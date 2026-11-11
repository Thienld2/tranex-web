// Builds the site as plain static files and zips them for upload to any web
// hosting (cPanel / Apache / Nginx / shared hosting — no Node.js needed).
//
//   pnpm --filter web package
//
// Output: <repo>/deploy/tranex-web-static.zip  (contents = the site root)
import { spawnSync } from "node:child_process"
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs"
import { createRequire } from "node:module"
import { dirname, join, resolve } from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

const appDir = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const outDir = join(appDir, "out")
const deployDir = resolve(appDir, "..", "..", "deploy")
const zipPath = join(deployDir, "tranex-web-static.zip")

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: "inherit", cwd: appDir, ...opts })
  if (r.status !== 0) {
    console.error(`\n✖ "${cmd} ${args.join(" ")}" failed`)
    process.exit(r.status ?? 1)
  }
}

// 1. Static build
console.log("› Building static site…")
rmSync(outDir, { recursive: true, force: true })
const nextBin = createRequire(join(appDir, "package.json")).resolve("next/dist/bin/next")
run(process.execPath, [nextBin, "build"], {
  env: { ...process.env, STATIC_EXPORT: "1" },
})

// 2. Server config for Apache hosts (ignored elsewhere)
writeFileSync(
  join(outDir, ".htaccess"),
  `# TRANEX – Apache / cPanel configuration
DirectoryIndex index.html
ErrorDocument 404 /404.html
Options -Indexes

<IfModule mod_rewrite.c>
  RewriteEngine On
  # "/" -> Vietnamese home page
  RewriteRule ^$ /vi/ [R=302,L]
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml application/javascript application/json image/svg+xml
</IfModule>

<IfModule mod_headers.c>
  # Hashed build assets never change: cache for a year
  <If "%{REQUEST_URI} =~ m#^/_next/static/#">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </If>
  <If "%{REQUEST_URI} =~ m#\\.html$#">
    Header set Cache-Control "no-cache"
  </If>
</IfModule>
`
)

// 3. Zip the *contents* of out/ (so index.html sits at the zip root)
console.log("› Creating zip…")
mkdirSync(deployDir, { recursive: true })
rmSync(zipPath, { force: true })
if (process.platform === "win32") {
  // Windows' own bsdtar (10+) writes real .zip files with -a. Call it by full
  // path: Git Bash puts GNU tar first on PATH, which cannot write zips.
  // eslint-disable-next-line turbo/no-undeclared-env-vars -- OS variable, not a build input
  const tar = join(process.env.SystemRoot ?? "C:\\Windows", "System32", "tar.exe")
  run(tar, ["-a", "-c", "-f", zipPath, "-C", outDir, "."])
} else {
  run("zip", ["-qr", zipPath, "."], { cwd: outDir })
}

if (!existsSync(zipPath)) {
  console.error("✖ Zip was not created")
  process.exit(1)
}
console.log(`\n✔ Ready to upload: ${zipPath}`)
