"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Channel, Content, Project, Tool } from "@/lib/types";
import ContactForm from "./ContactForm";
import ThemeToggle from "./ThemeToggle";
import VideoPlayer from "./VideoPlayer";
import Stage from "./Stage";
import { Cursor, Words, WordFill, clamp, prefersReduced, smooth, tiltHandlers, useReveal } from "./motion";

const isUrl = (n: string) => /^https?:\/\//.test(n);
export const stillSrc = (n: string) => (isUrl(n) ? n : `/assets/media/stills/${n}.jpg`);
export const markSrc = (n: string) =>
  isUrl(n) ? n : `/assets/media/marks/${/\./.test(n) ? n : `${n}.png`}`;
const framesOf = (p: Project) =>
  p.shots?.length ? p.shots : p.media.type === "still" ? p.media.stills : [];
const pad = (n: number) => String(n).padStart(2, "0");
const NEUTRAL = "#A2A8A6";

/* Where each floating tile drifts to once the hero scrolls away, as fractions
   of half the viewport. Kept clear of the paragraph in the middle. */
const SCATTER: [number, number, number][] = [
  [-0.84, -0.64, 1.45], [-0.36, -0.6, 0.95], [0.27, -0.62, 1.05], [0.78, -0.66, 1.4],
  [0.9, -0.02, 1.3], [-0.86, -0.02, 1.15], [-0.58, 0.64, 1.05], [-0.18, 0.72, 0.62],
  [0.18, 0.7, 0.78], [0.56, 0.62, 1.2], [0.86, 0.74, 0.92], [-0.92, 0.78, 1.1],
  [0.02, -0.82, 0.7], [0.62, 0.02, 0.6], [-0.62, -0.05, 0.66], [0.38, 0.86, 0.7],
];

export default function Studio({ content }: { content: Content }) {
  const channels = useMemo(() => content.channels.filter((c) => !c.hidden), [content.channels]);
  const tools = useMemo(() => content.rack.tools.filter((t) => !t.hidden), [content.rack.tools]);
  const projects = useMemo(() => content.work.projects.filter((p) => !p.hidden), [content.work.projects]);
  const says = useMemo(() => (content.testimonials?.items ?? []).filter((t) => !t.hidden), [content.testimonials]);
  const byId = useMemo(() => new Map(channels.map((c) => [c.id, c])), [channels]);
  const tint = useCallback((ch?: number) => byId.get(ch ?? -1)?.colour ?? NEUTRAL, [byId]);
  const brands = useMemo(() => {
    const seen = new Set<string>();
    return projects
      .filter((p) => p.brand?.mark && !p.slot && !seen.has(p.brand.mark) && seen.add(p.brand.mark))
      .map((p) => ({ id: p.id, mark: p.brand!.mark, name: p.client || p.title }));
  }, [projects]);

  const [filter, setFilter] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);
  const [frame, setFrame] = useState(0);
  const [clock, setClock] = useState("");
  const [menu, setMenu] = useState(false);
  const lastFocus = useRef<HTMLElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  const shown = useMemo(() => projects.filter((p) => filter === 0 || p.ch.includes(filter)), [projects, filter]);
  const reel = openId && shown.some((p) => p.id === openId) ? shown : projects;
  const at = openId ? reel.findIndex((p) => p.id === openId) : -1;
  const current = at >= 0 ? reel[at] : null;

  useReveal([]);

  /* ---- filter, with a view transition where the browser has one ---- */
  const pick = useCallback((ch: number) => {
    const go = () => setFilter(ch);
    const d = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (d.startViewTransition && !prefersReduced()) d.startViewTransition(go);
    else go();
  }, []);

  /* ---- the project sheet ---- */
  const open = useCallback((id: string) => {
    lastFocus.current = document.activeElement as HTMLElement;
    setOpenId(id);
    setFrame(0);
  }, []);
  const close = useCallback(() => {
    setOpenId(null);
    lastFocus.current?.focus();
  }, []);
  const step = useCallback((d: number) => {
    if (at < 0 || !reel.length) return;
    setOpenId(reel[(at + d + reel.length) % reel.length].id);
    setFrame(0);
    if (sheetRef.current) sheetRef.current.scrollTop = 0;
  }, [at, reel]);

  useEffect(() => {
    document.body.classList.toggle("is-locked", Boolean(current) || menu);
  }, [current, menu]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (menu && e.key === "Escape") { setMenu(false); return; }
      if (!current) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [current, menu, close, step]);

  /* ---- local clock ---- */
  useEffect(() => {
    const tick = () => {
      try {
        setClock(new Intl.DateTimeFormat("en-GB", {
          timeZone: content.site.timezone, hour: "2-digit", minute: "2-digit",
        }).format(new Date()));
      } catch { setClock(""); }
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [content.site.timezone]);

  const nav = [
    { href: "#work", label: "Work" },
    { href: "#services", label: "Services" },
    { href: "#process", label: "Process" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];

  let sec = 0;
  const num = () => `[${pad(++sec)}]`;

  return (
    <>
      <a className="skip-link" href="#work">Skip to the work</a>
      <Cursor />
      <Nav name={content.site.name} links={nav} menu={menu} setMenu={setMenu} />

      <main id="top">
        <Hero content={content} tools={tools} tint={tint} clock={clock} />

        {brands.length > 3 && (
          <section className="clients" aria-label="Clients">
            <p className="clients__label">Trusted by founders, foundations and teams</p>
            <div className="marquee marquee--clients">
              <div className="marquee__track">
                {[0, 1].map((k) => (
                  <ul className="marquee__set" aria-hidden={k === 1} key={k}>
                    {brands.map((b) => (
                      <li className="clients__item" key={b.id}>
                        <img src={markSrc(b.mark)} alt={k === 0 ? b.name : ""} loading="lazy" decoding="async" />
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══ WORK ══ */}
        <section className="section work" id="work" aria-labelledby="workTitle">
          <Head n={num()} eyebrow={content.work.eyebrow} title={content.work.title} id="workTitle" colour={tint(1)} />

          <div className="filters" role="toolbar" aria-label="Filter the work" data-reveal>
            {[{ id: 0, name: "Everything", colour: "var(--ink)" }, ...channels].map((c) => {
              const count = c.id === 0 ? projects.length : projects.filter((p) => p.ch.includes(c.id)).length;
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`filter${filter === c.id ? " is-on" : ""}`}
                  aria-pressed={filter === c.id}
                  onClick={() => pick(c.id)}
                  style={{ "--c": c.colour } as React.CSSProperties}
                >
                  {c.id !== 0 && <i className="filter__dot" />}
                  {c.name}
                  <span className="filter__n">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="grid">
            {shown.map((p, i) => (
              <Card key={p.id} project={p} index={i} colour={tint(p.ch[0])} onOpen={open}
                channels={p.ch.map((c) => byId.get(c)).filter(Boolean) as Channel[]} />
            ))}
          </div>
        </section>

        {/* ══ SERVICES ══ */}
        <Services channels={channels} n={num()} />

        {/* ══ TOOLS + PROCESS ══ */}
        <section className="section process" id="process" aria-labelledby="pathTitle">
          <Head n={num()} eyebrow={content.path.eyebrow} title={content.path.title} id="pathTitle" note={content.path.note} colour={tint(3)} />
          <ol className="path">
            {content.path.steps.map((s, i) => (
              <li className="path__step" key={s.name} data-reveal style={{ "--i": i } as React.CSSProperties}>
                <span className="path__no">{pad(i + 1)}</span>
                <h3 className="path__name">{s.name}</h3>
                <p className="path__body">{s.body}</p>
              </li>
            ))}
          </ol>

          <div className="rack" aria-labelledby="rackTitle">
            <div className="rack__head" data-reveal>
              <p className="rack__eyebrow" id="rackTitle">{content.rack.title}</p>
              <p className="rack__note">{tools.length} tools on the desk, every day.</p>
            </div>
            {[tools, [...tools].reverse()].map((row, k) => (
              <div className={`marquee marquee--tools${k ? " marquee--rev" : ""}`} key={k}>
                <div className="marquee__track">
                  {[0, 1].map((dup) => (
                    <ul className="marquee__set" aria-hidden={k === 1 || dup === 1} key={dup}>
                      {row.map((t) => (
                        <li className="tool" key={t.name} style={{ "--c": tint(t.ch[0]) } as React.CSSProperties}>
                          <ToolIcon tool={t} />
                          <span className="tool__name">{t.name}</span>
                          <span className="tool__dots" aria-hidden="true">
                            {t.ch.map((c) => <i key={c} style={{ background: tint(c) }} />)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ TESTIMONIALS ══ */}
        {says.length > 0 && (
          <section className="section says" id="says" aria-labelledby="saysTitle">
            <Head n={num()} eyebrow={content.testimonials.eyebrow} title={content.testimonials.title} id="saysTitle" colour={tint(2)} />
            <div className="says__grid">
              {says.map((t, i) => (
                <figure className="say" key={t.id} data-reveal style={{ "--i": i, "--c": tint(t.ch?.[0]) } as React.CSSProperties}>
                  <blockquote className="say__quote">“{t.quote}”</blockquote>
                  <figcaption className="say__by">
                    <span className="say__avatar" aria-hidden="true">{t.name.slice(0, 1)}</span>
                    <span><b>{t.name}</b>{t.role && <span>{t.role}</span>}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* ══ ABOUT ══ */}
        <section className="section about" id="about" aria-labelledby="aboutTitle">
          <Head n={num()} eyebrow={content.about.eyebrow} title={content.about.title} id="aboutTitle" colour={tint(4)} />
          <div className="about__grid">
            <WordFill text={content.about.lead} className="about__lead" />
            <div className="about__side" data-reveal>
              {content.about.body.map((para, i) => <p key={i}>{para}</p>)}
              <dl className="facts">
                {content.about.facts.map((f) => (
                  <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* ══ CONTACT ══ */}
        <Contact content={content} channels={channels} tools={tools} tint={tint} n={num()} />
      </main>

      <footer className="foot">
        <div className="foot__in">
          <a className="foot__brand" href="#top" data-magnetic>
            <Mark name={content.site.name} />
            <span>{content.site.name}</span>
          </a>
          <span className="foot__txt">{content.footer.left}</span>
          <span className="foot__txt">{content.footer.right}</span>
          <a className="foot__top" href="#top">Back to top ↑</a>
        </div>
      </footer>

      {current && (
        <Sheet
          project={current}
          position={`${pad(at + 1)} / ${pad(reel.length)}`}
          colour={tint(current.ch[0])}
          frame={frame}
          setFrame={setFrame}
          onClose={close}
          onStep={step}
          boxRef={sheetRef}
        />
      )}
    </>
  );
}

/* ============================================================ */

function Mark({ name }: { name: string }) {
  const initials = name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return <span className="mark" aria-hidden="true">{initials}</span>;
}

function Head({
  n, eyebrow, title, id, note, colour,
}: { n: string; eyebrow: string; title: string; id: string; note?: string; colour: string }) {
  return (
    <header className="head" data-reveal>
      <p className="head__eyebrow" style={{ "--c": colour } as React.CSSProperties}>
        <i aria-hidden="true" />{n} {eyebrow}
      </p>
      <h2 className="head__title" id={id}><Words text={title} /></h2>
      {note && <p className="head__note">{note}</p>}
    </header>
  );
}

function ToolIcon({ tool }: { tool: Tool }) {
  if (tool.icon === "cut") {
    return (
      <span className="tool__icon" aria-hidden="true" style={{ color: "#111" }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="6" cy="18" r="2.6" /><circle cx="18" cy="18" r="2.6" />
          <path d="M7.6 16.1 18.5 4.5M16.4 16.1 5.5 4.5" />
        </svg>
      </span>
    );
  }
  const brand = BRAND[tool.icon];
  if (brand) {
    return (
      <span className="tool__icon" aria-hidden="true">
        <span
          className="tool__glyph"
          style={{ "--src": `url(/assets/icons/${tool.icon}.svg)`, "--brand": brand } as React.CSSProperties}
        />
      </span>
    );
  }
  return (
    <span className="tool__icon" aria-hidden="true">
      <img src={`/assets/icons/${tool.icon}.svg`} alt="" loading="lazy" decoding="async" />
    </span>
  );
}

/* Brand colours for the bundled single-colour icons. Anything not listed
   (an icon uploaded later) is shown as drawn. */
const BRAND: Record<string, string> = {
  figma: "#F24E1E", canva: "#00C4CC", davinciresolve: "#E2483D", wordpress: "#21759B",
  openai: "#10A37F", claude: "#D97757", git: "#F05032", github: "var(--ink)",
  miro: "#E8B500", jira: "#0052CC", clickup: "#7B68EE",
};

/* ============================================================
   Nav — a floating pill that tucks away on the way down
   ============================================================ */

function Nav({
  name, links, menu, setMenu,
}: { name: string; links: { href: string; label: string }[]; menu: boolean; setMenu: (v: boolean) => void }) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let last = window.scrollY, raf = 0;
    const run = () => {
      raf = 0;
      const y = window.scrollY;
      const el = ref.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.setProperty("--read", String(clamp(y / Math.max(1, max))));
      el.classList.toggle("is-tucked", y > last && y > 400);
      el.classList.toggle("is-scrolled", y > 24);
      last = y;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(run); };
    run();
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <header className={`nav${menu ? " is-open" : ""}`} ref={ref}>
      <div className="nav__pill">
        <a className="nav__home" href="#top" aria-label={`${name} — back to top`} onClick={() => setMenu(false)}>
          <svg className="nav__ring" viewBox="0 0 36 36" aria-hidden="true">
            <circle cx="18" cy="18" r="16.5" pathLength="1" />
          </svg>
          <Mark name={name} />
        </a>
        <button
          className="nav__burger"
          type="button"
          aria-expanded={menu}
          aria-controls="navMenu"
          aria-label={menu ? "Close the menu" : "Open the menu"}
          onClick={() => setMenu(!menu)}
        >
          <i /><i />
        </button>
        <a className="btn btn--dark nav__cta" href="#contact" data-magnetic onClick={() => setMenu(false)}>
          Start a project
        </a>
      </div>

      <div className="nav__menu" id="navMenu" hidden={!menu}>
        <ul>
          {links.map((l, i) => (
            <li key={l.href} style={{ "--i": i } as React.CSSProperties}>
              <a href={l.href} onClick={() => setMenu(false)}>
                <span className="nav__n">{pad(i + 1)}</span>{l.label}<span aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="nav__foot"><span>Theme</span><ThemeToggle /></div>
      </div>
      {menu && <div className="nav__scrim" onClick={() => setMenu(false)} />}
    </header>
  );
}

/* ============================================================
   Hero — tools orbit the headline, then scatter as you scroll
   and the intro fills in word by word
   ============================================================ */

function Hero({
  content, tools, tint, clock,
}: { content: Content; tools: Tool[]; tint: (c?: number) => string; clock: string }) {
  const scene = useRef<HTMLElement | null>(null);
  const tiles = useRef<(HTMLSpanElement | null)[]>([]);
  const [p, setP] = useState(0);
  const headline = content.site.headline || content.site.role;
  const intro = content.site.intro || content.site.description;

  useEffect(() => {
    const el = scene.current;
    if (!el) return;
    const reduced = prefersReduced();
    let raf = 0, alive = true;
    let px = 0, py = 0, tx = 0, ty = 0;
    let lastP = -1;

    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const frame = (t: number) => {
      if (!alive) return;
      const r = el.getBoundingClientRect();
      const vw = window.innerWidth, vh = window.innerHeight;
      const prog = clamp(-r.top / Math.max(1, r.height - vh));
      if (Math.abs(prog - lastP) > 0.002) { lastP = prog; setP(prog); }

      // Only animate while the scene is on screen.
      if (r.bottom > 0 && r.top < vh) {
        px += (tx - px) * 0.06; py += (ty - py) * 0.06;
        const n = tiles.current.length;
        const small = vw < 720;
        const rx = small ? vw * 0.4 : Math.min(vw * 0.34, 470);
        const ry = small ? vh * 0.36 : Math.min(vh * 0.37, 360);
        const s = smooth(0.02, 0.55, prog);
        tiles.current.forEach((tile, i) => {
          if (!tile) return;
          const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
          const [sx, sy, ss] = SCATTER[i % SCATTER.length];
          const depth = 0.5 + ((i * 37) % 10) / 12;
          const fx = reduced ? 0 : Math.sin(t * 0.0006 + i * 1.7) * 7;
          const fy = reduced ? 0 : Math.cos(t * 0.0005 + i * 1.3) * 9;
          let ox = Math.cos(a) * rx, oy = Math.sin(a) * ry;
          let gx = sx * vw * 0.5 * 0.96, gy = sy * vh * 0.5 * 0.92;
          if (small) {
            // Phones: keep the tiles in bands above and below the copy.
            const row = Math.floor(i / 3) % 4, col = i % 3;
            const band = [-0.39, -0.3, 0.3, 0.39][row];
            ox = ((col + (row % 2 ? 0.5 : 0)) / 3 - 0.4) * vw * 0.82;
            oy = band * vh;
            gx = sx * vw * 0.46;
            gy = Math.sign(sy || (i % 2 ? 1 : -1)) * (0.62 + Math.abs(sy) * 0.3) * vh * 0.5;
          }
          const x = ox + (gx - ox) * s + fx + (reduced ? 0 : px * 22 * depth);
          const y = oy + (gy - oy) * s + fy + (reduced ? 0 : py * 18 * depth) - smooth(0.7, 1, prog) * 160 * depth;
          const scale = 1 + (ss * (small ? 0.75 : 1) - 1) * s;
          tile.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
          tile.style.opacity = String(1 - smooth(0.82, 1, prog) * 0.9);
        });
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => { alive = false; cancelAnimationFrame(raf); window.removeEventListener("pointermove", onMove); };
  }, [tools.length]);

  const heroOut = smooth(0.0, 0.32, p);
  const introIn = smooth(0.26, 0.42, p);
  const fill = smooth(0.4, 0.86, p);

  return (
    <section className="scene" ref={scene} aria-labelledby="heroTitle">
      <div className="scene__pin">
        <div className="orbit" aria-hidden="true">
          {tools.map((t, i) => (
            <span
              className="orbit__tile"
              key={t.name}
              ref={(el) => { tiles.current[i] = el; }}
            >
              <span className={`orbit__in${i % 4 === 1 ? " is-solid" : ""}`} style={{ "--i": i, "--c": tint(t.ch[0]), "--b": BRAND[t.icon] ?? tint(t.ch[0]) } as React.CSSProperties} title={t.name}>
                <ToolIcon tool={t} />
              </span>
            </span>
          ))}
        </div>

        <div
          className="hero"
          style={{ opacity: 1 - heroOut, transform: `translateY(${-heroOut * 80}px) scale(${1 - heroOut * 0.06})`, visibility: heroOut > 0.99 ? "hidden" : undefined }}
        >
          <p className="hero__status">
            <span className="pulse" aria-hidden="true" />
            Available for new work · {content.site.location}
          </p>
          <h1 className="hero__title" id="heroTitle"><Words text={headline} /></h1>
          <div className="hero__cta">
            <a className="btn btn--dark btn--lg" href="#work" data-magnetic>See the work</a>
            <a className="btn btn--ghost btn--lg" href="#contact" data-magnetic>Get in touch</a>
          </div>
          <p className="hero__sub">{content.site.role}</p>
        </div>

        <div
          className="scene__intro"
          style={{ opacity: introIn, transform: `translateY(${(1 - introIn) * 40}px)`, visibility: introIn < 0.01 ? "hidden" : undefined }}
        >
          <WordFill text={intro} className="intro" progress={fill} />
        </div>

        <div className="scene__foot" style={{ opacity: 1 - smooth(0.05, 0.2, p) }}>
          <span className="scene__clock">
            {content.site.name}{clock && <> · {clock} local</>}
          </span>
          <a className="scene__down" href="#work">
            Scroll to explore <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Work card
   ============================================================ */

function Card({
  project: p, index, colour, onOpen, channels,
}: { project: Project; index: number; colour: string; onOpen: (id: string) => void; channels: Channel[] }) {
  const wide = Boolean(p.case) && index < 3;
  return (
    <article
      className={`card${wide ? " card--wide" : ""}${p.slot ? " card--slot" : ""}`}
      style={{ "--c": colour, "--i": index % 6, viewTransitionName: `card-${p.id}` } as React.CSSProperties}
      {...tiltHandlers()}
    >
      <button className="card__btn" type="button" onClick={() => onOpen(p.id)} data-cursor="Open" aria-label={`Open ${p.title}`}>
        <span className="card__media">
          <Visual project={p} />
          <span className="card__glow" aria-hidden="true" />
        </span>
        <span className="card__body">
          <span className="card__meta">
            <span className="card__kind">{p.kind}</span>
            <span className="card__chs" aria-hidden="true">
              {channels.map((c) => <i key={c.id} style={{ background: c.colour }} title={c.name} />)}
            </span>
          </span>
          <span className="card__title">{p.title}</span>
          <span className="card__line">{p.line}</span>
        </span>
        <span className="card__arrow" aria-hidden="true">↗</span>
      </button>
      {p.case && <Link className="card__case" href={`/work/${p.id}`}>Case study</Link>}
    </article>
  );
}

function Visual({ project }: { project: Project }) {
  const m = project.media;
  const f = framesOf(project);

  if (m.type === "brand" && project.brand) {
    const b = project.brand;
    return (
      <span className={`vis vis--brand${b.dark ? " is-dark" : ""}`}>
        {f[0] && <img className="vis__peek" src={stillSrc(f[0])} alt="" loading="lazy" decoding="async" />}
        <span className="vis__plate">
          <img src={markSrc(b.mark)} alt={`${project.client} logo`} loading="lazy" decoding="async" />
        </span>
        <span className="vis__sw">
          {b.colors.map((c) => <i key={c} style={{ background: c }} />)}
        </span>
      </span>
    );
  }
  if (m.type === "still" || m.type === "canvas") {
    const src = m.type === "still" ? stillSrc(m.stills[0]) : m.src;
    return (
      <span className="vis vis--still">
        <span className="vis__win">
          <span className="vis__bar"><i /><i /><i /></span>
          <img src={src} alt={`Frame from ${project.title}`} loading="lazy" decoding="async" />
        </span>
        {m.type === "still" && m.video && <span className="vis__play" aria-hidden="true" />}
        {m.type === "still" && m.stills.length > 1 && <span className="vis__count">{m.stills.length} frames</span>}
      </span>
    );
  }
  const glyph = m.type === "plate" ? m.glyph : "··";
  return <span className="vis vis--plate"><span className="vis__glyph">{glyph || "··"}</span></span>;
}

/* ============================================================
   Services — a sticky stage beside a scrolling list of steps
   ============================================================ */

function Services({ channels, n }: { channels: Channel[]; n: string }) {
  const [active, setActive] = useState(0);
  const list = useRef<HTMLOListElement | null>(null);
  const steps = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    const run = () => {
      raf = 0;
      const mid = window.innerHeight * 0.5;
      let best = 0, bestD = Infinity;
      steps.current.forEach((s, i) => {
        if (!s) return;
        const r = s.getBoundingClientRect();
        const d = Math.abs(r.top + Math.min(r.height, 160) / 2 - mid);
        if (d < bestD) { bestD = d; best = i; }
      });
      setActive(best);
      const l = list.current;
      if (l) {
        const r = l.getBoundingClientRect();
        l.style.setProperty("--prog", String(clamp((mid - r.top) / r.height)));
      }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(run); };
    run();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); if (raf) cancelAnimationFrame(raf); };
  }, [channels.length]);

  const cur = channels[active] ?? channels[0];
  if (!cur) return null;

  return (
    <section className="section services" id="services" aria-labelledby="servicesTitle">
      <Head n={n} eyebrow="What I do" title="One person. Four ways to get it shipped." id="servicesTitle" colour={channels[1]?.colour ?? NEUTRAL} />

      <div className="services__grid">
        <ol className="steps" ref={list}>
          {channels.map((c, i) => (
            <li
              className={`step${i === active ? " is-active" : ""}${i < active ? " is-past" : ""}`}
              key={c.id}
              ref={(el) => { steps.current[i] = el; }}
              style={{ "--c": c.colour } as React.CSSProperties}
            >
              <span className="step__no">{pad(i + 1)}</span>
              <div className="step__copy">
                <p className="step__name">{c.name}</p>
                <h3 className="step__head">{c.brief.head}</h3>
                <p className="step__body">{c.brief.body}</p>
                <ul className="step__list">
                  {c.brief.list.map((li) => <li key={li}>{li}</li>)}
                </ul>
                <div className="step__stage stage" aria-hidden="true">
                  {i === active && <Stage channel={c} key={`m-${c.id}`} />}
                </div>
              </div>
            </li>
          ))}
        </ol>

        <aside className="services__aside" aria-hidden="true">
          <div className="stage stage--sticky" style={{ "--c": cur.colour } as React.CSSProperties}>
            <span className="stage__count">{pad(active + 1)} / {pad(channels.length)}</span>
            <span className="stage__name">{cur.name}</span>
            <div className="stage__screen">
              <Stage channel={cur} key={cur.id} />
            </div>
            <dl className="stage__spec">
              {cur.brief.spec.slice(0, 2).map((s) => (
                <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>
              ))}
            </dl>
          </div>
        </aside>
      </div>
    </section>
  );
}

/* ============================================================
   Contact — tiles gather around the card
   ============================================================ */

function Contact({
  content, channels, tools, tint, n,
}: { content: Content; channels: Channel[]; tools: Tool[]; tint: (c?: number) => string; n: string }) {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    let raf = 0;
    const run = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--gather", String(clamp(1 - (r.top - window.innerHeight * 0.1) / (window.innerHeight * 0.9))));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(run); };
    run();
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); if (raf) cancelAnimationFrame(raf); };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(content.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${content.contact.email}`;
    }
  }

  const spots: [number, number][] = [
    [-46, -30], [44, -34], [-50, 8], [50, 4], [-40, 40], [42, 42], [-22, -44], [24, 48], [-54, -8], [56, -16],
  ];

  return (
    <section className="section contact" id="contact" aria-labelledby="contactTitle" ref={ref}>
      <div className="contact__float" aria-hidden="true">
        {tools.slice(0, spots.length).map((t, i) => (
          <span
            className="contact__tile"
            key={t.name}
            style={{ "--x": spots[i][0], "--y": spots[i][1], "--i": i, "--c": tint(t.ch[0]) } as React.CSSProperties}
          >
            <ToolIcon tool={t} />
          </span>
        ))}
      </div>

      <Head n={n} eyebrow={content.contact.eyebrow} title={content.contact.title} id="contactTitle" colour={tint(1)} />
      <p className="contact__body" data-reveal>{content.contact.body}</p>

      <div className="contact__card" data-reveal>
        <div className="contact__say">
          <p className="contact__label">Email me directly</p>
          <a className="contact__email" href={`mailto:${content.contact.email}?subject=Project%20enquiry`}>
            {content.contact.email}
          </a>
          <div className="contact__actions">
            <button className="btn btn--ghost" type="button" onClick={copy} data-magnetic>
              {copied ? "Copied ✓" : "Copy address"}
            </button>
            {content.site.cv?.url && (
              <a className="btn btn--ghost" href={content.site.cv.url} target="_blank" rel="noopener" data-magnetic>
                {content.site.cv.label || "Download CV"} ↓
              </a>
            )}
          </div>
          <ul className="contact__links">
            {content.contact.links.map((l) => (
              <li key={l.label}>
                <a href={l.href} rel="me noopener" target="_blank">{l.label}<span aria-hidden="true">↗</span></a>
              </li>
            ))}
          </ul>
        </div>

        {content.contact.form?.enabled && (
          <ContactForm
            form={content.contact.form}
            channels={channels.map((c) => ({ id: c.id, name: c.name }))}
            email={content.contact.email}
          />
        )}
      </div>
    </section>
  );
}

/* ============================================================
   The project sheet
   ============================================================ */

function Sheet({
  project, position, colour, frame, setFrame, onClose, onStep, boxRef,
}: {
  project: Project; position: string; colour: string; frame: number;
  setFrame: (n: number) => void; onClose: () => void; onStep: (d: number) => void;
  boxRef: React.RefObject<HTMLDivElement | null>;
}) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const frames = framesOf(project);
  const src = frames.length ? stillSrc(frames[frame] ?? frames[0]) : null;

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    if (boxRef.current) boxRef.current.scrollTop = 0;
  }, [project.id, boxRef]);

  return (
    <div className="sheet" style={{ "--c": colour } as React.CSSProperties}>
      <div className="sheet__scrim" onClick={onClose} />
      <div className="sheet__box" role="dialog" aria-modal="true" aria-labelledby="sheetTitle" ref={boxRef}>
        <header className="sheet__bar">
          <span className="sheet__kind"><i />{project.kind}</span>
          <span className="sheet__pos">{position}</span>
          <button className="sheet__close" type="button" onClick={onClose} ref={closeRef} aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className="sheet__screen" key={`${project.id}-${frame}`}>
          {project.video ? (
            <VideoPlayer video={project.video} poster={src ?? undefined} title={project.title} />
          ) : src ? (
            <img className="sheet__img" src={src} alt={`${project.title} — screen`} />
          ) : (
            <Visual project={project} />
          )}
        </div>

        {frames.length > 1 && (
          <div className="strip">
            {frames.map((f, i) => (
              <button type="button" className={`strip__frame${i === frame ? " is-on" : ""}`} key={f}
                aria-label={`Frame ${i + 1}`} aria-current={i === frame} onClick={() => setFrame(i)}>
                <img src={stillSrc(f)} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}

        <div className="sheet__info">
          {project.client && <p className="sheet__client">{project.client}</p>}
          <h3 className="sheet__title" id="sheetTitle">{project.title}</h3>
          <p className="sheet__story">{project.story}</p>

          {project.brand && <BrandBar project={project} />}
          {project.case && <CaseBlocks project={project} />}

          <dl className="meta">
            {project.meta.map((m) => (
              <div key={m.label}><dt>{m.label}</dt><dd>{m.value}</dd></div>
            ))}
          </dl>
          {project.note && <p className="sheet__note">{project.note}</p>}

          <div className="sheet__links">
            {project.case && <Link className="btn btn--dark" href={`/work/${project.id}`}>Read the full case study →</Link>}
            {project.link && (
              <a className="btn btn--ghost" href={project.link} target="_blank" rel="noopener">
                {project.linkText || "Open"} ↗
              </a>
            )}
          </div>
        </div>

        <nav className="sheet__nav" aria-label="Move through the work">
          <button className="btn btn--ghost" type="button" onClick={() => onStep(-1)}>← Previous</button>
          <span className="sheet__hint"><kbd>←</kbd><kbd>→</kbd> <kbd>Esc</kbd></span>
          <button className="btn btn--ghost" type="button" onClick={() => onStep(1)}>Next →</button>
        </nav>
      </div>
    </div>
  );
}

export function BrandBar({ project }: { project: Project }) {
  const b = project.brand!;
  return (
    <div className="brandbar">
      <p className="case__head">Brand</p>
      <div className="brandbar__row">
        <span className={`brandbar__mark${b.dark ? " is-dark" : ""}`}>
          <img src={markSrc(b.mark)} alt={`${project.client} logo`} loading="lazy" />
        </span>
        <ul className="brandbar__sws">
          {b.colors.map((c) => (
            <li className="brandbar__sw" key={c}>
              <span className="brandbar__chip" style={{ background: c }} />
              <span className="brandbar__hex">{c.toUpperCase()}</span>
            </li>
          ))}
        </ul>
        {b.type && <p className="brandbar__type"><span>Typeface</span>{b.type}</p>}
      </div>
    </div>
  );
}

function CaseBlocks({ project }: { project: Project }) {
  const c = project.case!;
  return (
    <div className="case">
      {c.problem && (
        <section className="case__block">
          <p className="case__head">The problem</p>
          <p className="case__lead">{c.problem}</p>
        </section>
      )}
      {(c.features?.length ?? 0) > 0 && (
        <section className="case__block">
          <p className="case__head">What it does</p>
          <ul className="case__list">
            {c.features!.map((f) => (
              <li key={f.title}><h5 className="case__sub">{f.title}</h5><p className="case__text">{f.body}</p></li>
            ))}
          </ul>
        </section>
      )}
      {c.process.length > 0 && (
        <section className="case__block">
          <p className="case__head">How it was worked out</p>
          <ol className="case__list case__list--num">
            {c.process.map((s, i) => (
              <li key={s.title}>
                <span className="case__n">{pad(i + 1)}</span>
                <div><h5 className="case__sub">{s.title}</h5><p className="case__text">{s.body}</p></div>
              </li>
            ))}
          </ol>
        </section>
      )}
      {c.decisions.length > 0 && (
        <section className="case__block">
          <p className="case__head">Design decisions</p>
          <ul className="case__list">
            {c.decisions.map((d) => (
              <li key={d.title}><h5 className="case__sub">{d.title}</h5><p className="case__text">{d.body}</p></li>
            ))}
          </ul>
        </section>
      )}
      {c.outcome && (
        <section className="case__block case__block--out">
          <p className="case__head">Outcome</p>
          <p className="case__lead">{c.outcome}</p>
        </section>
      )}
    </div>
  );
}
