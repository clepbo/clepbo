import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { rateLimit, sweep } from "@/lib/ratelimit";
import { getContentFresh } from "@/lib/content";
import type { ProjectContext } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

/* The voice of the site, described once. Everything the model writes has to
   sound like the copy already on the page, or the edit will stand out. */
const VOICE = `You are editing the portfolio of Israel Oni — a designer and developer in
Benin City, Nigeria, who builds websites (WordPress and AI-assisted), designs products in
Figma, edits video, and builds internal systems.

The site's voice, which you must match exactly:
- Plain, direct, confident. Short sentences carrying one idea each.
- Specific over clever. Concrete nouns, real detail, no abstraction where a fact will do.
- British spelling (colour, organisation, systemise).
- It states what a thing does and why a decision beat the alternative.
- It never sells with adjectives. No "cutting-edge", "seamless", "passionate",
  "leverage", "empower", "solutions-driven", "in today's world".
- No em-dash-heavy rhythm, no rule-of-three lists, no rhetorical questions.
- It admits limits plainly rather than hedging.

Hard rules:
- Never invent facts, clients, metrics, dates or outcomes. If the source text has
  no numbers, the result has no numbers.
- Background material may be supplied — a brief, a PRD, a spec, screenshots. Use it
  to get the project right, and you may draw specifics from it. Everything in it is
  fair game; anything not in it or in the source text is not.
- Return only the rewritten text. No preamble, no quotes around it, no commentary,
  no markdown formatting unless the input already had it.`;

const MODES: Record<string, string> = {
  tighten: "Cut this to its shortest honest form. Keep every fact. Remove filler, hedging and repetition.",
  expand: "Develop this a little further using only what is already stated or clearly implied. Add no new facts.",
  rewrite: "Rewrite this in the site's voice. Same meaning, same facts, better sentences.",
  proofread: "Fix grammar, punctuation and British spelling. Change nothing else. If it is already correct, return it unchanged.",
  headline: "Write one short line — under twelve words — capturing what this is. Return only the line.",
  problem: "From these notes, write the 'problem' paragraph of a case study: what was actually wrong before the work, in three or four sentences. State no outcomes.",
  decision: "Rewrite this as a design decision: the choice made, then why it beat the obvious alternative. Two or three sentences.",
};

export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  sweep();
  const limit = rateLimit("ai", 30, 60000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: `Too many rewrites at once — try again in ${limit.retryAfter}s.` },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not set on this deployment." },
      { status: 500 },
    );
  }

  const { mode, text, context, projectId } = (await req.json().catch(() => ({}))) as {
    mode?: string; text?: string; context?: string; projectId?: string;
  };

  const instruction = MODES[mode ?? ""];
  if (!instruction) return NextResponse.json({ error: "Unknown mode." }, { status: 400 });
  if (!text?.trim()) return NextResponse.json({ error: "Nothing to work on." }, { status: 400 });
  if (text.length > 12000) return NextResponse.json({ error: "That text is too long." }, { status: 400 });

  // Background the author attached: site-wide, plus this project's own.
  let brief = "";
  let images: string[] = [];
  try {
    const doc = await getContentFresh();
    const project = projectId
      ? doc.work.projects.find((p) => p.id === projectId)
      : undefined;
    const parts = [doc.site.context, project?.context].filter(Boolean) as ProjectContext[];
    ({ brief, images } = buildContext(parts, project?.title));
  } catch (err) {
    // Background is a bonus. Losing it should not lose the rewrite.
    console.error("context load failed:", err);
  }

  const client = new Anthropic();

  const content: Anthropic.ContentBlockParam[] = [
    ...images.map((url): Anthropic.ContentBlockParam => ({
      type: "image",
      source: { type: "url", url },
    })),
    {
      type: "text",
      text:
        `${instruction}\n\n` +
        (context ? `Where this appears: ${context}\n\n` : "") +
        (brief ? `${brief}\n\n` : "") +
        `Text to work on:\n---\n${text}\n---`,
    },
  ];

  try {
    const response = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 16000,
      system: VOICE,
      output_config: { effort: "medium" },
      messages: [{ role: "user", content }],
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json({ error: "Claude declined that request." }, { status: 422 });
    }

    // response.content is a discriminated union — narrow before reading .text
    const out = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    if (!out) return NextResponse.json({ error: "Claude returned nothing." }, { status: 502 });
    return NextResponse.json({ text: out, usage: response.usage });
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
    console.error("ai failed:", err);
    return NextResponse.json({ error: "That rewrite failed." }, { status: 500 });
  }
}

/* Assemble the attached background into one block, capped so a long PRD
   cannot crowd out the text actually being edited. */
const MAX_CONTEXT_CHARS = 120_000;
const MAX_IMAGES = 4;

function buildContext(parts: ProjectContext[], title?: string) {
  const chunks: string[] = [];
  const images: string[] = [];
  let budget = MAX_CONTEXT_CHARS;

  for (const part of parts) {
    if (part.brief?.trim()) {
      const t = part.brief.trim().slice(0, budget);
      budget -= t.length;
      chunks.push(t);
    }
    for (const d of part.docs ?? []) {
      if (d.kind === "image") {
        if (images.length < MAX_IMAGES) images.push(d.url);
        continue;
      }
      if (!d.text || budget <= 0) continue;
      const body = d.text.slice(0, Math.max(0, budget));
      budget -= body.length;
      chunks.push(`--- ${d.name} ---\n${body}`);
    }
  }

  if (!chunks.length && !images.length) return { brief: "", images };

  const head = title
    ? `Background on ${title}, supplied by the author. Treat it as true:`
    : "Background supplied by the author. Treat it as true:";
  const imgNote = images.length
    ? `\n\n${images.length} image${images.length > 1 ? "s are" : " is"} attached above as further background.`
    : "";

  return { brief: chunks.length ? `${head}\n\n${chunks.join("\n\n")}${imgNote}` : head + imgNote, images };
}
