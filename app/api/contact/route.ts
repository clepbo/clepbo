import { NextResponse } from "next/server";
import { getContent } from "@/lib/content";
import { sendEnquiry } from "@/lib/mail";
import { rateLimit, sweep } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 30;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LIMITS = { name: 120, email: 200, need: 120, message: 5000 };

export async function POST(req: Request) {
  const content = await getContent();
  const { form } = content.contact;

  if (!form?.enabled) {
    return NextResponse.json({ error: "The form is closed — please email instead." }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "That didn't come through. Try again." }, { status: 400 });

  /* Two quiet traps. A hidden field a person never sees and cannot fill, and a
     form submitted faster than anybody could type it. Both catch bots without
     making a human solve a puzzle. */
  if (typeof body.company === "string" && body.company.trim()) {
    return NextResponse.json({ ok: true, confirmed: true });   // look like success
  }
  const openedAt = Number(body.openedAt);
  if (Number.isFinite(openedAt) && Date.now() - openedAt < 2500) {
    return NextResponse.json({ ok: true, confirmed: true });
  }

  const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const enquiry = {
    name: str(body.name, LIMITS.name),
    email: str(body.email, LIMITS.email),
    need: str(body.need, LIMITS.need) || "Not specified",
    message: str(body.message, LIMITS.message),
  };

  if (!enquiry.name) return NextResponse.json({ error: "Your name is missing." }, { status: 400 });
  if (!EMAIL.test(enquiry.email)) {
    return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 });
  }
  if (enquiry.message.length < 10) {
    return NextResponse.json({ error: "Tell me a little more than that." }, { status: 400 });
  }

  sweep();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const gate = rateLimit(`contact:${ip}`, 3, 10 * 60 * 1000);
  if (!gate.ok) {
    return NextResponse.json(
      { error: "That's a few messages in a row — try again shortly, or email me directly." },
      { status: 429, headers: { "Retry-After": String(gate.retryAfter) } },
    );
  }

  const site = process.env.SITE_URL ?? new URL(req.url).origin;

  try {
    const { confirmed } = await sendEnquiry(enquiry, content, site);
    return NextResponse.json({ ok: true, confirmed });
  } catch (err) {
    console.error("enquiry failed:", err);
    return NextResponse.json(
      { error: `Sending failed. Please email ${content.contact.email} directly.` },
      { status: 502 },
    );
  }
}
