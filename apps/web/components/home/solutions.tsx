import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@workspace/ui/lib/utils"

import {
  ArrowBox,
  container,
  Eyebrow,
  Lines,
  SectionHeading,
} from "@/components/brand"
import { Reveal } from "@/components/reveal"
import type { Content } from "@/lib/i18n/types"

/** Big consulting banner + service cards. */
export function Solutions({ t }: { t: Content }) {
  const { consulting, services } = t
  return (
    <section id="giai-phap" className="scroll-mt-24 bg-white">
      <Reveal className="px-2.5">
        <div className="relative isolate overflow-hidden rounded-[4px]">
          <Image
            src={consulting.image}
            alt={consulting.imageAlt}
            fill
            sizes="100vw"
            className="-z-10 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-linear-to-r from-brand-deep/90 via-brand-deep/60 to-brand-deep/10" />
          <div className="px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
            <p className="text-base font-bold tracking-wide text-white/90">
              {consulting.label}
            </p>
            <h2 className="mt-5 text-[28px] leading-[1.45] font-bold tracking-wide text-white sm:text-[40px] lg:text-[48px]">
              <Lines lines={consulting.titleLines} />
            </h2>
            <p className="mt-6 max-w-xl text-base leading-[1.9] text-white/90">
              {consulting.description}
            </p>
            <Link
              href="#giai-phap"
              className="group mt-9 inline-flex items-center gap-12 rounded-[3px] bg-brand px-6 py-4 text-base font-bold text-white transition-colors hover:bg-[#17a058]"
            >
              {t.ui.viewDetails}
              <ArrowBox tone="white" />
            </Link>
          </div>
        </div>
      </Reveal>

      <div className={cn(container, "pt-14 pb-10")}>
        <Reveal className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div>
            <Eyebrow>{services.eyebrow}</Eyebrow>
            <h2 className="mt-2 text-[26px] leading-[1.4] font-bold text-brand-dark uppercase sm:text-[32px]">
              {services.title}
            </h2>
          </div>
          <Link
            href="#giai-phap"
            className="group inline-flex items-center gap-2 text-base font-bold text-brand-dark hover:text-brand"
          >
            {services.viewAll}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-3.5">
          {services.items.map((s, i) => {
            const Icon = s.icon
            return (
              <Reveal as="li" key={s.title} delay={i * 70}>
                <Link
                  href="#giai-phap"
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-[0_2px_10px_rgba(15,61,54,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-xl hover:shadow-brand-dark/10"
                >
                  <span className="relative block aspect-[16/7.2] overflow-hidden">
                    <Image
                      src={s.image}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </span>
                  <span className="flex flex-1 gap-3 p-4 pb-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-dark text-white ring-4 ring-brand/10">
                      <Icon className="size-[26px]" strokeWidth={2.2} />
                    </span>
                    <span className="flex flex-1 flex-col pt-1.5">
                      <span className="text-lg leading-snug font-bold text-brand-dark">
                        {s.title}
                      </span>
                      <span className="mt-2.5 text-[14px] leading-[1.75] text-neutral-600">
                        {s.description}
                      </span>
                      <ArrowRight
                        className="mt-auto size-4 self-end text-brand-dark transition-transform group-hover:translate-x-1 group-hover:text-brand"
                        aria-hidden="true"
                      />
                    </span>
                  </span>
                </Link>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/** Building-type tile grid + two support cards + crane banner. */
export function BuildingTypes({ t }: { t: Content }) {
  const { buildingTypes } = t
  return (
    <section id="cong-trinh" className="scroll-mt-24 bg-white pt-8 pb-16">
      <div className={container}>
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading title={buildingTypes.title} sub={buildingTypes.sub} />
          <Link
            href="#cong-trinh"
            className="group flex items-center gap-12 border border-neutral-300 px-5 py-3.5 text-[15px] font-bold text-neutral-800 hover:border-brand"
          >
            {buildingTypes.viewAll}
            <ArrowBox />
          </Link>
        </Reveal>

        <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
          {buildingTypes.items.map((b, i) => (
            <Reveal as="li" key={b.title} delay={(i % 4) * 80}>
              <Link
                href="#cong-trinh"
                className="group relative block aspect-square overflow-hidden rounded-[3px] bg-neutral-200"
              >
                <Image
                  src={b.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-linear-to-t from-black/65 via-black/5 to-transparent" />
                <span className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
                  <span className="text-[15px] leading-snug font-bold text-white sm:text-[17px]">
                    {b.title}
                  </span>
                  <ArrowBox tone="white" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>

        <ul className="mt-12 grid gap-x-8 md:grid-cols-2 lg:px-6">
          {t.support.map(({ title, description, icon: Icon }) => (
            <Reveal as="li" key={title}>
              <Link
                href="#lien-he"
                className="group flex items-center gap-5 border-b border-neutral-300 py-5"
              >
                <span className="grid size-[88px] shrink-0 place-items-center bg-neutral-100 text-brand-dark">
                  <Icon className="size-14" strokeWidth={1.2} />
                </span>
                <span className="flex-1">
                  <span className="block text-xl leading-snug font-bold text-neutral-800 group-hover:text-brand sm:text-[23px]">
                    {title}
                  </span>
                  <span className="mt-1.5 block text-[15px] text-neutral-600">
                    {description}
                  </span>
                </span>
                <ArrowBox />
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>

      <Reveal className="mt-16 px-2.5">
        <div className="relative h-[220px] overflow-hidden rounded-[4px] sm:h-[320px]">
          <Image
            src={t.crane.image}
            alt={t.crane.alt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </Reveal>
    </section>
  )
}
