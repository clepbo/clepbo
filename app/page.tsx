import { getContent } from "@/lib/content";
import ChannelStyles from "./ChannelStyles";
import Desk from "./Desk";

export default async function Page() {
  const content = await getContent();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: content.site.name,
    description: content.site.description,
    email: `mailto:${content.contact.email}`,
    address: { "@type": "PostalAddress", addressLocality: content.site.location },
    knowsAbout: content.channels.filter((c) => !c.hidden).map((c) => c.name),
    sameAs: content.contact.links.map((l) => l.href),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ChannelStyles channels={content.channels} />
      <Desk content={content} />
    </>
  );
}
