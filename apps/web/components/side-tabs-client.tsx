"use client"

import { ArrowRight, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import { cn } from "@workspace/ui/lib/utils"

import { ArrowBox } from "@/components/brand"
import {
  BookIcon,
  BuildingsIcon,
  EventIcon,
  MailIcon,
  PhoneSolidIcon,
} from "@/components/icons"

export type SideTabsProps = {
  locale: string
  tabLabels: [string, string, string]
  company: { phone: string; phoneHref: string; hours: string; email: string }
  ui: {
    quickLinks: string
    callNow: string
    contactConsult: string
    requestProfile: string
    requestProfileSubject: string
    contactPanelTitle: string
    close: string
  }
}

/**
 * Fixed vertical CTA tabs (desktop) + bottom action bar (mobile).
 * The first tab opens a slide-out contact panel instead of navigating.
 */
export function SideTabsClient({ locale, tabLabels, company, ui }: SideTabsProps) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const openerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus()
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    const onDown = (e: PointerEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("pointerdown", onDown)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("pointerdown", onDown)
    }
  }, [open])

  const close = () => {
    setOpen(false)
    openerRef.current?.focus()
  }

  const tab =
    "group flex w-[64px] flex-col items-center gap-3 rounded-l-lg pt-5 pb-6 text-white shadow-lg transition-all hover:w-[70px]"
  const tabText = "text-[14px] font-bold tracking-[0.08em] [writing-mode:vertical-rl]"

  return (
    <>
      {/* Vertical tabs */}
      <nav
        aria-label={ui.quickLinks}
        className={cn(
          "fixed top-1/2 right-0 z-30 hidden -translate-y-1/2 flex-col gap-0.5 transition-opacity duration-300 md:flex",
          open && "pointer-events-none opacity-0"
        )}
      >
        <button
          ref={openerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="contact-panel"
          className={cn(tab, "bg-neutral-700/90 hover:bg-neutral-800")}
        >
          <BookIcon className="size-[26px] opacity-90" strokeWidth={1.6} />
          <span className={tabText}>{tabLabels[0]}</span>
        </button>
        <Link href={`/${locale}#tin-tuc`} className={cn(tab, "bg-brand hover:bg-[#17a058]")}>
          <EventIcon className="size-[26px] opacity-90" strokeWidth={1.6} />
          <span className={tabText}>{tabLabels[1]}</span>
        </Link>
        <Link href={`/${locale}/du-an`} className={cn(tab, "bg-brand hover:bg-[#17a058]")}>
          <BuildingsIcon className="size-[26px] opacity-90" strokeWidth={1.6} />
          <span className={tabText}>{tabLabels[2]}</span>
        </Link>
      </nav>

      {/* Slide-out contact panel */}
      <div
        ref={panelRef}
        id="contact-panel"
        role="dialog"
        aria-label={ui.contactPanelTitle}
        aria-hidden={!open}
        inert={!open}
        className={cn(
          "fixed top-1/2 right-0 z-40 hidden -translate-y-1/2 items-stretch transition-transform duration-500 ease-out md:flex",
          open ? "translate-x-0" : "translate-x-[calc(100%+24px)]"
        )}
      >
        {/* Close tab */}
        <div className="flex w-[64px] flex-col items-center self-start rounded-l-lg bg-neutral-700 text-white shadow-lg">
          <button
            type="button"
            onClick={close}
            className="flex w-full flex-col items-center gap-3 pt-5 pb-5 hover:text-brand-lime"
          >
            <X className="size-7" strokeWidth={1.4} aria-hidden="true" />
            <span className="text-[15px] font-bold tracking-[0.1em] [writing-mode:vertical-rl]">
              {ui.close}
            </span>
          </button>
          <span className="h-px w-9 bg-white/30" aria-hidden="true" />
          <button
            type="button"
            onClick={close}
            aria-label={ui.close}
            className="grid w-full place-items-center py-4 hover:text-brand-lime"
          >
            <ArrowRight className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* Panel body */}
        <div className="w-[400px] bg-brand px-7 pt-7 pb-6 text-white shadow-2xl">
          <p className="text-[18px] leading-snug font-bold">{ui.contactPanelTitle}</p>
          <div className="mt-5 space-y-3">
            <a
              href={`/${locale}/lien-he#form-profile`}
              className="group flex items-center gap-3 rounded-[3px] bg-white px-5 py-4 text-[16px] font-bold text-neutral-800 hover:text-brand"
            >
              <BookIcon className="size-7 text-brand-dark" strokeWidth={1.6} />
              <span className="flex-1">{ui.requestProfile}</span>
              <ArrowBox className="size-7" />
            </a>
            <Link
              href={`/${locale}/lien-he#form-consult`}
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 rounded-[3px] bg-white px-5 py-4 text-[16px] font-bold text-neutral-800 hover:text-brand"
            >
              <MailIcon className="size-7 text-brand-dark" strokeWidth={1.6} />
              <span className="flex-1">{ui.contactConsult}</span>
              <ArrowBox className="size-7" />
            </Link>
          </div>
          <a
            href={company.phoneHref}
            className="mt-5 block text-center hover:text-brand-lime"
          >
            <span className="flex items-center justify-center gap-3 font-en text-[30px] leading-none font-semibold">
              <PhoneSolidIcon className="size-7" />
              {company.phone}
            </span>
            <span className="mt-2 block text-[13px] font-bold text-white/85">
              {company.hours}
            </span>
          </a>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 shadow-[0_-4px_16px_rgba(0,0,0,0.12)] md:hidden">
        <a
          href={company.phoneHref}
          className="flex items-center justify-center gap-2 bg-white py-3.5 text-[15px] font-bold text-brand-dark"
        >
          <PhoneSolidIcon className="size-4" /> {ui.callNow}
        </a>
        <Link
          href={`/${locale}/lien-he#form-consult`}
          className="flex items-center justify-center gap-2 bg-brand py-3.5 text-[15px] font-bold text-white"
        >
          <MailIcon className="size-5" strokeWidth={2.2} /> {ui.contactConsult}
        </Link>
      </div>
    </>
  )
}
