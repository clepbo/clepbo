/* ============================================================
   THE DESK — console.js
   ------------------------------------------------------------
   EDITING YOUR WORK
   Everything on the "What's come off the desk" grid is generated
   from the WORK array below. To add a project, copy one block and
   fill it in. To remove one, delete the block.

     ch     1 = Web & development
            2 = Video & motion
            3 = Solutions & digital product
     kind   the small label at the top-left of the card
     year   shown top-right; use "" to leave it blank
     title  the project name
     body   one or two honest sentences about what it does
     stack  tools used, as one string
     link   a URL, or "" for no link
     slot   true marks the card as an empty placeholder —
            delete the `slot` line once you've filled it in
   ============================================================ */

const WORK = [
  {
    ch: 1,
    kind: "Spring Boot · API",
    year: "",
    title: "Hospital Management System",
    body: "A REST service for patient records, appointments and staff access, with role-based permissions and a MySQL schema built to keep clinical records consistent.",
    stack: "Java · Spring Boot · MySQL",
    link: "https://github.com/clepbo/Hospital_Management_System",
    linkText: "View the code"
  },
  {
    ch: 1,
    kind: "Web application",
    year: "",
    title: "School marketplace",
    body: "An online marketplace scoped to a single school community — listings, sellers and orders, so students buy and sell inside a space they already trust.",
    stack: "Java · Spring Boot · MySQL",
    link: "https://github.com/clepbo",
    linkText: "More on GitHub"
  },
  {
    ch: 2,
    kind: "Video · Short-form",
    year: "",
    title: "Add a video project",
    body: "Drop in one of your edits — what it was for, who it was for, and what it had to achieve. A still frame or a link to the cut works well here.",
    stack: "Editing · Motion graphics",
    link: "",
    linkText: "",
    slot: true
  },
  {
    ch: 2,
    kind: "Video · Motion",
    year: "",
    title: "Add a motion piece",
    body: "Titles, animated graphics, a brand sting — anything that shows movement rather than a static layout.",
    stack: "Motion graphics",
    link: "",
    linkText: "",
    slot: true
  },
  {
    ch: 3,
    kind: "Digital solution",
    year: "",
    title: "Add a solution you shipped",
    body: "The best card on this channel is a before and after: what was broken, and what changed once the thing you built was running.",
    stack: "Tools used",
    link: "",
    linkText: "",
    slot: true
  },
  {
    ch: 1,
    kind: "Website",
    year: "",
    title: "Add a site you designed",
    body: "A client site or a build of your own. Say who it was for and what it needed to do.",
    stack: "Tools used",
    link: "",
    linkText: "",
    slot: true
  }
];

/* ---- channel definitions --------------------------------- */

const CHANNELS = {
  1: { name: "Web & development", colour: "#35D6C4", status: "CH 01 live — web & development", short: "CH 01 live" },
  2: { name: "Video & motion",    colour: "#FF5A36", status: "CH 02 live — video & motion",    short: "CH 02 live" },
  3: { name: "Solutions",         colour: "#F5B93F", status: "CH 03 live — solutions",         short: "CH 03 live" }
};

const STANDBY = "Standby — pick a channel";

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---- 1. work grid ---------------------------------------- */

const grid = document.getElementById("workGrid");
const workNote = document.getElementById("workNote");

function renderWork() {
  const html = WORK.map((item) => {
    const colour = CHANNELS[item.ch].colour;
    const classes = ["card", "card--ch" + item.ch];
    if (item.slot) classes.push("card--slot");

    const link = item.link
      ? `<a class="card__link" href="${item.link}" target="_blank" rel="noopener">${item.linkText || "Open"} →</a>`
      : "";

    return `
      <article class="${classes.join(" ")}" data-ch="${item.ch}" style="--card-accent:${colour}">
        <p class="card__top">
          <span class="card__ch">${item.kind}</span>
          <span>${item.year || ""}</span>
        </p>
        <h3 class="card__title">${item.title}</h3>
        <p class="card__body">${item.body}</p>
        <p class="card__stack">${item.stack}</p>
        ${link}
      </article>`;
  }).join("");

  grid.innerHTML = html;
}

function filterWork(ch) {
  const cards = grid.querySelectorAll(".card");
  cards.forEach((card) => {
    const match = ch === 0 || Number(card.dataset.ch) === ch;
    card.classList.toggle("card--dim", !match);
    card.style.order = match ? "0" : "1";
  });

  const count = ch === 0 ? cards.length : grid.querySelectorAll(`.card[data-ch="${ch}"]`).length;
  workNote.textContent = ch === 0
    ? "Showing everything. Patch into a channel to filter."
    : `${count} ${count === 1 ? "project" : "projects"} on ${CHANNELS[ch].name.toLowerCase()}.`;
}

renderWork();

/* ---- 2. the switch --------------------------------------- */

const root = document.documentElement;
const channelsWrap = document.querySelector(".channels");
const channelEls = Array.from(document.querySelectorAll(".channel"));
const railStatus = document.getElementById("railStatus");
const railStatusShort = document.getElementById("railStatusShort");
const briefs = Array.from(document.querySelectorAll(".brief__panel"));

let live = 0;

function setChannel(ch, { scroll = false } = {}) {
  live = ch;
  root.dataset.channel = String(ch);
  channelsWrap.classList.toggle("channels--patched", ch !== 0);

  channelEls.forEach((el) => {
    const isLive = Number(el.dataset.ch) === ch;
    el.classList.toggle("channel--live", isLive);
    el.querySelector(".channel__btn").setAttribute("aria-pressed", String(isLive));
  });

  briefs.forEach((panel) => {
    panel.hidden = Number(panel.dataset.brief) !== ch;
  });

  railStatus.textContent = ch === 0 ? STANDBY : CHANNELS[ch].status;
  railStatusShort.textContent = ch === 0 ? "Standby" : CHANNELS[ch].short;
  filterWork(ch);

  if (scroll) {
    document.getElementById("brief").scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start"
    });
  }
}

channelEls.forEach((el) => {
  const ch = Number(el.dataset.ch);
  const btn = el.querySelector(".channel__btn");

  btn.addEventListener("click", () => {
    setChannel(live === ch ? 0 : ch, { scroll: live !== ch });
  });
});

document.addEventListener("keydown", (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const tag = document.activeElement && document.activeElement.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return;

  if (["1", "2", "3"].includes(e.key)) {
    setChannel(Number(e.key), { scroll: true });
  } else if (e.key === "0" || e.key === "Escape") {
    setChannel(0);
  }
});

setChannel(0);

/* ---- 3. the meters --------------------------------------- */
/* Each channel draws its own signal in its own colour, so all
   three disciplines are legible on the panel at the same time. */

const meters = Array.from(document.querySelectorAll(".meter")).map((canvas) => {
  const strip = canvas.closest(".channel");
  return {
    canvas,
    ctx: canvas.getContext("2d"),
    wave: canvas.dataset.wave,
    colour: CHANNELS[Number(strip.dataset.ch)].colour,
    seed: Math.random() * 100
  };
});

function sizeMeters() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  meters.forEach((m) => {
    const rect = m.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);
    if (m.canvas.width === w && m.canvas.height === h) return;
    m.canvas.width = w;
    m.canvas.height = h;
    m.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (reduced) drawMeter(m, 1200);
  });
}

function drawMeter(m, t) {
  const { ctx, canvas, wave, colour, seed } = m;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.width / dpr;
  const h = canvas.height / dpr;
  if (!w) return;

  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = colour;
  ctx.fillStyle = colour;

  const mid = h / 2;
  const phase = t * 0.0011 + seed;

  if (wave === "step") {
    /* stepped digital signal — a clock line, for code */
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const steps = 26;
    const sw = w / steps;
    for (let i = 0; i <= steps; i++) {
      const level = Math.sin(phase * 1.6 + i * 0.72) > 0 ? 1 : -1;
      const y = mid - level * (h * 0.27);
      const x = i * sw;
      if (i === 0) ctx.moveTo(x, y);
      else { ctx.lineTo(x, y); }
      ctx.lineTo(x + sw, y);
    }
    ctx.stroke();

  } else if (wave === "vu") {
    /* metering bars — the sound of a cut */
    const bars = 34;
    const gap = 2;
    const bw = (w - gap * (bars - 1)) / bars;
    for (let i = 0; i < bars; i++) {
      const env =
        Math.sin(phase * 2.4 + i * 0.42) * 0.5 +
        Math.sin(phase * 5.1 + i * 0.17) * 0.32 +
        Math.sin(phase * 0.9 + i * 1.1) * 0.18;
      const level = Math.abs(env);
      const bh = Math.max(2, level * h * 0.92);
      ctx.globalAlpha = 0.35 + level * 0.65;
      ctx.fillRect(i * (bw + gap), mid - bh / 2, bw, bh);
    }
    ctx.globalAlpha = 1;

  } else {
    /* a slow ramp, climbing until it runs, then the next one — a process */
    ctx.lineWidth = 1.5;
    const ramps = 5;
    const rw = w / ramps;
    const top = h * 0.17;
    const bottom = h * 0.83;
    const drift = (phase * 0.2) % 1;

    for (let i = -1; i <= ramps; i++) {
      const x0 = (i + drift) * rw;
      ctx.beginPath();
      ctx.moveTo(x0, bottom);
      ctx.lineTo(x0 + rw * 0.84, top);
      ctx.stroke();
    }
  }
}

let rafId = null;

function frame(t) {
  meters.forEach((m) => drawMeter(m, t));
  rafId = requestAnimationFrame(frame);
}

function startMeters() {
  sizeMeters();
  if (reduced) {
    meters.forEach((m) => drawMeter(m, 1200));
    return;
  }
  if (rafId === null) rafId = requestAnimationFrame(frame);
}

function stopMeters() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopMeters();
  else startMeters();
});

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(startMeters, 150);
});

/* A strip hidden on a phone has no box until it goes live, so let each
   canvas tell us when it finally has one. */
if (window.ResizeObserver) {
  const observer = new ResizeObserver(() => sizeMeters());
  meters.forEach((m) => observer.observe(m.canvas));
}

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(startMeters);
} else {
  startMeters();
}
startMeters();

/* ---- 4. desk clock --------------------------------------- */

const clock = document.getElementById("clock");

function tickClock() {
  try {
    clock.textContent = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Lagos",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date()) + " WAT";
  } catch (err) {
    clock.textContent = "";
  }
}

tickClock();
setInterval(tickClock, 30000);
