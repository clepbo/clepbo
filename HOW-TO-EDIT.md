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
| **Testimonials** | Client quotes. Tag each one to the channels it speaks to, so it dims when another channel is live |
| **The rack** | The tools, and which channels each one lights up on |
| **Signal path** | The four stages |
| **About** | Your paragraphs and fact rows |
| **Contact** | Headline, body, email, social links |
| **History** | The last twenty saves, with one-click restore |

**Save & publish** writes the document and the live site updates immediately —
no rebuild, no deploy, no wait.

### If you regret a save

The **History** tab keeps the last twenty versions. Restoring one publishes it
as a *new* version rather than rewinding the counter, so the restore is itself
undoable and the history stays a straight line.

### Case studies have their own pages

Any project with a case study also lives at `/work/<its-id>` — a real page you
can send a client, and one Google can index on its own. Cards on the desk carry
a "Full case study" link, and the monitor offers it too. They are listed in
`sitemap.xml` and carry `CreativeWork` structured data.

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

## The enquiry form

The patch bay carries a form as well as the email address, so people who don't
want to open a mail client can still reach you. Sending it does two things:

1. The enquiry lands in your inbox, with the sender's address set as reply-to —
   so hitting reply goes straight back to them.
2. They get an automatic confirmation, in your words.

Everything about it is editable under **Contact** in the admin: the heading,
the note, the button, the on-screen success message, where enquiries are
delivered, and the full text of the confirmation email.

### Setting it up

Two ways to send. Set either one — if both are present, Gmail wins.

**Your own Gmail** (simplest, and the right choice until you own a domain)

1. Turn on 2-Step Verification on your Google account.
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   and generate one. You get a 16-character password.
3. In Vercel → Settings → Environment Variables, set `GMAIL_USER` to your
   address and `GMAIL_APP_PASSWORD` to that password. Redeploy.

Mail goes out through `smtp.gmail.com` as genuinely you, so it carries Gmail's
own reputation and lands in inboxes — no domain to verify, nothing to warm up.
Free Gmail allows 500 messages a day, which a contact form will never approach.

Two things to know. An app password gives whatever holds it the ability to send
mail as you, so keep it in Vercel's environment variables and nowhere else — if
it ever leaks, revoke it on that same Google page. And **Send from** in the
admin only controls the display name when using Gmail; the address is always
your Gmail account, because Google rewrites anything else.

App passwords need a personal Google account. They are unavailable on work,
school and other organisation accounts, on accounts using security keys as
their only second factor, and on accounts with Advanced Protection.

**Resend** (better once you have your own domain)

1. Vercel → your project → **Integrations** → add **Resend**. That sets
   `RESEND_API_KEY` for you.
2. In Resend, **verify a domain** you own.
3. Set **Send from** in the admin to an address on that domain, e.g.
   `Israel Oni <hello@yourdomain.com>`.

Until a domain is verified Resend only sends from `onboarding@resend.dev`, and
only to your own address — so confirmations to other people will not arrive.
Either way, if a confirmation fails the enquiry still reaches you and the
sender is told plainly.

### What stops spam

- A hidden field no person can see or tab into. Anything that fills it gets a
  success response and goes nowhere.
- A timing check — a form submitted in under 2.5 seconds is treated the same way.
- Three enquiries per IP per ten minutes.
- Length and format checks on every field.

No captcha. Nobody should have to identify traffic lights to hire you.

## Put it online

**If the site 404s, this is why**

An earlier version of this repo was a static site, and Vercel projects created
for it were set to Framework Preset "Other" with the output directory pointed at
the repo root. That configuration serves files out of `public/` and runs no app —
so `/` and `/admin` both 404 while `/assets/...` still works.

`vercel.json` now pins `"framework": "nextjs"`, which fixes it on the next
deploy. If it persists, clear the dashboard overrides:
Settings → Build & Deployment → Framework Preset **Next.js**, and switch off the
**Build Command** and **Output Directory** overrides so they fall back to the
defaults. Then redeploy.

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
- **Light and dark.** The switch is in the top rail. A first-time visitor gets
  whatever their system is set to; after that their choice is remembered. The
  light palette is **derived** from your channel colours — the panel is that
  accent mixed into paper, and the accent itself is walked toward ink until it
  clears WCAG AA against it. So changing a channel colour in the admin updates
  both themes at once, and there is no second set of colours to maintain.
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
- **Analytics** are on via `@vercel/analytics`. Numbers appear in the Vercel
  dashboard under the project's Analytics tab; nothing to configure.
- **The AI and upload routes are rate limited** to catch a runaway loop. It is
  per-instance and best-effort — the real protection is your password, so also
  set a monthly spend cap in the Anthropic console.
- **A document saved before a section existed still works.** Missing sections
  are filled from the seed on read, so old saves never break the page.
