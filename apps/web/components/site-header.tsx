"use client"

import { ArrowRight, ChevronDown, ExternalLink, House } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import { cn } from "@workspace/ui/lib/utils"

import { ArrowBox, FlagJP, FlagVN, Logo } from "@/components/brand"
import { BookIcon, MailIcon, PhoneSolidIcon } from "@/components/icons"
import type { Content, Locale, NavItem } from "@/lib/i18n/types"

type Props = {
  locale: Locale
  nav: NavItem[]
  company: Content["company"]
  ui: Content["ui"]
  /** href of the nav item for the current page (shown as active). */
  activeHref: string
  /** Pages without a full-bleed hero use the white header from the start. */
  solid?: boolean
}

export function SiteHeader({
  locale,
  nav,
  company,
  ui,
  activeHref,
  solid = false,
}: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  /** Index of the nav item whose mega menu is open, or null. */
  const [mega, setMega] = useState<number | null>(null)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : ""
  }, [menuOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      setMenuOpen(false)
      setMega(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Transparent with white text over the hero; frosted white once scrolled
  // or while a mega menu is open. The full-screen menu keeps it on dark.
  const onDark = menuOpen || (!solid && !scrolled && mega === null)
  const openItem = mega !== null ? nav[mega] : undefined

  return (
    <>
      <header
        ref={headerRef}
        onMouseLeave={() => setMega(null)}
        onBlur={(e) => {
          if (!headerRef.current?.contains(e.relatedTarget as Node)) setMega(null)
        }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          onDark
            ? "bg-linear-to-b from-black/45 to-transparent text-white"
            : "bg-white/90 text-neutral-800 shadow-[0_1px_0_rgba(0,0,0,0.06)] backdrop-blur-xl"
        )}
      >
        <div className="flex h-[76px] items-center gap-4 px-4 sm:px-6 xl:h-[96px] xl:px-6 min-[1440px]:gap-6 min-[1440px]:px-8">
          {/* Logo + tagline */}
          <div className="mr-auto flex shrink-0 items-center gap-4">
            <Logo variant={onDark ? "light" : "dark"} href={`/${locale}`} />
            <span
              aria-hidden="true"
              className={cn(
                "hidden h-9 w-px min-[1760px]:block",
                onDark ? "bg-white/50" : "bg-neutral-400"
              )}
            />
            <span className="hidden leading-tight min-[1760px]:block">
              <span
                className={cn(
                  "block text-[10px] tracking-[0.15em]",
                  onDark ? "text-white/85" : "text-neutral-600"
                )}
              >
                {company.tagline}
              </span>
              <span
                className={cn(
                  "mt-0.5 block text-[15px] font-medium",
                  onDark ? "text-white" : "text-brand"
                )}
              >
                {company.legalName}
              </span>
            </span>
          </div>

          <div className="hidden flex-col items-end gap-2.5 self-end pb-3 xl:flex">
            {/* Utility row */}
            <div className="flex items-center gap-4 text-[13px] font-medium">
              <a
                href={company.phoneHref}
                className={cn(
                  "flex items-center gap-1.5 rounded-[4px] border px-3 py-0.5 transition-colors",
                  onDark
                    ? "border-white/70 hover:bg-white hover:text-brand-dark"
                    : "border-neutral-400 text-neutral-700 hover:border-brand hover:text-brand"
                )}
              >
                <PhoneSolidIcon className="size-3" />
                {ui.hotline} {company.phone}
              </a>
              <LangSwitch locale={locale} label={ui.language} onDark={onDark} />
            </div>

            {/* Main navigation */}
            <nav aria-label={ui.mainNav}>
              <ul className="flex items-center text-[14px] font-bold min-[1440px]:text-[15px] min-[1760px]:text-[16px]">
                {nav.map((item, i) => (
                  <li key={item.label} className="flex items-center">
                    {i > 0 && (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "h-3.5 w-px",
                          onDark ? "bg-white/40" : "bg-neutral-300"
                        )}
                      />
                    )}
                    <NavTrigger
                      item={item}
                      isHome={i === 0}
                      isActive={item.href === activeHref}
                      open={mega === i}
                      onDark={onDark}
                      onOpen={() => setMega(item.children ? i : null)}
                      onToggle={() => setMega((m) => (m === i ? null : i))}
                    />
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => {
              setMega(null)
              setMenuOpen((v) => !v)
            }}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            aria-label={menuOpen ? ui.closeMenu : ui.openMenu}
            className="grid size-12 shrink-0 place-items-center"
          >
            <span className="relative block h-4 w-11">
              {[0, 1, 2].map((n) => (
                <span
                  key={n}
                  className={cn(
                    "absolute left-0 h-[2px] w-full transition-all duration-300",
                    onDark ? "bg-white" : "bg-brand",
                    n === 0 && (menuOpen ? "top-[7px] rotate-[25deg]" : "top-0"),
                    n === 1 && (menuOpen ? "top-[7px] opacity-0" : "top-[7px]"),
                    n === 2 && (menuOpen ? "top-[7px] -rotate-[25deg]" : "top-[14px]")
                  )}
                />
              ))}
            </span>
          </button>
        </div>

        {/* Mega menu panel */}
        {openItem?.children && (
          <MegaPanel
            key={openItem.label}
            item={openItem}
            company={company}
            ui={ui}
            onNavigate={() => setMega(null)}
          />
        )}
      </header>

      <FullScreenMenu
        open={menuOpen}
        close={() => setMenuOpen(false)}
        locale={locale}
        nav={nav}
        company={company}
        ui={ui}
      />
    </>
  )
}

function NavTrigger({
  item,
  isHome,
  isActive,
  open,
  onDark,
  onOpen,
  onToggle,
}: {
  item: NavItem
  /** The home link — shown with a house icon. */
  isHome: boolean
  /** Link to the current page — coloured and underlined. */
  isActive: boolean
  open: boolean
  onDark: boolean
  onOpen: () => void
  onToggle: () => void
}) {
  const base =
    "relative flex items-center gap-1.5 whitespace-nowrap px-3 py-2 transition-colors duration-200 min-[1440px]:px-4 min-[1760px]:px-5"
  // Hover / open state is a colour change only (no box), as on the reference.
  const hover = onDark ? "hover:text-brand-lime" : "hover:text-brand"
  const active = onDark ? "text-brand-lime" : "text-brand"

  if (!item.children) {
    return (
      <Link
        href={item.href}
        onMouseEnter={onOpen}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          base,
          isActive
            ? cn(
                active,
                // short underline beneath the current page
                "after:absolute after:inset-x-3 after:-bottom-1 after:h-[2px] after:rounded-full after:bg-current min-[1440px]:after:inset-x-4 min-[1760px]:after:inset-x-5"
              )
            : hover
        )}
      >
        {isHome && <House className="size-4" aria-hidden="true" />}
        {item.label}
        {item.external && <ExternalLink className="size-3.5" aria-hidden="true" />}
      </Link>
    )
  }

  return (
    <button
      type="button"
      aria-expanded={open}
      onMouseEnter={onOpen}
      onClick={onToggle}
      className={cn(base, open ? active : hover)}
    >
      {item.label}
      <ChevronDown
        className={cn("size-4 transition-transform", open && "rotate-180")}
        aria-hidden="true"
      />
    </button>
  )
}

function MegaPanel({
  item,
  company,
  ui,
  onNavigate,
}: {
  item: NavItem
  company: Content["company"]
  ui: Content["ui"]
  onNavigate: () => void
}) {
  return (
    <div className="animate-in fade-in-0 slide-in-from-top-1 border-t border-neutral-200/70 pb-12 duration-200">
      <div className="mx-auto grid max-w-[1120px] grid-cols-[220px_1fr_300px] items-start gap-10 px-8 pt-10">
        <div className="relative aspect-square overflow-hidden">
          {item.image && (
            <Image src={item.image} alt="" fill sizes="220px" className="object-cover" />
          )}
        </div>

        <div>
          <Link
            href={item.href}
            onClick={onNavigate}
            className="group flex items-center justify-between gap-4 border-b border-neutral-800 pb-4"
          >
            <span className="text-[23px] leading-snug font-bold text-neutral-800 group-hover:text-brand">
              {item.label}
              {ui.overviewSuffix}
            </span>
            <ArrowBox className="size-6" />
          </Link>
          <ul className="mt-5 grid grid-cols-2 gap-x-12 gap-y-4">
            {item.children!.map((c) => (
              <li key={c.label}>
                <Link
                  href={c.href}
                  onClick={onNavigate}
                  className="group flex items-center justify-between gap-3 text-[15px] font-bold text-neutral-800 hover:text-brand"
                >
                  {c.label}
                  <ArrowRight
                    className="size-4 shrink-0 text-brand transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 bg-brand/10 p-5">
          <CtaCard
            href={`mailto:${company.email}?subject=${encodeURIComponent(ui.requestProfileSubject)}`}
            icon={<BookIcon className="size-7" strokeWidth={1.6} />}
            label={ui.requestProfile}
          />
          <CtaCard
            href="#lien-he"
            onClick={onNavigate}
            icon={<MailIcon className="size-7" strokeWidth={1.6} />}
            label={ui.contactConsult}
          />
          <a
            href={company.phoneHref}
            className="block pt-3 text-center text-neutral-800 hover:text-brand"
          >
            <span className="flex items-center justify-center gap-2 font-en text-[23px] font-semibold">
              <PhoneSolidIcon className="size-5" />
              {company.phone}
            </span>
            <span className="mt-0.5 block text-[12px] text-neutral-500">
              {company.hours}
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}

function CtaCard({
  href,
  icon,
  label,
  onClick,
}: {
  href: string
  icon: React.ReactNode
  label: string
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group flex items-center gap-2.5 bg-white px-4 py-4 text-[15px] font-bold text-neutral-800 hover:text-brand"
    >
      <span className="text-brand-dark" aria-hidden="true">
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      <ArrowBox className="size-6" />
    </Link>
  )
}

function FullScreenMenu({
  open,
  close,
  locale,
  nav,
  company,
  ui,
}: {
  open: boolean
  close: () => void
  locale: Locale
  nav: NavItem[]
  company: Content["company"]
  ui: Content["ui"]
}) {
  return (
    <div
      id="site-menu"
      aria-hidden={!open}
      inert={!open}
      className={cn(
        "fixed inset-0 z-40 overflow-y-auto bg-brand-deep text-white transition-opacity duration-300",
        open ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <div className="mx-auto max-w-6xl px-6 pt-28 pb-16 lg:pt-36">
        <ul className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {nav.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                onClick={close}
                className="block border-b border-white/20 pb-2 text-lg font-bold hover:text-brand-lime"
              >
                {item.label}
              </Link>
              {item.children && (
                <ul className="mt-3 space-y-2">
                  {item.children.map((c) => (
                    <li key={c.label}>
                      <Link
                        href={c.href}
                        onClick={close}
                        className="text-[15px] text-white/75 hover:text-brand-lime"
                      >
                        – {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-white/20 pt-6 text-sm">
          <a
            href={company.phoneHref}
            className="flex items-center gap-2 hover:text-brand-lime"
          >
            <PhoneSolidIcon className="size-4" /> {company.phone}
          </a>
          <LangSwitch locale={locale} label={ui.language} onDark />
        </div>
      </div>
    </div>
  )
}

function LangSwitch({
  locale,
  label,
  onDark,
}: {
  locale: Locale
  label: string
  onDark: boolean
}) {
  const item = (value: Locale, text: string, flag: React.ReactNode) => (
    <Link
      href={`/${value}`}
      hrefLang={value}
      lang={value}
      aria-current={locale === value ? "true" : undefined}
      className={cn(
        "flex items-center gap-1 transition-opacity",
        locale === value ? "opacity-100" : "opacity-50 hover:opacity-80"
      )}
    >
      {flag}
      {text}
    </Link>
  )
  return (
    <div role="group" aria-label={label} className="flex items-center gap-2">
      {item("vi", "VI", <FlagVN className="size-3.5" />)}
      <span
        className={cn("h-3 w-px", onDark ? "bg-white/40" : "bg-neutral-300")}
      />
      {item("ja", "JP", <FlagJP className="size-3.5" />)}
    </div>
  )
}
