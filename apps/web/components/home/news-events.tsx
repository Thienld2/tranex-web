import Image from "next/image"
import Link from "next/link"

import { cn } from "@workspace/ui/lib/utils"

import { ArrowBox, container, SectionHeading, Tag } from "@/components/brand"
import { Reveal } from "@/components/reveal"
import type { Content } from "@/lib/i18n/types"

function MoreLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2.5 text-[15px] font-bold text-neutral-700 hover:text-brand"
    >
      {label}
      <ArrowBox />
    </Link>
  )
}

export function NewsEvents({ t }: { t: Content }) {
  return (
    <section id="tin-tuc" className="scroll-mt-24 bg-white py-16 lg:py-20">
      <div className={cn(container, "grid gap-14 lg:grid-cols-2 lg:gap-16")}>
        <Reveal>
          <div className="flex items-end justify-between">
            <SectionHeading title={t.news.title} />
            <MoreLink href="#tin-tuc" label={t.ui.viewAll} />
          </div>
          <ul className="mt-8">
            {t.news.items.map((item) => (
              <li key={item.title}>
                <Link
                  href="#tin-tuc"
                  className="group block border-b border-neutral-300 py-5"
                >
                  <span className="flex items-center gap-3 text-[13px] text-neutral-500">
                    <time className="font-en font-semibold" dateTime={item.date.replaceAll(".", "-")}>
                      {item.date}
                    </time>
                    <span className="rounded-[2px] border border-neutral-400 px-2 py-0.5 text-[12.5px] leading-tight text-neutral-600">
                      {item.tag}
                    </span>
                  </span>
                  <span className="mt-2.5 flex items-center justify-between gap-4">
                    <span className="text-base font-bold text-neutral-800 transition-colors group-hover:text-brand">
                      {item.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-brand transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <div className="flex items-end justify-between">
            <SectionHeading title={t.events.title} />
            <MoreLink href="#tin-tuc" label={t.ui.viewAll} />
          </div>
          <p className="mt-8 flex items-center gap-2 font-en text-base font-semibold tracking-wider text-neutral-700">
            <span className="size-2 bg-brand" aria-hidden="true" />
            PICKUP
          </p>
          <ul className="mt-4 grid gap-6 sm:grid-cols-2">
            {t.events.items.map((ev) => (
              <li key={ev.title}>
                <Link href="#tin-tuc" className="group block">
                  <span className="relative block aspect-[16/10] overflow-hidden bg-neutral-100">
                    <Image
                      src={ev.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </span>
                  <span className="mt-3 flex gap-1.5">
                    {ev.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </span>
                  <span className="mt-2 block text-[13px] text-neutral-500">
                    {ev.date}
                  </span>
                  <span className="mt-1 block text-base leading-snug font-bold text-neutral-800 group-hover:text-brand">
                    {ev.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
