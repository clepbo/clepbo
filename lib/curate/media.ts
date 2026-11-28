import { put } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import { processImage, samplePalette } from "@/lib/palette";
import { assertPublicUrl, safeFetch } from "./safefetch";

/* Images for a drafted project: real screenshots of the site, and its logo
   with a sampled palette. Stored in Blob in production; on a local checkout
   without a Blob token they land in public/ like the shipped stills. */

const hasBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

/** Returns what the content document stores: a Blob URL, or a bare file stem. */
async function store(kind: "still" | "mark", stem: string, buffer: Buffer, ext: string, contentType: string) {
  if (hasBlob()) {
    const blob = await put(`desk/${kind}s/${stem}-${Date.now()}.${ext}`, buffer, {
      access: "public", contentType, addRandomSuffix: false,
    });
    return blob.url;
  }
  const dir = path.join(process.cwd(), "public", "assets", "media", `${kind}s`);
  await fs.mkdir(dir, { recursive: true });
  const name = `${stem}-${Date.now()}`;
  await fs.writeFile(path.join(dir, `${name}.${ext}`), buffer);
  // Stills are referenced by stem; marks keep their extension.
  return kind === "still" ? name : `${name}.${ext}`;
}

export const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "project";

/* ---------------- screenshots ---------------- */

async function launch() {
  const puppeteer = (await import("puppeteer-core")).default;
  // On Vercel (and any Linux server) the packaged Chromium is used. Locally,
  // point CHROME_PATH at an installed browser if the package can't run.
  if (process.env.CHROME_PATH) {
    return puppeteer.launch({ executablePath: process.env.CHROME_PATH, headless: true, args: ["--no-sandbox"] });
  }
  const chromium = (await import("@sparticuz/chromium")).default;
  return puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
    defaultViewport: { width: 1440, height: 900 },
  });
}

/** Screenshots of up to `max` pages, cookie banners and chat bubbles out of the way. */
export async function screenshots(urls: string[], stem: string, max = 3): Promise<string[]> {
  const targets: string[] = [];
  for (const u of urls) {
    try { await assertPublicUrl(u); targets.push(u); } catch { /* skip anything not public */ }
    if (targets.length >= max) break;
  }
  if (!targets.length) return [];

  let browser: Awaited<ReturnType<typeof launch>> | null = null;
  const out: string[] = [];
  try {
    browser = await launch();
    for (const [i, url] of targets.entries()) {
      const page = await browser.newPage();
      try {
        await page.setViewport({ width: 1440, height: 900 });
        // Sites with scroll-driven motion settle into their resting state.
        await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
        await page.goto(url, { waitUntil: "networkidle2", timeout: 25000 });
        await new Promise((r) => setTimeout(r, 1200));
        await page.evaluate(() => {
          const words = /^(accept|accept all|decline|reject|reject all|got it|ok|agree|i agree|close)$/i;
          for (const b of Array.from(document.querySelectorAll("button, a[role=button]"))) {
            if (words.test((b.textContent || "").trim())) { (b as HTMLElement).click(); break; }
          }
          for (const el of Array.from(document.querySelectorAll<HTMLElement>("body *"))) {
            const cs = getComputedStyle(el);
            if ((cs.position === "fixed" || cs.position === "sticky") && el.getBoundingClientRect().top > innerHeight * 0.45) {
              el.style.display = "none";
            }
          }
        });
        await new Promise((r) => setTimeout(r, 500));
        const shot = Buffer.from(await page.screenshot({ type: "jpeg", quality: 85 }));
        const img = await processImage(shot, "still");
        out.push(await store("still", `${stem}-${i + 1}`, img.buffer, img.ext, img.contentType));
      } catch (err) {
        console.error("screenshot failed:", url, err);
      } finally {
        await page.close().catch(() => {});
      }
    }
  } catch (err) {
    // No browser on this machine: the draft still works, with fewer pictures.
    console.error("browser unavailable:", err);
  } finally {
    await browser?.close().catch(() => {});
  }
  return out;
}

/** The og:image, when a site has one and no screenshot could be taken. */
export async function keepImage(url: string, stem: string): Promise<string | null> {
  try {
    const res = await safeFetch(url, { maxBytes: 12_000_000 });
    if (res.status !== 200 || !res.type.startsWith("image/")) return null;
    const img = await processImage(res.body, "still");
    return await store("still", stem, img.buffer, img.ext, img.contentType);
  } catch {
    return null;
  }
}

/** The logo, stored as a mark, with up to four brand colours sampled from it. */
export async function keepLogo(url: string, stem: string): Promise<{ mark: string; colors: string[] } | null> {
  try {
    const res = await safeFetch(url, { maxBytes: 5_000_000 });
    if (res.status !== 200) return null;
    const isSvg = /svg/i.test(res.type) || /\.svg(\?|$)/i.test(url);
    if (!isSvg && !res.type.startsWith("image/")) return null;
    if (isSvg) {
      const text = res.body.toString("utf8");
      // A logo is drawing, not a program: refuse anything scripted.
      if (/<script|on\w+\s*=|javascript:/i.test(text)) return null;
      const colors = [...new Set((text.match(/#[0-9a-f]{6}\b/gi) ?? []).map((c) => c.toUpperCase()))]
        .filter((c) => !["#FFFFFF", "#000000"].includes(c)).slice(0, 4);
      return { mark: await store("mark", stem, res.body, "svg", "image/svg+xml"), colors };
    }
    const img = await processImage(res.body, "mark");
    const colors = await samplePalette(res.body, 4).catch(() => []);
    return { mark: await store("mark", stem, img.buffer, img.ext, img.contentType), colors };
  } catch {
    return null;
  }
}
