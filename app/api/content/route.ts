import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getContentFresh, saveContent } from "@/lib/content";
import type { Content } from "@/lib/types";

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  return NextResponse.json(await getContentFresh());
}

export async function PUT(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body: Content;
  try {
    body = (await req.json()) as Content;
  } catch {
    return NextResponse.json({ error: "That wasn't valid JSON." }, { status: 400 });
  }
  if (!body?.site || !Array.isArray(body.channels) || !body.work?.projects) {
    return NextResponse.json({ error: "The document is missing its site, channels or work." }, { status: 400 });
  }

  try {
    return NextResponse.json(await saveContent(body));
  } catch (err) {
    console.error("save failed:", err);
    return NextResponse.json(
      { error: "Saving failed. Check BLOB_READ_WRITE_TOKEN is set on this deployment." },
      { status: 500 },
    );
  }
}
