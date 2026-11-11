import { redirect } from "next/navigation"

// "/" → Vietnamese home.
// - With a server (`next dev` / `next start`): a real 307 redirect.
// - With a static export there is no server, so render a meta refresh
//   (React hoists <meta> into <head>) plus plain links as a fallback.
//   Raw URLs are not rewritten by Next, so prefix the sub-path ourselves.
export default function RootPage() {
  if (process.env.STATIC_EXPORT !== "1") redirect("/vi")

  const base = process.env.PAGES_BASE_PATH ?? ""
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${base}/vi/`} />
      <p style={{ fontFamily: "sans-serif", padding: 24 }}>
        <a href={`${base}/vi/`}>Tiếng Việt</a> · <a href={`${base}/ja/`}>日本語</a>
      </p>
    </>
  )
}
