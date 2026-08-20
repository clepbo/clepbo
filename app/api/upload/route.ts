import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { rateLimit, sweep } from "@/lib/ratelimit";
import { processImage, samplePalette } from "@/lib/palette";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  sweep();
  const limit = rateLimit("upload", 40, 60000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: `Too many uploads at once — try again in ${limit.retryAfter}s.` },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  const kind = (form.get("kind") === "mark" ? "mark" : "still") as "still" | "mark";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file was attached." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "That isn't an image." }, { status: 400 });
  }
  if (file.size > 25 * 1024 * 1024) {
    return NextResponse.json({ error: "Images need to be under 25 MB." }, { status: 400 });
  }

  const input = Buffer.from(await file.arrayBuffer());

  try {
    // SVG marks are already the right thing — resizing them would only lose quality.
    const isSvg = file.type === "image/svg+xml";
    const out = isSvg
      ? { buffer: input, ext: "svg", contentType: "image/svg+xml" }
      : await processImage(input, kind);

    const stem = (file.name.replace(/\.[^.]+$/, "") || "upload")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

    const blob = await put(`desk/${kind}s/${stem}-${Date.now()}.${out.ext}`, out.buffer, {
      access: "public",
      contentType: out.contentType,
      addRandomSuffix: false,
    });

    // A logo carries its own palette; sampling it saves picking colours by hand.
    let palette: string[] = [];
    if (kind === "mark" && !isSvg) {
      try { palette = await samplePalette(input); } catch { palette = []; }
    }

    return NextResponse.json({ url: blob.url, kind, palette, bytes: out.buffer.length });
  } catch (err) {
    console.error("upload failed:", err);
    return NextResponse.json(
      { error: "Processing that image failed. Check BLOB_READ_WRITE_TOKEN is set." },
      { status: 500 },
    );
  }
}
