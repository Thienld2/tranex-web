import Image from "next/image"
import Link from "next/link"

import { cn } from "@workspace/ui/lib/utils"

import { ArrowBox, container, Lines } from "@/components/brand"
import { PhoneSolidIcon } from "@/components/icons"
import { Reveal } from "@/components/reveal"
import type { Content } from "@/lib/i18n/types"

function FreeBadge({ label }: { label: string }) {
  return (
    <span className="rounded-[2px] bg-brand-deep px-1.5 py-0.5 text-[13px] leading-tight font-bold text-white">
      {label}
    </span>
  )
}

export function ContactCta({ t }: { t: Content }) {
  const { company, ui, contactCta } = t
  return (
    <section id="lien-he" className="scroll-mt-24 bg-white pb-16">
      <div className={container}>
        <Reveal className="relative overflow-hidden rounded-[4px] bg-brand-dark px-6 py-10 sm:px-10 lg:flex lg:items-center lg:justify-between lg:py-12">
          <div>
            <p className="text-xl leading-[1.6] font-bold text-white sm:text-[25px]">
              <Lines lines={contactCta.lines} />
            </p>
            <Link
              href={`/${t.locale}/lien-he#form-profile`}
              className="group mt-7 inline-flex items-center gap-3 rounded-[2px] bg-white px-4 py-3.5 sm:gap-16"
            >
              <span className="flex items-center gap-2.5 text-base font-bold text-brand-dark">
                <FreeBadge label={ui.free} />
                {ui.requestProfile}
              </span>
              <ArrowBox />
            </Link>
            <p className="mt-3 text-[14px] text-white/75">{contactCta.note}</p>
          </div>

          <div className="mt-10 hidden gap-5 sm:flex lg:mt-0 lg:mr-6">
            {contactCta.brochures.map((b, i) => (
              <div
                key={b.title}
                className={cn(
                  "relative h-56 w-40 overflow-hidden rounded-[2px] shadow-2xl ring-1 ring-white/10",
                  i === 1 && "lg:translate-y-3"
                )}
              >
                <Image src={b.image} alt="" fill sizes="144px" className="object-cover" />
                <div className="absolute inset-0 bg-linear-to-b from-brand-deep/85 via-brand-deep/30 to-brand-deep/70" />
                <div className="absolute inset-x-3 top-3 text-white">
                  <p className="text-[8px] tracking-[0.2em] uppercase opacity-80">
                    {b.label}
                  </p>
                  <p className="mt-1 text-sm font-bold">{b.title}</p>
                </div>
                <p className="absolute bottom-2.5 left-3 text-[9px] font-bold tracking-widest text-white">
                  TRANEX
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Reveal>
            <a
              href={company.phoneHref}
              className="flex h-full flex-wrap items-center justify-center gap-x-5 gap-y-1 border border-neutral-300 px-6 py-7 hover:border-brand"
            >
              <span className="flex items-center gap-3 font-en text-[28px] font-semibold text-neutral-800 sm:text-[36px]">
                <PhoneSolidIcon className="size-8 text-brand-dark" />
                {company.phone}
              </span>
              <span className="text-[13px] text-neutral-500">{company.hours}</span>
            </a>
          </Reveal>
          <Reveal delay={80}>
            <Link
              href={`/${t.locale}/lien-he#form-consult`}
              className="group flex h-full items-center justify-center gap-6 border border-neutral-300 px-6 py-7 hover:border-brand sm:gap-28"
            >
              <span className="flex items-center gap-2.5 text-[22px] font-bold text-neutral-800 sm:text-[29px]">
                <FreeBadge label={ui.free} />
                {ui.contactConsult}
              </span>
              <ArrowBox />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
