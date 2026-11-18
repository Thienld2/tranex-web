import type { Metadata } from "next"
import {
  Geist_Mono,
  Noto_Sans_JP,
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
