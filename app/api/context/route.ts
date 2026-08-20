import { put, del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { isAuthed } from "@/lib/auth";
import { rateLimit, sweep } from "@/lib/ratelimit";
import { extractText, isTextDoc } from "@/lib/extract";
import { processImage } from "@/lib/palette";
import type { ContextDoc } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

const MAX_BYTES = 20 * 1024 * 1024;

export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  sweep();
  const limit = rateLimit("context", 20, 60000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: `Too many uploads at once — try again in ${limit.retryAfter}s.` },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file was attached." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Documents need to be under 20 MB." }, { status: 400 });

  const isImage = file.type.startsWith("image/");
  if (!isImage && !isTextDoc(file.type, file.name)) {
    return NextResponse.json(
      { error: "Upload a PDF, Word file, text or markdown file, or an image." },
      { status: 400 },
    );
  }

  const input = Buffer.from(await file.arrayBuffer());
  const stem = (file.name.replace(/\.[^.]+$/, "") || "document")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

  try {
    let stored: Buffer = input;
    let contentType = file.type || "application/octet-stream";
    let ext = file.name.toLowerCase().split(".").pop() || "bin";
    let doc: Partial<ContextDoc> = {};

    if (isImage && file.type !== "image/svg+xml") {
      // A screenshot used as context still wants to be a sane size.
      const out = await processImage(input, "still");
      stored = out.buffer; contentType = out.contentType; ext = out.ext;
    } else if (!isImage) {
      const { text, pages, truncated } = await extractText(input, file.type, file.name);
      if (!text.trim()) {
        return NextResponse.json(
          { error: "No readable text in that file — a scanned PDF needs OCR first." },
          { status: 422 },
        );
      }
      doc = { text, pages, truncated };
    }

    const blob = await put(`desk/context/${stem}-${Date.now()}.${ext}`, stored, {
      access: "public",
      contentType,
      addRandomSuffix: false,
    });

    const result: ContextDoc = {
      id: randomUUID(),
      name: file.name,
      kind: isImage ? "image" : "text",
      url: blob.url,
      bytes: stored.length,
      addedAt: new Date().toISOString(),
      ...doc,
    };
    return NextResponse.json(result);
  } catch (err) {
    console.error("context upload failed:", err);
    return NextResponse.json(
      { error: "Couldn't read that file. Check BLOB_READ_WRITE_TOKEN is set." },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const { url } = (await req.json().catch(() => ({}))) as { url?: string };
  if (!url) return NextResponse.json({ error: "No file named." }, { status: 400 });
  try {
    await del(url);
  } catch (err) {
    // Already gone is fine — the editor only cares that it is no longer listed.
    console.error("context delete failed:", err);
  }
  return NextResponse.json({ ok: true });
}
