import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { cn } from "@workspace/ui/lib/utils"

import { ArrowBox, container, SectionHeading } from "@/components/brand"
import { ContactForm } from "@/components/contact/contact-form"
import { ContactCta } from "@/components/home/contact-cta"
import { SideTabs } from "@/components/side-tabs"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getContent, hasLocale } from "@/lib/i18n"

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const c = getContent(lang).contactPage
  return { title: c.metaTitle, description: c.metaDescription }
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const t = getContent(lang)
  const c = t.contactPage
  const href = `/${lang}/lien-he`

  return (
    <>
      <div id="top" />
      <SiteHeader
        locale={t.locale}
        nav={t.nav}
        company={t.company}
        ui={t.ui}
        activeHref={href}
        solid
      />
      <SideTabs t={t} />

      <main className="pt-[76px] xl:pt-[96px]">
        {/* Breadcrumb + title */}
        <div className="border-b border-neutral-200 bg-white">
          <div className={cn(container, "pt-6 pb-10 lg:pb-12")}>
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-[13px] text-neutral-500">
                <li>
                  <Link href={`/${lang}`} className="hover:text-brand">
                    {c.breadcrumbHome}
                  </Link>
                </li>
                <li aria-hidden="true">—</li>
                <li aria-current="page" className="text-neutral-800">
                  {c.title}
                </li>
              </ol>
            </nav>
            <h1 className="mt-8 text-[28px] leading-[1.4] font-bold text-brand-dark sm:text-[34px]">
              {c.title}
            </h1>
          </div>
        </div>

        <div className={cn(container, "max-w-[1100px] py-14 lg:py-20")}>
          {/* Owners band */}
          <div className="grid overflow-hidden rounded-[4px] bg-brand text-white md:grid-cols-[1.1fr_1fr]">
            <div className="p-8 lg:p-10">
              <p className="text-[22px] leading-[1.5] font-bold">
                {c.owner.titleLines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </p>
              <span className="mt-5 block h-px bg-white/30" aria-hidden="true" />
              <p className="mt-5 text-[14px] leading-[1.9] text-white/90">{c.owner.text}</p>
            </div>
            <a href={t.company.phoneHref} className="group relative block min-h-56">
              <Image src={c.owner.image} alt="" fill loading="eager" sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
              <span className="absolute right-5 bottom-5 left-5 flex items-center justify-between gap-3 bg-white px-5 py-3.5 text-[15px] font-bold text-neutral-800 group-hover:text-brand">
                {c.owner.linkLabel}
                <ArrowBox />
              </span>
            </a>
          </div>

          {/* Form */}
          <section aria-labelledby="form-title" className="mt-20">
            <SectionHeading title={c.form.title} id="form-title" />
            <p className="mt-5 text-[15px] text-neutral-600">{c.form.intro}</p>
            <div className="mt-8">
              <ContactForm
                labels={c.form}
                kinds={c.items.map(({ key, title }) => ({ key, title }))}
                email={t.company.email}
              />
            </div>
          </section>
        </div>

        <div className="border-t border-neutral-200 pt-16">
          <ContactCta t={t} />
        </div>
      </main>

      <SiteFooter t={t} />
    </>
  )
}
