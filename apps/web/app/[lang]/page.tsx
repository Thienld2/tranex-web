import { notFound } from "next/navigation"

import { Hero } from "@/components/hero"
import { Challenge } from "@/components/home/challenge"
import { Company, Pickup } from "@/components/home/company"
import { ContactCta } from "@/components/home/contact-cta"
import { NewsEvents } from "@/components/home/news-events"
import { BuildingTypes, Solutions } from "@/components/home/solutions"
import { SideTabs } from "@/components/side-tabs"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getContent, hasLocale } from "@/lib/i18n"

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()
  const t = getContent(lang)

  return (
    <>
      <div id="top" />
      <SiteHeader
        locale={t.locale}
        nav={t.nav}
        company={t.company}
        ui={t.ui}
        activeHref={`/${t.locale}`}
      />
      <SideTabs t={t} />
      <main>
        <Hero hero={t.hero} closeLabel={t.ui.closeNotice} />
        <NewsEvents t={t} />
        <Solutions t={t} />
        <BuildingTypes t={t} />
        <Challenge t={t} />
        <Company t={t} />
        <Pickup t={t} />
        <ContactCta t={t} />
      </main>
      <SiteFooter t={t} />
    </>
  )
}
