import type { Channel } from "@/lib/types";

/** Colours come from the content document, and the document is written by a
 *  human through the editor. Anything that is not plainly a colour is dropped
 *  rather than concatenated into a stylesheet. */
const SAFE = /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%/]+\)|hsla?\([\d\s.,%/deg]+\))$/i;
const ok = (v: string, fallback: string) => (SAFE.test(v.trim()) ? v.trim() : fallback);

/* ---- the light desk is derived, never hand-maintained ---------------- */

const LIGHT_BASE = "#F2F0EA";
const LIGHT_INK = "#101314";

const hex = (v: string) => /^#[0-9a-f]{6}$/i.test(v.trim());
const toRgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
const toHex = (r: number[]) =>
  "#" + r.map((c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, "0")).join("");
const mix = (a: string, b: string, amountOfA: number) => {
  const [x, y] = [toRgb(a), toRgb(b)];
  return toHex(x.map((c, i) => c * amountOfA + y[i] * (1 - amountOfA)));
};
const luminance = (h: string) =>
  toRgb(h)
    .map((c) => c / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    .reduce((s, c, i) => s + c * [0.2126, 0.7152, 0.0722][i], 0);
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/** An accent chosen to glow on graphite is far too pale on paper. Walk it
 *  toward ink until it clears AA against the panel it will sit on. */
function accentForLight(accent: string, panel: string): string {
  if (!hex(accent)) return "#4A5350";
  for (let step = 0; step <= 100; step += 1) {
    const candidate = mix(LIGHT_INK, accent, step / 100);
    if (contrast(candidate, panel) >= 4.5) return candidate;
  }
  return LIGHT_INK;
}

/** Each channel's palette in both finishes. Dark uses the colours stored in
 *  the document; light is derived from the same accent, so editing one colour
 *  in the admin keeps both themes in step. */
export default function ChannelStyles({ channels }: { channels: Channel[] }) {
  const css = channels
    .map((c) => {
      const accent = ok(c.colour, "#A2A8A6");
      const id = Number(c.id);
      /* The desk sets data-channel on <html>; a case-study page sets it on its
         own wrapper. Both selectors are listed, and both outrank the base
         theme block, so a channel tint is never lost to specificity. */
      const dark =
        `html[data-channel="${id}"],html [data-channel="${id}"]{` +
        `--panel:${ok(c.panel, "#16181A")};` +
        `--panel-2:${ok(c.panel2, "#1C1F21")};` +
        `--panel-3:${ok(c.panel3, "#23262A")};` +
        `--accent:${accent};` +
        `--accent-ink:${ok(c.ink, "#101214")};` +
        `--glow:color-mix(in srgb, ${accent} 30%, transparent);}`;

      if (!hex(accent)) return dark;

      const panel = mix(accent, LIGHT_BASE, 0.07);
      const lightAccent = accentForLight(accent, panel);
      const light =
        `html[data-theme="light"][data-channel="${id}"],` +
        `html[data-theme="light"] [data-channel="${id}"]{` +
        `--panel:${panel};` +
        `--panel-2:${mix(accent, "#E9E6DE", 0.07)};` +
        `--panel-3:${mix(accent, "#DFDBD1", 0.09)};` +
        `--accent:${lightAccent};` +
        `--accent-ink:#F5F3ED;` +
        `--glow:color-mix(in srgb, ${lightAccent} 22%, transparent);}`;

      return `${dark}\n${light}`;
    })
    .join("\n");

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
