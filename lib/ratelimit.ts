/** A best-effort burst limiter for the AI and upload routes.
 *
 *  It lives in the memory of one serverless instance, so it caps a runaway
 *  loop or an accidental double-click — it is not a defence against a
 *  determined attacker across many instances. The real protection is the
 *  admin password, and a spend cap set in the Anthropic console. */

type Window = { count: number; resetAt: number };
const windows = new Map<string, Window>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const w = windows.get(key);

  if (!w || now > w.resetAt) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }
  if (w.count >= limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((w.resetAt - now) / 1000) };
  }
  w.count += 1;
  return { ok: true, remaining: limit - w.count, retryAfter: 0 };
}

/** Keeps the map from growing without bound on a long-lived instance. */
export function sweep() {
  const now = Date.now();
  for (const [k, w] of windows) if (now > w.resetAt) windows.delete(k);
}
