# The Desk — how to change things

A three-file static site. No build step, no framework, no npm install.
Open the files in any editor, save, refresh the browser.

```
index.html              all the copy
assets/css/console.css  all the design
assets/js/console.js    the channel switch, the work grid, the meters
assets/fonts/           Archivo + IBM Plex Mono, self-hosted
```

---

## Add a project

Everything in **What's come off the desk** is generated from the `WORK`
array at the top of `assets/js/console.js`. Copy a block, fill it in:

```js
{
  ch: 2,                       // 1 = web, 2 = video, 3 = solutions
  kind: "Video · Short-form",  // small label, top-left of the card
  year: "2025",                // top-right, or "" to leave blank
  title: "Campaign film",
  body: "One or two honest sentences about what it does.",
  stack: "Premiere · After Effects",
  link: "https://…",           // "" for no link
  linkText: "Watch the cut"
},
```

Cards marked `slot: true` are the empty placeholders. **Delete the
`slot: true` line** once you've written real content in — that's what
greys them out.

Cards filter and reorder themselves by channel automatically. Nothing else
to wire up.

## Change what a channel says

- **The strip on the front panel** — search `data-ch="2"` in `index.html`.
  The big word, the sub-line, the one-liner, and the tags all live there.
- **The detail below** — search `id="brief-2"`. That's the headline, the
  paragraph, the capability list, and the **Channel spec** sidebar.

## Change the colours

Top of `assets/css/console.css`. Each channel relights the whole page:

```css
html[data-channel="2"] {
  --panel: #1A1210;    /* the graphite, tinted by this channel */
  --panel-2: #241816;  /* raised surfaces */
  --accent: #FF5A36;   /* tally lamp, labels, rules */
}
```

If you change an accent, change it in **two** places — the CSS block above
and the `CHANNELS` map in `console.js`, which the meters draw with.

## Add a fourth channel

1. Copy an `<article class="channel" data-ch="3">` block in `index.html`,
   make it `data-ch="4"`.
2. Copy a `<div class="brief__panel" id="brief-3">` block, make it
   `id="brief-4" data-brief="4"`.
3. Add `html[data-channel="4"] { … }` to the CSS.
4. Add `4: { … }` to `CHANNELS` in the JS, and `"4"` to the keyboard list
   in the `keydown` handler.

The strips are flex children, so four will lay themselves out. Below about
four they get cramped on a laptop — stack them two-up at that point.

---

## Put it online

It's plain files, so anything that serves static hosting works.

**Netlify or Vercel** — drag the folder onto the dashboard, or connect the
repo. Nothing to configure.

**GitHub Pages** — Settings → Pages → deploy from branch, root folder.
Note this repo (`clepbo/clepbo`) is your GitHub *profile* repo, so Pages
serves it at `clepbo.github.io/clepbo/`. For a bare `clepbo.github.io`,
copy these files into a repo named exactly `clepbo.github.io`.

**A custom domain** — point it at whichever host above, then update the
`og:` tags in `index.html` so link previews show the right thing.

## Before you launch

- [ ] Replace the four placeholder cards with real work
- [ ] Add an `og:image` (1200×630) so shared links show a preview
- [ ] Check the email in the contact section is the one you want public
- [ ] Open it on your own phone, not just a desktop browser

## Things worth knowing

- **Keyboard** — `1` `2` `3` switch channels, `0` or `Esc` back to standby.
- **Reduced motion** — the meters freeze and transitions drop for anyone
  who has that turned on. Don't remove that block.
- **The fonts are local.** No Google Fonts request, so the page works
  offline and loads in one round trip. If you swap a font, put the
  `.woff2` in `assets/fonts/` and update `assets/css/fonts.css`.
- **The meters are drawn in code**, not images — a stepped clock line for
  web, metering bars for video, a climbing ramp for solutions. They're in
  `drawMeter()` if you want to change what they do.
