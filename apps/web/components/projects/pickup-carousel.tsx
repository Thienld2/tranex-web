"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

import { cn } from "@workspace/ui/lib/utils"

import { container, Tag } from "@/components/brand"
import type { Project } from "@/lib/projects"

/** Horizontally sliding "pickup" cards with a counter and square arrows. */
export function PickupCarousel({
  title,
  items,
  prevLabel,
  nextLabel,
  basePath,
}: {
  title: string
  items: Project[]
  prevLabel: string
  nextLabel: string
  /** Cards link to `${basePath}/${id}`. */
  basePath: string
}) {
  const [index, setIndex] = useState(0)
  const count = items.length
  const go = (n: number) => setIndex(((n % count) + count) % count)

  const arrow =
    "grid size-11 place-items-center rounded-[3px] bg-brand text-white transition-colors hover:bg-brand-dark"

  return (
    <section
      aria-roledescription="carousel"
      aria-label={title}
      className="overflow-hidden bg-neutral-100 py-14 lg:py-20"
    >
      <div className={container}>
        <div className="flex items-center justify-between gap-6">
          <h2 className="text-[24px] leading-[1.4] font-bold text-neutral-800 sm:text-[26px]">
            {title}
          </h2>
          <div className="flex items-center gap-4">
            <p
              className="font-en text-[17px] font-semibold text-brand"
              aria-live="polite"
            >
              {index + 1}
              <span className="mx-1.5 text-neutral-400">/</span>
              <span className="text-neutral-500">{count}</span>
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label={prevLabel}
                className={arrow}
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label={nextLabel}
                className={arrow}
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Track: card widths are CSS variables so the slide offset can use them.
            The active card is wider (--active) and sits higher; the rest are
            pushed down by --lift. Every card before the active one is a regular
            card, so the offset is simply index × (card + gap). */}
        <div className="mt-10 [--active:300px] [--card:260px] [--gap:20px] [--lift:20px] sm:[--active:420px] sm:[--card:340px] sm:[--lift:40px] lg:[--active:500px] lg:[--card:400px] lg:[--gap:28px] lg:[--lift:64px]">
          <ul
            className="flex items-start gap-(--gap) transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(calc(${-index} * (var(--card) + var(--gap))))`,
            }}
          >
            {items.map((p, i) => {
              const active = i === index
              return (
                <li
                  key={p.id}
                  aria-hidden={!active}
                  className={cn(
                    "shrink-0 transition-[width,margin,opacity] duration-500 ease-out",
                    active ? "w-(--active)" : "mt-(--lift) w-(--card)",
                    i < index && "opacity-40"
                  )}
                >
                  <Link
                    href={`${basePath}/${p.id}`}
                    tabIndex={active ? undefined : -1}
                    className={cn(
                      "group flex h-full flex-col bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition-[padding,box-shadow] duration-500 hover:shadow-lg",
                      active ? "p-4 sm:p-6" : "p-4"
                    )}
                  >
                    <span>
                      <Tag>{p.category}</Tag>
                    </span>
                    <span
                      className={cn(
                        "mt-3 min-h-[3.2em] leading-[1.6] font-bold text-neutral-800 transition-[color,font-size] duration-500 group-hover:text-brand",
                        active
                          ? "text-[18px] sm:text-[22px]"
                          : "text-[17px] lg:text-lg"
                      )}
                    >
                      {p.name}
                    </span>
                    <span className="relative mt-3 block aspect-[16/10] overflow-hidden bg-neutral-100">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(min-width: 1024px) 500px, (min-width: 640px) 420px, 300px"
                        loading={i < 3 ? "eager" : undefined}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
