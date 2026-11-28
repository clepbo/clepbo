import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { rateLimit, sweep } from "@/lib/ratelimit";
import { getContentFresh } from "@/lib/content";
import { VOICE } from "@/lib/voice";
import type { ContextDoc, Project } from "@/lib/types";
import { parseRepo, readRepo, readSite, type Source } from "@/lib/curate/sources";
import { keepImage, keepLogo, screenshots, slug } from "@/lib/curate/media";

export const runtime = "nodejs";
// Reading a repo and a site, drafting, then taking screenshots: give it room.
export const maxDuration = 300;

/* Paste a website or a GitHub repository; get back a drafted project for the
   Work list — copy in the site's voice, a case study built only from what the
   sources say, real screenshots, the logo and its colours. The draft is
   hidden until the author has read it and shown it. */

const DRAFT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["title", "client", "kind", "line", "story", "status", "channels", "meta",
    "linkText", "note", "case", "screens", "review"],
  properties: {
    title: { type: "string", description: "The project's name, as its owner writes it." },
    client: { type: "string", description: "The organisation it was for. Empty if it is the author's own." },
    kind: { type: "string", description: "Short type label, e.g. 'Website · Next.js' or 'Internal tool · Web app'." },
    line: { type: "string", description: "One line under twelve words for the card." },
    story: { type: "string", description: "Two to four sentences: what it is, and exactly what the author did on it." },
    status: { type: "string", description: "'In progress' if the sources show it is unfinished or not launched; otherwise empty." },
    channels: { type: "array", items: { type: "integer" }, description: "Ids of the service channels this belongs to, best fit first." },
    meta: {
      type: "array",
      description: "Three or four facts: Role, Stack, Status, Live link host, and so on.",
      items: {
        type: "object", additionalProperties: false, required: ["label", "value"],
        properties: { label: { type: "string" }, value: { type: "string" } },
      },
    },
    linkText: { type: "string", description: "Text for the link button, e.g. 'Visit example.com'." },
    note: { type: "string", description: "A plain credit note when other people built part of it; else empty." },
    case: {
      type: "object", additionalProperties: false,
      required: ["problem", "features", "process", "decisions", "outcome"],
      properties: {
        problem: { type: "string", description: "What was wrong or missing before. Empty if the sources don't say." },
        features: { type: "array", items: { $ref: "#/$defs/item" } },
        process: { type: "array", items: { $ref: "#/$defs/item" } },
        decisions: { type: "array", items: { $ref: "#/$defs/item" } },
        outcome: { type: "string", description: "What exists now. No invented metrics." },
      },
    },
    screens: {
      type: "array", items: { type: "string" },
      description: "Up to two inner page URLs, copied exactly from the list given, that best show the work. The home page is always shot.",
    },
    review: {
      type: "array", items: { type: "string" },
      description: "Short notes for the author: anything uncertain, inferred, or worth checking before publishing.",
    },
  },
  $defs: {
    item: {
      type: "object", additionalProperties: false, required: ["title", "body"],
      properties: { title: { type: "string" }, body: { type: "string" } },
    },
  },
} as const;

type Draft = {
  title: string; client: string; kind: string; line: string; story: string; status: string;
  channels: number[]; meta: { label: string; value: string }[]; linkText: string; note: string;
  case: {
    problem: string; features: { title: string; body: string }[];
    process: { title: string; body: string }[]; decisions: { title: string; body: string }[]; outcome: string;
  };
  screens: string[]; review: string[];
};

const TASK = `Draft one portfolio project from the sources below, for the Work section of the site.

Rules for this task:
- Credit honestly. Use the commit history to decide what the author actually did. If most
  commits are by other people, say the author's part precisely (for example "I led the
  AI-assisted work on…") and put a one-sentence credit to the others in "note".
- Work made with Claude or other AI tools counts as the author's work, and says so: the
  site's whole pitch is building AI-powered solutions.
- Use only facts in the sources or the author's notes. No invented clients, numbers, results
  or dates. Where the sources say nothing, leave the field empty or the list short.
- Case study: 2 to 6 features (what it does), 2 to 5 process steps (how it was worked out),
  2 to 4 decisions (a choice, and why it beat the obvious alternative). Draw decisions from
  docs, READMEs and commit messages; don't manufacture them.
- Pick channels only from the list given.
- Put anything you inferred, or would want the author to confirm, in "review".`;

export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  sweep();
  const limit = rateLimit("curate", 8, 10 * 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: `That's a lot of drafts at once — try again in ${limit.retryAfter}s.` },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY is not set on this deployment." }, { status: 500 });
  }

  const { links, notes } = (await req.json().catch(() => ({}))) as { links?: string; notes?: string };
  const urls = [...new Set((links ?? "").split(/[\s,]+/).map((s) => s.trim()).filter(Boolean))]
    .map((u) => (/^https?:\/\//i.test(u) ? u : `https://${u}`));
  if (!urls.length) return NextResponse.json({ error: "Paste at least one link." }, { status: 400 });
  if (urls.length > 4) return NextResponse.json({ error: "Up to four links per project." }, { status: 400 });
  if ((notes ?? "").length > 4000) return NextResponse.json({ error: "Keep the notes under 4,000 characters." }, { status: 400 });

  const doc = await getContentFresh();
  const channels = doc.channels.filter((c) => !c.hidden);

  /* ---- 1. read everything ---- */
  const sources: Source[] = [];
  const problems: string[] = [];
  const read = async (u: string) => {
    try {
      sources.push(parseRepo(u) ? await readRepo(u, doc.site.name) : await readSite(u));
    } catch (err) {
      problems.push(err instanceof Error ? err.message : `Couldn't read ${u}.`);
    }
  };
  await Promise.all(urls.map(read));
  // A repository that names its website: read that too, unless it was pasted.
  for (const s of [...sources]) {
    if (s.homepage && !sources.some((x) => x.kind === "website")) await read(s.homepage);
  }
  if (!sources.length) {
    return NextResponse.json({ error: problems.join(" ") || "None of those links could be read." }, { status: 422 });
  }
  const site = sources.find((s) => s.kind === "website");
  const repo = sources.find((s) => s.kind === "github");

  /* ---- 2. draft ---- */
  const brief = [
    `The author is ${doc.site.name}.`,
    `Service channels (id: name): ${channels.map((c) => `${c.id}: ${c.name}`).join("; ")}.`,
    `Projects already on the site (don't duplicate): ${doc.work.projects.map((p) => p.title).join(", ")}.`,
    site?.pages?.length ? `Inner pages available for screenshots:\n${site.pages.join("\n")}` : "",
    notes?.trim() ? `Notes from the author — treat as true:\n${notes.trim()}` : "",
    ...sources.map((s) => `===== SOURCE: ${s.kind} ${s.url} =====\n${s.text}`),
  ].filter(Boolean).join("\n\n");

  let draft: Draft;
  try {
    const client = new Anthropic();
    const stream = client.beta.messages.stream({
      model: "claude-opus-5-5",
      max_tokens: 32000,
      system: VOICE,
      thinking: { type: "adaptive" },
      output_config: { effort: "high", format: { type: "json_schema", schema: DRAFT_SCHEMA } },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      messages: [{ role: "user", content: `${TASK}\n\n${brief}` }],
    });
    const message = await stream.finalMessage();
    if (message.stop_reason === "refusal") {
      return NextResponse.json({ error: "Claude declined to draft from those sources." }, { status: 422 });
    }
    if (message.stop_reason === "max_tokens") {
      return NextResponse.json({ error: "The draft ran too long. Try fewer links." }, { status: 502 });
    }
    const text = message.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    draft = JSON.parse(text) as Draft;
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "Rate limited — try again in a moment." }, { status: 429 });
    }
    if (err instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY was rejected." }, { status: 401 });
    }
    if (err instanceof Anthropic.APIConnectionError) {
      return NextResponse.json({ error: "Couldn't reach the Claude API." }, { status: 503 });
    }
    if (err instanceof SyntaxError) {
      return NextResponse.json({ error: "Claude's draft came back malformed. Try again." }, { status: 502 });
    }
    console.error("curate failed:", err);
    return NextResponse.json({ error: "Drafting failed." }, { status: 500 });
  }

  /* ---- 3. pictures ---- */
  const taken = new Set(doc.work.projects.map((p) => p.id));
  let id = slug(draft.title || site?.title || repo?.title || "project");
  for (let n = 2; taken.has(id); n++) id = `${slug(draft.title)}-${n}`;

  let stills: string[] = [];
  let brand: Project["brand"];
  if (site) {
    const pages = (draft.screens ?? []).filter((u) => site.pages?.includes(u)).slice(0, 2);
    stills = await screenshots([site.url, ...pages], id);
    if (!stills.length && site.ogImage) {
      const og = await keepImage(site.ogImage, `${id}-og`);
      if (og) stills = [og];
    }
    if (site.logo) {
      const logo = await keepLogo(site.logo, id);
      if (logo) brand = { mark: logo.mark, colors: logo.colors.length ? logo.colors : ["#1D1C19"] };
    }
  }

  /* ---- 4. the project, hidden until reviewed ---- */
  const valid = new Set(channels.map((c) => c.id));
  const ch = (draft.channels ?? []).filter((n) => valid.has(n));
  const c = draft.case;
  const hasCase = Boolean(c && (c.problem || c.features.length || c.process.length || c.decisions.length));

  const docs: ContextDoc[] = sources.map((s, i) => ({
    id: `src-${Date.now()}-${i}`,
    name: s.kind === "github" ? `GitHub: ${s.title}` : `Website: ${s.title}`,
    kind: "text",
    url: s.url,
    text: s.text.slice(0, 60_000),
    bytes: s.text.length,
    truncated: s.text.length > 60_000,
    addedAt: new Date().toISOString(),
  }));

  const project: Project = {
    id,
    ch: ch.length ? ch : [channels[0]?.id ?? 1],
    kind: draft.kind,
    client: draft.client,
    title: draft.title,
    line: draft.line,
    story: draft.story,
    media: stills.length ? { type: "still", stills } : brand ? { type: "brand" } : { type: "plate", glyph: "··" },
    ...(stills.length ? { shots: stills } : {}),
    ...(brand ? { brand } : {}),
    ...(draft.status?.trim() ? { status: draft.status.trim() } : {}),
    meta: draft.meta ?? [],
    link: site?.url ?? repo?.url ?? urls[0],
    linkText: draft.linkText || "Visit the site",
    ...(draft.note?.trim() ? { note: draft.note.trim() } : {}),
    ...(hasCase ? {
      case: {
        problem: c.problem,
        ...(c.features.length ? { features: c.features } : {}),
        process: c.process,
        decisions: c.decisions,
        outcome: c.outcome,
      },
    } : {}),
    hidden: true,
    context: { brief: notes?.trim() ?? "", docs },
  };

  return NextResponse.json({
    project,
    review: draft.review ?? [],
    problems,
    read: sources.map((s) => s.url),
    pictures: stills.length,
  });
}
