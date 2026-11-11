import { ArrowUp, Mail, MapPin } from "lucide-react"
import Link from "next/link"

import { cn } from "@workspace/ui/lib/utils"

import { container, Logo } from "@/components/brand"
import {
  FacebookColor,
  InstagramColor,
  LinkedinColor,
  PhoneSolidIcon,
  YoutubeColor,
} from "@/components/icons"
import type { Content } from "@/lib/i18n/types"

const socials = [
  { label: "Facebook", icon: FacebookColor },
  { label: "YouTube", icon: YoutubeColor },
  { label: "Instagram", icon: InstagramColor },
  { label: "LinkedIn", icon: LinkedinColor },
]

export function SiteFooter({ t }: { t: Content }) {
  const { company, ui, nav } = t
  const groups = nav.filter((n) => n.children)
  const singles = nav.filter((n) => !n.children)

  return (
    <footer className="bg-brand-deep pb-16 text-white md:pb-0">
      <div
        className={cn(
          container,
          "grid gap-12 py-14 lg:grid-cols-[260px_1fr] lg:gap-16"
        )}
      >
        <div>
          <Logo variant="light" href={`/${t.locale}`} />
          <p className="mt-5 text-base font-bold">{company.legalName}</p>
          <address className="mt-4 space-y-3 text-[14px] text-white/80 not-italic">
            <p className="flex gap-2.5">
              <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              {company.address}
            </p>
            <p>
              <a
                href={company.phoneHref}
                className="flex items-center gap-2.5 hover:text-brand-lime"
              >
                <PhoneSolidIcon className="size-3.5 shrink-0" />
                {company.phone}
              </a>
            </p>
            <p>
              <a
                href={`mailto:${company.email}`}
                className="flex items-center gap-2.5 hover:text-brand-lime"
              >
                <Mail className="size-3.5 shrink-0" aria-hidden="true" />
                {company.email}
              </a>
            </p>
          </address>
        </div>

        <nav
          aria-label={ui.siteMap}
          className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-5"
        >
          <ul className="space-y-4">
            {singles.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-base font-bold hover:text-brand-lime"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          {groups.map((g) => (
            <div key={g.label}>
              <Link
                href={g.href}
                className="text-base font-bold hover:text-brand-lime"
              >
                {g.label}
              </Link>
              <ul className="mt-4 space-y-2.5">
                {g.children!.map((c) => (
                  <li key={c.label}>
                    <Link
                      href={c.href}
                      className="text-[14px] text-white/70 hover:text-brand-lime"
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div
          className={cn(
            container,
            "flex flex-wrap items-center justify-between gap-4 py-5"
          )}
        >
          <div className="flex items-center gap-5">
            <ul className="flex items-center gap-3">
              {socials.map(({ label, icon: Icon }) => (
                <li key={label}>
                  <a
                    href="#"
                    aria-label={label}
                    className="grid size-9 place-items-center rounded-full bg-white transition-transform hover:-translate-y-0.5"
                  >
                    <Icon className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
            <ul className="hidden items-center gap-3 text-[13px] text-white/65 sm:flex">
              {ui.policies.map((p, i) => (
                <li key={p} className="flex items-center gap-3">
                  {i > 0 && <span aria-hidden="true">|</span>}
                  <Link href="#" className="hover:text-white">
                    {p}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-5">
            <p className="font-en text-[12px] text-white/65">
              © 2026 TRANEX Co., Ltd. All rights reserved.
            </p>
            <a
              href="#top"
              aria-label={ui.backToTop}
              className="grid size-9 place-items-center rounded-[3px] bg-white/10 transition-colors hover:bg-brand"
            >
              <ArrowUp className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
