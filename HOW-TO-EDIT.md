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
  story: "Two or three sentences for the monitor.",
  media: { type: "still", stills: ["file-name"] },
  meta: [["Work", "Edit"], ["Format", "Vertical"]],
  link: "https://…", linkText: "Watch it",
  note: "Optional line, shown with an accent rule."
}
```

### The four visuals

| `media` | Looks like | Use it for |
|---|---|---|
| `{ type: "still", stills: ["a", "b"] }` | The frame, plus a filmstrip in the monitor when there's more than one | Video work |
| `{ type: "brand", mark: "teasoo", colors: ["#e11b3f", …] }` | A brand plate — logo on a light card with a palette bar | Websites |
| `{ type: "canvas", src: "assets/media/stills/x.jpg" }` | Contained on a dark ground | Design-file canvas maps |
| `{ type: "plate", glyph: "01" }` | A typographic plate, no image | Anything with no visual yet |

Add `dark: true` to a `brand` block when the logo is drawn for a dark
background, or it'll disappear on the light plate.

### Adding a still

Drop a JPEG in `assets/media/stills/` and reference it **without the
extension**: a file called `launch-film.jpg` is `stills: ["launch-film"]`.
Around 1100px on the long edge is plenty.

### Adding a client logo

Drop a transparent PNG in `assets/media/marks/` and use its filename as
`mark`. Sample three colours from the logo for `colors` — they become the
palette bar.

---

## Add real site screenshots

The web cards currently show brand plates — logo, real palette, typeface —
rather than screenshots, because I couldn't reach the live sites from the
machine this was built on. Screenshots would be stronger. To swap one in:

1. Screenshot the site (1440px wide is a good size), save it to
   `assets/media/stills/` as e.g. `teasoo-site.jpg`.
2. In `data.js`, change that project's media to:
   `media: { type: "still", stills: ["teasoo-site"] }`

Or keep the brand plate and add the screenshot as a second entry — the
monitor will show both as a filmstrip.

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

## Add a fifth channel

1. Copy an `<article class="channel" data-ch="4">` block in `index.html`.
2. Copy a `<div class="brief__panel" id="brief-4">` block.
3. Add `html[data-channel="5"] { … }` to the CSS.
4. Add `5: { … }` to `CHANNELS` in `data.js`.

The keyboard picks up new channels on its own. Past five strips it gets
cramped on a laptop — stack them two-up at that point.

---

## Put it online

**Netlify or Vercel** — drag the folder in, or connect the repo. Nothing to configure.

**GitHub Pages** — Settings → Pages → deploy from branch, root folder. This
repo (`clepbo/clepbo`) is your *profile* repo, so Pages serves it at
`clepbo.github.io/clepbo/`. For a bare `clepbo.github.io`, copy these files
into a repo named exactly that.

**Custom domain** — point it at whichever host, then update the `og:` tags in
`index.html`.

## Before you launch

- [ ] Replace the three placeholder entries (`slot: true` in `data.js`) —
      EventPlanna, Shedulr and the solutions card need real stories
- [ ] Consider swapping brand plates for real screenshots (above)
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
