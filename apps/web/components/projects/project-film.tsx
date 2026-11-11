"use client"

import { ChevronDown } from "lucide-react"
import Image from "next/image"
import { useEffect, useId, useRef, useState } from "react"

import { cn } from "@workspace/ui/lib/utils"

import { FloorPlan } from "@/components/projects/floor-plan"
import type { Plan } from "@/lib/floor-plan"
import type { Content, Locale } from "@/lib/i18n/types"

type Scene = {
  label: string
  before: string
  accent: string
  after: string
  description: string
}

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))

/** Cross-fade length between scenes, in scene units. */
const FADE = 0.35

/**
 * Full-bleed, scroll-scrubbed "film" of a project, in the spirit of
 * cinematic architecture sites: intro → concept wireframe → construction →
 * finishes → finished home at dusk → camera pushes inside.
 * Every shot drifts slowly (a dolly feel) and scenes dissolve into each other.
 */
export function ProjectFilm({
  locale,
  title,
  tagline,
  meta,
  image,
  siteImage,
  interiorImage,
  scenes,
  plan,
  planLabels,
  labels,
  skipTo,
}: {
  locale: Locale
  title: string
  tagline: string
  meta: string
  image: string
  siteImage: string
  interiorImage: string
  scenes: Scene[]
  /** Generated site plan shown in the concept scene. */
  plan: Plan
  planLabels: Content["projectDetail"]["plan"]
  labels: { simTitle: string; scrollHint: string; skip: string }
  skipTo: string
}) {
  const total = scenes.length + 1 // intro + scenes
  const sectionRef = useRef<HTMLElement>(null)
  const [p, setP] = useState(0)
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "")

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = sectionRef.current
      if (!el) return
      const run = el.offsetHeight - window.innerHeight
      setP(run > 0 ? clamp(-el.getBoundingClientRect().top / run) : 0)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  // s runs 0 → total-1 (+ a short hold at the end)
  const s = p * (total - 0.6)
  const fadeIn = (k: number) => (k === 0 ? 1 : clamp((s - (k - FADE)) / FADE))
  const drift = (k: number) => clamp((s - (k - FADE)) / (1 + FADE))
  const current = Math.min(total - 1, Math.floor(s + FADE / 2))

  // Scene-specific motion
  const planDraw = clamp((s - 0.68) / 0.45) // line work traces in
  const planFill = clamp((s - 0.98) / 0.3) // colours flood in
  const planToWire = clamp((s - 1.3) / 0.32) // plan dissolves into 3D wireframe
  const finishColour = clamp((s - 3.05) / 0.7) // rough → coloured
  const pushIn = clamp((s - (total - 1 - FADE - 0.25)) / (FADE + 0.25)) // dolly into the house
  const interiorIn = fadeIn(5)

  const jumpTo = (k: number) => {
    const el = sectionRef.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const run = el.offsetHeight - window.innerHeight
    const target = k === 0 ? 0 : clamp((k + 0.15) / (total - 0.6))
    window.scrollTo({ top: top + run * target, behavior: "smooth" })
  }

  const shot = (
    src: string,
    k: number,
    style?: React.CSSProperties,
    extraScale = 0
  ) => (
    <Image
      src={src}
      alt=""
      fill
      loading="eager"
      sizes="100vw"
      className="object-cover will-change-transform"
      style={{
        transform: `scale(${1.04 + drift(k) * 0.1 + extraScale})`,
        ...style,
      }}
    />
  )

  const scriptAccent = locale !== "ja"

  return (
    <section
      ref={sectionRef}
      aria-label={labels.simTitle}
      className="relative bg-neutral-950"
      style={{ height: `${total * 85 + 100}svh` }}
    >
      {/* White wireframe lines extracted from the photo (concept scene) */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <filter id={`${uid}-lines`} colorInterpolationFilters="sRGB">
            <feColorMatrix type="saturate" values="0" />
            <feGaussianBlur stdDeviation="0.8" />
            <feConvolveMatrix order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true" />
            <feComponentTransfer>
              <feFuncR type="linear" slope="7" />
              <feFuncG type="linear" slope="7" />
              <feFuncB type="linear" slope="7" />
            </feComponentTransfer>
          </filter>
          <pattern id={`${uid}-scaffold`} width="64" height="52" patternUnits="userSpaceOnUse">
            <path d="M0 .5H64M.5 0V52M0 52 64 0" stroke="#2f2f2f" strokeWidth="1.4" fill="none" />
          </pattern>
        </defs>
      </svg>

      <div className="sticky top-[76px] h-[calc(100svh-76px)] overflow-hidden xl:top-[96px] xl:h-[calc(100svh-96px)]">
        {/* 0 · Intro — morning haze over the finished house */}
        <div className="absolute inset-0">
          {shot(image, 0, { filter: "saturate(0.85) brightness(1.04)" }, 0.08)}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.55),transparent_60%),radial-gradient(ellipse_at_80%_70%,rgba(255,255,255,0.35),transparent_55%)]" />
        </div>

        {/* 1 · Concept — site plan draws itself, then becomes a white
               wireframe over a muted landscape */}
        <div className="absolute inset-0" style={{ opacity: fadeIn(1) }}>
          {shot(image, 1, { filter: "grayscale(0.55) brightness(0.62) contrast(0.95) sepia(0.15)" })}
          {shot(image, 1, { filter: `url(#${uid}-lines)`, mixBlendMode: "screen", opacity: 0.95 })}
          <div
            className="absolute inset-0 will-change-transform"
            style={{
              opacity: 1 - planToWire,
              transform: `scale(${1.0 + drift(1) * 0.06})`,
            }}
          >
            <FloorPlan
              plan={plan}
              labels={planLabels}
              projectName={title}
              draw={planDraw}
              fill={planFill}
            />
          </div>
        </div>

        {/* 2 · Construction — the site at dusk */}
        <div className="absolute inset-0" style={{ opacity: fadeIn(2) }}>
          {shot(siteImage, 2, { filter: "brightness(0.86) contrast(1.06) saturate(1.15) sepia(0.22)" })}
          <div className="absolute inset-0 bg-linear-to-b from-[#1c2a48]/45 via-transparent to-amber-900/25" />
        </div>

        {/* 3 · Finishes — rough shell with scaffolding, colour coming in */}
        <div className="absolute inset-0" style={{ opacity: fadeIn(3) }}>
          {shot(image, 3, { filter: "grayscale(0.9) contrast(1.05) brightness(1.04) sepia(0.12)" })}
          <svg
            aria-hidden="true"
            className="absolute inset-0 h-full w-full mix-blend-multiply"
            style={{
              opacity: (1 - finishColour) * 0.7,
              maskImage: "linear-gradient(to top, black 55%, transparent 92%)",
            }}
          >
            <rect width="100%" height="100%" fill={`url(#${uid}-scaffold)`} />
          </svg>
          <div className="absolute inset-0" style={{ opacity: finishColour }}>
            {shot(image, 3)}
          </div>
        </div>

        {/* 4 · Home — lights on at dusk, then the camera pushes in */}
        <div
          className="absolute inset-0"
          style={{ opacity: fadeIn(4) * (1 - interiorIn * 0.999) }}
        >
          {shot(image, 4, { filter: "brightness(0.9) saturate(1.15) contrast(1.04)" }, pushIn * 0.55)}
          <div className="absolute inset-0 bg-linear-to-b from-[#16233d]/50 via-transparent to-amber-600/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(255,196,110,0.28),transparent_60%)]" />
        </div>

        {/* 5 · Interior — stepping inside */}
        <div className="absolute inset-0" style={{ opacity: interiorIn }}>
          <Image
            src={interiorImage}
            alt=""
            fill
            loading="eager"
            sizes="100vw"
            className="object-cover will-change-transform"
            style={{
              transform: `scale(${1.28 - interiorIn * 0.24 + clamp(s - 5) * 0.06})`,
              filter: "saturate(1.05) brightness(1.02)",
            }}
          />
        </div>

        {/* Legibility gradient for captions */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-black/10" />

        {/* Hotspot (scene label) */}
        {current > 0 && (
          <div
            key={`h${current}`}
            className="pointer-events-none absolute top-[42%] left-1/2 hidden -translate-x-1/2 animate-in items-center gap-2 duration-700 fade-in md:flex"
            aria-hidden="true"
          >
            <span className="grid size-7 place-items-center rounded-full border border-white/80 bg-white/15 text-sm text-white backdrop-blur">
              +
            </span>
            <span className="rounded-full bg-black/35 px-3 py-1 text-[12px] font-bold tracking-wide text-white backdrop-blur">
              {scenes[current - 1]!.label}
            </span>
          </div>
        )}

        {/* Captions */}
        <div className="absolute inset-x-0 bottom-0 px-5 pb-28 sm:px-10 md:pb-14 lg:px-16">
          {current === 0 ? (
            <div key="intro" className="max-w-3xl animate-in text-white duration-700 fade-in slide-in-from-bottom-3">
              <p className="text-[12px] font-bold tracking-[0.25em] text-white/85 uppercase">
                {tagline}
              </p>
              <h1 className="mt-3 font-serif text-[40px] leading-[1.05] font-semibold sm:text-6xl lg:text-[76px]">
                {title}
              </h1>
              <p className="mt-4 text-[14px] text-white/80 sm:text-[15px]">{meta}</p>
            </div>
          ) : (
            <div
              key={`c${current}`}
              className="max-w-3xl animate-in text-white duration-700 fade-in slide-in-from-bottom-3"
            >
              <p className="flex flex-wrap items-baseline gap-x-3 leading-none">
                {scenes[current - 1]!.before && (
                  <span className="font-serif text-[34px] font-semibold sm:text-5xl lg:text-[60px]">
                    {scenes[current - 1]!.before}
                  </span>
                )}
                <span
                  className={cn(
                    scriptAccent
                      ? "font-script text-[60px] sm:text-[84px] lg:text-[110px]"
                      : "font-serif text-[46px] font-bold sm:text-6xl lg:text-[76px]",
                    "text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)]"
                  )}
                >
                  {scenes[current - 1]!.accent}
                </span>
                {scenes[current - 1]!.after && (
                  <span className="font-serif text-[34px] font-semibold sm:text-5xl lg:text-[60px]">
                    {scenes[current - 1]!.after}
                  </span>
                )}
              </p>
              <p className="mt-5 max-w-md text-[14px] leading-[1.8] text-white/85 sm:text-[15px]">
                {scenes[current - 1]!.description}
              </p>
            </div>
          )}
        </div>

        {/* Progress rail */}
        <nav
          aria-label={labels.simTitle}
          className="absolute top-1/2 right-4 flex -translate-y-1/2 flex-col items-end gap-3 md:right-[92px]"
        >
          {Array.from({ length: total }, (_, k) => {
            const label = k === 0 ? title : scenes[k - 1]!.label
            return (
              <button
                key={k}
                type="button"
                onClick={() => jumpTo(k)}
                aria-label={label}
                aria-current={k === current ? "step" : undefined}
                className="group flex items-center gap-2"
              >
                <span className="pointer-events-none hidden text-[11px] font-bold whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100 md:inline">
                  {label}
                </span>
                <span
                  className={cn(
                    "block rounded-full transition-all",
                    k === current
                      ? "h-6 w-1.5 bg-brand-lime"
                      : k < current
                        ? "size-1.5 bg-white"
                        : "size-1.5 bg-white/40"
                  )}
                />
              </button>
            )
          })}
        </nav>

        {/* Scroll hint + skip */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-[64px] flex flex-col items-center gap-1 text-[12px] font-bold text-white transition-opacity duration-500 md:bottom-4"
          style={{ opacity: p < 0.02 ? 1 : 0 }}
          aria-hidden="true"
        >
          {labels.scrollHint}
          <ChevronDown className="size-5 animate-bounce" />
        </div>
        <a
          href={skipTo}
          className="absolute right-4 bottom-[64px] border-b border-white/50 pb-0.5 text-[12px] font-bold text-white/80 hover:border-brand-lime hover:text-brand-lime md:right-[92px] md:bottom-6"
        >
          {labels.skip} ↓
        </a>
      </div>
    </section>
  )
}
