import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { cn } from "@workspace/ui/lib/utils"

import { container } from "@/components/brand"
import { EventExplorer } from "@/components/events/event-explorer"
import { ContactCta } from "@/components/home/contact-cta"
import { SideTabs } from "@/components/side-tabs"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getEvents, lastUpdated } from "@/lib/events"
import { getContent, hasLocale } from "@/lib/i18n"

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const p = getContent(lang).eventsPage
  return { title: p.metaTitle, description: p.metaDescription }
}

export default async function EventsPage({ params }: Props) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const t = getContent(lang)
  const p = t.eventsPage
  const href = `/${lang}/su-kien`

  return (
    <>
      <div id="top" />
      <SiteHeader
        locale={t.locale}
        nav={t.nav}
        company={t.company}
        ui={t.ui}
        activeHref={href}
        solid
      />
      <SideTabs t={t} />

      <main className="pt-[76px] xl:pt-[96px]">
        {/* Breadcrumb + title */}
        <div className="border-b border-neutral-200 bg-white">
          <div className={cn(container, "py-6")}>
            <h1 className="sr-only">{p.title}</h1>
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-[13px] text-neutral-500">
                <li>
                  <Link href={`/${lang}`} className="hover:text-brand">
                    {p.breadcrumbHome}
                  </Link>
                </li>
                <li aria-hidden="true">—</li>
                <li aria-current="page" className="text-neutral-800">
                  {p.title}
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <EventExplorer
          events={getEvents(lang)}
          labels={p}
          basePath={href}
          updated={lastUpdated()}
        />

        <div className="border-t border-neutral-200 pt-16">
          <ContactCta t={t} />
        </div>
      </main>

      <SiteFooter t={t} />
    </>
  )
}
