import Image from "next/image"
import Link from "next/link"

import { cn } from "@workspace/ui/lib/utils"

import { ArrowBox, container, Lines, SectionHeading } from "@/components/brand"
import { Reveal } from "@/components/reveal"
import type { Content } from "@/lib/i18n/types"

export function Company({ t }: { t: Content }) {
  const { about } = t
  return (
    <section id="cong-ty" className="scroll-mt-24">
      {/* Statement band */}
      <div className="relative isolate overflow-hidden bg-brand">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -bottom-16 -z-10 text-[22vw] leading-none font-extrabold tracking-tighter text-white/[0.06] select-none lg:text-[260px]"
        >
          TRANEX
        </span>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.12),transparent_45%)]"
        />
        <Reveal className={cn(container, "py-16 text-white lg:py-24")}>
          <p className="text-base font-bold tracking-wide text-white/90">
            {about.label}
          </p>
          <h2 className="mt-5 text-[28px] leading-[1.45] font-bold tracking-wide sm:text-[40px] lg:text-[48px]">
            <Lines lines={about.titleLines} />
          </h2>
          <div className="mt-8 max-w-2xl space-y-4 text-base leading-[1.9] tracking-[0.03em] text-white/90">
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <Link
            href="#cong-ty"
            className="group mt-10 inline-flex items-center gap-12 rounded-[3px] bg-brand-deep px-6 py-4 text-base font-bold transition-colors hover:bg-black"
          >
            {t.ui.viewDetails}
            <ArrowBox tone="white" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

/** Company cards (Về TRANEX, numbers, history) + company link grid. */
export function CompanyLinks({ t }: { t: Content }) {
  const { about } = t
  return (
    <section aria-label={about.label} className="bg-white">
      {/* Cards + link grid */}
      <div className={cn(container, "pt-0 pb-12 lg:pb-16")}>
        <ul className="grid gap-4 md:grid-cols-3">
          {about.cards.map((card, i) => (
            <Reveal as="li" key={card.title} delay={i * 80}>
              <Link
                href="#cong-ty"
                className="group relative block aspect-[16/7] overflow-hidden rounded-[3px] bg-brand-lime/40"
              >
                {card.image ? (
                  <Image
                    src={card.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-around bg-linear-to-br from-brand-lime/50 to-brand/40 text-6xl font-extrabold text-white/70"
                  >
                    <span>15+</span>
                    <span className="text-5xl">200</span>
                  </span>
                )}
                <span className="absolute inset-0 bg-linear-to-t from-black/55 to-transparent" />
                <span className="absolute inset-x-3 bottom-3 flex items-end justify-between">
                  <span className="text-lg font-bold text-white sm:text-xl">
                    {card.title}
                  </span>
                  <ArrowBox tone="white" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>

        <ul className="mt-8 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {about.links.map((l) => (
            <li key={l.label}>
              <Link
                href={l.href}
                className="group flex items-center justify-between border-b border-neutral-300 py-4 text-[15px] font-bold text-neutral-800 hover:text-brand"
              >
                {l.label}
                <span
                  aria-hidden="true"
                  className="text-brand transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const toneCls = {
  brand: "from-brand/95 via-brand/70 to-transparent",
  dark: "from-brand-deep/95 via-brand-deep/70 to-transparent",
  light: "from-white/95 via-white/75 to-transparent",
}

export function Pickup({ t }: { t: Content }) {
  return (
    <section id="noi-bat" className="scroll-mt-24 border-t bg-white py-14">
      <div className={container}>
        <SectionHeading title={t.pickup.title} />
        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {t.pickup.items.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 80}>
              <Link
                href="#noi-bat"
                className="group relative block aspect-[16/6.5] overflow-hidden rounded-[3px] border border-neutral-200"
              >
                <Image
                  src={p.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span
                  className={cn("absolute inset-0 bg-linear-to-r", toneCls[p.tone])}
                />
                <span
                  className={cn(
                    "absolute inset-y-0 left-0 flex w-2/3 flex-col justify-center gap-1 px-5",
                    p.tone === "light" ? "text-brand-dark" : "text-white"
                  )}
                >
                  <span className="font-en text-[12px] font-semibold tracking-[0.2em] uppercase opacity-80">
                    {p.eyebrow}
                  </span>
                  <span className="text-lg leading-snug font-bold">
                    {p.title}
                  </span>
                </span>
                <ArrowBox
                  tone={p.tone === "light" ? "brand" : "white"}
                  className="absolute right-3 bottom-3"
                />
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
