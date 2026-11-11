import { redirect } from "next/navigation"

// "/" → Vietnamese home.
// - With a server (`next dev` / `next start`): a real 307 redirect.
// - With a static export there is no server, so render a meta refresh
//   (React hoists <meta> into <head>) plus plain links as a fallback.
export default function RootPage() {
  if (process.env.STATIC_EXPORT !== "1") redirect("/vi")

  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/vi/" />
      <p style={{ fontFamily: "sans-serif", padding: 24 }}>
        <a href="/vi/">Tiếng Việt</a> · <a href="/ja/">日本語</a>
      </p>
    </>
  )
}
