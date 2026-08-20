"use client";

import { useCallback, useRef, useState } from "react";
import type { Content, Project, ProjectContext } from "@/lib/types";
import "./admin.css";

type Tab = "site" | "channels" | "rack" | "work" | "path" | "about" | "contact";
const TABS: [Tab, string][] = [
  ["site", "Site"], ["channels", "Channels"], ["work", "Work"],
  ["rack", "The rack"], ["path", "Signal path"], ["about", "About"], ["contact", "Contact"],
];

const AI_MODES = [
  ["tighten", "Tighten"], ["rewrite", "Rewrite"], ["expand", "Expand"], ["proofread", "Fix"],
] as const;

export default function Editor({ initial }: { initial: Content }) {
  const [doc, setDoc] = useState<Content>(initial);
  const [tab, setTab] = useState<Tab>("site");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; bad?: boolean } | null>(null);

  const say = useCallback((msg: string, bad = false) => {
    setToast({ msg, bad });
    setTimeout(() => setToast(null), bad ? 6000 : 2600);
  }, []);

  const edit = useCallback((fn: (d: Content) => void) => {
    setDoc((prev) => {
      const next = structuredClone(prev);
      fn(next);
      return next;
    });
    setDirty(true);
  }, []);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(doc),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Save failed.");
      setDoc(body);
      setDirty(false);
      say("Saved — the site is live");
    } catch (err) {
      say(err instanceof Error ? err.message : "Save failed.", true);
    } finally {
      setSaving(false);
    }
  }

  async function signOut() {
    await fetch("/api/session", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  const shared = { edit, say };

  return (
    <div className="adm">
      <header className="adm__bar">
        <span className="adm__name">The desk · admin</span>
        <span className="adm__mono" style={{ color: dirty ? "var(--warn)" : "var(--mute)" }}>
          {dirty ? "Unsaved changes" : `v${doc.version} saved`}
        </span>
        <span className="adm__spacer" />
        <a className="adm__btn" href="/" target="_blank" rel="noopener">View site</a>
        <button className="adm__btn" onClick={signOut}>Sign out</button>
        <button className="adm__btn adm__btn--go" onClick={save} disabled={saving || !dirty}>
          {saving ? "Saving…" : "Save & publish"}
        </button>
      </header>

      <div className="adm__body">
        <nav className="adm__nav">
          {TABS.map(([id, label]) => (
            <button key={id} className="adm__tab" aria-current={tab === id} onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </nav>

        <main className="adm__main">
          {tab === "site" && <SiteTab doc={doc} {...shared} />}
          {tab === "channels" && <ChannelsTab doc={doc} {...shared} />}
          {tab === "work" && <WorkTab doc={doc} {...shared} />}
          {tab === "rack" && <RackTab doc={doc} {...shared} />}
          {tab === "path" && <PathTab doc={doc} {...shared} />}
          {tab === "about" && <AboutTab doc={doc} {...shared} />}
          {tab === "contact" && <ContactTab doc={doc} {...shared} />}
        </main>
      </div>

      {toast && <p className={`adm__toast${toast.bad ? " adm__toast--bad" : ""}`}>{toast.msg}</p>}
    </div>
  );
}

/* ---------- shared bits ---------- */

type Shared = { edit: (fn: (d: Content) => void) => void; say: (m: string, bad?: boolean) => void };

function Head({ title, note }: { title: string; note: string }) {
  return (
    <div className="adm__head">
      <h2>{title}</h2>
      <p>{note}</p>
    </div>
  );
}

function Field({
  label, value, onChange, area, ai, context, say, rows, projectId,
}: {
  label: string; value: string; onChange: (v: string) => void;
  area?: boolean; ai?: boolean; context?: string; say?: Shared["say"];
  rows?: number; projectId?: string;
}) {
  const [busy, setBusy] = useState<string | null>(null);

  async function run(mode: string) {
    if (!value.trim()) return;
    setBusy(mode);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode, text: value, context: context ?? label, projectId }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Claude failed.");
      onChange(body.text);
      say?.("Claude rewrote it — undo by editing back");
    } catch (err) {
      say?.(err instanceof Error ? err.message : "Claude failed.", true);
    } finally {
      setBusy(null);
    }
  }

  return (
    <label className="fld">
      <span className="fld__top">
        <span className="fld__label">{label}</span>
        {ai && (
          <span className="fld__ai">
            {AI_MODES.map(([mode, name]) => (
              <button key={mode} type="button" disabled={Boolean(busy)} onClick={() => run(mode)}>
                {busy === mode ? "…" : name}
              </button>
            ))}
          </span>
        )}
      </span>
      {area ? (
        <textarea value={value} rows={rows ?? 4} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function StringList({
  label, items, onChange,
}: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState("");
  return (
    <div className="fld">
      <span className="fld__top"><span className="fld__label">{label}</span></span>
      <div className="chips">
        {items.map((it, i) => (
          <span className="chip" key={`${it}-${i}`}>
            {it}
            <button type="button" aria-label={`Remove ${it}`} onClick={() => onChange(items.filter((_, j) => j !== i))}>×</button>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: ".4rem" }}>
        <input
          type="text" value={draft} placeholder="Add one and press enter"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && draft.trim()) {
              e.preventDefault();
              onChange([...items, draft.trim()]);
              setDraft("");
            }
          }}
        />
      </div>
    </div>
  );
}

function PairList({
  label, items, onChange, keyName = "label", valName = "value",
}: {
  label: string;
  items: { label: string; value: string }[];
  onChange: (v: { label: string; value: string }[]) => void;
  keyName?: string; valName?: string;
}) {
  return (
    <div className="fld">
      <span className="fld__top"><span className="fld__label">{label}</span></span>
      {items.map((row, i) => (
        <div className="row" key={i} style={{ gridTemplateColumns: "1fr 2fr auto", alignItems: "start", gap: ".4rem", marginBottom: ".4rem" }}>
          <input type="text" aria-label={keyName} value={row.label}
            onChange={(e) => onChange(items.map((r, j) => (j === i ? { ...r, label: e.target.value } : r)))} />
          <input type="text" aria-label={valName} value={row.value}
            onChange={(e) => onChange(items.map((r, j) => (j === i ? { ...r, value: e.target.value } : r)))} />
          <button className="adm__btn" type="button" onClick={() => onChange(items.filter((_, j) => j !== i))}>Del</button>
        </div>
      ))}
      <button className="adm__btn" type="button" onClick={() => onChange([...items, { label: "", value: "" }])}>Add row</button>
    </div>
  );
}

function Upload({
  kind, label, onDone, say,
}: { kind: "still" | "mark"; label: string; onDone: (url: string, palette: string[]) => void; say: Shared["say"] }) {
  const ref = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);

  async function send(file: File) {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("kind", kind);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Upload failed.");
      onDone(body.url, body.palette ?? []);
      say(body.palette?.length ? "Uploaded — palette sampled from the logo" : "Uploaded and optimised");
    } catch (err) {
      say(err instanceof Error ? err.message : "Upload failed.", true);
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  }

  return (
    <>
      <button className="adm__btn" type="button" disabled={busy} onClick={() => ref.current?.click()}>
        {busy ? "Working…" : label}
      </button>
      <input
        ref={ref} type="file" accept="image/*" hidden
        onChange={(e) => { const f = e.target.files?.[0]; if (f) void send(f); }}
      />
    </>
  );
}

function move<T>(arr: T[], i: number, d: number): T[] {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const out = arr.slice();
  [out[i], out[j]] = [out[j], out[i]];
  return out;
}

/* ---------- tabs ---------- */

function SiteTab({ doc, edit, say }: { doc: Content } & Shared) {
  const s = doc.site;
  return (
    <>
      <Head title="Site" note="The rail, the page title, and the standby line." />
      <div className="row">
        <Field label="Name" value={s.name} onChange={(v) => edit((d) => { d.site.name = v; })} />
        <Field label="Rail subtitle" value={s.role} onChange={(v) => edit((d) => { d.site.role = v; })} />
        <Field label="Location" value={s.location} onChange={(v) => edit((d) => { d.site.location = v; })} />
        <Field label="Clock timezone" value={s.timezone} onChange={(v) => edit((d) => { d.site.timezone = v; })} />
      </div>
      <Field label="Browser title" value={s.title} onChange={(v) => edit((d) => { d.site.title = v; })} />
      <Field label="Meta description" value={s.description} area ai say={say}
        context="the search-engine description of a portfolio site"
        onChange={(v) => edit((d) => { d.site.description = v; })} />
      <Field label="Standby line" value={s.standby} area ai say={say}
        context="the line shown before a visitor picks a channel"
        onChange={(v) => edit((d) => { d.site.standby = v; })} />
      <div className="sub"><h3>Footer</h3></div>
      <div className="row">
        <Field label="Footer left" value={doc.footer.left} onChange={(v) => edit((d) => { d.footer.left = v; })} />
        <Field label="Footer right" value={doc.footer.right} onChange={(v) => edit((d) => { d.footer.right = v; })} />
      </div>

      <ContextPanel
        ctx={doc.site.context}
        say={say}
        title="Background for the whole site — how you work, who you serve, anything Claude should always know."
        onChange={(v) => edit((d) => { d.site.context = v; })}
      />
    </>
  );
}

function ChannelsTab({ doc, edit, say }: { doc: Content } & Shared) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <Head title="Channels" note="The strips on the front panel, their copy, and the colour each one lights the page with." />
      {doc.channels.map((c, i) => (
        <div className={`card2${c.hidden ? " card2--off" : ""}`} key={c.id}>
          <div className="card2__top">
            <span className="card2__grip">CH {String(c.id).padStart(2, "0")}</span>
            <span className="sw" style={{ background: c.colour }} />
            <span className="card2__name">{c.word} {c.sub}</span>
            <span className="card2__acts">
              <button onClick={() => edit((d) => { d.channels = move(d.channels, i, -1); })}>↑</button>
              <button onClick={() => edit((d) => { d.channels = move(d.channels, i, 1); })}>↓</button>
              <button onClick={() => edit((d) => { d.channels[i].hidden = !d.channels[i].hidden; })}>
                {c.hidden ? "Show" : "Hide"}
              </button>
              <button onClick={() => setOpen(open === c.id ? null : c.id)}>{open === c.id ? "Close" : "Edit"}</button>
            </span>
          </div>
          {open === c.id && (
            <div className="card2__open">
              <div className="row">
                <Field label="Name" value={c.name} onChange={(v) => edit((d) => { d.channels[i].name = v; })} />
                <Field label="Big word" value={c.word} onChange={(v) => edit((d) => { d.channels[i].word = v; })} />
                <Field label="Sub" value={c.sub} onChange={(v) => edit((d) => { d.channels[i].sub = v; })} />
              </div>
              <Field label="One line" value={c.line} ai say={say} context="the one-line summary on a service channel strip"
                onChange={(v) => edit((d) => { d.channels[i].line = v; })} />
              <StringList label="Tags" items={c.tags} onChange={(v) => edit((d) => { d.channels[i].tags = v; })} />

              <div className="sub"><h3>Colours &amp; meter</h3></div>
              <div className="row">
                {(["colour", "panel", "panel2", "panel3", "ink"] as const).map((k) => (
                  <label className="fld" key={k}>
                    <span className="fld__top"><span className="fld__label">{k}</span></span>
                    <div style={{ display: "flex", gap: ".4rem" }}>
                      <input type="color" value={c[k]} aria-label={`${k} colour`} style={{ width: "2.6rem", padding: 0, background: "none", border: "1px solid var(--rule)" }}
                        onChange={(e) => edit((d) => { d.channels[i][k] = e.target.value; })} />
                      <input type="text" value={c[k]} onChange={(e) => edit((d) => { d.channels[i][k] = e.target.value; })} />
                    </div>
                  </label>
                ))}
                <label className="fld">
                  <span className="fld__top"><span className="fld__label">Meter</span></span>
                  <select value={c.wave} onChange={(e) => edit((d) => { d.channels[i].wave = e.target.value as typeof c.wave; })}>
                    <option value="step">Stepped clock line</option>
                    <option value="grid">Artboard lattice</option>
                    <option value="vu">Metering bars</option>
                    <option value="ramp">Climbing ramp</option>
                  </select>
                </label>
              </div>

              <div className="sub"><h3>The brief below</h3></div>
              <Field label="Headline" value={c.brief.head} ai say={say} context="the headline of a service channel's detail section"
                onChange={(v) => edit((d) => { d.channels[i].brief.head = v; })} />
              <Field label="Body" value={c.brief.body} area rows={5} ai say={say} context="the body paragraph of a service channel"
                onChange={(v) => edit((d) => { d.channels[i].brief.body = v; })} />
              <StringList label="Capability list" items={c.brief.list} onChange={(v) => edit((d) => { d.channels[i].brief.list = v; })} />
              <PairList label="Channel spec" items={c.brief.spec} onChange={(v) => edit((d) => { d.channels[i].brief.spec = v; })} />
            </div>
          )}
        </div>
      ))}
    </>
  );
}

function WorkTab({ doc, edit, say }: { doc: Content } & Shared) {
  const [open, setOpen] = useState<string | null>(null);
  const projects = doc.work.projects;

  function add() {
    const id = `project-${Date.now()}`;
    edit((d) => {
      d.work.projects.unshift({
        id, ch: [d.channels[0]?.id ?? 1], kind: "Website · WordPress", client: "",
        title: "New project", line: "", story: "",
        media: { type: "plate", glyph: "01" }, meta: [], link: "", linkText: "Visit the site",
      });
    });
    setOpen(id);
  }

  return (
    <>
      <Head title="Work" note="Every card on the site. Hide one to take it off the page without deleting it." />
      <div className="row" style={{ gridTemplateColumns: "1fr", marginBottom: "1rem" }}>
        <Field label="Section note" value={doc.work.note} onChange={(v) => edit((d) => { d.work.note = v; })} />
      </div>
      <button className="adm__btn adm__btn--go" onClick={add} style={{ marginBottom: "1rem" }}>Add a project</button>

      {projects.map((p, i) => (
        <div className={`card2${p.hidden ? " card2--off" : ""}`} key={p.id}>
          <div className="card2__top">
            <span className="card2__grip">{String(i + 1).padStart(2, "0")}</span>
            <span className="card2__name">{p.title}</span>
            <span className="card2__kind">{p.ch.map((c) => `CH 0${c}`).join(" + ")}</span>
            <span className="card2__acts">
              <button onClick={() => edit((d) => { d.work.projects = move(d.work.projects, i, -1); })}>↑</button>
              <button onClick={() => edit((d) => { d.work.projects = move(d.work.projects, i, 1); })}>↓</button>
              <button onClick={() => edit((d) => { d.work.projects[i].hidden = !d.work.projects[i].hidden; })}>
                {p.hidden ? "Show" : "Hide"}
              </button>
              <button onClick={() => setOpen(open === p.id ? null : p.id)}>{open === p.id ? "Close" : "Edit"}</button>
            </span>
          </div>
          {open === p.id && <ProjectForm doc={doc} index={i} edit={edit} say={say} />}
        </div>
      ))}
    </>
  );
}

function ProjectForm({ doc, index, edit, say }: { doc: Content; index: number } & Shared) {
  const p = doc.work.projects[index];
  const set = (fn: (x: Project) => void) => edit((d) => fn(d.work.projects[index]));
  const shots = p.shots ?? [];

  return (
    <div className="card2__open">
      <div className="row">
        <Field label="Title" value={p.title} onChange={(v) => set((x) => { x.title = v; })} />
        <Field label="Client" value={p.client} onChange={(v) => set((x) => { x.client = v; })} />
        <Field label="Kind label" value={p.kind} onChange={(v) => set((x) => { x.kind = v; })} />
      </div>

      <div className="fld">
        <span className="fld__top"><span className="fld__label">Channels</span></span>
        <div className="chips">
          {doc.channels.map((c) => (
            <label className="chip" key={c.id}>
              <input type="checkbox" checked={p.ch.includes(c.id)}
                onChange={(e) => set((x) => {
                  x.ch = e.target.checked ? [...x.ch, c.id].sort() : x.ch.filter((n) => n !== c.id);
                })} />
              CH 0{c.id} {c.word}
            </label>
          ))}
        </div>
      </div>

      <Field label="Card line" value={p.line} ai say={say} projectId={p.id} context="the one-line summary on a portfolio project card"
        onChange={(v) => set((x) => { x.line = v; })} />
      <Field label="Story" value={p.story} area rows={5} ai say={say} projectId={p.id} context="the opening paragraph of a portfolio case study"
        onChange={(v) => set((x) => { x.story = v; })} />

      <div className="sub"><h3>Visual</h3></div>
      <div className="row">
        <label className="fld">
          <span className="fld__top"><span className="fld__label">Card shows</span></span>
          <select value={p.media.type} onChange={(e) => set((x) => {
            const t = e.target.value;
            x.media = t === "brand" ? { type: "brand" }
              : t === "still" ? { type: "still", stills: [] }
              : t === "canvas" ? { type: "canvas", src: "" }
              : { type: "plate", glyph: "01" };
          })}>
            <option value="brand">Brand plate (the client&apos;s logo)</option>
            <option value="still">A frame or screenshot</option>
            <option value="canvas">Design-file canvas map</option>
            <option value="plate">Typographic plate</option>
          </select>
        </label>
        {p.media.type === "plate" && (
          <Field label="Glyph" value={p.media.glyph}
            onChange={(v) => set((x) => { if (x.media.type === "plate") x.media.glyph = v; })} />
        )}
      </div>

      {p.media.type === "still" && (
        <ImageList label="Card frames" items={p.media.stills} say={say}
          onChange={(v) => set((x) => { if (x.media.type === "still") x.media.stills = v; })}
          extra={
            <label className="chip">
              <input type="checkbox" checked={Boolean(p.media.type === "still" && p.media.video)}
                onChange={(e) => set((x) => { if (x.media.type === "still") x.media.video = e.target.checked; })} />
              Play badge (video)
            </label>
          } />
      )}

      <ImageList label="Screens shown in the monitor" items={shots} say={say}
        onChange={(v) => set((x) => { x.shots = v; })} />

      <div className="sub"><h3>Brand strip</h3></div>
      {p.brand ? (
        <>
          <div className="row" style={{ alignItems: "end" }}>
            <Field label="Mark file or URL" value={p.brand.mark} onChange={(v) => set((x) => { if (x.brand) x.brand.mark = v; })} />
            <Field label="Typeface" value={p.brand.type ?? ""} onChange={(v) => set((x) => { if (x.brand) x.brand.type = v; })} />
            <div className="fld">
              <span className="fld__top"><span className="fld__label">Logo</span></span>
              <div style={{ display: "flex", gap: ".4rem", alignItems: "center" }}>
                <Upload kind="mark" label="Upload logo" say={say}
                  onDone={(url, palette) => set((x) => {
                    if (!x.brand) return;
                    x.brand.mark = url;
                    if (palette.length) x.brand.colors = palette;
                  })} />
                <label className="chip">
                  <input type="checkbox" checked={Boolean(p.brand.dark)}
                    onChange={(e) => set((x) => { if (x.brand) x.brand.dark = e.target.checked; })} />
                  Dark plate
                </label>
              </div>
            </div>
          </div>
          <StringList label="Palette (sampled on upload)" items={p.brand.colors}
            onChange={(v) => set((x) => { if (x.brand) x.brand.colors = v; })} />
          <button className="adm__btn adm__btn--warn" onClick={() => set((x) => { delete x.brand; })}>Remove brand strip</button>
        </>
      ) : (
        <button className="adm__btn" onClick={() => set((x) => { x.brand = { mark: "", colors: [] }; })}>Add a brand strip</button>
      )}

      <div className="sub"><h3>Case study</h3></div>
      {p.case ? <CaseForm doc={doc} index={index} edit={edit} say={say} /> : (
        <button className="adm__btn" onClick={() => set((x) => {
          x.case = { problem: "", process: [], decisions: [], outcome: "" };
        })}>Add a case study</button>
      )}

      <div className="sub"><h3>Details</h3></div>
      <PairList label="Spec rows" items={p.meta} onChange={(v) => set((x) => { x.meta = v; })} />
      <div className="row">
        <Field label="Link" value={p.link} onChange={(v) => set((x) => { x.link = v; })} />
        <Field label="Link text" value={p.linkText} onChange={(v) => set((x) => { x.linkText = v; })} />
      </div>
      <Field label="Note (optional)" value={p.note ?? ""} onChange={(v) => set((x) => { x.note = v; })} />

      <ContextPanel
        ctx={p.context}
        say={say}
        title="Background for this project only — the PRD, the spec, the notes, a screenshot of the thing."
        onChange={(v) => set((x) => { x.context = v; })}
      />

      <div style={{ display: "flex", gap: ".5rem", marginTop: "1.25rem" }}>
        <label className="chip">
          <input type="checkbox" checked={Boolean(p.slot)} onChange={(e) => set((x) => { x.slot = e.target.checked; })} />
          Mark as a placeholder
        </label>
        <button className="adm__btn adm__btn--warn"
          onClick={() => { if (confirm(`Delete "${p.title}" for good?`)) edit((d) => { d.work.projects.splice(index, 1); }); }}>
          Delete project
        </button>
      </div>
    </div>
  );
}

function CaseForm({ doc, index, edit, say }: { doc: Content; index: number } & Shared) {
  const p = doc.work.projects[index];
  const c = p.case!;
  const set = (fn: (x: NonNullable<Project["case"]>) => void) =>
    edit((d) => { const t = d.work.projects[index].case; if (t) fn(t); });

  return (
    <>
      <Field label="The problem" value={c.problem} area rows={5} ai say={say} projectId={p.id}
        context="the problem section of a design case study"
        onChange={(v) => set((x) => { x.problem = v; })} />

      <div className="fld">
        <span className="fld__top"><span className="fld__label">How it was worked out</span></span>
        {c.process.map((s, i) => (
          <div className="card2" key={i} style={{ background: "var(--sur2)" }}>
            <div className="card2__top">
              <span className="card2__grip">{String(i + 1).padStart(2, "0")}</span>
              <input type="text" value={s.title} aria-label="Step title"
                onChange={(e) => set((x) => { x.process[i].title = e.target.value; })} />
              <span className="card2__acts">
                <button onClick={() => set((x) => { x.process = move(x.process, i, -1); })}>↑</button>
                <button onClick={() => set((x) => { x.process = move(x.process, i, 1); })}>↓</button>
                <button onClick={() => set((x) => { x.process.splice(i, 1); })}>Del</button>
              </span>
            </div>
            <div style={{ padding: "0 .9rem .9rem" }}>
              <Field label="What you did" value={s.body} area ai say={say} projectId={p.id}
                context="a process step in a design case study"
                onChange={(v) => set((x) => { x.process[i].body = v; })} />
            </div>
          </div>
        ))}
        <button className="adm__btn" onClick={() => set((x) => { x.process.push({ title: "", body: "" }); })}>Add a step</button>
      </div>

      <div className="fld">
        <span className="fld__top"><span className="fld__label">Design decisions</span></span>
        {c.decisions.map((s, i) => (
          <div className="card2" key={i} style={{ background: "var(--sur2)" }}>
            <div className="card2__top">
              <input type="text" value={s.title} aria-label="Decision"
                onChange={(e) => set((x) => { x.decisions[i].title = e.target.value; })} />
              <span className="card2__acts">
                <button onClick={() => set((x) => { x.decisions = move(x.decisions, i, -1); })}>↑</button>
                <button onClick={() => set((x) => { x.decisions = move(x.decisions, i, 1); })}>↓</button>
                <button onClick={() => set((x) => { x.decisions.splice(i, 1); })}>Del</button>
              </span>
            </div>
            <div style={{ padding: "0 .9rem .9rem" }}>
              <Field label="Why it beat the alternative" value={s.body} area ai say={say} projectId={p.id}
                context="a design decision and its rationale in a case study"
                onChange={(v) => set((x) => { x.decisions[i].body = v; })} />
            </div>
          </div>
        ))}
        <button className="adm__btn" onClick={() => set((x) => { x.decisions.push({ title: "", body: "" }); })}>Add a decision</button>
      </div>

      <Field label="Outcome" value={c.outcome} area ai say={say} projectId={p.id}
        context="the outcome line of a design case study"
        onChange={(v) => set((x) => { x.outcome = v; })} />

      <button className="adm__btn adm__btn--warn"
        onClick={() => edit((d) => { delete d.work.projects[index].case; })}>Remove case study</button>
    </>
  );
}

function ImageList({
  label, items, onChange, say, extra,
}: {
  label: string; items: string[]; onChange: (v: string[]) => void;
  say: Shared["say"]; extra?: React.ReactNode;
}) {
  return (
    <div className="fld">
      <span className="fld__top"><span className="fld__label">{label}</span></span>
      <div className="chips">
        {items.map((it, i) => (
          <span className="chip" key={`${it}-${i}`} title={it}>
            <img src={/^https?:\/\//.test(it) ? it : `/assets/media/stills/${it}.jpg`} alt=""
              style={{ width: "3.2rem", height: "2rem", objectFit: "cover" }} />
            <span style={{ maxWidth: "9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {it.split("/").pop()}
            </span>
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))}>×</button>
          </span>
        ))}
        {extra}
      </div>
      <Upload kind="still" label="Upload an image" say={say} onDone={(url) => onChange([...items, url])} />
    </div>
  );
}

function ContextPanel({
  ctx, onChange, say, title,
}: {
  ctx: ProjectContext | undefined;
  onChange: (v: ProjectContext | undefined) => void;
  say: Shared["say"];
  title: string;
}) {
  const ref = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const value: ProjectContext = ctx ?? { brief: "", docs: [] };

  async function add(file: File) {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/context", { method: "POST", body: fd });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Upload failed.");
      onChange({ ...value, docs: [...value.docs, body] });
      say(
        body.kind === "image"
          ? "Screenshot attached — Claude will look at it"
          : `Read ${body.pages ? `${body.pages} pages of ` : ""}${body.name}${body.truncated ? " (trimmed)" : ""}`,
      );
    } catch (err) {
      say(err instanceof Error ? err.message : "Upload failed.", true);
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  }

  async function remove(id: string, url: string) {
    onChange({ ...value, docs: value.docs.filter((d) => d.id !== id) });
    await fetch("/api/context", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url }),
    }).catch(() => {});
  }

  return (
    <>
      <div className="sub"><h3>Context for the AI</h3></div>
      <p className="adm__note" style={{ marginBottom: "1rem" }}>
        {title} Everything here is given to Claude whenever you use a rewrite button,
        and never appears on the site.
      </p>

      <Field
        label="Brief — the angle you want this to take"
        value={value.brief}
        area
        rows={4}
        onChange={(v) => onChange({ ...value, brief: v })}
      />

      <div className="fld">
        <span className="fld__top"><span className="fld__label">Documents &amp; screenshots</span></span>
        {value.docs.length > 0 && (
          <div className="chips">
            {value.docs.map((d) => (
              <span className="chip" key={d.id} title={d.name}>
                {d.kind === "image"
                  ? <img src={d.url} alt="" style={{ width: "2.6rem", height: "1.8rem", objectFit: "cover" }} />
                  : <span style={{ color: "var(--go)" }}>DOC</span>}
                <span style={{ maxWidth: "12rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {d.name}
                </span>
                <span style={{ color: "var(--mute)" }}>
                  {d.kind === "image"
                    ? `${Math.round(d.bytes / 1024)} kB`
                    : `${d.pages ? `${d.pages}p · ` : ""}${Math.round((d.text?.length ?? 0) / 1000)}k chars${d.truncated ? " · trimmed" : ""}`}
                </span>
                <button type="button" aria-label={`Remove ${d.name}`} onClick={() => void remove(d.id, d.url)}>×</button>
              </span>
            ))}
          </div>
        )}
        <button className="adm__btn" type="button" disabled={busy} onClick={() => ref.current?.click()}>
          {busy ? "Reading…" : "Attach a PRD, spec, write-up or screenshot"}
        </button>
        <input
          ref={ref} type="file" hidden
          accept=".pdf,.docx,.txt,.md,.markdown,.csv,.json,image/*"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) void add(f); }}
        />
        <p className="adm__note" style={{ marginTop: ".5rem" }}>
          PDF, Word, text, markdown or an image. Up to 20 MB each — text is read out
          on upload, so a scanned PDF needs OCR first.
        </p>
      </div>
    </>
  );
}

function RackTab({ doc, edit }: { doc: Content } & Shared) {
  const tools = doc.rack.tools;
  return (
    <>
      <Head title="The rack" note="The tools shown under the channels. Each lights up only on the channels you tick." />
      <Field label="Section note" value={doc.rack.note} onChange={(v) => edit((d) => { d.rack.note = v; })} />
      {tools.map((t, i) => (
        <div className={`card2${t.hidden ? " card2--off" : ""}`} key={i}>
          <div className="card2__top">
            <span className="card2__grip">{String(i + 1).padStart(2, "0")}</span>
            <input type="text" value={t.name} aria-label="Tool name"
              onChange={(e) => edit((d) => { d.rack.tools[i].name = e.target.value; })} />
            <input type="text" value={t.icon} aria-label="Icon file" style={{ maxWidth: "9rem" }}
              onChange={(e) => edit((d) => { d.rack.tools[i].icon = e.target.value; })} />
            <span className="chips" style={{ margin: 0 }}>
              {doc.channels.map((c) => (
                <label className="chip" key={c.id}>
                  <input type="checkbox" checked={t.ch.includes(c.id)}
                    onChange={(e) => edit((d) => {
                      const list = d.rack.tools[i].ch;
                      d.rack.tools[i].ch = e.target.checked ? [...list, c.id].sort() : list.filter((n) => n !== c.id);
                    })} />
                  {c.id}
                </label>
              ))}
            </span>
            <span className="card2__acts">
              <button onClick={() => edit((d) => { d.rack.tools = move(d.rack.tools, i, -1); })}>↑</button>
              <button onClick={() => edit((d) => { d.rack.tools = move(d.rack.tools, i, 1); })}>↓</button>
              <button onClick={() => edit((d) => { d.rack.tools[i].hidden = !d.rack.tools[i].hidden; })}>
                {t.hidden ? "Show" : "Hide"}
              </button>
              <button onClick={() => edit((d) => { d.rack.tools.splice(i, 1); })}>Del</button>
            </span>
          </div>
        </div>
      ))}
      <button className="adm__btn adm__btn--go"
        onClick={() => edit((d) => { d.rack.tools.push({ icon: "figma", name: "New tool", ch: [] }); })}>
        Add a tool
      </button>
    </>
  );
}

function PathTab({ doc, edit, say }: { doc: Content } & Shared) {
  return (
    <>
      <Head title="Signal path" note="The four stages every job runs through." />
      <Field label="Section note" value={doc.path.note} onChange={(v) => edit((d) => { d.path.note = v; })} />
      {doc.path.steps.map((s, i) => (
        <div className="card2" key={i}>
          <div className="card2__top">
            <span className="card2__grip">{String(i + 1).padStart(2, "0")}</span>
            <input type="text" value={s.name} aria-label="Stage name"
              onChange={(e) => edit((d) => { d.path.steps[i].name = e.target.value; })} />
            <span className="card2__acts">
              <button onClick={() => edit((d) => { d.path.steps = move(d.path.steps, i, -1); })}>↑</button>
              <button onClick={() => edit((d) => { d.path.steps = move(d.path.steps, i, 1); })}>↓</button>
              <button onClick={() => edit((d) => { d.path.steps.splice(i, 1); })}>Del</button>
            </span>
          </div>
          <div style={{ padding: "0 .9rem .9rem" }}>
            <Field label="What happens" value={s.body} area ai say={say} context="a stage in a freelance project process"
              onChange={(v) => edit((d) => { d.path.steps[i].body = v; })} />
          </div>
        </div>
      ))}
      <button className="adm__btn adm__btn--go"
        onClick={() => edit((d) => { d.path.steps.push({ name: "New stage", body: "" }); })}>Add a stage</button>
    </>
  );
}

function AboutTab({ doc, edit, say }: { doc: Content } & Shared) {
  const a = doc.about;
  return (
    <>
      <Head title="About" note="Who you are, in your own words." />
      <Field label="Heading" value={a.title} onChange={(v) => edit((d) => { d.about.title = v; })} />
      <Field label="Lead paragraph" value={a.lead} area rows={4} ai say={say} context="the opening paragraph of an about section"
        onChange={(v) => edit((d) => { d.about.lead = v; })} />
      {a.body.map((para, i) => (
        <Field key={i} label={`Paragraph ${i + 2}`} value={para} area rows={4} ai say={say}
          context="a paragraph in a portfolio about section"
          onChange={(v) => edit((d) => { d.about.body[i] = v; })} />
      ))}
      <button className="adm__btn" onClick={() => edit((d) => { d.about.body.push(""); })}>Add a paragraph</button>
      <div className="sub"><h3>Facts</h3></div>
      <PairList label="Fact rows" items={a.facts} onChange={(v) => edit((d) => { d.about.facts = v; })} />
    </>
  );
}

function ContactTab({ doc, edit, say }: { doc: Content } & Shared) {
  const c = doc.contact;
  return (
    <>
      <Head title="Contact" note="The patch bay at the bottom of the page." />
      <Field label="Headline" value={c.title} ai say={say} context="the headline of a contact section"
        onChange={(v) => edit((d) => { d.contact.title = v; })} />
      <Field label="Body" value={c.body} area ai say={say} context="the paragraph above a contact email address"
        onChange={(v) => edit((d) => { d.contact.body = v; })} />
      <Field label="Email" value={c.email} onChange={(v) => edit((d) => { d.contact.email = v; })} />
      <div className="sub"><h3>Links</h3></div>
      {c.links.map((l, i) => (
        <div className="row" key={i} style={{ gridTemplateColumns: "1fr 2fr auto", gap: ".4rem", marginBottom: ".4rem" }}>
          <input type="text" value={l.label} aria-label="Label"
            onChange={(e) => edit((d) => { d.contact.links[i].label = e.target.value; })} />
          <input type="text" value={l.href} aria-label="URL"
            onChange={(e) => edit((d) => { d.contact.links[i].href = e.target.value; })} />
          <button className="adm__btn" onClick={() => edit((d) => { d.contact.links.splice(i, 1); })}>Del</button>
        </div>
      ))}
      <button className="adm__btn"
        onClick={() => edit((d) => { d.contact.links.push({ label: "", href: "" }); })}>Add a link</button>
    </>
  );
}
