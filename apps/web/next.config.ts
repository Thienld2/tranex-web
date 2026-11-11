import type { NextConfig } from "next"

// `STATIC_EXPORT=1 next build` (or `pnpm --filter web package`) produces a
// plain static site in `out/` for ordinary web hosting. Normal builds are
// unaffected.
const staticExport = process.env.STATIC_EXPORT === "1"

// Sub-path hosting, e.g. GitHub Pages serves a repo at /<repo-name>/.
// Set PAGES_BASE_PATH=/tranex-web for such builds; leave unset for a domain root.
const basePath = staticExport ? (process.env.PAGES_BASE_PATH ?? "") : ""

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
  // Folder-per-page output (/vi/index.html, /vi/du-an/index.html) so any
  // static host serves clean URLs without rewrite rules.
  ...(staticExport && { output: "export", trailingSlash: true }),
  ...(basePath && { basePath }),
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    // The image optimizer needs a server; static hosting serves sources as-is.
    unoptimized: staticExport,
  },
}

export default nextConfig
