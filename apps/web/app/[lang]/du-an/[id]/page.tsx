import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { cn } from "@workspace/ui/lib/utils"

import { container, SectionHeading, Tag } from "@/components/brand"
import { ContactCta } from "@/components/home/contact-cta"
import { ProjectFilm } from "@/components/projects/project-film"
import { buildFloorPlan } from "@/lib/floor-plan"
import { ProjectCard } from "@/components/projects/project-card"
import { SideTabs } from "@/components/side-tabs"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getContent, hasLocale } from "@/lib/i18n"
import {
  getFilmImages,
  getProject,
  getProjectIds,
  getRelatedProjects,
} from "@/lib/projects"

type Props = { params: Promise<{ lang: string; id: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return getProjectIds().map((id) => ({ id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params
  if (!hasLocale(lang)) return {}
  const project = getProject(lang, id)
  if (!project) return {}
  const t = getContent(lang)
  return {
    title: `${project.name} | TRANEX`,
    description: t.projectDetail.overview.replace("{name}", project.name),
    openGraph: { images: [project.imageLarge] },
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { lang, id } = await params
  if (!hasLocale(lang)) notFound()
  const project = getProject(lang, id)
  if (!project) notFound()

  const t = getContent(lang)
  const d = t.projectDetail
  const listHref = `/${lang}/du-an`
  const related = getRelatedProjects(lang, id)
  const film = getFilmImages(id)

  const info: [string, React.ReactNode][] = [
    [d.fields.category, project.category],
    [d.fields.region, project.region],
    [d.fields.location, project.location],
    [d.fields.structure, project.structure],
    [
      d.fields.features,
      <span key="f" className="flex flex-wrap gap-x-3 gap-y-1">
        {project.tags.map((tag) => (
          <span key={tag}>＃{tag}</span>
        ))}
      </span>,
    ],
  ]

  return (
    <>
      <div id="top" />
      <SiteHeader
        locale={t.locale}
        nav={t.nav}
        company={t.company}
        ui={t.ui}
        activeHref={listHref}
        solid
      />
      <SideTabs t={t} />

      <main className="pt-[76px] xl:pt-[96px]">
        {/* Breadcrumb (the project title lives in the film intro) */}
        <div className="border-b border-neutral-200 bg-white">
          <div className={cn(container, "flex flex-wrap items-center justify-between gap-3 py-3.5")}>
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-[13px] text-neutral-500">
                <li>
                  <Link href={`/${lang}`} className="hover:text-brand">
                    {t.projectsPage.breadcrumbHome}
                  </Link>
                </li>
                <li aria-hidden="true">—</li>
                <li>
                  <Link href={listHref} className="hover:text-brand">
                    {t.projectsPage.title}
                  </Link>
                </li>
                <li aria-hidden="true">—</li>
                <li aria-current="page" className="text-neutral-800">
                  {project.name}
                </li>
              </ol>
            </nav>
            <span className="flex items-center gap-2">
              <Tag>{project.category}</Tag>
              {project.isNew && (
                <span className="rounded-[3px] border border-neutral-300 px-2 py-0.5 font-en text-[12px] font-semibold text-brand">
                  NEW
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Scroll-scrubbed project film: concept → construction → home */}
        <ProjectFilm
          locale={t.locale}
          title={project.name}
          tagline={d.introTagline}
          meta={`${project.location} · ${project.structure}`}
          image={project.imageLarge}
          siteImage={film.site}
          interiorImage={film.interior}
          scenes={d.scenes}
          plan={buildFloorPlan(project)}
          planLabels={d.plan}
          labels={{ simTitle: d.simTitle, scrollHint: d.scrollHint, skip: d.skip }}
          skipTo="#thong-tin"
        />

        {/* Project information */}
        <section
          id="thong-tin"
          aria-labelledby="info-title"
          className="scroll-mt-28 bg-white py-16 lg:py-24"
        >
          <div className={cn(container, "grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16")}>
            <div>
              <SectionHeading title={d.infoTitle} id="info-title" />
              <p className="mt-8 text-base leading-[1.9] text-neutral-700">
                {d.overview.replace("{name}", project.name)}
              </p>
              <dl className="mt-8 border-t border-neutral-300">
                {info.map(([label, value]) => (
                  <div
                    key={label}
                    className="grid grid-cols-[130px_1fr] gap-4 border-b border-neutral-300 py-4 text-[15px] sm:grid-cols-[170px_1fr]"
                  >
                    <dt className="font-bold text-neutral-800">{label}</dt>
                    <dd className="text-neutral-700">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-neutral-100 lg:aspect-auto">
              <Image
                src={project.imageLarge}
                alt={project.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                loading="eager" // same file as the film intro: already downloaded
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Related projects */}
        <section aria-labelledby="related-title" className="border-t border-neutral-200 bg-white py-16 lg:py-20">
          <div className={container}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading title={d.relatedTitle} id="related-title" />
              <Link
                href={listHref}
                className="group flex items-center gap-2 text-[15px] font-bold text-neutral-700 hover:text-brand"
              >
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                {d.backToList}
              </Link>
            </div>
            <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.id}>
                  <ProjectCard
                    project={p}
                    href={`${listHref}/${p.id}`}
                    locationLabel={t.projectsPage.location}
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="border-t border-neutral-200 pt-16">
          <ContactCta t={t} />
        </div>
      </main>

      <SiteFooter t={t} />
    </>
  )
}
