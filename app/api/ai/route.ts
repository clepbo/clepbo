import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";

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

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not set on this deployment." },
      { status: 500 },
    );
  }

  const { mode, text, context } = (await req.json().catch(() => ({}))) as {
    mode?: string; text?: string; context?: string;
  };

  const instruction = MODES[mode ?? ""];
  if (!instruction) return NextResponse.json({ error: "Unknown mode." }, { status: 400 });
  if (!text?.trim()) return NextResponse.json({ error: "Nothing to work on." }, { status: 400 });
  if (text.length > 12000) return NextResponse.json({ error: "That text is too long." }, { status: 400 });

  const client = new Anthropic();

  try {
    const response = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 16000,
      system: VOICE,
      output_config: { effort: "medium" },
      messages: [
        {
          role: "user",
          content:
            `${instruction}\n\n` +
            (context ? `Where this appears: ${context}\n\n` : "") +
            `---\n${text}\n---`,
        },
      ],
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
