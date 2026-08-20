import { put, list } from "@vercel/blob";
import { unstable_cache, revalidateTag } from "next/cache";
import { promises as fs } from "fs";
import path from "path";
import type { Content } from "./types";
import { SEED } from "./seed";

const BLOB_PATH = "desk/content.json";
export const CONTENT_TAG = "desk-content";

/* Production stores the document in Vercel Blob. With no token — i.e. a local
   checkout that has not run `vercel env pull` — it falls back to a file on
   disk so `next dev` works offline. Same document either way. */
const hasBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const localFile = () => path.join(process.cwd(), ".data", "content.json");

async function readLocal(): Promise<Content | null> {
  try {
    return JSON.parse(await fs.readFile(localFile(), "utf8")) as Content;
  } catch {
    return null;
  }
}

async function readBlob(): Promise<Content | null> {
  const { blobs } = await list({ prefix: BLOB_PATH, limit: 1 });
  const hit = blobs.find((b) => b.pathname === BLOB_PATH);
  if (!hit) return null;
  const res = await fetch(hit.url, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as Content;
}

/** The live document. Falls back to the seed before anything has been saved. */
export const getContent = unstable_cache(
  async (): Promise<Content> => {
    try {
      const stored = hasBlob() ? await readBlob() : await readLocal();
      return stored ?? SEED;
    } catch (err) {
      // Never take the site down because storage hiccuped.
      console.error("content read failed, serving seed:", err);
      return SEED;
    }
  },
  ["desk-content"],
  { tags: [CONTENT_TAG] },
);

/** Read without the cache — the editor must always see what it last saved. */
export async function getContentFresh(): Promise<Content> {
  const stored = hasBlob() ? await readBlob() : await readLocal();
  return stored ?? SEED;
}

export async function saveContent(next: Content): Promise<Content> {
  const doc: Content = { ...next, version: (next.version ?? 0) + 1, updatedAt: new Date().toISOString() };
  const body = JSON.stringify(doc, null, 2);

  if (hasBlob()) {
    await put(BLOB_PATH, body, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
    });
  } else {
    await fs.mkdir(path.dirname(localFile()), { recursive: true });
    await fs.writeFile(localFile(), body, "utf8");
  }

  revalidateTag(CONTENT_TAG);
  return doc;
}
