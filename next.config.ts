import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site is hand-written CSS; nothing to transpile beyond React.
  reactStrictMode: true,
  // The curator takes screenshots with a packaged Chromium. Keep it out of the
  // bundle, and make sure its compressed browser ships with the function.
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  outputFileTracingIncludes: {
    "/api/curate": ["./node_modules/@sparticuz/chromium/bin/**"],
  },
};

export default nextConfig;
