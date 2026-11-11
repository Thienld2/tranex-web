"use client"

import { ChevronDown, House, Menu, Search, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import { cn } from "@workspace/ui/lib/utils"

import { container, FlagJP, FlagVN, Logo } from "@/components/brand"
import { navItems } from "@/lib/site-data"

type Lang = "vi" | "jp"

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [lang, setLang] = useState<Lang>("vi")
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false)
        setMobileOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-white transition-shadow",
        scrolled ? "shadow-[0_2px_16px_rgba(15,61,54,0.08)]" : "border-b"
      )}
    >
      <div className={cn(container, "flex h-[72px] items-center gap-6")}>
        <Logo className="mr-auto" />

        {/* Desktop navigation */}
        <nav aria-label="Điều hướng chính" className="hidden h-full lg:block">
          <ul className="flex h-full items-center gap-1 xl:gap-3">
            {navItems.map((item, i) => {
              const active = i === 0
              return (
                <li key={item.label} className="group relative h-full">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex h-full items-center gap-1.5 px-2.5 text-[13.5px] font-medium whitespace-nowrap transition-colors",
                      "after:absolute after:inset-x-2.5 after:bottom-0 after:h-[3px] after:rounded-t-full after:bg-brand after:transition-transform",
                      active
                        ? "text-brand after:scale-x-100"
                        : "text-neutral-700 after:scale-x-0 hover:text-brand group-hover:after:scale-x-100"
                    )}
                  >
                    {active && <House className="size-4" aria-hidden="true" />}
                    {item.label}
                    {item.children && (
                      <ChevronDown
                        className="size-3.5 transition-transform group-focus-within:rotate-180 group-hover:rotate-180"
                        aria-hidden="true"
                      />
                    )}
                  </Link>

                  {item.children && (
                    <div className="invisible absolute top-full left-0 z-10 translate-y-1 opacity-0 transition-all group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <ul className="min-w-56 rounded-b-xl border border-t-0 bg-white p-2 shadow-xl shadow-brand-dark/10">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              href={child.href}
                              className="block rounded-lg px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-brand-soft hover:text-brand"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Language + search */}
        <div className="flex items-center gap-1 sm:gap-3 lg:ml-6">
          <div
            role="group"
            aria-label="Ngôn ngữ"
            className="hidden items-center gap-1 text-xs font-semibold sm:flex"
          >
            <LangButton
              active={lang === "vi"}
              onClick={() => setLang("vi")}
              flag={<FlagVN className="size-4" />}
              label="VI"
            />
            <span className="h-4 w-px bg-neutral-300" aria-hidden="true" />
            <LangButton
              active={lang === "jp"}
              onClick={() => setLang("jp")}
              flag={<FlagJP className="size-4" />}
              label="JP"
            />
          </div>

          <button
            type="button"
            aria-label="Tìm kiếm"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-full text-neutral-700 transition-colors hover:bg-brand-soft hover:text-brand"
          >
            {searchOpen ? (
              <X className="size-5" />
            ) : (
              <Search className="size-5" />
            )}
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-full text-brand-dark transition-colors hover:bg-brand-soft lg:hidden"
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t bg-brand-soft">
          <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            className={cn(container, "flex items-center gap-3 py-3")}
          >
            <Search className="size-5 text-brand" aria-hidden="true" />
            <input
              ref={searchRef}
              type="search"
              placeholder="Tìm kiếm dịch vụ, dự án, tin tức…"
              aria-label="Từ khóa tìm kiếm"
              className="h-10 flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-500"
            />
            <button
              type="submit"
              className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
            >
              Tìm kiếm
            </button>
          </form>
        </div>
      )}

      {/* Mobile navigation */}
      {mobileOpen && (
        <nav
          aria-label="Điều hướng di động"
          className="max-h-[calc(100svh-72px)] overflow-y-auto border-t bg-white lg:hidden"
        >
          <ul className={cn(container, "py-3")}>
            {navItems.map((item, i) => (
              <li key={item.label} className="border-b last:border-b-0">
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 py-3 text-[15px] font-medium",
                    i === 0 ? "text-brand" : "text-neutral-800"
                  )}
                >
                  {i === 0 && <House className="size-4" aria-hidden="true" />}
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="mb-3 ml-3 border-l pl-3">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <Link
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block py-1.5 text-sm text-neutral-600 hover:text-brand"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <div
            className={cn(
              container,
              "flex items-center gap-3 border-t py-4 text-sm font-semibold sm:hidden"
            )}
          >
            <LangButton
              active={lang === "vi"}
              onClick={() => setLang("vi")}
              flag={<FlagVN className="size-4" />}
              label="VI"
            />
            <LangButton
              active={lang === "jp"}
              onClick={() => setLang("jp")}
              flag={<FlagJP className="size-4" />}
              label="JP"
            />
          </div>
        </nav>
      )}
    </header>
  )
}

function LangButton({
  active,
  onClick,
  flag,
  label,
}: {
  active: boolean
  onClick: () => void
  flag: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-2 py-1 transition-colors",
        active
          ? "text-brand-dark"
          : "text-neutral-400 hover:text-neutral-700"
      )}
    >
      {flag}
      {label}
    </button>
  )
}
