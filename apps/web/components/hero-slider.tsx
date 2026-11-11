"use client"

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

import { cn } from "@workspace/ui/lib/utils"

import { container } from "@/components/brand"
import { heroSlides } from "@/lib/site-data"

const AUTOPLAY_MS = 6500

export function HeroSlider() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = heroSlides.length

  const go = (n: number) => setIndex(((n % count) + count) % count)

  // Re-armed on every slide change, so manual navigation restarts the timer.
  useEffect(() => {
    if (paused) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const t = setTimeout(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS)
    return () => clearTimeout(t)
  }, [index, paused, count])

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Giới thiệu TRANEX"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative isolate h-[600px] overflow-hidden bg-brand-deep sm:h-[520px] lg:h-[440px]"
    >
      {heroSlides.map((slide, i) => {
        const active = i === index
        const Heading = i === 0 ? "h1" : "h2"
        return (
          <div
            key={slide.titleTop}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${count}`}
            aria-hidden={!active}
            inert={!active}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              active ? "z-10 opacity-100" : "z-0 opacity-0"
            )}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              sizes="100vw"
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
              className={cn(
                "object-cover transition-transform duration-[7000ms] ease-out",
                active ? "scale-100" : "scale-110"
              )}
            />
            {/* Readability overlays */}
            <div className="absolute inset-0 bg-linear-to-r from-brand-deep/95 via-brand-deep/60 to-brand-deep/0 lg:via-brand-deep/45" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-brand-deep/60 to-transparent" />

            <div
              className={cn(
                container,
                "relative flex h-full flex-col justify-center pb-16 sm:pb-10"
              )}
            >
              <div
                className={cn(
                  "max-w-xl transition-all delay-200 duration-700",
                  active
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                )}
              >
                <p className="text-sm font-medium tracking-[0.08em] text-white/90 uppercase sm:text-base">
                  {slide.eyebrow}
                </p>
                <Heading className="mt-3 text-[29px] leading-[1.15] font-extrabold tracking-tight uppercase sm:text-[40px] lg:text-[42px]">
                  <span className="block text-white">{slide.titleTop}</span>
                  <span className="block text-brand-lime">
                    {slide.titleBottom}
                  </span>
                </Heading>
                <p className="mt-5 max-w-[34rem] text-[14.5px] leading-relaxed text-white/90">
                  {slide.description}
                </p>
                <Link
                  href={slide.cta.href}
                  className="group mt-7 inline-flex items-center gap-2.5 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition-colors hover:bg-[#17a058]"
                >
                  {slide.cta.label}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        )
      })}

      {/* Tagline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[6%] bottom-[24%] z-20 hidden -rotate-[11deg] text-white md:block"
      >
        <p className="font-script text-4xl leading-none drop-shadow-md lg:text-[44px]">
          Build Today
        </p>
        <p className="mt-1 ml-6 font-script text-2xl leading-none drop-shadow-md lg:text-[28px]">
          for a Sustainable Tomorrow
        </p>
        <svg
          viewBox="0 0 300 24"
          className="mt-1 ml-4 h-5 w-[300px] text-brand-lime"
          fill="none"
        >
          <path
            d="M4 20C90 6 190 2 296 6"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Controls */}
      <div
        className={cn(
          container,
          "absolute inset-x-0 bottom-6 z-20 flex items-center justify-end gap-5"
        )}
      >
        <div className="flex items-center gap-2">
          {heroSlides.map((s, i) => (
            <button
              key={s.titleTop}
              type="button"
              onClick={() => go(i)}
              aria-label={`Chuyển đến slide ${i + 1}`}
              aria-current={i === index}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index
                  ? "w-7 bg-brand-lime"
                  : "w-1.5 bg-white/60 hover:bg-white"
              )}
            />
          ))}
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Slide trước"
            className="grid size-9 place-items-center rounded-full border border-white/60 text-white transition-colors hover:bg-white hover:text-brand-dark"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Slide tiếp theo"
            className="grid size-9 place-items-center rounded-full border border-white/60 text-white transition-colors hover:bg-white hover:text-brand-dark"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
