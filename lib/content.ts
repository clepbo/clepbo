import { put, list, del } from "@vercel/blob";
import { unstable_cache, revalidateTag } from "next/cache";
import { promises as fs } from "fs";
import path from "path";
import type { Content, Version } from "./types";
import { SEED } from "./seed";

/** A document saved before a field existed must not break the site. Stored
 *  values always win; anything the stored copy has never heard of is filled in
 *  from the seed. Arrays are taken whole — a list the author emptied stays
 *  empty rather than refilling itself. */
function withDefaults<T>(stored: unknown, seed: T): T {
  if (Array.isArray(seed)) return (Array.isArray(stored) ? stored : seed) as T;
  if (seed && typeof seed === "object") {
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) return seed;
    const out: Record<string, unknown> = { ...(stored as Record<string, unknown>) };
    for (const [k, v] of Object.entries(seed as Record<string, unknown>)) {
      out[k] = k in out ? withDefaults(out[k], v) : v;
    }
    return out as T;
  }
  return (stored === undefined ? seed : stored) as T;
}

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
  return retireWording(refreshProjects(offerNewProjects(withDefaults(doc, SEED))), SEED) as Content;
}

/* Default copy from the old "desk" design. Wherever the stored document still
   holds one of these exact strings, the author never changed it, so the
   seed's current wording at the same place replaces it. Anything edited in
   the admin is left alone. Objects in arrays are matched by id when they
   have one, otherwise by position. */
const RETIRED = new Set([
  "Israel Oni — Web, Product, Video, Solutions",
  "Web · Product · Video · Solutions",
  "Israel Oni, Benin City. Four channels: websites built fast on WordPress and AI, product and UI/UX design, video editing and motion, and digital solutions.",
  "Four channels, one person. Patch into any of them above — the desk retunes to whichever one you're listening to, and the work below follows.",
  "switch channel",
  "Sites, products and video — built by one person.",
  "I build websites fast on WordPress and AI, design the product before anyone codes it, cut the video, and fix the process underneath when that turns out to be the real problem.",
  "The rack", "What's patched in", "Everything on the desk. Patch a channel to see what it runs on.",
  "What's come off the desk", "Showing everything. Patch into a channel to filter.",
  "Also on CH 03 — I cut their brand video series.",
  "Also on CH 03 — I shot and cut their school outreach films.",
  "Also on CH 03 — the walkthrough film is mine too.",
  "Site on CH 01",
  "Signal path", "How a job actually runs", "Same four stages on every channel.",
  "Patch in", "Set levels", "On air",
  "You see it while it's coming together, not at the end. Changes are cheap in the middle and expensive on the last day.",
  "Operator",
  "I work out of Benin City, Edo State. Most people meet me through one channel — a site, an edit, a design file, a system that needed fixing — and only find out about the rest later. That's the whole reason this page is built like a desk instead of a CV.",
  "Patch bay", "Tell me which channel you need.",
  "Say what you're trying to get done and when you need it. If it isn't something I should be doing, I'll say so and point you at someone better.",
  "Built by hand. No template.",
]);

function retireWording(stored: unknown, seed: unknown): unknown {
  if (typeof stored === "string") {
    return RETIRED.has(stored) && typeof seed === "string" && seed !== stored ? seed : stored;
  }
  if (Array.isArray(stored)) {
    if (!Array.isArray(seed)) return stored;
    return stored.map((item, i) => {
      const id = item && typeof item === "object" ? (item as { id?: unknown }).id : undefined;
      const match = id !== undefined
        ? seed.find((x) => x && typeof x === "object" && (x as { id?: unknown }).id === id)
        : seed[i];
      return match === undefined ? item : retireWording(item, match);
    });
  }
  if (stored && typeof stored === "object") {
    if (!seed || typeof seed !== "object" || Array.isArray(seed)) return stored;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(stored)) {
      out[k] = k in seed ? retireWording(v, (seed as Record<string, unknown>)[k]) : v;
    }
    return out;
  }
  return stored;
}

/* Projects added to the seed after the live document was first saved. The
   project list is taken whole from the stored copy, so without this a project
   shipped in code would never reach a site that has been edited. Each id is
   offered once, placed at the top, and remembered in work.offered, so a
   project the author deletes in the editor stays deleted. */
const ADDED_IN_CODE = ["tms", "teasoo-expense", "shop-timart"];

function offerNewProjects(doc: Content): Content {
  const offered = doc.work.offered ?? [];
  const due = ADDED_IN_CODE.filter((id) => !offered.includes(id));
  if (due.length === 0) return doc;
  const have = new Set(doc.work.projects.map((p) => p.id));
  const add = SEED.work.projects.filter((p) => due.includes(p.id) && !have.has(p.id));
  return {
    ...doc,
    work: { ...doc.work, projects: [...add, ...doc.work.projects], offered: [...offered, ...due] },
  };
}

/* Projects updated in code after the live document was saved. The stored
   project list wins over the seed, so a rewrite of a case study in seed.ts
   would never reach an edited site. Bump a project's number here to replace
   the stored copy with the seed's once, in the same position. A project the
   author deleted is not added back. work.refreshed remembers the number
   applied, so later edits in the admin are kept until the next bump. */
const REFRESHED_IN_CODE: Record<string, number> = { "shop-timart": 2 };

function refreshProjects(doc: Content): Content {
  const done = doc.work.refreshed ?? {};
  const due = Object.entries(REFRESHED_IN_CODE).filter(([id, v]) => (done[id] ?? 0) < v);
  if (due.length === 0) return doc;
  const projects = doc.work.projects.map((p) => {
    if (!due.some(([id]) => id === p.id)) return p;
    return SEED.work.projects.find((s) => s.id === p.id) ?? p;
  });
  return {
    ...doc,
    work: { ...doc.work, projects, refreshed: { ...done, ...Object.fromEntries(due) } },
  };
}

export const getContent = unstable_cache(
  async (): Promise<Content> => {
    try {
      const stored = hasBlob() ? await readBlob() : await readLocal();
      return normalise(stored ?? SEED);
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
  return normalise(stored ?? SEED);
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
