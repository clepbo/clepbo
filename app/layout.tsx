import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent();
  return {
    title: site.title,
    description: site.description,
    authors: [{ name: site.name }],
    openGraph: {
      title: site.title,
      description: site.description,
      type: "website",
      images: [{ url: "/assets/media/og.png", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image" },
    metadataBase: new URL(process.env.SITE_URL ?? "https://israeloni.vercel.app"),
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#16181A" },
    { media: "(prefers-color-scheme: light)", color: "#F2F0EA" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-channel="0">
      <head>
        {/* Settle the theme before first paint so the page never flashes. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('desk-theme');" +
              "if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}" +
              "document.documentElement.dataset.theme=t;}catch(e){" +
              "document.documentElement.dataset.theme='dark';}})();",
          }}
        />
        {/* Linked rather than imported: the desk's CSS ships exactly as written,
            with nothing in the build pipeline able to alter it. */}
        <link rel="stylesheet" href="/assets/css/fonts.css" />
        <link rel="stylesheet" href="/assets/css/console.css" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%2316181A'/><circle cx='16' cy='16' r='6' fill='%2335D6C4'/></svg>"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
