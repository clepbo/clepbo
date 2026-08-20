import { put, list, del } from "@vercel/blob";
import { unstable_cache, revalidateTag } from "next/cache";
import { promises as fs } from "fs";
import path from "path";
import type { Content, Version } from "./types";
import { SEED } from "./seed";

const BLOB_PATH = "desk/content.json";
const VERSION_PREFIX = "desk/versions/";
const KEEP_VERSIONS = 20;
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
/* A document saved before a new section existed is still valid — fill the
   gaps from the seed rather than letting the page or the editor hit undefined. */
function normalise(doc: Content): Content {
  return {
    ...SEED,
    ...doc,
    site: { ...SEED.site, ...doc.site },
    rack: { ...SEED.rack, ...doc.rack },
    work: { ...SEED.work, ...doc.work },
    testimonials: { ...SEED.testimonials, ...(doc.testimonials ?? {}) },
    path: { ...SEED.path, ...doc.path },
    about: { ...SEED.about, ...doc.about },
    contact: { ...SEED.contact, ...doc.contact },
    footer: { ...SEED.footer, ...doc.footer },
  };
}

export const getContent = unstable_cache(
  async (): Promise<Content> => {
    try {
      const stored = hasBlob() ? await readBlob() : await readLocal();
      return stored ? normalise(stored) : SEED;
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
  return stored ? normalise(stored) : SEED;
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
    // A failed snapshot must not fail the save the author just made.
    await snapshot(doc, body).catch((err) => console.error("snapshot failed:", err));
  } else {
    await fs.mkdir(path.dirname(localFile()), { recursive: true });
    await fs.writeFile(localFile(), body, "utf8");
  }

  revalidateTag(CONTENT_TAG);
  return doc;
}

/* ---- version history -------------------------------------
   Every save also drops a snapshot, so a rewrite you regret is
   one restore away. Only the last KEEP_VERSIONS are kept. */

export async function listVersions(): Promise<Version[]> {
  if (!hasBlob()) return [];
  const { blobs } = await list({ prefix: VERSION_PREFIX, limit: 100 });
  return blobs
    .map((b) => {
      const [v, ts] = b.pathname.slice(VERSION_PREFIX.length).replace(/\.json$/, "").split("__");
      return {
        version: Number(v) || 0,
        updatedAt: ts ? ts.replace(/-/g, ":").replace("T:", "T") : b.uploadedAt.toISOString(),
        pathname: b.pathname,
        bytes: b.size,
      };
    })
    .sort((a, b) => b.version - a.version);
}

export async function readVersion(pathname: string): Promise<Content | null> {
  if (!pathname.startsWith(VERSION_PREFIX)) return null; // never read outside the version folder
  const { blobs } = await list({ prefix: pathname, limit: 1 });
  const hit = blobs.find((b) => b.pathname === pathname);
  if (!hit) return null;
  const res = await fetch(hit.url, { cache: "no-store" });
  return res.ok ? ((await res.json()) as Content) : null;
}

async function snapshot(doc: Content, body: string) {
  const stamp = doc.updatedAt.replace(/[:.]/g, "-");
  await put(`${VERSION_PREFIX}${String(doc.version).padStart(5, "0")}__${stamp}.json`, body, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });

  const all = await listVersions();
  for (const old of all.slice(KEEP_VERSIONS)) {
    const { blobs } = await list({ prefix: old.pathname, limit: 1 });
    const hit = blobs.find((b) => b.pathname === old.pathname);
    if (hit) await del(hit.url).catch(() => {});
  }
}
