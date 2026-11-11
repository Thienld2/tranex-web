import type { Metadata } from "next"
import { Be_Vietnam_Pro, Geist_Mono, Kaushan_Script } from "next/font/google"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"

const fontSans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
})

const fontScript = Kaushan_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "TRANEX | Kết nối công nghệ – Kiến tạo tương lai",
  description:
    "TRANEX cung cấp giải pháp toàn diện trong lĩnh vực xây dựng: tư vấn thiết kế, BIM, bê tông đúc sẵn, vật liệu xây dựng và máy thi công.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={cn(
        "scroll-smooth antialiased",
        fontSans.variable,
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
