import Link from "next/link"

import { cn } from "@workspace/ui/lib/utils"

import {
  BookIcon,
  BuildingsIcon,
  EventIcon,
  MailIcon,
  PhoneSolidIcon,
} from "@/components/icons"
import type { Content } from "@/lib/i18n/types"

/** Fixed vertical CTA tabs on desktop, a bottom action bar on mobile. */
export function SideTabs({ t }: { t: Content }) {
  // Every page that shows these tabs has a contact block (#lien-he);
  // events live on the home page and projects on their own page.
  const tabMeta = [
    { href: "#lien-he", icon: BookIcon },
    { href: `/${t.locale}#tin-tuc`, icon: EventIcon },
    { href: `/${t.locale}/du-an`, icon: BuildingsIcon },
  ]
  return (
    <>
      <nav
        aria-label={t.ui.quickLinks}
        className="fixed top-1/2 right-0 z-30 hidden -translate-y-1/2 flex-col gap-0.5 md:flex"
      >
        {tabMeta.map(({ href, icon: Icon }, i) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "group flex w-[64px] flex-col items-center gap-3 rounded-l-lg pt-5 pb-6 text-white shadow-lg transition-all hover:w-[70px]",
              i === 0
                ? "bg-neutral-700/90 hover:bg-neutral-800"
                : "bg-brand hover:bg-[#17a058]"
            )}
          >
            <Icon className="size-[26px] opacity-90" strokeWidth={1.6} />
            <span className="text-[14px] font-bold tracking-[0.08em] [writing-mode:vertical-rl]">
              {t.sideTabs[i]}
            </span>
          </Link>
        ))}
      </nav>

      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 shadow-[0_-4px_16px_rgba(0,0,0,0.12)] md:hidden">
        <a
          href={t.company.phoneHref}
          className="flex items-center justify-center gap-2 bg-white py-3.5 text-[15px] font-bold text-brand-dark"
        >
          <PhoneSolidIcon className="size-4" /> {t.ui.callNow}
        </a>
        <Link
          href="#lien-he"
          className="flex items-center justify-center gap-2 bg-brand py-3.5 text-[15px] font-bold text-white"
        >
          <MailIcon className="size-5" strokeWidth={2.2} /> {t.ui.contactConsult}
        </Link>
      </div>
    </>
  )
}
