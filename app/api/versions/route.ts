import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { listVersions, readVersion, saveContent } from "@/lib/content";

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  try {
    return NextResponse.json({ versions: await listVersions() });
  } catch (err) {
    console.error("version list failed:", err);
    return NextResponse.json({ versions: [] });
  }
}

export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const { pathname } = (await req.json().catch(() => ({}))) as { pathname?: string };
  if (!pathname) return NextResponse.json({ error: "No version named." }, { status: 400 });

  const doc = await readVersion(pathname);
  if (!doc) return NextResponse.json({ error: "That version is gone." }, { status: 404 });

  // Restoring publishes it as a new version rather than rewinding the counter,
  // so the history stays a straight line and the restore itself is undoable.
  return NextResponse.json(await saveContent(doc));
}
