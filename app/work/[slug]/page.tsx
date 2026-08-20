import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import ChannelStyles from "@/app/ChannelStyles";
import Gallery from "./Gallery";

const framesOf = (p: { shots?: string[]; media: { type: string; stills?: string[] } }) =>
  p.shots?.length ? p.shots : p.media.type === "still" ? p.media.stills ?? [] : [];

const markSrc = (n: string) =>
  /^https?:\/\//.test(n) ? n : `/assets/media/marks/${/\./.test(n) ? n : `${n}.png`}`;

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
      <ChannelStyles channels={content.channels} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div data-channel={p.ch[0]} className="study" style={{ ["--page-accent" as string]: channel?.colour }}>
        <header className="rail">
          <div className="rail__id">
            <Link className="rail__name study__back" href="/">← {content.site.name}</Link>
            <span className="rail__sep" aria-hidden="true" />
            <span className="rail__role">{p.kind}</span>
          </div>
          <p className="rail__tally">
            <span className="lamp" aria-hidden="true" />
            <span className="rail__status">{channel ? `CH 0${channel.id} — ${channel.name.toLowerCase()}` : ""}</span>
          </p>
          <div className="rail__meta"><span>{content.site.location}</span></div>
        </header>

        <main className="study__main">
          <section className="study__head">
            {p.client && <p className="eyebrow">{p.client}</p>}
            <h1 className="study__title">{p.title}</h1>
            <p className="study__line">{p.line}</p>
          </section>

          {frames.length > 0 && <Gallery frames={frames} title={p.title} />}

          <section className="study__body">
            <p className="study__story">{p.story}</p>

            {p.brand && (
              <div className="brandbar">
                <p className="case__head">Brand</p>
                <div className="brandbar__row">
                  <span className={`brandbar__mark${p.brand.dark ? " is-dark" : ""}`}>
                    <img src={markSrc(p.brand.mark)} alt={`${p.client} logo`} />
                  </span>
                  <ul className="brandbar__sws">
                    {p.brand.colors.map((c) => (
                      <li className="brandbar__sw" key={c}>
                        <span className="brandbar__chip" style={{ background: c }} />
                        <span className="brandbar__hex">{c.toUpperCase()}</span>
                      </li>
                    ))}
                  </ul>
                  {p.brand.type && <p className="brandbar__type"><span>Typeface</span>{p.brand.type}</p>}
                </div>
              </div>
            )}

            {p.case && (
              <div className="case">
                {p.case.problem && (
                  <section className="case__block">
                    <p className="case__head">The problem</p>
                    <p className="case__lead">{p.case.problem}</p>
                  </section>
                )}
                {p.case.process.length > 0 && (
                  <section className="case__block">
                    <p className="case__head">How it was worked out</p>
                    <ol className="case__steps">
                      {p.case.process.map((s, n) => (
                        <li className="case__step" key={s.title}>
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
                    <ul className="case__decisions">
                      {p.case.decisions.map((d) => (
                        <li className="case__decision" key={d.title}>
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

            <dl className="monitor__meta">
              {p.meta.map((m) => (
                <div key={m.label}><dt>{m.label}</dt><dd>{m.value}</dd></div>
              ))}
            </dl>

            {p.note && <p className="monitor__note">{p.note}</p>}
            {p.link && (
              <a className="monitor__link" href={p.link} target="_blank" rel="noopener">
                {p.linkText || "Open"} →
              </a>
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
            <Link className="monitor__link" href="/">← Back to the desk</Link>
          </p>
        </main>

        <footer className="foot">
          <span>{content.footer.left}</span>
          <span className="foot__mark" aria-hidden="true" />
          <span>{content.footer.right}</span>
        </footer>
      </div>
    </>
  );
}
