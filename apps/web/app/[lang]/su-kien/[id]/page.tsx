import { ArrowLeft, ExternalLink } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { cn } from "@workspace/ui/lib/utils"

import { container, SectionHeading, Tag } from "@/components/brand"
import { CopyLinkButton, EventCta } from "@/components/events/event-actions"
import { EventCard } from "@/components/events/event-card"
import { EventStatusBadge } from "@/components/events/event-status"
import { ContactCta } from "@/components/home/contact-cta"
import { SideTabs } from "@/components/side-tabs"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { formatDot, getEvent, getEventIds, getOtherEvents } from "@/lib/events"
import { getContent, hasLocale } from "@/lib/i18n"

type Props = { params: Promise<{ lang: string; id: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return getEventIds().map((id) => ({ id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params
  if (!hasLocale(lang)) return {}
  const ev = getEvent(lang, id)
  if (!ev) return {}
  return {
    title: `${ev.title} | TRANEX`,
    description: ev.lead,
    openGraph: { images: [ev.image] },
  }
}

export default async function EventDetailPage({ params }: Props) {
  const { lang, id } = await params
  if (!hasLocale(lang)) notFound()
  const ev = getEvent(lang, id)
  if (!ev) notFound()

  const t = getContent(lang)
  const p = t.eventsPage
  const d = t.eventDetail
  const listHref = `/${lang}/su-kien`
  const others = getOtherEvents(lang, id)

  const info: [string, React.ReactNode][] = [
    [d.fields.date, ev.dateText],
    [
      d.fields.venue,
      <span key="venue">
        {ev.venue}
        <a
          href={ev.mapHref}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-3 inline-flex items-center gap-1 text-[14px] font-bold whitespace-nowrap text-brand underline-offset-4 hover:underline"
        >
          {d.mapLink}
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
      </span>,
    ],
    [d.fields.time, ev.time],
    [d.fields.access, ev.access],
  ]

  return (
    <>
      <div id="top" />
      <SiteHeader
        locale={t.locale}
        nav={t.nav}
        company={t.company}
        ui={t.ui}
        activeHref={listHref}
        solid
      />
      <SideTabs t={t} />

      <main className="pt-[76px] xl:pt-[96px]">
        <article>
          {/* Breadcrumb + heading */}
          <div className={cn(container, "pt-6")}>
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-[13px] text-neutral-500">
                <li>
                  <Link href={`/${lang}`} className="hover:text-brand">
                    {p.breadcrumbHome}
                  </Link>
                </li>
                <li aria-hidden="true">—</li>
                <li>
                  <Link href={listHref} className="hover:text-brand">
                    {p.title}
                  </Link>
                </li>
                <li aria-hidden="true">—</li>
                <li aria-current="page" className="line-clamp-1 text-neutral-800">
                  {ev.title}
                </li>
              </ol>
            </nav>
          </div>

          <div className="mx-auto w-full max-w-[1000px] px-4 pt-10 pb-16 sm:px-6 lg:pt-14 lg:pb-24">
            <div className="flex flex-wrap items-center gap-1.5">
              <EventStatusBadge dates={ev.dates} labels={p.status} className="mr-1" />
              {ev.categories.map((c) => (
                <Tag key={c}>{c}</Tag>
              ))}
              <span className="inline-block rounded-[2px] border border-neutral-400 px-2 py-0.5 text-[12.5px] leading-tight text-neutral-600">
                {ev.area}
              </span>
              {ev.free && (
                <span className="inline-block rounded-[2px] bg-brand-lime/60 px-2 py-0.5 text-[12.5px] leading-tight font-bold text-brand-dark">
                  {d.free}
                </span>
              )}
              {ev.reservation && (
                <span className="inline-block rounded-[2px] bg-brand-dark px-2 py-0.5 text-[12.5px] leading-tight font-bold text-white">
                  {d.reservation}
                </span>
              )}
            </div>
            <h1 className="mt-4 text-[26px] leading-[1.45] font-bold text-brand-dark sm:text-[32px]">
              {ev.title}
            </h1>
            <p className="mt-3 text-[13px] text-neutral-500">
              {p.updated}：<span className="font-en">{formatDot(ev.updated)}</span>
            </p>
            <p className="mt-8 text-base leading-[1.9] text-neutral-700">{ev.lead}</p>

            <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-[8px] bg-neutral-100">
              <Image
                src={ev.image}
                alt={ev.detail.name ?? ev.title}
                fill
                priority
                sizes="(min-width: 1000px) 950px, 100vw"
                className="object-cover"
              />
            </div>

            {/* Info */}
            <dl className="mt-10 border-t border-neutral-300">
              {info.map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[110px_1fr] gap-4 border-b border-neutral-300 py-4 text-[15px] sm:grid-cols-[170px_1fr]"
                >
                  <dt className="font-bold text-neutral-800">{label}</dt>
                  <dd className="leading-[1.8] text-neutral-700">{value}</dd>
                </div>
              ))}
            </dl>

            {/* Building / programme */}
            <section aria-labelledby="detail-title" className="mt-16">
              <SectionHeading
                id="detail-title"
                title={ev.detail.kind === "building" ? d.buildingTitle : d.programTitle}
              />
              {ev.detail.name && (
                <h3 className="mt-8 text-[20px] font-bold text-neutral-800">{ev.detail.name}</h3>
              )}
              <dl className={cn("border-t border-neutral-300", ev.detail.name ? "mt-4" : "mt-8")}>
                {ev.detail.rows.map(([k, v]) => (
                  <div
                    key={k}
                    className="grid grid-cols-[110px_1fr] gap-4 border-b border-neutral-300 py-4 text-[15px] sm:grid-cols-[170px_1fr]"
                  >
                    <dt className="flex items-center gap-2 font-bold text-neutral-800">
                      <span className="size-1.5 shrink-0 bg-brand" aria-hidden="true" />
                      {k}
                    </dt>
                    <dd className="leading-[1.8] text-neutral-700">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Registration */}
            <section className="mt-16">
              <EventCta
                dates={ev.dates}
                labels={d}
                contactHref={`/${lang}/lien-he#form-consult`}
                phone={t.company.phone}
                phoneHref={t.company.phoneHref}
                hours={t.company.hours}
              />
            </section>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
              <CopyLinkButton label={d.copyLink} done={d.copied} />
              <Link
                href={listHref}
                className="group flex items-center gap-2 text-[15px] font-bold text-neutral-700 hover:text-brand"
              >
                <ArrowLeft
                  className="size-4 transition-transform group-hover:-translate-x-1"
                  aria-hidden="true"
                />
                {d.backToList}
              </Link>
            </div>
          </div>
        </article>

        {/* Other events */}
        <section
          aria-labelledby="other-title"
          className="border-t border-neutral-200 bg-white py-16 lg:py-20"
        >
          <div className={container}>
            <SectionHeading title={d.otherTitle} id="other-title" />
            <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((o) => (
                <li key={o.id}>
                  <EventCard ev={o} href={`${listHref}/${o.id}`} labels={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="border-t border-neutral-200 pt-16">
          <ContactCta t={t} />
        </div>
      </main>

      <SiteFooter t={t} />
    </>
  )
}
