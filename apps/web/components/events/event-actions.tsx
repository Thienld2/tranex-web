"use client"

import { Check, Link2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { ArrowBox } from "@/components/brand"
import { useEventStatus } from "@/components/events/event-status"
import { PhoneSolidIcon } from "@/components/icons"
import type { Content } from "@/lib/i18n/types"

/** Registration call-to-action; says so instead once the event has ended. */
export function EventCta({
  dates,
  labels,
  contactHref,
  phone,
  phoneHref,
  hours,
}: {
  dates: string[]
  labels: Content["eventDetail"]
  contactHref: string
  phone: string
  phoneHref: string
  hours: string
}) {
  const ended = useEventStatus(dates) === "ended"
  return (
    <div className="grid gap-6 rounded-[8px] bg-brand px-6 py-8 text-white sm:px-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12 lg:py-10">
      <div>
        <p className="text-[22px] leading-snug font-bold sm:text-[24px]">{labels.ctaTitle}</p>
        <p className="mt-3 text-[15px] leading-[1.8] text-white/90">
          {ended ? labels.ctaEnded : labels.ctaText}
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center lg:flex-col lg:items-stretch">
        <Link
          href={contactHref}
          className="group flex items-center justify-between gap-6 rounded-[4px] bg-white px-6 py-4 text-[16px] font-bold text-neutral-800 hover:text-brand"
        >
          {labels.ctaButton}
          <ArrowBox />
        </Link>
        <a href={phoneHref} className="text-center hover:text-brand-lime">
          <span className="flex items-center justify-center gap-2 font-en text-[24px] leading-none font-semibold">
            <PhoneSolidIcon className="size-5" />
            {phone}
          </span>
          <span className="mt-1.5 block text-[12.5px] font-bold text-white/85">{hours}</span>
        </a>
      </div>
    </div>
  )
}

/** Copies the current page URL. */
export function CopyLinkButton({ label, done }: { label: string; done: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href)
          setCopied(true)
          setTimeout(() => setCopied(false), 2500)
        } catch {
          // clipboard unavailable (insecure context): ignore
        }
      }}
      className="flex items-center gap-2 rounded-[4px] border border-neutral-300 px-5 py-3 text-[14px] font-bold text-neutral-700 transition-colors hover:border-brand hover:text-brand"
    >
      {copied ? <Check className="size-4 text-brand" /> : <Link2 className="size-4" />}
      <span aria-live="polite">{copied ? done : label}</span>
    </button>
  )
}
