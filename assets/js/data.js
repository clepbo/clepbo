/* ============================================================
   THE DESK — content
   ------------------------------------------------------------
   All copy and project data lives here. Edit this file to change
   what the site says; console.js only renders it.
   See HOW-TO-EDIT.md for the full guide.
   ============================================================ */

const CHANNELS = {
  1: { name: "Web & build",     colour: "#35D6C4", status: "CH 01 live — web & build",     short: "CH 01 live" },
  2: { name: "Product & UI/UX", colour: "#A98BFF", status: "CH 02 live — product & UI/UX", short: "CH 02 live" },
  3: { name: "Video & motion",  colour: "#FF5A36", status: "CH 03 live — video & motion",  short: "CH 03 live" },
  4: { name: "Solutions",       colour: "#F5B93F", status: "CH 04 live — solutions",       short: "CH 04 live" }
};

/* Tools light up on the channels they're actually used on. */
const TOOLS = [
  { icon: "figma",          name: "Figma",     ch: [2, 1] },
  { icon: "canva",          name: "Canva",     ch: [2, 3] },
  { icon: "davinciresolve", name: "DaVinci Resolve", ch: [3] },
  { icon: "cut",            name: "CapCut",    ch: [3] },
  { icon: "wordpress",      name: "WordPress", ch: [1] },
  { icon: "openai",         name: "ChatGPT",   ch: [1, 2, 3, 4] },
  { icon: "claude",         name: "Claude",    ch: [1, 2, 3, 4] },
  { icon: "git",            name: "Git",       ch: [1, 4] },
  { icon: "github",         name: "GitHub",    ch: [1, 4] },
  { icon: "miro",           name: "Miro",      ch: [2, 4] },
  { icon: "jira",           name: "Jira",      ch: [4] },
  { icon: "clickup",        name: "ClickUp",   ch: [4] }
];

/* ------------------------------------------------------------
   WORK
   ch      channels this belongs to (an array — work can sit on
           more than one, which is the point of the whole site)
   media   { type: "brand" }  client mark + palette sampled from it
           { type: "still" }  one or more real frames, stills: []
           { type: "canvas" } a design-file canvas map
           { type: "plate" }  no image — a typographic plate
   ------------------------------------------------------------ */

const WORK = [

  /* ---------- CH 01 · WEB & BUILD ---------- */
  {
    id: "teasoo", ch: [1], kind: "Website · WordPress", client: "Teasoo Consulting",
    title: "Teasoo Consulting",
    line: "A risk and complexity advisory, made concrete.",
    story: "Teasoo helps people and organisations navigate complexity and mitigate risk — which is a hard thing to put on a page, because there is no product to photograph. The site had to make an abstract advisory service feel solid: what they actually do, which sectors they work across, and a short route to a conversation. Built on WordPress so their team can keep it moving without me.",
    media: { type: "brand", mark: "teasoo", colors: ["#e11b3f", "#41454f", "#eff1f6"] },
    meta: [["Platform", "WordPress"], ["Type", "Montserrat"], ["Role", "Design + build"]],
    link: "https://teasooconsulting.com/", linkText: "Visit the site",
    note: "Also on CH 03 — I cut their brand video series."
  },
  {
    id: "ehf", ch: [1], kind: "Website · WordPress", client: "Esangbedo Humanitarian Foundation",
    title: "EHF Africa",
    line: "A foundation's programmes, partners and case for support.",
    story: "EHF works with vulnerable groups across Nigeria, alongside partners including NAPTIP. A foundation site carries a heavier job than a business one: it has to explain the work clearly enough that a donor, a partner and a beneficiary all find what they came for. Programmes, partners and routes to give, structured so the team can publish new work themselves.",
    media: { type: "brand", mark: "ehf", colors: ["#093f87", "#63e1e1", "#2d3f63"] },
    meta: [["Platform", "WordPress"], ["Type", "Roboto"], ["Role", "Design + build"]],
    link: "https://ehfoundation.africa/", linkText: "Visit the site",
    note: "Also on CH 03 — I shot and cut their school outreach films."
  },
  {
    id: "moatview", ch: [1], kind: "Website · WordPress", client: "Moatview Apartments",
    title: "Moatview Apartments",
    line: "Serviced apartments in GRA, Benin City.",
    story: "Somewhere to stay sells on atmosphere and on detail — the rooms, the amenities, how to book, where it is. The site leads with the space and keeps the booking route short, because a visitor deciding where to sleep tonight will not dig for a phone number.",
    media: { type: "brand", mark: "moatview", colors: ["#e18709", "#cf993f", "#1b1b1b"] },
    meta: [["Platform", "WordPress"], ["Type", "Poppins"], ["Role", "Design + build"]],
    link: "https://moatviewapartments.com/", linkText: "Visit the site",
    note: "Also on CH 03 — the walkthrough film is mine too."
  },
  {
    id: "shinaluwoye", ch: [1], kind: "Website · WordPress", client: "Shina Luwoye Foundation",
    title: "Shina Luwoye Foundation",
    line: "Breaking financial barriers to education.",
    story: "A foundation working on access to education, running since 2024. The build puts the programmes and the people they reach in front, and keeps the application and donation paths obvious rather than buried in a menu.",
    media: { type: "brand", mark: "shinaluwoye", colors: ["#ff3f3f", "#0987bd", "#51bdbd"] },
    meta: [["Platform", "WordPress"], ["Type", "Poppins / Open Sans"], ["Role", "Design + build"]],
    link: "https://shinaluwoyefoundation.com/", linkText: "Visit the site"
  },
  {
    id: "thinkingroom", ch: [1, 2], kind: "Website · Next.js", client: "The Thinking Room",
    title: "The Thinking Room",
    line: "Conversations that create clarity.",
    story: "Not everything belongs on WordPress. This one is a Next.js build on Vercel — near-black, acid lime, Anton set enormous — for a show about why unlimited access to information has left people less certain, not more. The design is loud on purpose: the brand is the argument.",
    media: { type: "brand", mark: "thinkingroom", dark: true, colors: ["#d1ff00", "#0a0a0a", "#e3ff66"] },
    meta: [["Platform", "Next.js on Vercel"], ["Type", "Anton / Inter"], ["Role", "Design + build"]],
    link: "https://the-thinking-room-pi.vercel.app/", linkText: "Visit the site"
  },
  {
    id: "mediagiants", ch: [1], kind: "Website · WordPress", client: "MediaGiants Enterprise",
    title: "MediaGiants",
    line: "Social media management and photography, with a storefront.",
    story: "An agency selling both services and packages, so the site had to do two jobs at once: explain the work, and take an order. WooCommerce underneath means their team changes prices and packages without waiting on a developer.",
    media: { type: "brand", mark: "mediagiants", colors: ["#f3872d", "#991b09", "#cf8709"] },
    meta: [["Platform", "WordPress + WooCommerce"], ["Type", "Roboto"], ["Role", "Design + build"]],
    link: "https://mediagiantsenterprise.com/", linkText: "Visit the site"
  },
  {
    id: "thomas", ch: [1, 2], kind: "Website · Static", client: "Thomas Emmanuel Ayodele",
    title: "Thomas Emmanuel Ayodele",
    line: "A portfolio for a brand designer and illustrator.",
    story: "Designing for a designer is its own test — the site has to have a point of view and still get out of the way of the work. Playfair Display against Syne, cream on near-black, no framework and no CMS: a static build that loads instantly and costs nothing to host.",
    media: { type: "brand", mark: "thomas", dark: true, colors: ["#f4f1ea", "#d8d3c8", "#0f0f0f"] },
    meta: [["Platform", "Static · GitHub Pages"], ["Type", "Playfair Display / Syne"], ["Role", "Design + build"]],
    link: "https://clepbo.github.io/Thomas-Emmanuel-Ayodele-/index.html", linkText: "Visit the site"
  },

  /* ---------- CH 02 · PRODUCT & UI/UX ---------- */
  {
    id: "esg-horizon", ch: [2], kind: "Product design · Figma", client: "ESG Horizon",
    title: "ESG Horizon",
    line: "A sustainability reporting product, designed end to end.",
    story: "The file runs to hundreds of frames across a canvas about sixty thousand pixels wide — flows, states, components and the dead ends you only find by drawing them. This is the canvas map rather than a hero shot, because that map is the honest picture of what product design actually looks like before anything gets built.",
    media: { type: "canvas", src: "assets/media/stills/esg-horizon-canvas.jpg" },
    meta: [["Tool", "Figma"], ["Canvas", "62,181 × 70,853 px"], ["File", "ESG Horizon.fig · 15 MB"]],
    link: "https://github.com/clepbo/clepbo/blob/main/Projects/ESG%20Horizon.fig", linkText: "Download the .fig"
  },
  {
    id: "eventplanna", ch: [2], kind: "Product design · Figma", client: "EventPlanna",
    title: "EventPlanna",
    line: "Event planning, from booking to run sheet.",
    story: "A 38 MB design file covering the planning side of events — the part organisers actually live in once the excitement wears off. Add your own account of the problem it solves here; the file is in the repo.",
    media: { type: "plate", glyph: "EP" },
    meta: [["Tool", "Figma"], ["File", "EventPlanna.fig · 38 MB"], ["Stored", "Git LFS"]],
    link: "https://github.com/clepbo/clepbo/blob/main/Projects/EventPlanna.fig", linkText: "Open the file",
    slot: true
  },
  {
    id: "shedulr", ch: [2], kind: "Product design · Figma", client: "Shedulr",
    title: "Shedulr",
    line: "Scheduling, designed properly.",
    story: "The largest of the three files at 156 MB. Add the story here — what it schedules, who for, and the decision the design had to make easy.",
    media: { type: "plate", glyph: "SH" },
    meta: [["Tool", "Figma"], ["File", "Shedulr.fig · 156 MB"], ["Stored", "Git LFS"]],
    link: "https://github.com/clepbo/clepbo/blob/main/Projects/Shedulr.fig", linkText: "Open the file",
    slot: true
  },

  /* ---------- CH 03 · VIDEO & MOTION ---------- */
  {
    id: "moatview-film", ch: [3, 1], kind: "Video · Property film", client: "Moatview Apartments",
    title: "Moatview walkthrough",
    line: "The property film for a site I also built.",
    story: "A walkthrough that has to sell a room to somebody who cannot stand in it. Shot in the apartments, cut around a spoken guide, with a lower third carrying the address and booking details so a viewer who arrives mid-scroll still knows where this is and how to book.",
    media: { type: "still", stills: ["moatview-tour"] },
    meta: [["Work", "Edit · motion graphics"], ["Client", "Moatview Apartments"], ["Pair", "Site on CH 01"]],
    link: "https://drive.google.com/file/d/1ZFh3R-CE6Bm0_Y3eK94KffU4hNxsRATo/view", linkText: "Watch the film"
  },
  {
    id: "teaching-series", ch: [3], kind: "Video · Long-form series", client: "Pastor Austin Adetunji",
    title: "Teaching series",
    line: "An ongoing series, episode after episode.",
    story: "The unglamorous discipline of series work: same look, same pacing, same treatment, week after week, so an audience recognises it before the title card lands. Stage recordings and studio pieces cut down to something that holds attention past the first minute.",
    media: { type: "still", stills: ["crisis-of-faith", "person-of-value", "welfare-package", "mentorship-class"] },
    meta: [["Work", "Edit · colour · sound"], ["Format", "Long-form"], ["Cadence", "Ongoing series"]],
    link: "https://drive.google.com/file/d/1IAqlAvQ9gi1avgfKmwww5wmFFWmAQ3iX/view", linkText: "Watch an episode"
  },
  {
    id: "short-form", ch: [3], kind: "Video · Short-form", client: "Various",
    title: "Short-form and kinetic titles",
    line: "Cut for the scroll, with type that moves.",
    story: "Long recordings mined for the ninety seconds actually worth posting, then rebuilt for a feed: tighter pacing, captions, and animated titles that land the point before a thumb moves. The titles are set, animated and timed to the edit rather than dropped on top of it.",
    media: { type: "still", stills: ["validation", "difficult-situation", "perception"] },
    meta: [["Work", "Edit · motion graphics"], ["Format", "Vertical + 16:9"], ["Use", "Social"]],
    link: "https://drive.google.com/file/d/18lJ05HmQfQp1RYCHNm6uvFS4cN0ksa17/view", linkText: "Watch a cut"
  },
  {
    id: "ehf-films", ch: [3, 1], kind: "Video · Documentary", client: "Esangbedo Humanitarian Foundation",
    title: "School outreach films",
    line: "Field work, in the schools themselves.",
    story: "Outreach across schools including Our Lady of Lourdes Girls Grammar School, Uromi, and Niger College. Documentary footage cut into pieces a foundation can actually use — proof for partners, and something a school community recognises itself in.",
    media: { type: "still", stills: ["ehf-lourdes", "ehf-niger-college"] },
    meta: [["Work", "Edit · motion graphics"], ["Client", "EHF Africa"], ["Pair", "Site on CH 01"]],
    link: "https://ehfoundation.africa/", linkText: "See the foundation"
  },
  {
    id: "teelens", ch: [3, 4], kind: "Video · AI in the edit", client: "TeeLens Visuals",
    title: "Nine editing tasks AI can do for you",
    line: "A piece about AI, made with the workflow it argues for.",
    story: "The boring parts of an edit — transcription, rough selects, captions, cleanup — are the parts a machine is now genuinely good at. This is a piece about that, cut using exactly that workflow, which is the same reason my web work leans on AI: it removes the hours that were never the craft.",
    media: { type: "still", stills: ["teelens-ai-editing"] },
    meta: [["Work", "Edit · motion graphics"], ["Subject", "AI-assisted editing"], ["Format", "Long-form"]],
    link: "https://drive.google.com/file/d/1cb8jHbKKrRV_N_obnsdEHvTuSOQ65xBO/view", linkText: "Watch it"
  },
  {
    id: "podcast", ch: [3], kind: "Video · Podcast", client: "Falmaran",
    title: "Falmaran Hoodies podcast",
    line: "Multi-camera conversation, cut for clips.",
    story: "A podcast cut twice: once as the full conversation, once as vertical clips built to travel on their own. The second cut is where most of the audience actually meets the show.",
    media: { type: "still", stills: ["falmaran-podcast"] },
    meta: [["Work", "Edit · clips"], ["Format", "Long-form + vertical"], ["Use", "Podcast + social"]],
    link: "https://drive.google.com/file/d/1yD3SaeZSZVOcnl8bTGqAcHI53v0PAR9B/view", linkText: "Watch it"
  },

  /* ---------- CH 04 · SOLUTIONS ---------- */
  {
    id: "hms", ch: [4], kind: "System · Spring Boot", client: "Engineering",
    title: "Hospital Management System",
    line: "Patient records, appointments and staff access.",
    story: "A REST service with role-based permissions over a MySQL schema built to keep clinical records consistent. The engineering half of what I do — the part that decides whether a system still behaves once real people and real edge cases arrive.",
    media: { type: "plate", glyph: "01" },
    meta: [["Stack", "Java · Spring Boot · MySQL"], ["Shape", "REST API"], ["Code", "Public on GitHub"]],
    link: "https://github.com/clepbo/Hospital_Management_System", linkText: "Read the code"
  },
  {
    id: "marketplace", ch: [4], kind: "System · Spring Boot", client: "Engineering",
    title: "School marketplace",
    line: "Buying and selling inside one campus.",
    story: "A marketplace scoped to a single school community — listings, sellers, orders — so trade happens inside a group that already trusts each other rather than out in the open internet.",
    media: { type: "plate", glyph: "02" },
    meta: [["Stack", "Java · Spring Boot · MySQL"], ["Shape", "Web application"], ["Code", "Public on GitHub"]],
    link: "https://github.com/clepbo", linkText: "More on GitHub"
  },
  {
    id: "solutions-slot", ch: [4], kind: "Digital solution", client: "",
    title: "Add an automation you shipped",
    line: "The strongest card here is a before and after.",
    story: "What was broken, what you built, and what changed once it was running. Replace this entry in assets/js/data.js.",
    media: { type: "plate", glyph: "03" },
    meta: [["Stack", "Tools used"], ["Shape", "Internal tool"], ["Status", "Placeholder"]],
    link: "", linkText: "",
    slot: true
  }
];
