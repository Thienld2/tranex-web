import Image from "next/image"
import Link from "next/link"

import { cn } from "@workspace/ui/lib/utils"

import { ArrowBox, Tag } from "@/components/brand"
import { EventStatusBadge } from "@/components/events/event-status"
import type { EventItem } from "@/lib/events"
import type { Content } from "@/lib/i18n/types"

type Labels = Pick<Content["eventsPage"], "fields" | "status">

/** Tags row: categories + area. */
function EventTags({ ev }: { ev: EventItem }) {
  return (
    <span className="flex flex-wrap gap-1.5">
      {ev.categories.map((c) => (
        <Tag key={c}>{c}</Tag>
      ))}
      <span className="inline-block rounded-[2px] border border-neutral-400 px-2 py-0.5 text-[12.5px] leading-tight text-neutral-600">
        {ev.area}
      </span>
    </span>
  )
}

/** Event list row: image on the left, tags / title / date-venue-time on the right. */
export function EventRow({
  ev,
  href,
  labels,
  eager = false,
}: {
  ev: EventItem
  href: string
  labels: Labels
  eager?: boolean
}) {
  return (
    <Link
      href={href}
      className="group grid gap-5 border-b border-neutral-300 py-8 sm:grid-cols-[minmax(0,300px)_1fr] sm:gap-8 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-10"
    >
      <span className="relative block aspect-[16/10] overflow-hidden rounded-[6px] bg-neutral-100">
        <Image
          src={ev.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 300px, 100vw"
          loading={eager ? "eager" : undefined}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <EventStatusBadge
          dates={ev.dates}
          labels={labels.status}
          className="absolute top-3 left-3 shadow"
        />
      </span>
      <span className="flex min-w-0 flex-col">
        <EventTags ev={ev} />
        <span className="mt-3 text-[19px] leading-[1.55] font-bold text-neutral-800 transition-colors group-hover:text-brand lg:text-[21px]">
          {ev.title}
        </span>
        <dl className="mt-4 space-y-1.5 text-[14.5px]">
          {(
            [
              [labels.fields.date, ev.dateText],
              [labels.fields.venue, ev.venue],
              [labels.fields.time, ev.time],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="grid grid-cols-[104px_1fr] gap-3 sm:grid-cols-[120px_1fr]">
              <dt className="flex items-center gap-2 font-bold text-neutral-700">
                <span className="size-1.5 shrink-0 bg-brand" aria-hidden="true" />
                {k}
              </dt>
              <dd className="text-neutral-800">{v}</dd>
            </div>
          ))}
        </dl>
        <ArrowBox className="mt-4 self-end sm:mt-auto" />
      </span>
    </Link>
  )
}

/** Compact vertical card (home page pickup, "other events"). */
export function EventCard({
  ev,
  href,
  labels,
  className,
}: {
  ev: EventItem
  href: string
  labels: Labels
  className?: string
}) {
  return (
    <Link href={href} className={cn("group block", className)}>
      <span className="relative block aspect-[16/10] overflow-hidden bg-neutral-100">
        <Image
          src={ev.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <EventStatusBadge
          dates={ev.dates}
          labels={labels.status}
          className="absolute top-2.5 left-2.5 shadow"
        />
      </span>
      <span className="mt-3 block">
        <EventTags ev={ev} />
      </span>
      <span className="mt-2 block text-[13px] text-neutral-500">{ev.dateText}</span>
      <span className="mt-1 block text-base leading-snug font-bold text-neutral-800 group-hover:text-brand">
        {ev.title}
      </span>
    </Link>
  )
}
