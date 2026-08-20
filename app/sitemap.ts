import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getContent();
  const base = process.env.SITE_URL ?? "https://israeloni.vercel.app";
  const updated = content.updatedAt ? new Date(content.updatedAt) : new Date();

  return [
    { url: base, lastModified: updated, changeFrequency: "monthly", priority: 1 },
    ...content.work.projects
      .filter((p) => !p.hidden && p.case)
      .map((p) => ({
        url: `${base}/work/${p.id}`,
        lastModified: updated,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
  ];
}
