import { lookup } from "dns/promises";
import { isIP } from "net";

/* Fetching a URL the author pasted. The admin is behind a password, but the
   server should still never be pointed at its own network: only public
   http(s) hosts, redirects re-checked hop by hop, sizes and time capped. */

const PRIVATE_V4 = [
  [0x00000000, 8], [0x0a000000, 8], [0x64400000, 10], [0x7f000000, 8], [0xa9fe0000, 16],
  [0xac100000, 12], [0xc0000000, 24], [0xc0a80000, 16], [0xc6120000, 15], [0xe0000000, 3],
] as const;

function v4ToInt(ip: string) {
  return ip.split(".").reduce((n, part) => (n << 8) + Number(part), 0) >>> 0;
}

function isPrivate(ip: string): boolean {
  if (isIP(ip) === 4) {
    const n = v4ToInt(ip);
    return PRIVATE_V4.some(([base, bits]) => (n >>> (32 - bits)) === (base >>> (32 - bits)));
  }
  const v6 = ip.toLowerCase();
  if (v6 === "::1" || v6 === "::") return true;
  if (v6.startsWith("fc") || v6.startsWith("fd") || v6.startsWith("fe80")) return true;
  const mapped = v6.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  return mapped ? isPrivate(mapped[1]) : false;
}

export async function assertPublicUrl(raw: string): Promise<URL> {
  let url: URL;
  try { url = new URL(raw); } catch { throw new Error(`"${raw}" isn't a valid link.`); }
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error(`Only web links can be read: ${raw}`);
  if (url.username || url.password) throw new Error("Links with a username or password can't be read.");
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) {
    throw new Error(`${host} isn't a public address.`);
  }
  const addrs = isIP(host) ? [{ address: host }] : await lookup(host, { all: true }).catch(() => []);
  if (!addrs.length) throw new Error(`Couldn't find ${host}.`);
  if (addrs.some((a) => isPrivate(a.address))) throw new Error(`${host} isn't a public address.`);
  return url;
}

export const UA = "Mozilla/5.0 (compatible; PortfolioCurator/1.0; +https://israeloni.vercel.app)";

/** GET with redirects followed by hand, so every hop is checked. */
export async function safeFetch(
  raw: string,
  { maxBytes = 2_000_000, timeoutMs = 12_000, headers = {} as Record<string, string> } = {},
): Promise<{ url: string; status: number; type: string; body: Buffer }> {
  let current = raw;
  for (let hop = 0; hop < 5; hop++) {
    const url = await assertPublicUrl(current);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        redirect: "manual",
        signal: ctrl.signal,
        headers: { "user-agent": UA, accept: "*/*", ...headers },
      });
      if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
        current = new URL(res.headers.get("location")!, url).toString();
        continue;
      }
      const chunks: Uint8Array[] = [];
      let size = 0;
      if (res.body) {
        const reader = res.body.getReader();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          size += value.length;
          if (size > maxBytes) { await reader.cancel(); break; }
          chunks.push(value);
        }
      }
      return {
        url: url.toString(),
        status: res.status,
        type: res.headers.get("content-type") ?? "",
        body: Buffer.concat(chunks),
      };
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error(`Too many redirects from ${raw}.`);
}
