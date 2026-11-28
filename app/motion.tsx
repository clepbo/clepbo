"use client";

import { useEffect, useRef } from "react";

/* Small, dependency-free motion kit for the studio page.
   Everything here stands down when the visitor asks for reduced motion. */

export const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Splits a line into words that rise in one after another. */
export function Words({ text, className, base = 0 }: { text: string; className?: string; base?: number }) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>
          <span className="w"><span className="w__in" style={{ "--i": i + base } as React.CSSProperties}>{w}</span></span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

/** A paragraph whose words light up as it scrolls through the viewport.
 *  Pass `progress` to drive it from outside (the hero scene does). */
export function WordFill({
  text, className, progress,
}: { text: string; className?: string; progress?: number }) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const words = text.split(/\s+/).filter(Boolean);

  const paint = (p: number) => {
    const el = ref.current;
    if (!el) return;
    const spans = el.children;
    const lit = Math.round(p * spans.length);
    for (let i = 0; i < spans.length; i++) {
      const on = i < lit;
      const s = spans[i] as HTMLElement;
      if (s.dataset.on !== String(on)) s.dataset.on = String(on);
    }
  };

  useEffect(() => {
    if (progress !== undefined) paint(progress);
  });

  useEffect(() => {
    if (progress !== undefined) return;
    if (prefersReduced()) { paint(1); return; }
    let raf = 0;
    const run = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      paint(clamp((vh * 0.85 - r.top) / (r.height + vh * 0.3)));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(run); };
    run();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress === undefined, text]);

  return (
    <p className={`fill ${className ?? ""}`} ref={ref}>
      {words.map((w, i) => (
        <span className="fill__w" key={`${w}-${i}`}>{w}{i < words.length - 1 ? " " : ""}</span>
      ))}
    </p>
  );
}

/** Adds `is-in` to every [data-reveal] element as it enters the viewport. */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    if (prefersReduced() || !("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** A soft ring that trails the pointer, grows over anything clickable and
 *  carries a label over elements with data-cursor. Also drives every
 *  [data-magnetic] element. Fine pointers only. */
export function Cursor() {
  const ring = useRef<HTMLDivElement | null>(null);
  const label = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || prefersReduced()) return;
    const el = ring.current!;
    document.documentElement.classList.add("has-cursor");

    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let cx = x, cy = y;
    let raf = 0;
    let magnet: HTMLElement | null = null;
    let shown = false;

    const loop = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const release = () => {
      if (magnet) { magnet.style.transform = ""; magnet = null; }
    };

    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      if (!shown) { shown = true; el.classList.add("is-on"); cx = x; cy = y; }
      const t = e.target as HTMLElement | null;
      const hit = t?.closest<HTMLElement>("[data-cursor]");
      const press = t?.closest("a, button, select, label, [role=button]");
      const text = hit?.dataset.cursor ?? "";
      el.classList.toggle("is-hover", Boolean(press) && !text);
      el.classList.toggle("is-label", Boolean(text));
      if (label.current && label.current.textContent !== text) label.current.textContent = text;

      const m = t?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (m !== magnet) release();
      if (m) {
        magnet = m;
        const r = m.getBoundingClientRect();
        const dx = x - (r.left + r.width / 2), dy = y - (r.top + r.height / 2);
        m.style.transform = `translate(${dx * 0.22}px, ${dy * 0.32}px)`;
      }
    };
    const leave = () => { shown = false; el.classList.remove("is-on"); release(); };
    const down = () => el.classList.add("is-down");
    const up = () => el.classList.remove("is-down");

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.classList.remove("has-cursor");
      release();
    };
  }, []);

  return (
    <div className="cursor" ref={ring} aria-hidden="true">
      <span className="cursor__ring"><span className="cursor__label" ref={label} /></span>
    </div>
  );
}

/** Pointer-tracked tilt and spotlight for a card. */
export function tiltHandlers() {
  return {
    onPointerMove(e: React.PointerEvent<HTMLElement>) {
      if (e.pointerType !== "mouse" || prefersReduced()) return;
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
      el.style.setProperty("--rx", `${(0.5 - py) * 6}deg`);
      el.style.setProperty("--ry", `${(px - 0.5) * 8}deg`);
    },
    onPointerLeave(e: React.PointerEvent<HTMLElement>) {
      const el = e.currentTarget;
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    },
  };
}
