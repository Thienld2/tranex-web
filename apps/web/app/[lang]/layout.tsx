import type { Metadata } from "next"
import {
  Cormorant_Garamond,
  Geist_Mono,
  Great_Vibes,
  Noto_Sans_JP,
  Noto_Serif_JP,
  Plus_Jakarta_Sans,
} from "next/font/google"
import { notFound } from "next/navigation"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { getContent, hasLocale, locales } from "@/lib/i18n"
import { cn } from "@workspace/ui/lib/utils"

// Main typeface for both locales (as on the reference site). It covers
// Vietnamese diacritics; Japanese glyphs are served as unicode-range slices,
// so the browser only downloads the slices a page actually uses.
const fontSans = Noto_Sans_JP({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
})

// Numbers, dates and English labels.
const fontEn = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-en",
})

// Editorial serif + handwritten script for the cinematic project film
// ("Từ ý tưởng", "đến tổ ấm"…). Japanese falls back to a Mincho serif.
const fontSerif = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
})

const fontSerifJp = Noto_Serif_JP({
  weight: ["500", "700"],
  variable: "--font-serif-jp",
  preload: false,
})

const fontScript = Great_Vibes({
  subsets: ["latin", "vietnamese"],
  weight: "400",
  variable: "--font-script",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

type Props = {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const t = getContent(lang)
  return {
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={cn(
        "scroll-smooth antialiased",
        fontSans.variable,
        fontEn.variable,
        fontSerif.variable,
        fontSerifJp.variable,
        fontScript.variable,
        fontMono.variable,
        "font-sans"
      )}
    >
      <body>
        <ThemeProvider forcedTheme="light">{children}</ThemeProvider>
      </body>
    </html>
  )
}
