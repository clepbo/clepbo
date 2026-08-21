/** Work out how to play a URL without asking the author to pick a provider.
 *  Everything here is a plain URL they already have. */

export type Playable =
  | { kind: "embed"; src: string; title: string }
  | { kind: "file"; src: string }
  | null;

const YT_ID = /^[\w-]{11}$/;

export function resolveVideo(raw: string | undefined): Playable {
  const v = raw?.trim();
  if (!v) return null;

  // A bare YouTube id, pasted straight from the address bar
  if (YT_ID.test(v)) return yt(v);

  let url: URL;
  try {
    url = new URL(v);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;

  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtu.be") return yt(url.pathname.slice(1));
  if (host.endsWith("youtube.com")) {
    const id = url.searchParams.get("v") ?? url.pathname.split("/").pop() ?? "";
    return YT_ID.test(id) ? yt(id) : null;
  }

  // Google Drive plays in place through its preview view — no migration needed
  if (host === "drive.google.com") {
    const id = url.pathname.match(/\/file\/d\/([^/]+)/)?.[1];
    return id
      ? { kind: "embed", src: `https://drive.google.com/file/d/${id}/preview`, title: "Google Drive player" }
      : null;
  }

  // Cloudflare Stream and Bunny both hand you an iframe URL
  if (host.endsWith("cloudflarestream.com") || host === "iframe.videodelivery.net") {
    return { kind: "embed", src: withParams(url, { autoplay: "true" }), title: "Cloudflare Stream player" };
  }
  if (host.endsWith("mediadelivery.net")) {
    return { kind: "embed", src: withParams(url, { autoplay: "true" }), title: "Bunny Stream player" };
  }

  if (/\.(mp4|webm|ogv|mov|m3u8)$/i.test(url.pathname)) return { kind: "file", src: url.toString() };

  // An unknown https iframe is still better than a redirect away from the site
  if (url.pathname.includes("/embed") || url.pathname.includes("/iframe")) {
    return { kind: "embed", src: url.toString(), title: "Video player" };
  }
  return null;
}

function yt(id: string): Playable {
  if (!YT_ID.test(id)) return null;
  // nocookie: no tracking cookie until somebody actually presses play
  const q = new URLSearchParams({ autoplay: "1", rel: "0", modestbranding: "1", playsinline: "1" });
  return { kind: "embed", src: `https://www.youtube-nocookie.com/embed/${id}?${q}`, title: "YouTube player" };
}

function withParams(url: URL, extra: Record<string, string>) {
  const next = new URL(url.toString());
  for (const [k, v] of Object.entries(extra)) next.searchParams.set(k, v);
  return next.toString();
}
