import Image from "next/image"
import Link from "next/link"

import { ArrowBox } from "@/components/brand"
import type { Project } from "@/lib/projects"

/** Project list card (list page + "other projects" on the detail page). */
export function ProjectCard({
  project: p,
  href,
  locationLabel,
  eager = false,
}: {
  project: Project
  href: string
  locationLabel: string
  /** Load immediately (the first row shares images with the pickup carousel). */
  eager?: boolean
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col border-b border-neutral-300 pb-6"
    >
      <span className="relative block aspect-[16/9] overflow-hidden rounded-[8px] bg-neutral-100">
        <Image
          src={p.image}
          alt={p.name}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          loading={eager ? "eager" : undefined}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {p.isNew && (
          <span className="absolute top-2 left-2 rounded-[3px] border border-neutral-300 bg-white px-2 py-0.5 font-en text-[13px] leading-tight font-semibold text-brand">
            NEW
          </span>
        )}
      </span>
      <span className="mt-4 flex flex-wrap gap-1.5">
        <span className="rounded-[2px] border border-neutral-400 px-3 py-0.5 text-[13px] leading-snug text-neutral-800">
          {p.category}
        </span>
      </span>
      <span className="mt-2.5 text-[19px] leading-[1.5] font-bold text-neutral-800 transition-colors duration-200 group-hover:text-brand">
        {p.name}
      </span>
      <span className="mt-3 flex gap-3 text-[14px] text-neutral-800">
        <span className="shrink-0">{locationLabel}</span>
        <span>{p.location}</span>
      </span>
      <span className="mt-1 text-[14px] text-neutral-500">{p.structure}</span>
      <span className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[14px] text-neutral-500">
        {p.tags.map((tag) => (
          <span key={tag}>＃{tag}</span>
        ))}
      </span>
      <ArrowBox className="mt-auto self-end" />
    </Link>
  )
}
