"use client"

import { X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

import { cn } from "@workspace/ui/lib/utils"

import { ArrowBox, Lines, Tag } from "@/components/brand"
import type { Content } from "@/lib/i18n/types"

const INTERVAL = 7000

export function Hero({
  hero,
  closeLabel,
}: {
  hero: Content["hero"]
  closeLabel: string
}) {
  const heroImages = hero.images
  const heroNotice = hero.notice
  const [index, setIndex] = useState(0)
  const [noticeOpen, setNoticeOpen] = useState(true)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const t = setInterval(
      () => setIndex((i) => (i + 1) % heroImages.length),
      INTERVAL
    )
    return () => clearInterval(t)
  }, [heroImages.length])

  return (
    <section
      aria-label={hero.ariaLabel}
      className="relative isolate h-svh min-h-[560px] overflow-hidden bg-brand-deep"
    >
      {heroImages.map((img, i) => (
        <div
          key={img.src}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 transition-opacity duration-[1500ms]",
            i === index ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="100vw"
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            className={cn(
              "object-cover transition-transform ease-linear",
              i === index
                ? "scale-110 duration-[8000ms]"
                : "scale-100 delay-[1500ms] duration-0"
            )}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-linear-to-t from-brand-deep/80 via-brand-deep/20 to-black/30" />

      {/* Catch copy */}
      <div className="absolute inset-x-0 bottom-[14%] px-6 sm:px-10 md:bottom-[max(28vh,17.5rem)] lg:px-16">
        <p className="font-en text-[13px] font-semibold tracking-[0.3em] text-brand-lime uppercase">
          {hero.eyebrow}
        </p>
        <h1 className="mt-4 text-[34px] leading-[1.35] font-bold tracking-wide text-white sm:text-5xl lg:text-[60px]">
          <Lines lines={hero.titleLines} />
        </h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-[1.9] text-white/90 sm:text-[17px]">
          {hero.description}
        </p>
      </div>

      {/* Slide indicator + scroll cue */}
      <div className="absolute right-6 bottom-8 flex items-center gap-6 text-white sm:right-10 lg:right-24">
        <div className="flex items-center gap-2" aria-hidden="true">
          {heroImages.map((img, i) => (
            <span
              key={img.src}
              className={cn(
                "h-0.5 rounded-full transition-all duration-500",
                i === index ? "w-10 bg-white" : "w-4 bg-white/40"
              )}
            />
          ))}
        </div>
        <span className="hidden items-center gap-3 font-en text-[12px] font-semibold tracking-[0.3em] sm:flex">
          SCROLL
          <span className="relative h-10 w-px overflow-hidden bg-white/30">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_2s_ease-in-out_infinite] bg-white" />
          </span>
        </span>
      </div>

      {/* Floating notice card */}
      {noticeOpen && (
        <div className="absolute bottom-8 left-6 hidden w-52 bg-white p-1.5 shadow-xl md:block lg:left-8">
          <button
            type="button"
            onClick={() => setNoticeOpen(false)}
            aria-label={closeLabel}
            className="absolute -top-3 -right-3 z-10 grid size-6 place-items-center rounded-full bg-brand-deep text-white"
          >
            <X className="size-3.5" />
          </button>
          <Link href={heroNotice.href} className="group block">
            <span className="relative block aspect-[16/9] overflow-hidden">
              <Image
                src={heroNotice.image}
                alt=""
                fill
                sizes="208px"
                className="object-cover"
              />
            </span>
            <span className="mt-2 block px-1">
              <Tag>{heroNotice.tag}</Tag>
            </span>
            <span className="mt-1.5 flex items-end justify-between gap-2 px-1 pb-1">
              <span className="text-[14px] leading-snug font-bold text-neutral-800">
                {heroNotice.title}
              </span>
              <ArrowBox />
            </span>
          </Link>
        </div>
      )}
    </section>
  )
}
