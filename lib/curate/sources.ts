import { safeFetch } from "./safefetch";

/* Reading what the author pasted: a GitHub repository, a website, or both.
   Everything here is plain text for Claude, plus the few image URLs worth
   keeping (an og:image, a logo). Nothing is invented at this stage. */

export type Source = {
  kind: "github" | "website";
  url: string;
  title: string;
  text: string;           // what Claude reads
  homepage?: string;      // a repo's website, worth reading too
  ogImage?: string;
  logo?: string;
  pages?: string[];       // other pages on the site worth a screenshot
};

const cap = (s: string, n: number) => (s.length > n ? `${s.slice(0, n)}\n…[cut at ${n} characters]` : s);

/* ---------------- GitHub ---------------- */

export function parseRepo(raw: string): { owner: string; repo: string } | null {
  try {
    const u = new URL(raw);
    if (u.hostname !== "github.com" && u.hostname !== "www.github.com") return null;
    const [owner, repo] = u.pathname.split("/").filter(Boolean);
    if (!owner || !repo) return null;
    return { owner, repo: repo.replace(/\.git$/, "") };
  } catch {
    return null;
  }
}

async function gh(path: string, accept = "application/vnd.github+json") {
  const headers: Record<string, string> = { accept, "x-github-api-version": "2022-11-28" };
  // Optional: a token lets the curator read private repositories you can see.
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await safeFetch(`https://api.github.com${path}`, { headers, maxBytes: 3_000_000 });
  return res;
}

async function ghJson<T>(path: string): Promise<T | null> {
  const res = await gh(path);
  if (res.status !== 200) return null;
  try { return JSON.parse(res.body.toString("utf8")) as T; } catch { return null; }
}

async function ghRaw(path: string): Promise<string | null> {
  const res = await gh(path, "application/vnd.github.raw+json");
  return res.status === 200 ? res.body.toString("utf8") : null;
}

type Repo = {
  full_name: string; description: string | null; homepage: string | null; topics?: string[];
  language: string | null; private: boolean; created_at: string; pushed_at: string;
  stargazers_count: number; owner: { login: string; type: string };
};
type Commit = { commit: { author: { name: string; date: string }; message: string } };
type Entry = { name: string; path: string; type: string; size: number };

export async function readRepo(raw: string, authorName: string): Promise<Source> {
  const parsed = parseRepo(raw);
  if (!parsed) throw new Error(`Not a GitHub repository link: ${raw}`);
  const { owner, repo } = parsed;
  const base = `/repos/${owner}/${repo}`;

  const meta = await ghJson<Repo>(base);
  if (!meta) {
    throw new Error(
      `Couldn't read github.com/${owner}/${repo}. If it's private, set GITHUB_TOKEN on the deployment ` +
      "with read access to it.",
    );
  }

  const [readme, languages, commits, root, docs] = await Promise.all([
    ghRaw(`${base}/readme`),
    ghJson<Record<string, number>>(`${base}/languages`),
    ghJson<Commit[]>(`${base}/commits?per_page=100`),
    ghJson<Entry[]>(`${base}/contents`),
    ghJson<Entry[]>(`${base}/contents/docs`),
  ]);

  // Who did the work. The author's own commits, and work done with Claude,
  // decide how the write-up credits it.
  const byAuthor = new Map<string, number>();
  const mine: string[] = [];
  const me = authorName.toLowerCase();
  for (const c of commits ?? []) {
    const name = c.commit.author.name || "unknown";
    byAuthor.set(name, (byAuthor.get(name) ?? 0) + 1);
    const first = c.commit.message.split("\n")[0];
    const coAuthoredWithClaude = /co-authored-by: claude/i.test(c.commit.message);
    if (name.toLowerCase() === me || name === "Claude" || coAuthoredWithClaude) {
      mine.push(`${c.commit.author.date.slice(0, 10)}  ${name}: ${first}`);
    }
  }
  const authors = [...byAuthor.entries()].sort((a, b) => b[1] - a[1])
    .map(([n, k]) => `${n} (${k})`).join(", ");
  const recent = (commits ?? []).slice(0, 40)
    .map((c) => `${c.commit.author.date.slice(0, 10)}  ${c.commit.author.name}: ${c.commit.message.split("\n")[0]}`);

  // A manifest says what it is built with; docs often say why.
  let manifest = "";
  const names = new Set((root ?? []).map((e) => e.name));
  for (const f of ["package.json", "pom.xml", "build.gradle", "requirements.txt", "pyproject.toml", "composer.json", "go.mod"]) {
    if (names.has(f)) { manifest = `--- ${f} ---\n${cap((await ghRaw(`${base}/contents/${f}`)) ?? "", 4000)}`; break; }
  }
  const docTexts: string[] = [];
  for (const d of (docs ?? []).filter((e) => e.type === "file" && /\.(md|mdx|txt)$/i.test(e.name)).slice(0, 5)) {
    const t = await ghRaw(`${base}/contents/${d.path}`);
    if (t) docTexts.push(`--- docs/${d.name} ---\n${cap(t, 12000)}`);
  }

  const text = [
    `GitHub repository: ${meta.full_name}${meta.private ? " (private)" : ""}`,
    `Owner: ${meta.owner.login} (${meta.owner.type})`,
    meta.description ? `Description: ${meta.description}` : "",
    meta.homepage ? `Website: ${meta.homepage}` : "",
    meta.topics?.length ? `Topics: ${meta.topics.join(", ")}` : "",
    languages ? `Languages: ${Object.keys(languages).join(", ")}` : "",
    `Created ${meta.created_at.slice(0, 10)}, last pushed ${meta.pushed_at.slice(0, 10)}`,
    `Top-level files: ${[...names].slice(0, 60).join(", ")}`,
    "",
    `Commit authors in the latest ${commits?.length ?? 0} commits: ${authors || "unknown"}`,
    `Commits by ${authorName} or made with Claude (${mine.length}):`,
    ...mine.slice(0, 60),
    "",
    "Most recent commits:",
    ...recent,
    "",
    readme ? `--- README ---\n${cap(readme, 24000)}` : "No README.",
    manifest,
    ...docTexts,
  ].filter((l) => l !== undefined).join("\n");

  return {
    kind: "github",
    url: `https://github.com/${meta.full_name}`,
    title: meta.full_name,
    text,
    homepage: meta.homepage || undefined,
  };
}

/* ---------------- Websites ---------------- */

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, " ").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));

function attr(tag: string, name: string) {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return m ? decode(m[2] ?? m[3] ?? m[4] ?? "") : "";
}

function metaContent(html: string, key: string) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    if ((attr(tag, "property") || attr(tag, "name")).toLowerCase() === key) return attr(tag, "content");
  }
  return "";
}

/** The readable text of a page: headings marked, scripts and chrome dropped. */
function pageText(html: string) {
  const body = html
    .replace(/<(script|style|noscript|svg|template|iframe)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<h([1-3])\b[^>]*>/gi, (_, n) => `\n${"#".repeat(Number(n))} `)
    .replace(/<\/(h[1-6]|p|li|div|section|article|header|footer|tr|br)>/gi, "\n")
    .replace(/<li\b[^>]*>/gi, "\n- ")
    .replace(/<[^>]+>/g, " ");
  return decode(body).split("\n").map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean)
    .filter((l, i, all) => all.indexOf(l) === i).join("\n");
}

async function getPage(url: string) {
  const res = await safeFetch(url, { headers: { accept: "text/html,application/xhtml+xml" } });
  if (res.status >= 400) throw new Error(`${url} answered ${res.status}.`);
  if (!/html/i.test(res.type)) throw new Error(`${url} isn't a web page.`);
  return { url: res.url, html: res.body.toString("utf8") };
}

export async function readSite(raw: string): Promise<Source> {
  const { url, html } = await getPage(raw);
  const origin = new URL(url).origin;
  const abs = (h: string) => { try { return new URL(h, url).toString(); } catch { return ""; } };

  const title = decode((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").trim());
  const description = metaContent(html, "description") || metaContent(html, "og:description");
  const siteName = metaContent(html, "og:site_name");
  const ogImage = abs(metaContent(html, "og:image") || metaContent(html, "twitter:image"));

  // A logo: an <img> that says it is one, else the largest touch icon.
  let logo = "";
  for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) {
    const hay = `${attr(tag, "src")} ${attr(tag, "alt")} ${attr(tag, "class")}`.toLowerCase();
    if (/logo/.test(hay) && attr(tag, "src")) { logo = abs(attr(tag, "src")); break; }
  }
  if (!logo) {
    for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
      if (/apple-touch-icon|icon/i.test(attr(tag, "rel")) && attr(tag, "href")) {
        logo = abs(attr(tag, "href"));
        if (/apple-touch/i.test(attr(tag, "rel")) || /\.svg/i.test(logo)) break;
      }
    }
  }

  // Other pages on the same site, in the order the navigation lists them.
  const pages: string[] = [];
  for (const tag of html.match(/<a\b[^>]*>/gi) ?? []) {
    const href = abs(attr(tag, "href")).split("#")[0];
    if (!href.startsWith(origin) || href === url || href === `${origin}/`) continue;
    if (/\.(png|jpe?g|webp|gif|svg|pdf|zip|xml|json)$/i.test(href)) continue;
    if (/(privacy|terms|cookie|login|sign-?in|sign-?up|cart|checkout|account|wp-admin)/i.test(href)) continue;
    if (!pages.includes(href)) pages.push(href);
    if (pages.length >= 8) break;
  }

  const parts = [
    `Website: ${url}`,
    title ? `Title: ${title}` : "",
    siteName ? `Site name: ${siteName}` : "",
    description ? `Description: ${description}` : "",
    "",
    "--- Home page ---",
    cap(pageText(html), 14000),
  ];

  // Read a few inner pages for substance; their failures don't matter.
  const inner = await Promise.all(
    pages.slice(0, 4).map(async (p) => {
      try {
        const pg = await getPage(p);
        const t = decode((pg.html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").trim());
        return `--- ${t || p} (${p}) ---\n${cap(pageText(pg.html), 5000)}`;
      } catch {
        return "";
      }
    }),
  );

  return {
    kind: "website",
    url,
    title: siteName || title || new URL(url).hostname,
    text: [...parts, ...inner.filter(Boolean)].join("\n"),
    ogImage: ogImage || undefined,
    logo: logo || undefined,
    pages,
  };
}
