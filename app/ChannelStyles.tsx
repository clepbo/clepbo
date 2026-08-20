import type { Channel } from "@/lib/types";

/** Colours come from the content document, and the document is written by a
 *  human through the editor. Anything that is not plainly a colour is dropped
 *  rather than concatenated into a stylesheet. */
const SAFE = /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%/]+\)|hsla?\([\d\s.,%/deg]+\))$/i;
const ok = (v: string, fallback: string) => (SAFE.test(v.trim()) ? v.trim() : fallback);

/** Each channel's palette, written as the custom properties the stylesheet
 *  already expects. Editing a colour in the admin changes this and nothing else. */
export default function ChannelStyles({ channels }: { channels: Channel[] }) {
  const css = channels
    .map((c) => {
      const accent = ok(c.colour, "#A2A8A6");
      return (
        `html[data-channel="${Number(c.id)}"]{` +
        `--panel:${ok(c.panel, "#16181A")};` +
        `--panel-2:${ok(c.panel2, "#1C1F21")};` +
        `--panel-3:${ok(c.panel3, "#23262A")};` +
        `--accent:${accent};` +
        `--accent-ink:${ok(c.ink, "#101214")};` +
        `--glow:color-mix(in srgb, ${accent} 30%, transparent);}`
      );
    })
    .join("\n");
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
