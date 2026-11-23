import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { cn } from "@workspace/ui/lib/utils"

import { container, SectionHeading } from "@/components/brand"
import { ContactCta } from "@/components/home/contact-cta"
import { HouseModel3D } from "@/components/projects/house-model-3d"
import { ProjectCard } from "@/components/projects/project-card"
import { SideTabs } from "@/components/side-tabs"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { modelText } from "@/lib/house-model"
import { getHouseSpec } from "@/lib/house-specs"
import { getContent, hasLocale } from "@/lib/i18n"
import { getProject, getProjectIds, getRelatedProjects } from "@/lib/projects"

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
  const model = modelText(lang, project.name)

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
        {/* Title */}
        <div className="border-b border-neutral-200 bg-white">
          <div className={cn(container, "pt-10 pb-10 lg:pt-12 lg:pb-12")}>
            <h1 className="text-[28px] leading-[1.4] font-bold text-brand-dark sm:text-[34px]">
              {project.name}
            </h1>
            <p className="mt-2 text-[15px] text-neutral-600">
              {project.location}
              <span className="mx-2 text-neutral-300" aria-hidden="true">|</span>
              {project.structure}
            </p>
          </div>
        </div>

        {/* Interactive BIM model (three.js) */}
        <section aria-label={model.title} className="bg-white pt-12 lg:pt-16">
          <div className={container}>
            <HouseModel3D locale={lang} spec={getHouseSpec(id)} name={project.name} />
          </div>
        </section>

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
