"use client"

import { useRef, useState } from "react"

import { container } from "@/components/brand"
import { EventRow } from "@/components/events/event-card"
import { Pagination } from "@/components/projects/project-explorer"
import type { EventItem } from "@/lib/events"
import type { Content } from "@/lib/i18n/types"

const PAGE_SIZE = 6

/** Event list + pagination. */
export function EventExplorer({
  events,
  labels,
  basePath,
  updated,
}: {
  events: EventItem[]
  labels: Content["eventsPage"]
  /** e.g. "/vi/su-kien" — rows link to `${basePath}/${id}`. */
  basePath: string
  updated: string
}) {
  const [page, setPage] = useState(1)
  const listRef = useRef<HTMLHeadingElement>(null)

  const pageCount = Math.max(1, Math.ceil(events.length / PAGE_SIZE))
  const visible = events.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const goTo = (n: number) => {
    setPage(Math.min(Math.max(1, n), pageCount))
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <section aria-labelledby="list-title" className="py-14 lg:py-20">
      <div className={container}>
        <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-brand-dark pb-4">
          <h2
            id="list-title"
            ref={listRef}
            className="scroll-mt-28 text-[24px] leading-[1.4] font-bold text-neutral-800 sm:text-[26px]"
          >
            {labels.listTitle}
          </h2>
          <p className="flex gap-4 text-[14px] text-neutral-500">
            <span>{labels.resultCount.replace("{n}", String(events.length))}</span>
            <span>
              {labels.updated}：<span className="font-en">{updated}</span>
            </span>
          </p>
        </div>

        <ul>
          {visible.map((ev, i) => (
            <li key={ev.id}>
              <EventRow ev={ev} href={`${basePath}/${ev.id}`} labels={labels} eager={i < 2} />
            </li>
          ))}
        </ul>

        {pageCount > 1 && (
          <Pagination page={page} pageCount={pageCount} onChange={goTo} labels={labels} />
        )}
      </div>
    </section>
  )
}
