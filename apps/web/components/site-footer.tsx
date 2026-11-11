import {
  Briefcase,
  Building2,
  House,
  Info,
  Layers,
  type LucideIcon,
  Mail,
  MapPin,
  Newspaper,
  Phone,
} from "lucide-react"
import Link from "next/link"

import { cn } from "@workspace/ui/lib/utils"

import { container, Logo, SocialIcon } from "@/components/brand"
import { contact, services } from "@/lib/site-data"

const quickLinks: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Trang chủ", href: "/", icon: House },
  { label: "Giới thiệu", href: "#gioi-thieu", icon: Info },
  { label: "Lĩnh vực hoạt động", href: "#linh-vuc", icon: Layers },
  { label: "Dự án tiêu biểu", href: "#du-an", icon: Building2 },
  { label: "Tin tức", href: "#tin-tuc", icon: Newspaper },
  { label: "Tuyển dụng", href: "#tin-tuc", icon: Briefcase },
  { label: "Liên hệ", href: "#lien-he", icon: Phone },
]

const fieldLinks = [
  ...services.map((s) => s.title),
  "Thông tin công ty",
  "Tuyển dụng",
]

const socials = [
  { name: "facebook", label: "Facebook" },
  { name: "youtube", label: "YouTube" },
  { name: "linkedin", label: "LinkedIn" },
] as const

const heading = "mb-3 text-[13px] font-semibold text-white"
const linkCls =
  "text-[12px] text-white/70 transition-colors hover:text-brand-lime"

export function SiteFooter() {
  return (
    <footer id="lien-he" className="scroll-mt-20 bg-brand-deep text-white">
      <div
        className={cn(
          container,
          "grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-[1fr_1.5fr_1.5fr_1.35fr] lg:gap-0 lg:py-6"
        )}
      >
        <div className="lg:pt-2">
          <Logo variant="light" />
        </div>

        <div className="lg:px-8">
          <h2 className={heading}>Liên kết nhanh</h2>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
            {quickLinks.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <Link href={href} className={cn(linkCls, "flex items-center gap-2")}>
                  <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:border-l lg:border-white/15 lg:px-8">
          <h2 className={heading}>Lĩnh vực hoạt động</h2>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
            {fieldLinks.map((label) => (
              <li key={label}>
                <Link href="#linh-vuc" className={linkCls}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:border-l lg:border-white/15 lg:pl-8">
          <h2 className={heading}>Liên hệ</h2>
          <div className="flex items-start justify-between gap-4">
            <address className="space-y-2.5 text-[12px] text-white/75 not-italic">
              <p className="flex gap-2.5">
                <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                {contact.address}
              </p>
              <p>
                <a
                  href={contact.phoneHref}
                  className="flex items-center gap-2.5 hover:text-brand-lime"
                >
                  <Phone className="size-3.5 shrink-0" aria-hidden="true" />
                  {contact.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2.5 hover:text-brand-lime"
                >
                  <Mail className="size-3.5 shrink-0" aria-hidden="true" />
                  {contact.email}
                </a>
              </p>
            </address>
            <ul className="flex shrink-0 items-center gap-3">
              {socials.map((s) => (
                <li key={s.name}>
                  <a
                    href="#"
                    aria-label={s.label}
                    className="grid size-7 place-items-center rounded-full text-white/85 transition-colors hover:bg-white/10 hover:text-brand-lime"
                  >
                    <SocialIcon name={s.name} className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div
          className={cn(
            container,
            "flex flex-col gap-1 py-3.5 text-[11px] text-white/70 sm:flex-row sm:items-center sm:justify-between"
          )}
        >
          <p>© 2026 TRANEX Co., Ltd. All rights reserved.</p>
          <p className="italic">Build Today for a Sustainable Tomorrow</p>
        </div>
      </div>
    </footer>
  )
}
