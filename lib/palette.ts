import sharp from "sharp";

/** Sample a brand palette from a logo — the same rules used to build the
 *  existing brand plates: ignore paper and ink, ignore dead greys, then keep
 *  the most-used colours that are visibly different from each other. */
export async function samplePalette(buf: Buffer, want = 3): Promise<string[]> {
  const { data, info } = await sharp(buf)
    .resize(200, 200, { fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const counts = new Map<string, number>();
  for (let i = 0; i < data.length; i += info.channels) {
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3] ?? 255];
    if (a < 160) continue;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2 / 255;
    const s = max === min ? 0 : (max - min) / (l > 0.5 ? 510 - max - min : max + min);
    if (l > 0.94 || l < 0.06) continue;          // paper and ink
    if (s < 0.12 && l > 0.2 && l < 0.85) continue; // dead greys
    const key = `${r >> 4 << 4},${g >> 4 << 4},${b >> 4 << 4}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const out: [number, number, number][] = [];
  for (const [key] of [...counts.entries()].sort((a, b) => b[1] - a[1])) {
    const [r, g, b] = key.split(",").map(Number) as [number, number, number];
    if (out.some(([pr, pg, pb]) => Math.abs(r - pr) + Math.abs(g - pg) + Math.abs(b - pb) < 70)) continue;
    out.push([r, g, b]);
    if (out.length === want) break;
  }
  const hex = (n: number) => Math.min(n + 8, 255).toString(16).padStart(2, "0");
  return out.map(([r, g, b]) => `#${hex(r)}${hex(g)}${hex(b)}`);
}

/** Resize and compress an upload the way the existing stills were prepared. */
export async function processImage(buf: Buffer, kind: "still" | "mark") {
  const img = sharp(buf, { animated: false });
  const meta = await img.metadata();
  if (kind === "mark") {
    const out = await img.resize(640, 640, { fit: "inside", withoutEnlargement: true })
      .png({ compressionLevel: 9 }).toBuffer();
    return { buffer: out, ext: "png", contentType: "image/png", width: meta.width, height: meta.height };
  }
  const out = await img.resize(1400, 4000, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 80, progressive: true, mozjpeg: true }).toBuffer();
  return { buffer: out, ext: "jpg", contentType: "image/jpeg", width: meta.width, height: meta.height };
}
