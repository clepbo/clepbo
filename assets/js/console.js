/* ============================================================
   THE DESK — console.js
   Renders the desk from the data in data.js. To change what the
   site says, edit data.js, not this file.
   ============================================================ */

const STANDBY = "Standby — pick a channel";
const CH_KEYS = Object.keys(CHANNELS);
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const root = document.documentElement;
const grid = document.getElementById("workGrid");
const workNote = document.getElementById("workNote");
const rackList = document.getElementById("rackList");
const rackNote = document.getElementById("rackNote");
const railStatus = document.getElementById("railStatus");
const railStatusShort = document.getElementById("railStatusShort");
const channelsWrap = document.querySelector(".channels");
const channelEls = Array.from(document.querySelectorAll(".channel"));
const briefs = Array.from(document.querySelectorAll(".brief__panel"));

let live = 0;

/* ---- helpers --------------------------------------------- */

const esc = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const onChannel = (item, ch) => ch === 0 || item.ch.indexOf(ch) !== -1;
const accentOf = (item) => CHANNELS[item.ch[0]].colour;
const stillSrc = (name) => `assets/media/stills/${name}.jpg`;

/* ---- 1. media ---------------------------------------------
   Four kinds of visual, one shape. A brand plate is deliberately
   a light card: it reads like a printed spec sheet lying on the
   desk, and every client mark stays legible on it.            */

function mediaHTML(item, big) {
  const m = item.media;
  const cls = big ? "media media--big" : "media";

  if (m.type === "brand") {
    const sw = (m.colors || []).map((c) =>
      `<span class="plate__swatch" style="background:${esc(c)}"><span class="plate__hex">${esc(c)}</span></span>`).join("");
    return `<span class="${cls} media--brand${m.dark ? " is-dark" : ""}">
        <span class="plate">
          <img class="plate__mark" src="assets/media/marks/${esc(m.mark)}.png"
               alt="${esc(item.client)} logo" loading="lazy" decoding="async">
        </span>
        <span class="plate__swatches">${sw}</span>
      </span>`;
  }

  if (m.type === "still") {
    const first = m.stills[0];
    const n = m.stills.length;
    const badge = n > 1 ? `<span class="media__count">${n} frames</span>` : "";
    const play = m.video ? `<span class="media__play" aria-hidden="true"></span>` : "";
    const alt = m.video ? `Frame from ${esc(item.title)}` : `${esc(item.title)} — screen`;
    return `<span class="${cls} media--still">
        <img class="shot" src="${stillSrc(first)}" alt="${alt}"
             loading="lazy" decoding="async">
        ${play}${badge}
      </span>`;
  }

  if (m.type === "canvas") {
    return `<span class="${cls} media--canvas">
        <img class="shot" src="${esc(m.src)}" alt="Canvas overview of the ${esc(item.title)} design file"
             loading="lazy" decoding="async">
        <span class="media__count">Canvas map</span>
      </span>`;
  }

  return `<span class="${cls} media--plate"><span class="glyph">${esc(m.glyph || "··")}</span></span>`;
}

/* ---- 2. work grid ---------------------------------------- */

function renderWork() {
  grid.innerHTML = WORK.map((item) => {
    const cls = ["card"];
    if (item.slot) cls.push("card--slot");
    return `
      <article class="${cls.join(" ")}" data-id="${esc(item.id)}"
               data-ch="${item.ch.join(" ")}" style="--card-accent:${accentOf(item)}">
        <button class="card__btn" type="button" aria-label="Open ${esc(item.title)}">
          ${mediaHTML(item, false)}
          <span class="card__body">
            <span class="card__top">
              <span class="card__kind">${esc(item.kind)}</span>
              ${item.ch.length > 1 ? `<span class="card__multi">${item.ch.map((c) => "CH 0" + c).join(" + ")}</span>` : ""}
            </span>
            <span class="card__title">${esc(item.title)}</span>
            <span class="card__line">${esc(item.line)}</span>
            <span class="card__open">Open<span aria-hidden="true"> →</span></span>
          </span>
        </button>
      </article>`;
  }).join("");

  grid.querySelectorAll(".card__btn").forEach((btn) => {
    btn.addEventListener("click", () => openMonitor(btn.closest(".card").dataset.id));
  });
}

function filterWork(ch) {
  let n = 0;
  grid.querySelectorAll(".card").forEach((card) => {
    const item = WORK.find((w) => w.id === card.dataset.id);
    const match = onChannel(item, ch);
    if (match) n++;
    card.classList.toggle("card--dim", !match);
    card.style.order = match ? "0" : "1";
  });
  workNote.textContent = ch === 0
    ? "Showing everything. Patch into a channel to filter."
    : `${n} ${n === 1 ? "project" : "projects"} on ${CHANNELS[ch].name.toLowerCase()}.`;
}

/* ---- 3. the rack ----------------------------------------- */

function renderRack() {
  rackList.innerHTML = TOOLS.map((t) => `
    <li class="rack__item" data-ch="${t.ch.join(" ")}">
      ${t.icon === "cut"
        ? `<span class="rack__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="6" cy="18" r="2.6"/><circle cx="18" cy="18" r="2.6"/><path d="M7.6 16.1 18.5 4.5M16.4 16.1 5.5 4.5"/></svg></span>`
        : `<img class="rack__icon" src="assets/icons/${t.icon}.svg" alt="" aria-hidden="true" loading="lazy">`}
      <span class="rack__name">${esc(t.name)}</span>
    </li>`).join("");
}

function filterRack(ch) {
  let n = 0;
  rackList.querySelectorAll(".rack__item").forEach((el) => {
    const match = ch === 0 || el.dataset.ch.split(" ").indexOf(String(ch)) !== -1;
    if (match) n++;
    el.classList.toggle("rack__item--dim", !match);
  });
  rackNote.textContent = ch === 0
    ? "Everything on the desk. Patch a channel to see what it runs on."
    : `${n} of ${TOOLS.length} in use on ${CHANNELS[ch].name.toLowerCase()}.`;
}

/* ---- 4. the switch --------------------------------------- */

function setChannel(ch, { scroll = false } = {}) {
  live = ch;
  root.dataset.channel = String(ch);
  channelsWrap.classList.toggle("channels--patched", ch !== 0);

  channelEls.forEach((el) => {
    const isLive = Number(el.dataset.ch) === ch;
    el.classList.toggle("channel--live", isLive);
    el.querySelector(".channel__btn").setAttribute("aria-pressed", String(isLive));
  });

  briefs.forEach((panel) => { panel.hidden = Number(panel.dataset.brief) !== ch; });

  railStatus.textContent = ch === 0 ? STANDBY : CHANNELS[ch].status;
  railStatusShort.textContent = ch === 0 ? "Standby" : CHANNELS[ch].short;

  filterWork(ch);
  filterRack(ch);

  if (scroll) {
    document.getElementById("brief").scrollIntoView({
      behavior: reduced ? "auto" : "smooth", block: "start"
    });
  }
}

channelEls.forEach((el) => {
  const ch = Number(el.dataset.ch);
  el.querySelector(".channel__btn").addEventListener("click", () => {
    setChannel(live === ch ? 0 : ch, { scroll: live !== ch });
  });
});

/* ---- 5. the program monitor ------------------------------ */

const monitor = document.getElementById("monitor");
const monScreen = document.getElementById("monScreen");
const monStrip = document.getElementById("monStrip");
const els = {
  kind: document.getElementById("monKind"), pos: document.getElementById("monPos"),
  client: document.getElementById("monClient"), title: document.getElementById("monTitle"),
  story: document.getElementById("monStory"), meta: document.getElementById("monMeta"),
  note: document.getElementById("monNote"), link: document.getElementById("monLink"),
  brand: document.getElementById("monBrand"), casebox: document.getElementById("monCase")
};
let reel = [], reelAt = 0, frameAt = 0, lastFocus = null;

function visibleWork() {
  return WORK.filter((w) => onChannel(w, live));
}

function paintFrame() {
  const item = reel[reelAt];
  if (item.media.type !== "still") return;
  const name = item.media.stills[frameAt];
  const img = monScreen.querySelector(".shot");
  if (img) img.src = stillSrc(name);
  monStrip.querySelectorAll("button").forEach((b, i) => {
    b.classList.toggle("is-on", i === frameAt);
    b.setAttribute("aria-current", i === frameAt ? "true" : "false");
  });
}

function paintMonitor() {
  const item = reel[reelAt];
  frameAt = 0;
  monitor.style.setProperty("--mon-accent", accentOf(item));

  els.kind.textContent = item.kind;
  els.pos.textContent = `${reelAt + 1} / ${reel.length}`;
  els.client.textContent = item.client || "";
  els.client.hidden = !item.client;
  els.title.textContent = item.title;
  els.story.textContent = item.story;
  els.note.textContent = item.note || "";
  els.note.hidden = !item.note;

  els.meta.innerHTML = (item.meta || []).map(([k, v]) =>
    `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");

  paintBrand(item);
  paintCase(item);

  if (item.link) {
    els.link.href = item.link;
    els.link.textContent = (item.linkText || "Open") + " →";
    els.link.hidden = false;
  } else {
    els.link.hidden = true;
  }

  monScreen.innerHTML = mediaHTML(item, true);

  const many = item.media.type === "still" && item.media.stills.length > 1;
  monStrip.hidden = !many;
  monStrip.innerHTML = many ? item.media.stills.map((s, i) =>
    `<button type="button" class="monitor__frame${i === 0 ? " is-on" : ""}" data-i="${i}"
       aria-label="Frame ${i + 1}"><img src="${stillSrc(s)}" alt="" loading="lazy"></button>`).join("") : "";
  if (many) {
    monStrip.querySelectorAll("button").forEach((b) => {
      b.addEventListener("click", () => { frameAt = Number(b.dataset.i); paintFrame(); });
    });
  }
}

/* The brand strip: the client's own mark, the palette sampled from it,
   and the typeface the live site actually runs. */
function paintBrand(item) {
  const bd = item.brand;
  els.brand.hidden = !bd;
  if (!bd) return;
  const sw = (bd.colors || []).map((c) =>
    `<li class="brandbar__sw"><span class="brandbar__chip" style="background:${esc(c)}"></span>
       <span class="brandbar__hex">${esc(c).toUpperCase()}</span></li>`).join("");
  els.brand.innerHTML = `
    <p class="case__head">Brand</p>
    <div class="brandbar__row">
      <span class="brandbar__mark${bd.dark ? " is-dark" : ""}">
        <img src="assets/media/marks/${esc(bd.mark)}.png" alt="${esc(item.client)} logo" loading="lazy">
      </span>
      <ul class="brandbar__sws">${sw}</ul>
      ${bd.type ? `<p class="brandbar__type"><span>Typeface</span>${esc(bd.type)}</p>` : ""}
    </div>`;
}

/* The case study: what was wrong, how it was worked out, what was
   decided and why, what shipped. */
function paintCase(item) {
  const c = item.case;
  els.casebox.hidden = !c;
  if (!c) return;
  const steps = (c.process || []).map(([t, b], i) => `
    <li class="case__step">
      <span class="case__n">${String(i + 1).padStart(2, "0")}</span>
      <div><h5 class="case__sub">${esc(t)}</h5><p class="case__text">${esc(b)}</p></div>
    </li>`).join("");
  const decisions = (c.decisions || []).map(([t, b]) => `
    <li class="case__decision">
      <h5 class="case__sub">${esc(t)}</h5><p class="case__text">${esc(b)}</p>
    </li>`).join("");

  els.casebox.innerHTML = `
    ${c.problem ? `<section class="case__block">
      <p class="case__head">The problem</p>
      <p class="case__lead">${esc(c.problem)}</p></section>` : ""}
    ${steps ? `<section class="case__block">
      <p class="case__head">How it was worked out</p>
      <ol class="case__steps">${steps}</ol></section>` : ""}
    ${decisions ? `<section class="case__block">
      <p class="case__head">Design decisions</p>
      <ul class="case__decisions">${decisions}</ul></section>` : ""}
    ${c.outcome ? `<section class="case__block case__block--out">
      <p class="case__head">Outcome</p>
      <p class="case__lead">${esc(c.outcome)}</p></section>` : ""}`;
}

function openMonitor(id) {
  reel = visibleWork();
  reelAt = reel.findIndex((w) => w.id === id);
  if (reelAt === -1) { reel = WORK.slice(); reelAt = reel.findIndex((w) => w.id === id); }
  lastFocus = document.activeElement;
  paintMonitor();
  monitor.hidden = false;
  document.body.classList.add("is-locked");
  /* focus without letting the browser scroll the dialog to the button */
  monitor.querySelector(".monitor__close").focus({ preventScroll: true });
  monitor.querySelector(".monitor__box").scrollTop = 0;
}

function closeMonitor() {
  monitor.hidden = true;
  document.body.classList.remove("is-locked");
  if (lastFocus) lastFocus.focus();
}

function step(d) {
  reelAt = (reelAt + d + reel.length) % reel.length;
  paintMonitor();
  monitor.querySelector(".monitor__box").scrollTop = 0;
}

monitor.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", closeMonitor));
document.getElementById("monPrev").addEventListener("click", () => step(-1));
document.getElementById("monNext").addEventListener("click", () => step(1));

/* ---- 6. keyboard ----------------------------------------- */

document.addEventListener("keydown", (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const tag = document.activeElement && document.activeElement.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return;

  if (!monitor.hidden) {
    if (e.key === "Escape") { closeMonitor(); return; }
    if (e.key === "ArrowRight") { step(1); return; }
    if (e.key === "ArrowLeft") { step(-1); return; }
    if (e.key === "Tab") {
      const f = monitor.querySelectorAll("button, a[href]:not([hidden])");
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    return;
  }

  if (CH_KEYS.indexOf(e.key) !== -1) setChannel(Number(e.key), { scroll: true });
  else if (e.key === "0" || e.key === "Escape") setChannel(0);
});

/* ---- 7. the meters ---------------------------------------
   Each channel draws its own signal in its own colour, so all
   four disciplines stay legible on the panel at the same time. */

const meters = Array.from(document.querySelectorAll(".meter")).map((canvas) => ({
  canvas, ctx: canvas.getContext("2d"), wave: canvas.dataset.wave,
  colour: CHANNELS[Number(canvas.closest(".channel").dataset.ch)].colour,
  seed: Math.random() * 100
}));

function sizeMeters() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  meters.forEach((m) => {
    const r = m.canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
    if (m.canvas.width === w && m.canvas.height === h) return;
    m.canvas.width = w; m.canvas.height = h;
    m.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (reduced) drawMeter(m, 1200);
  });
}

function drawMeter(m, t) {
  const { ctx, canvas, wave, colour, seed } = m;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.width / dpr, h = canvas.height / dpr;
  if (!w) return;

  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = colour; ctx.fillStyle = colour;
  const mid = h / 2, phase = t * 0.0011 + seed;

  if (wave === "step") {
    /* a stepped clock line — code */
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
    /* a lattice of artboards, lighting up one at a time — design */
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
    /* metering bars — the sound of a cut */
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
    /* a slow ramp, climbing until it runs — a process */
    ctx.lineWidth = 1.5;
    const ramps = 5, rw = w / ramps, top = h * 0.17, bottom = h * 0.83;
    const drift = (phase * 0.2) % 1;
    for (let i = -1; i <= ramps; i++) {
      const x0 = (i + drift) * rw;
      ctx.beginPath(); ctx.moveTo(x0, bottom); ctx.lineTo(x0 + rw * 0.84, top); ctx.stroke();
    }
  }
}

let rafId = null;
const frame = (t) => { meters.forEach((m) => drawMeter(m, t)); rafId = requestAnimationFrame(frame); };

function startMeters() {
  sizeMeters();
  if (reduced) { meters.forEach((m) => drawMeter(m, 1200)); return; }
  if (rafId === null) rafId = requestAnimationFrame(frame);
}
function stopMeters() { if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; } }

document.addEventListener("visibilitychange", () => document.hidden ? stopMeters() : startMeters());

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(startMeters, 150);
});

/* A strip hidden on a phone has no box until it goes live. */
if (window.ResizeObserver) {
  const observer = new ResizeObserver(() => sizeMeters());
  meters.forEach((m) => observer.observe(m.canvas));
}

/* ---- 8. desk clock --------------------------------------- */

const clock = document.getElementById("clock");
function tickClock() {
  try {
    clock.textContent = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Lagos", hour: "2-digit", minute: "2-digit"
    }).format(new Date()) + " WAT";
  } catch (err) { clock.textContent = ""; }
}

/* ---- boot ------------------------------------------------ */

renderWork();
renderRack();
setChannel(0);
tickClock();
setInterval(tickClock, 30000);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(startMeters);
startMeters();
