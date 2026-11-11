import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { cn } from "@workspace/ui/lib/utils"

import { container } from "@/components/brand"
import { ContactCta } from "@/components/home/contact-cta"
import { PickupCarousel } from "@/components/projects/pickup-carousel"
import { ProjectExplorer } from "@/components/projects/project-explorer"
import { SideTabs } from "@/components/side-tabs"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getContent, hasLocale } from "@/lib/i18n"
import { getProjectFilters, getProjects } from "@/lib/projects"

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const p = getContent(lang).projectsPage
  return { title: p.metaTitle, description: p.metaDescription }
}

export default async function ProjectsPage({ params }: Props) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const t = getContent(lang)
  const p = t.projectsPage
  const href = `/${lang}/du-an`
  const projects = getProjects(lang)

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
                    {p.breadcrumbHome}
                  </Link>
                </li>
                <li aria-hidden="true">—</li>
                <li aria-current="page" className="text-neutral-800">
                  {p.title}
                </li>
              </ol>
            </nav>
            <h1 className="mt-8 text-[28px] leading-[1.4] font-bold text-brand-dark sm:text-[34px]">
              {p.title}
            </h1>
          </div>
        </div>

        <PickupCarousel
          title={p.pickupTitle}
          items={projects.filter((x) => x.pickup)}
          prevLabel={p.prev}
          nextLabel={p.next}
          basePath={href}
        />

        <ProjectExplorer
          projects={projects}
          filters={getProjectFilters(lang)}
          labels={p}
          basePath={href}
        />

        <div className="border-t border-neutral-200 pt-16">
          <ContactCta t={t} />
        </div>
      </main>

      <SiteFooter t={t} />
    </>
  )
}
