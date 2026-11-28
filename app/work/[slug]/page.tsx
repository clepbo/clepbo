import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { BrandBar } from "@/app/Studio";
import { Words } from "@/app/motion";
import Gallery from "./Gallery";

const framesOf = (p: { shots?: string[]; media: { type: string; stills?: string[] } }) =>
  p.shots?.length ? p.shots : p.media.type === "still" ? p.media.stills ?? [] : [];

const stillSrc = (n: string) => (/^https?:\/\//.test(n) ? n : `/assets/media/stills/${n}.jpg`);

export async function generateStaticParams() {
  const { work } = await getContent();
  return work.projects.filter((p) => !p.hidden).map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const content = await getContent();
  const p = content.work.projects.find((x) => x.id === slug && !x.hidden);
  if (!p) return { title: "Not found" };

  const title = `${p.title} — ${content.site.name}`;
  const description = p.case?.problem?.slice(0, 180) ?? p.story.slice(0, 180);
  return {
    title,
    description,
    alternates: { canonical: `/work/${p.id}` },
    openGraph: { title, description, type: "article", url: `/work/${p.id}` },
    twitter: { card: "summary_large_image" },
  };
}

export default async function Study({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getContent();
  const visible = content.work.projects.filter((p) => !p.hidden);
  const i = visible.findIndex((x) => x.id === slug);
  if (i === -1) notFound();

  const p = visible[i];
  const prev = visible[(i - 1 + visible.length) % visible.length];
  const next = visible[(i + 1) % visible.length];
  const channel = content.channels.find((c) => c.id === p.ch[0]);
  const frames = framesOf(p);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.title,
    description: p.case?.problem ?? p.story,
    creator: { "@type": "Person", name: content.site.name },
    about: p.kind,
    ...(p.client ? { sourceOrganization: { "@type": "Organization", name: p.client } } : {}),
    ...(p.link ? { url: p.link } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="study__bar">
        <Link className="study__back" href="/#work">
          <span className="mark" aria-hidden="true">{initials(content.site.name)}</span>
          ← All work
        </Link>
        <span className="study__kind">{p.kind}</span>
        <Link className="btn btn--dark" href="/#contact" style={{ height: 36 }}>Start a project</Link>
      </header>

      <main className="study" style={{ ["--c" as string]: channel?.colour ?? "#A2A8A6" }}>
        <section className="study__head">
          <p className="study__eyebrow"><i aria-hidden="true" />{p.client || channel?.name}</p>
          <h1 className="study__title"><Words text={p.title} /></h1>
          <p className="study__line">{p.line}</p>
        </section>

        {(frames.length > 0 || p.video) && <Gallery frames={frames} title={p.title} video={p.video} />}

        <section className="study__body">
          <p className="study__story">{p.story}</p>

          {p.brand && <BrandBar project={p} />}

          {p.case && (
            <div className="case">
              {p.case.problem && (
                <section className="case__block">
                  <p className="case__head">The problem</p>
                  <p className="case__lead">{p.case.problem}</p>
                </section>
              )}
              {(p.case.features?.length ?? 0) > 0 && (
                <section className="case__block">
                  <p className="case__head">What it does</p>
                  <ol className="feats__list">
                    {p.case.features!.map((f, n) => (
                      <li className={`feat${f.shot ? "" : " feat--text"}`} key={f.title}>
                        {f.shot && (
                          <a className="feat__shot" href={stillSrc(f.shot)} target="_blank" rel="noopener">
                            <img src={stillSrc(f.shot)} alt={`${p.title}: ${f.title}`} loading="lazy" decoding="async" />
                          </a>
                        )}
                        <div className="feat__copy">
                          <span className="case__n">{String(n + 1).padStart(2, "0")}</span>
                          <h2 className="case__sub">{f.title}</h2>
                          <p className="case__text">{f.body}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              )}
              {p.case.process.length > 0 && (
                <section className="case__block">
                  <p className="case__head">How it was worked out</p>
                  <ol className="case__list case__list--num">
                    {p.case.process.map((s, n) => (
                      <li key={s.title}>
                        <span className="case__n">{String(n + 1).padStart(2, "0")}</span>
                        <div>
                          <h2 className="case__sub">{s.title}</h2>
                          <p className="case__text">{s.body}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              )}
              {p.case.decisions.length > 0 && (
                <section className="case__block">
                  <p className="case__head">Design decisions</p>
                  <ul className="case__list">
                    {p.case.decisions.map((d) => (
                      <li key={d.title}>
                        <h2 className="case__sub">{d.title}</h2>
                        <p className="case__text">{d.body}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {p.case.outcome && (
                <section className="case__block case__block--out">
                  <p className="case__head">Outcome</p>
                  <p className="case__lead">{p.case.outcome}</p>
                </section>
              )}
            </div>
          )}

          <dl className="meta">
            {p.meta.map((m) => (
              <div key={m.label}><dt>{m.label}</dt><dd>{m.value}</dd></div>
            ))}
          </dl>

          {p.note && <p className="sheet__note">{p.note}</p>}
          {p.link && (
            <p>
              <a className="btn btn--dark btn--lg" href={p.link} target="_blank" rel="noopener">
                {p.linkText || "Open"} ↗
              </a>
            </p>
          )}
        </section>

        <nav className="study__nav" aria-label="Other work">
          <Link className="study__step" href={`/work/${prev.id}`}>
            <span>← Previous</span><strong>{prev.title}</strong>
          </Link>
          <Link className="study__step study__step--next" href={`/work/${next.id}`}>
            <span>Next →</span><strong>{next.title}</strong>
          </Link>
        </nav>

        <p className="study__home">
          <Link className="btn btn--ghost" href="/#work">← Back to all work</Link>
        </p>
      </main>

      <footer className="foot">
        <div className="foot__in">
          <span className="foot__txt">{content.footer.left}</span>
          <span className="foot__txt">{content.footer.right}</span>
        </div>
      </footer>
    </>
  );
}

const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
