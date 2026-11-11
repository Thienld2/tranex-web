import type { NextConfig } from "next"

// `STATIC_EXPORT=1 next build` (or `pnpm --filter web package`) produces a
// plain static site in `out/` for ordinary web hosting. Normal builds are
// unaffected.
const staticExport = process.env.STATIC_EXPORT === "1"

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
  // Folder-per-page output (/vi/index.html, /vi/du-an/index.html) so any
  // static host serves clean URLs without rewrite rules.
  ...(staticExport && { output: "export", trailingSlash: true }),
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    // The image optimizer needs a server; static hosting serves sources as-is.
    unoptimized: staticExport,
  },
}

export default nextConfig
