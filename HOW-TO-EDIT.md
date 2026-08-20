# The Desk — how it works

There are now two halves. The **site** is what visitors see. The **admin** at
`/admin` is where you change it, with Claude on hand to rewrite copy.

Everything you can see on the page is editable there — you should rarely need
to open a file again.

```
app/                     the site and the admin
  page.tsx               the desk, rendered from the content document
  Desk.tsx               all the interactivity — channels, meters, monitor
  admin/                 the editor
  api/                   session, content, upload, ai
lib/
  types.ts               the shape of the content document
  seed.ts                the content the site ships with
  content.ts             reads and writes the document
public/assets/           fonts, icons, stills, marks — served as-is
```

---

## Using the admin

Go to `/admin`, sign in with your password, and you get seven tabs:

| Tab | What's in it |
|---|---|
| **Site** | Your name, the rail subtitle, location, clock timezone, page title, meta description, standby line, footer |
| **Channels** | Each strip: the big word, its line, tags, the whole brief below it, the channel spec — and the five colours it lights the page with |
| **Work** | Every project card. Add, delete, reorder, hide, and edit down to the last case-study decision |
| **The rack** | The tools, and which channels each one lights up on |
| **Signal path** | The four stages |
| **About** | Your paragraphs and fact rows |
| **Contact** | Headline, body, email, social links |

**Save & publish** writes the document and the live site updates immediately —
no rebuild, no deploy, no wait.

### Show and hide

Every project, channel and tool has a **Hide** button. Hiding takes it off the
site while keeping everything you wrote, which is what you want for work under
NDA, a client who hasn't launched, or a channel you're not selling this quarter.
**Delete** is separate and permanent.

### Claude in the editor

Any long text field has four buttons: **Tighten**, **Rewrite**, **Expand**,
**Fix**. They send that field to Claude with a description of the site's voice
and put the result straight back in the box.

Claude is told never to invent facts, clients, metrics or dates — if your text
has no numbers, the rewrite has none either. It's an editor, not a ghostwriter.
Nothing is saved until you press Save, so you can always type over a rewrite
you don't like.

### Images

Upload from the Work tab and the image is resized, compressed and stored for
you — the same treatment the existing stills got. Upload a **client logo** and
the palette is sampled from it automatically, so a new project card styles
itself.

### Giving Claude the full picture

Every project has a **Context for the AI** panel, and there's one for the whole
site under the Site tab. Two parts:

- **A brief** — free text. "Lead on the compliance angle", "the client hates the
  word platform", "this was a rescue job, say so."
- **Documents and screenshots** — attach the PRD, the spec, your notes, or a
  screenshot of the product. PDF, Word, text, markdown and images, up to 20 MB
  each.

Text is read out of the file the moment you upload it, so a 30-page PDF becomes
context immediately. Screenshots go to Claude as images — it looks at them.

None of it appears on the site. It only shapes what the rewrite buttons produce,
and the project's own context is combined with the site-wide context every time.

Two limits worth knowing: a scanned PDF with no text layer needs OCR before it's
useful, and very long documents are trimmed so they can't crowd out the text
you're actually editing.

---

## Editing the files directly

You can still edit `lib/seed.ts` by hand — it is the content the site falls
back to before anything has been saved from the admin. Once you have saved
once, the stored document wins and the seed is only a fallback.

### The project shape

Each project in the document looks like this: The `media` key decides
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
- **Its name and colour** — the `CHANNELS` map at the top of `lib/seed.ts`,
  **and** the matching `html[data-channel="2"]` block in `console.css`.
  Both, or the meters and the page will disagree.

## Change the tools

The `TOOLS` array in `lib/seed.ts`. Each tool lists the channels it's used on,
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
4. Add `5: { … }` to `CHANNELS` in `lib/seed.ts`.

To remove one, delete its `<article class="channel">` and
`<div class="brief__panel">` from `index.html` and its entry from
`CHANNELS`, then renumber the rest.

The keyboard picks up new channels on its own. Past five strips it gets
cramped on a laptop — stack them two-up at that point.

---

## Put it online

**First deploy**

1. vercel.com → Add New → Project → import `clepbo/clepbo`. Framework preset
   **Next.js** — it detects everything.
2. Project → Storage → Create → **Blob**. That creates `BLOB_READ_WRITE_TOKEN`
   for you and attaches it to the project.
3. Project → Settings → Environment Variables, add three more:
   - `ADMIN_PASSWORD` — what you'll type at `/admin/login`
   - `SESSION_SECRET` — `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - `ANTHROPIC_API_KEY` — from console.anthropic.com, for the rewrite buttons
4. Redeploy so the variables take effect.

Until you save from the admin once, the site serves `lib/seed.ts`. Your first
save creates the stored document and takes over from there.

**Running it locally**

```bash
npm install
cp .env.example .env.local     # fill in ADMIN_PASSWORD and SESSION_SECRET
npm run dev
```

Without a Blob token the editor writes `.data/content.json` on disk instead, so
you can work offline. That file is gitignored; production always uses Blob.

**Custom domain** — add it under the project's Domains tab, then set `SITE_URL`
so the `og:image` resolves to the real address.

## Things worth knowing

- **Keyboard on the site** — `1`–`4` switch channels, `0` or `Esc` returns to
  standby. In the monitor: `←` `→` move through the work, `Esc` closes.
- **The design is untouched by the build.** `console.css` and `fonts.css` are
  linked from `public/`, not imported, so nothing in the pipeline can alter
  them. Channel colours are the one exception — they come from the content
  document and are injected as custom properties.
- **Reduced motion** — meters freeze and transitions drop for anyone who has
  that turned on. Don't remove that block.
- **Storage never takes the site down.** If the document can't be read, the
  page serves the seed and logs the error rather than failing.
- **`/admin` is `noindex`** and excluded in `robots.ts`.
- **The session cookie** is httpOnly, signed, and lasts 12 hours. Changing
  `SESSION_SECRET` signs everyone out immediately.
- **Video files aren't hosted here.** Stills are local; the links point at
  Google Drive.
