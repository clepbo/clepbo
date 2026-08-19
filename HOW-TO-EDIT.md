# The Desk — how to change things

A static site. No build step, no framework, no `npm install`. Edit, save, refresh.

```
index.html               structure and the fixed copy
assets/js/data.js        ← all project content lives here
assets/js/console.js     rendering, the channel switch, the monitor, the meters
assets/css/console.css   the whole design system
assets/css/fonts.css     self-hosted Archivo + IBM Plex Mono
assets/media/stills/     video frames
assets/media/marks/      client logos
assets/icons/            tool marks
```

**Almost everything you'll want to change is in `assets/js/data.js`.**

---

## Add a project

Copy a block in the `WORK` array and fill it in. The `media` key decides
which of the four visual treatments it gets.

```js
{
  id: "unique-slug",              // must be unique
  ch: [3],                        // 1 web · 2 product · 3 video · 4 solutions
                                  // put it on two channels: ch: [3, 1]
  kind: "Video · Short-form",     // small label on the card
  client: "Client name",
  title: "What it's called",
  line: "One line for the card.",
  story: "Two or three sentences, top of the monitor.",
  media: { type: "still", stills: ["file-name"], video: true },
  meta: [["Work", "Edit"], ["Format", "Vertical"]],
  link: "https://…", linkText: "Watch it",
  note: "Optional line, shown with an accent rule."
}
```

`video: true` puts the play badge on the card. Leave it off for
screenshots, or a website will look like a video.

### Card and monitor show different things

This is the important bit. **`media` is what the card shows. `shots` is what
the monitor shows.**

```js
media: { type: "brand" },              // card: the client's logo on a plate
shots: ["teasoo-site-1", "teasoo-site-2"],  // monitor: the real screenshots
brand: { mark: "teasoo", colors: ["#e11b3f", "#41454f"], type: "Montserrat" }
```

The homepage stays a clean wall of client marks; the real screens are the
payoff when someone opens a project. A card with more than one `shot` gets
a "2 screens" badge so people know there's something behind it.

Leave `shots` off and the monitor just shows the card's visual bigger.

| `media` | Looks like | Use it for |
|---|---|---|
| `{ type: "brand" }` | The logo on a plate, over a palette bar. Reads `mark`, `colors` and `dark` from the `brand` block | Websites and product work |
| `{ type: "still", stills: ["a", "b"], video: true }` | The frame itself, with a play badge | Video work |
| `{ type: "canvas", src: "…" }` | Contained on a dark ground | Design-file canvas maps |
| `{ type: "plate", glyph: "01" }` | A typographic plate, no image | Anything with no visual yet |

Add `dark: true` to `brand` when the logo is drawn for a dark background,
or it'll disappear on the light plate.

`mark` is a filename in `assets/media/marks/`. A bare name means `.png`;
include the extension for anything else (`"shedulr.svg"`). SVG is better
where you have it — it stays sharp at any size.

### Adding a still

Drop a JPEG in `assets/media/stills/` and reference it **without the
extension**: a file called `launch-film.jpg` is `stills: ["launch-film"]`.
Around 1100px on the long edge is plenty.

### Adding a client logo

Drop a transparent PNG in `assets/media/marks/` and use its filename as
`mark`. Sample three colours from the logo for `colors` — they become the
palette bar.

---

## Write a case study

Add a `case` block to any project and the monitor turns into a case study —
the problem, the process as numbered steps, the design decisions, and the
outcome. This is what the website and UI/UX entries use.

```js
case: {
  problem: "What was actually wrong before this existed.",
  process: [
    ["Step name", "What you did and why it came first."],
    ["Next step", "…"]
  ],
  decisions: [
    ["The decision", "Why it beat the obvious alternative."],
    ["Another one", "…"]
  ],
  outcome: "What shipped, stated plainly."
}
```

Decisions read best as **a choice plus the option you rejected** — that's
what separates a case study from a description. Don't invent numbers you
can't stand behind; a specific design reason is more convincing than an
unverifiable metric.

## Add a brand strip

Add a `brand` block and the monitor shows the client's mark, their palette
and their typeface under the story:

```js
brand: { mark: "teasoo", colors: ["#e11b3f", "#41454f"], type: "Montserrat" }
```

`mark` is a filename in `assets/media/marks/`. Add `dark: true` when the
logo is drawn for a dark background.

## Swap in a better screenshot

Save the image (1400px wide is right) into `assets/media/stills/` and add
its filename — without the extension — to that project's `shots` array.
List two or more and the monitor gives you a filmstrip.

## Change what a channel says

- **The strip on the front panel** — search `data-ch="2"` in `index.html`.
- **The detail below** — search `id="brief-2"`: headline, paragraph,
  capability list and the **Channel spec** sidebar.
- **Its name and colour** — the `CHANNELS` map at the top of `data.js`,
  **and** the matching `html[data-channel="2"]` block in `console.css`.
  Both, or the meters and the page will disagree.

## Change the tools

The `TOOLS` array in `data.js`. Each tool lists the channels it's used on,
and lights up when one of them is live:

```js
{ icon: "figma", name: "Figma", ch: [2, 1] },
```

`icon` is a filename in `assets/icons/`. Add a new one by dropping in a
single-colour SVG. `icon: "cut"` is the one hand-drawn mark (CapCut isn't in
the icon set).

## Add or remove a channel

1. Copy an `<article class="channel" data-ch="4">` block in `index.html`.
2. Copy a `<div class="brief__panel" id="brief-4">` block.
3. Add `html[data-channel="5"] { … }` to the CSS.
4. Add `5: { … }` to `CHANNELS` in `data.js`.

To remove one, delete its `<article class="channel">` and
`<div class="brief__panel">` from `index.html` and its entry from
`CHANNELS`, then renumber the rest.

The keyboard picks up new channels on its own. Past five strips it gets
cramped on a laptop — stack them two-up at that point.

---

## Put it online

**Vercel** (what this is set up for)

1. vercel.com → Add New → Project → import `clepbo/clepbo`.
2. Framework preset: **Other**. Leave the build command empty and set the
   output directory to the repo root — it's plain static files, there is
   nothing to build.
3. Deploy.

`vercel.json` is already in the repo: it sets clean URLs and caches
`assets/` for a year, so fonts and images load instantly on repeat visits.
`.vercelignore` keeps the Figma files out of the deploy — they're linked
from GitHub, so there's no reason to ship 15 MB to the edge.

Every push to `main` redeploys. Pull requests get their own preview URL.

**Custom domain** — add it under the project's Domains tab, point your DNS
at Vercel, then update the `og:` tags in `index.html` to the real address.
The `og:image` at `assets/media/og.png` is the desk itself, so shared links
preview with all four channels visible.

**Anywhere else** — it's plain static files. Netlify takes the folder as-is;
GitHub Pages works from Settings → Pages → deploy from branch, root folder
(this is your *profile* repo, so Pages would serve it at
`clepbo.github.io/clepbo/`).

## Before you launch

- [ ] Write the EventPlanna and Shedulr case studies (`slot: true` in
      `data.js` — the scaffold is there, the words aren't)
- [ ] CH 04 Solutions has only one project on it. Either add work, or
      remove the channel (recipe below)
- [ ] Add an `og:image` (1200×630) so shared links preview properly
- [ ] Open it on your own phone, not just a desktop browser

## Things worth knowing

- **Keyboard** — `1`–`4` switch channels, `0` or `Esc` returns to standby.
  In the monitor: `←` `→` move through the work, `Esc` closes.
- **Reduced motion** — meters freeze and transitions drop for anyone who has
  that turned on. Don't remove that block.
- **Fonts are local.** No Google Fonts request, so the page works offline and
  loads in one round trip.
- **The meters are drawn in code** — a stepped clock line for web, a lattice
  of artboards for product, metering bars for video, a climbing ramp for
  solutions. They're in `drawMeter()`.
- **Video files aren't hosted here.** The stills are local; the links point
  at Google Drive. If you move a video, update its `link` in `data.js`.
