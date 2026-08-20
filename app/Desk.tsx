"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Channel, Content, Project } from "@/lib/types";

const isUrl = (n: string) => /^https?:\/\//.test(n);
const stillSrc = (n: string) => (isUrl(n) ? n : `/assets/media/stills/${n}.jpg`);
const markSrc = (n: string) =>
  isUrl(n) ? n : `/assets/media/marks/${/\./.test(n) ? n : `${n}.png`}`;
const framesOf = (p: Project) =>
  p.shots?.length ? p.shots : p.media.type === "still" ? p.media.stills : [];

export default function Desk({ content }: { content: Content }) {
  const channels = useMemo(() => content.channels.filter((c) => !c.hidden), [content.channels]);
  const tools = useMemo(() => content.rack.tools.filter((t) => !t.hidden), [content.rack.tools]);
  const projects = useMemo(() => content.work.projects.filter((p) => !p.hidden), [content.work.projects]);
  const byId = useMemo(() => new Map(channels.map((c) => [c.id, c])), [channels]);

  const [live, setLive] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);
  const [frame, setFrame] = useState(0);
  const [clock, setClock] = useState("--:--");
  const lastFocus = useRef<HTMLElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const shown = useMemo(
    () => projects.filter((p) => live === 0 || p.ch.includes(live)),
    [projects, live],
  );
  const reel = openId ? shown.filter((p) => p.id === openId).length ? shown : projects : shown;
  const at = openId ? reel.findIndex((p) => p.id === openId) : -1;
  const current = at >= 0 ? reel[at] : null;

  /* ---- the desk relights ---- */
  useEffect(() => {
    document.documentElement.dataset.channel = String(live);
  }, [live]);

  useEffect(() => {
    document.body.classList.toggle("is-locked", Boolean(current));
  }, [current]);

  const patch = useCallback((ch: number, scroll = false) => {
    setLive((prev) => (prev === ch ? 0 : ch));
    if (scroll) {
      requestAnimationFrame(() => {
        document.getElementById("brief")?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "start",
        });
      });
    }
  }, []);

  const open = useCallback((id: string) => {
    lastFocus.current = document.activeElement as HTMLElement;
    setOpenId(id);
    setFrame(0);
  }, []);

  const close = useCallback(() => {
    setOpenId(null);
    lastFocus.current?.focus();
  }, []);

  const step = useCallback(
    (d: number) => {
      if (at < 0 || !reel.length) return;
      setOpenId(reel[(at + d + reel.length) % reel.length].id);
      setFrame(0);
      if (boxRef.current) boxRef.current.scrollTop = 0;
    },
    [at, reel],
  );

  /* ---- keyboard ---- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (document.activeElement as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (current) {
        if (e.key === "Escape") close();
        else if (e.key === "ArrowRight") step(1);
        else if (e.key === "ArrowLeft") step(-1);
        return;
      }
      if (channels.some((c) => String(c.id) === e.key)) patch(Number(e.key), true);
      else if (e.key === "0" || e.key === "Escape") setLive(0);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [current, channels, patch, close, step]);

  /* ---- desk clock ---- */
  useEffect(() => {
    const tick = () => {
      try {
        setClock(
          `${new Intl.DateTimeFormat("en-GB", {
            timeZone: content.site.timezone,
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date())} WAT`,
        );
      } catch {
        setClock("");
      }
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [content.site.timezone]);

  const liveCh = byId.get(live);
  const status = liveCh ? `CH 0${liveCh.id} live — ${liveCh.name.toLowerCase()}` : "Standby — pick a channel";
  const shortStatus = liveCh ? `CH 0${liveCh.id} live` : "Standby";
  const rackOn = tools.filter((t) => live === 0 || t.ch.includes(live)).length;

  return (
    <>
      <a className="skip-link" href="#console">Skip to the channels</a>

      <header className="rail">
        <div className="rail__id">
          <span className="rail__name">{content.site.name}</span>
          <span className="rail__sep" aria-hidden="true" />
          <span className="rail__role">{content.site.role}</span>
        </div>
        <p className="rail__tally">
          <span className="lamp" aria-hidden="true" />
          <span className="rail__status" role="status">{status}</span>
          <span className="rail__status rail__status--short" aria-hidden="true">{shortStatus}</span>
        </p>
        <div className="rail__meta">
          <span>{content.site.location}</span>
          <span className="rail__dot" aria-hidden="true" />
          <span className="rail__clock">{clock}</span>
        </div>
      </header>

      <main>
        {/* ══ THE DESK ══ */}
        <section className="console" id="console" aria-labelledby="consoleTitle">
          <h1 className="visually-hidden" id="consoleTitle">
            {content.site.name} — {channels.map((c) => c.name).join(", ")}
          </h1>

          <div className={`channels${live ? " channels--patched" : ""}`} role="group" aria-label="Service channels">
            {channels.map((c) => (
              <article className={`channel${live === c.id ? " channel--live" : ""}`} data-ch={c.id} key={c.id}>
                <button
                  className="channel__btn"
                  type="button"
                  aria-pressed={live === c.id}
                  aria-controls={`brief-${c.id}`}
                  onClick={() => patch(c.id, live !== c.id)}
                >
                  <span className="channel__no">CH {String(c.id).padStart(2, "0")}</span>
                  <span className="channel__meter">
                    <Meter wave={c.wave} colour={c.colour} />
                  </span>
                  <span className="channel__title">
                    <span className="channel__word">{c.word}</span>
                    <span className="channel__word channel__word--sub">{c.sub}</span>
                  </span>
                  <span className="channel__line">{c.line}</span>
                  <span className="channel__tags">
                    {c.tags.map((t) => (
                      <span className="tag" key={t}>{t}</span>
                    ))}
                  </span>
                  <span className="channel__cue">
                    <span className="channel__cue-txt">Patch</span>
                    <span className="channel__cue-arw" aria-hidden="true">→</span>
                  </span>
                </button>
              </article>
            ))}
          </div>

          <p className="console__hint">
            {channels.map((c) => <kbd key={c.id}>{c.id}</kbd>)} {content.site.hint}
            <span className="console__hint-sep" aria-hidden="true" />
            <kbd>0</kbd> back to standby
          </p>
        </section>

        {/* ══ CHANNEL BRIEF ══ */}
        <section className="brief" id="brief" aria-live="polite">
          {!liveCh && (
            <div className="brief__panel brief__panel--standby">
              <p className="brief__standby">{content.site.standby}</p>
            </div>
          )}
          {liveCh && (
            <div className="brief__panel" id={`brief-${liveCh.id}`}>
              <div className="brief__main">
                <p className="eyebrow">Channel {String(liveCh.id).padStart(2, "0")} — live</p>
                <h2 className="brief__head">{liveCh.brief.head}</h2>
                <p className="brief__body">{liveCh.brief.body}</p>
                <ul className="brief__list">
                  {liveCh.brief.list.map((li) => <li key={li}>{li}</li>)}
                </ul>
              </div>
              <aside className="brief__spec">
                <p className="brief__spec-head">Channel spec</p>
                <dl className="brief__spec-list">
                  {liveCh.brief.spec.map((s) => (
                    <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>
                  ))}
                </dl>
              </aside>
            </div>
          )}
        </section>

        {/* ══ THE RACK ══ */}
        <section className="rack" id="rack" aria-labelledby="rackTitle">
          <p className="eyebrow">{content.rack.eyebrow}</p>
          <h2 className="rack__title" id="rackTitle">{content.rack.title}</h2>
          <p className="rack__note">
            {live === 0
              ? content.rack.note
              : `${rackOn} of ${tools.length} in use on ${liveCh?.name.toLowerCase()}.`}
          </p>
          <ul className="rack__list">
            {tools.map((t) => (
              <li
                className={`rack__item${live !== 0 && !t.ch.includes(live) ? " rack__item--dim" : ""}`}
                key={t.name}
              >
                {t.icon === "cut" ? (
                  <span className="rack__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                      <circle cx="6" cy="18" r="2.6" /><circle cx="18" cy="18" r="2.6" />
                      <path d="M7.6 16.1 18.5 4.5M16.4 16.1 5.5 4.5" />
                    </svg>
                  </span>
                ) : (
                  <img className="rack__icon" src={`/assets/icons/${t.icon}.svg`} alt="" aria-hidden="true" loading="lazy" />
                )}
                <span className="rack__name">{t.name}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ══ WORK ══ */}
        <section className="work" id="work" aria-labelledby="workTitle">
          <div className="section-head">
            <p className="eyebrow">{content.work.eyebrow}</p>
            <h2 className="section-title" id="workTitle">{content.work.title}</h2>
            <p className="section-note">
              {live === 0
                ? content.work.note
                : `${shown.length} ${shown.length === 1 ? "project" : "projects"} on ${liveCh?.name.toLowerCase()}.`}
            </p>
          </div>
          <div className="work__grid">
            {projects.map((p) => {
              const match = live === 0 || p.ch.includes(live);
              const frames = framesOf(p);
              return (
                <article
                  className={`card${p.slot ? " card--slot" : ""}${match ? "" : " card--dim"}`}
                  data-id={p.id}
                  key={p.id}
                  style={{ "--card-accent": byId.get(p.ch[0])?.colour ?? "#A2A8A6", order: match ? 0 : 1 } as React.CSSProperties}
                >
                  <button className="card__btn" type="button" aria-label={`Open ${p.title}`} onClick={() => open(p.id)}>
                    <Visual project={p} brand={p.brand} big={false} />
                    <span className="card__body">
                      <span className="card__top">
                        <span className="card__kind">{p.kind}</span>
                        {p.ch.length > 1 && (
                          <span className="card__multi">{p.ch.map((c) => `CH 0${c}`).join(" + ")}</span>
                        )}
                      </span>
                      <span className="card__title">{p.title}</span>
                      <span className="card__line">{p.line}</span>
                      <span className="card__open">Open<span aria-hidden="true"> →</span></span>
                    </span>
                  </button>
                  {frames.length > 1 && p.media.type !== "still" && (
                    <span className="card__frames">{frames.length} screens</span>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* ══ SIGNAL PATH ══ */}
        <section className="path" id="path" aria-labelledby="pathTitle">
          <div className="section-head">
            <p className="eyebrow">{content.path.eyebrow}</p>
            <h2 className="section-title" id="pathTitle">{content.path.title}</h2>
            <p className="section-note">{content.path.note}</p>
          </div>
          <ol className="path__list">
            {content.path.steps.map((s, i) => (
              <li className="path__step" key={s.name}>
                <span className="path__no">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="path__name">{s.name}</h3>
                <p className="path__body">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ══ ABOUT ══ */}
        <section className="about" id="about" aria-labelledby="aboutTitle">
          <div className="about__inner">
            <p className="eyebrow">{content.about.eyebrow}</p>
            <h2 className="section-title" id="aboutTitle">{content.about.title}</h2>
            <div className="about__cols">
              <p className="about__lead">{content.about.lead}</p>
              <div className="about__rest">
                {content.about.body.map((para, i) => <p key={i}>{para}</p>)}
                <dl className="about__facts">
                  {content.about.facts.map((f) => (
                    <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* ══ CONTACT ══ */}
        <section className="contact" id="contact" aria-labelledby="contactTitle">
          <p className="eyebrow">{content.contact.eyebrow}</p>
          <h2 className="contact__title" id="contactTitle">{content.contact.title}</h2>
          <p className="contact__body">{content.contact.body}</p>
          <a className="contact__jack" href={`mailto:${content.contact.email}?subject=Project%20enquiry`}>
            <span className="contact__jack-label">Email</span>
            <span className="contact__jack-value">{content.contact.email}</span>
          </a>
          <ul className="contact__links">
            {content.contact.links.map((l) => (
              <li key={l.label}>
                <a href={l.href} rel="me noopener" target="_blank">{l.label}</a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="foot">
        <span>{content.footer.left}</span>
        <span className="foot__mark" aria-hidden="true" />
        <span>{content.footer.right}</span>
      </footer>

      {current && (
        <Monitor
          project={current}
          position={`${at + 1} / ${reel.length}`}
          accent={byId.get(current.ch[0])?.colour ?? "#A2A8A6"}
          frame={frame}
          setFrame={setFrame}
          onClose={close}
          onStep={step}
          boxRef={boxRef}
        />
      )}
    </>
  );
}

/* ============================================================
   The visual: a brand plate, a real frame, a canvas map, or a
   typographic plate. In the monitor, real screens win.
   ============================================================ */

function Visual({
  project, brand, big,
}: { project: Project; brand?: Project["brand"]; big: boolean }) {
  const cls = big ? "media media--big" : "media";

  if (big) {
    const f = framesOf(project);
    if (f.length) {
      return (
        <span className={`${cls} media--still`}>
          <img className="shot" src={stillSrc(f[0])} alt={`${project.title} — screen`} loading="lazy" decoding="async" />
        </span>
      );
    }
  }

  const m = project.media;

  if (m.type === "brand" && brand) {
    return (
      <span className={`${cls} media--brand${brand.dark ? " is-dark" : ""}`}>
        <span className="plate">
          <img className="plate__mark" src={markSrc(brand.mark)} alt={`${project.client} logo`} loading="lazy" decoding="async" />
        </span>
        <span className="plate__swatches">
          {brand.colors.map((c) => (
            <span className="plate__swatch" style={{ background: c }} key={c}>
              <span className="plate__hex">{c}</span>
            </span>
          ))}
        </span>
      </span>
    );
  }

  if (m.type === "still") {
    return (
      <span className={`${cls} media--still`}>
        <img className="shot" src={stillSrc(m.stills[0])} alt={`Frame from ${project.title}`} loading="lazy" decoding="async" />
        {m.video && <span className="media__play" aria-hidden="true" />}
        {m.stills.length > 1 && <span className="media__count">{m.stills.length} frames</span>}
      </span>
    );
  }

  if (m.type === "canvas") {
    return (
      <span className={`${cls} media--canvas`}>
        <img className="shot" src={m.src} alt={`Canvas overview of the ${project.title} design file`} loading="lazy" decoding="async" />
        <span className="media__count">Canvas map</span>
      </span>
    );
  }

  const glyph = m.type === "plate" ? m.glyph : "··";
  return <span className={`${cls} media--plate`}><span className="glyph">{glyph || "··"}</span></span>;
}

/* ============================================================
   The program monitor
   ============================================================ */

function Monitor({
  project, position, accent, frame, setFrame, onClose, onStep, boxRef,
}: {
  project: Project; position: string; accent: string; frame: number;
  setFrame: (n: number) => void; onClose: () => void; onStep: (d: number) => void;
  boxRef: React.RefObject<HTMLDivElement | null>;
}) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const frames = framesOf(project);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    if (boxRef.current) boxRef.current.scrollTop = 0;
  }, [project.id, boxRef]);

  const src = frames.length ? stillSrc(frames[frame] ?? frames[0]) : null;

  return (
    <div className="monitor" style={{ "--mon-accent": accent } as React.CSSProperties}>
      <div className="monitor__scrim" onClick={onClose} />
      <div className="monitor__box" role="dialog" aria-modal="true" aria-labelledby="monTitle" ref={boxRef}>
        <header className="monitor__bar">
          <span className="monitor__tally" aria-hidden="true" />
          <span className="monitor__kind">{project.kind}</span>
          <span className="monitor__pos">{position}</span>
          <button className="monitor__close" type="button" onClick={onClose} ref={closeRef} aria-label="Close the monitor">
            Close <kbd>Esc</kbd>
          </button>
        </header>

        <div className="monitor__screen">
          {src ? (
            <span className="media media--big media--still">
              <img className="shot" src={src} alt={`${project.title} — screen`} />
            </span>
          ) : (
            <Visual project={project} brand={project.brand} big={false} />
          )}
        </div>

        {frames.length > 1 && (
          <div className="monitor__strip">
            {frames.map((f, i) => (
              <button
                type="button"
                className={`monitor__frame${i === frame ? " is-on" : ""}`}
                key={f}
                aria-label={`Frame ${i + 1}`}
                aria-current={i === frame}
                onClick={() => setFrame(i)}
              >
                <img src={stillSrc(f)} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}

        <div className="monitor__info">
          {project.client && <p className="monitor__client">{project.client}</p>}
          <h3 className="monitor__title" id="monTitle">{project.title}</h3>
          <p className="monitor__story">{project.story}</p>

          {project.brand && (
            <div className="brandbar">
              <p className="case__head">Brand</p>
              <div className="brandbar__row">
                <span className={`brandbar__mark${project.brand.dark ? " is-dark" : ""}`}>
                  <img src={markSrc(project.brand.mark)} alt={`${project.client} logo`} loading="lazy" />
                </span>
                <ul className="brandbar__sws">
                  {project.brand.colors.map((c) => (
                    <li className="brandbar__sw" key={c}>
                      <span className="brandbar__chip" style={{ background: c }} />
                      <span className="brandbar__hex">{c.toUpperCase()}</span>
                    </li>
                  ))}
                </ul>
                {project.brand.type && (
                  <p className="brandbar__type"><span>Typeface</span>{project.brand.type}</p>
                )}
              </div>
            </div>
          )}

          {project.case && (
            <div className="case">
              {project.case.problem && (
                <section className="case__block">
                  <p className="case__head">The problem</p>
                  <p className="case__lead">{project.case.problem}</p>
                </section>
              )}
              {project.case.process.length > 0 && (
                <section className="case__block">
                  <p className="case__head">How it was worked out</p>
                  <ol className="case__steps">
                    {project.case.process.map((s, i) => (
                      <li className="case__step" key={s.title}>
                        <span className="case__n">{String(i + 1).padStart(2, "0")}</span>
                        <div>
                          <h5 className="case__sub">{s.title}</h5>
                          <p className="case__text">{s.body}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              )}
              {project.case.decisions.length > 0 && (
                <section className="case__block">
                  <p className="case__head">Design decisions</p>
                  <ul className="case__decisions">
                    {project.case.decisions.map((d) => (
                      <li className="case__decision" key={d.title}>
                        <h5 className="case__sub">{d.title}</h5>
                        <p className="case__text">{d.body}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {project.case.outcome && (
                <section className="case__block case__block--out">
                  <p className="case__head">Outcome</p>
                  <p className="case__lead">{project.case.outcome}</p>
                </section>
              )}
            </div>
          )}

          <dl className="monitor__meta">
            {project.meta.map((m) => (
              <div key={m.label}><dt>{m.label}</dt><dd>{m.value}</dd></div>
            ))}
          </dl>

          {project.note && <p className="monitor__note">{project.note}</p>}
          {project.link && (
            <a className="monitor__link" href={project.link} target="_blank" rel="noopener">
              {project.linkText || "Open"} →
            </a>
          )}
        </div>

        <nav className="monitor__nav" aria-label="Move through the work">
          <button className="monitor__step" type="button" onClick={() => onStep(-1)}>← Previous</button>
          <button className="monitor__step" type="button" onClick={() => onStep(1)}>Next →</button>
        </nav>
      </div>
    </div>
  );
}

/* ============================================================
   The signal meters — each channel draws its own, in its own colour
   ============================================================ */

function Meter({ wave, colour }: { wave: Channel["wave"]; colour: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seed = Math.random() * 100;
    let raf: number | null = null;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w; canvas.height = h;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced) draw(1200);
    };

    const draw = (t: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.width / dpr, h = canvas.height / dpr;
      if (!w) return;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = colour; ctx.fillStyle = colour;
      const mid = h / 2, phase = t * 0.0011 + seed;

      if (wave === "step") {
        ctx.lineWidth = 1.5; ctx.beginPath();
        const steps = 26, sw = w / steps;
        for (let i = 0; i <= steps; i++) {
          const y = mid - (Math.sin(phase * 1.6 + i * 0.72) > 0 ? 1 : -1) * (h * 0.27);
          const x = i * sw;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          ctx.lineTo(x + sw, y);
        }
        ctx.stroke();
      } else if (wave === "grid") {
        const cols = 16, rows = 3, gap = 3;
        const cw = (w - gap * (cols - 1)) / cols, chh = (h - gap * (rows - 1)) / rows;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const lit = (Math.sin(phase * 2.2 + c * 0.55 + r * 1.3) + 1) / 2;
            ctx.globalAlpha = 0.14 + Math.pow(lit, 4) * 0.86;
            ctx.fillRect(c * (cw + gap), r * (chh + gap), cw, chh);
          }
        }
        ctx.globalAlpha = 1;
      } else if (wave === "vu") {
        const bars = 34, gap = 2, bw = (w - gap * (bars - 1)) / bars;
        for (let i = 0; i < bars; i++) {
          const env = Math.sin(phase * 2.4 + i * 0.42) * 0.5
                    + Math.sin(phase * 5.1 + i * 0.17) * 0.32
                    + Math.sin(phase * 0.9 + i * 1.1) * 0.18;
          const level = Math.abs(env), bh = Math.max(2, level * h * 0.92);
          ctx.globalAlpha = 0.35 + level * 0.65;
          ctx.fillRect(i * (bw + gap), mid - bh / 2, bw, bh);
        }
        ctx.globalAlpha = 1;
      } else {
        ctx.lineWidth = 1.5;
        const ramps = 5, rw = w / ramps, top = h * 0.17, bottom = h * 0.83;
        const drift = (phase * 0.2) % 1;
        for (let i = -1; i <= ramps; i++) {
          const x0 = (i + drift) * rw;
          ctx.beginPath(); ctx.moveTo(x0, bottom); ctx.lineTo(x0 + rw * 0.84, top); ctx.stroke();
        }
      }
    };

    const loop = (t: number) => { draw(t); raf = requestAnimationFrame(loop); };

    size();
    if (reduced) draw(1200);
    else raf = requestAnimationFrame(loop);

    /* A strip hidden on a phone has no box until it goes live. */
    const ro = new ResizeObserver(() => size());
    ro.observe(canvas);
    const onResize = () => size();
    window.addEventListener("resize", onResize);

    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [wave, colour]);

  return <canvas className="meter" width={440} height={60} data-wave={wave} aria-hidden="true" ref={ref} />;
}
