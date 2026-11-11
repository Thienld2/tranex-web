"use client"

import { ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { useMemo, useRef, useState } from "react"

import { cn } from "@workspace/ui/lib/utils"

import { container } from "@/components/brand"
import { ProjectCard } from "@/components/projects/project-card"
import type { Content } from "@/lib/i18n/types"
import type { Option, Project } from "@/lib/projects"

const PAGE_SIZE = 9

type Criteria = { category: string; region: string; tag: string; keyword: string }
const EMPTY: Criteria = { category: "", region: "", tag: "", keyword: "" }

/** Lower-case and strip Vietnamese diacritics so "ha noi" matches "Hà Nội". */
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()

function matches(p: Project, c: Criteria) {
  if (c.category && p.categoryId !== c.category) return false
  if (c.region && p.regionId !== c.region) return false
  if (c.tag && !p.tagIds.includes(c.tag)) return false
  if (c.keyword) {
    const haystack = normalize(
      [p.name, p.location, p.category, p.structure, ...p.tags].join(" ")
    )
    if (!normalize(c.keyword).split(/\s+/).every((w) => haystack.includes(w)))
      return false
  }
  return true
}

export function ProjectExplorer({
  projects,
  filters,
  labels,
  basePath,
}: {
  projects: Project[]
  filters: { categories: Option[]; regions: Option[]; tags: Option[] }
  labels: Content["projectsPage"]
  /** e.g. "/vi/du-an" — cards link to `${basePath}/${id}`. */
  basePath: string
}) {
  const [draft, setDraft] = useState<Criteria>(EMPTY)
  const [applied, setApplied] = useState<Criteria>(EMPTY)
  const [page, setPage] = useState(1)
  const listRef = useRef<HTMLHeadingElement>(null)

  const results = useMemo(
    () => projects.filter((p) => matches(p, applied)),
    [projects, applied]
  )
  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const visible = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const goTo = (n: number) => {
    setPage(Math.min(Math.max(1, n), pageCount))
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const set = (key: keyof Criteria) => (value: string) =>
    setDraft((d) => ({ ...d, [key]: value }))

  return (
    <div className={cn(container, "py-16 lg:py-20")}>
      {/* Search */}
      <section aria-labelledby="search-title">
        <h2 id="search-title" className="text-[24px] leading-[1.4] font-bold text-neutral-800 sm:text-[26px]">
          {labels.searchTitle}
        </h2>
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            setApplied(draft)
            setPage(1)
          }}
          className="mt-8 grid gap-2.5 border border-neutral-300 bg-white p-5 sm:grid-cols-2 sm:p-8 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto_auto] lg:items-center lg:px-10 lg:py-10"
        >
          <SelectField
            label={labels.filters.category}
            value={draft.category}
            onChange={set("category")}
            options={filters.categories}
          />
          <SelectField
            label={labels.filters.region}
            value={draft.region}
            onChange={set("region")}
            options={filters.regions}
          />
          <SelectField
            label={labels.filters.tag}
            value={draft.tag}
            onChange={set("tag")}
            options={filters.tags}
          />
          <label className="relative block">
            <span className="sr-only">{labels.filters.keyword}</span>
            <input
              type="search"
              value={draft.keyword}
              onChange={(e) => set("keyword")(e.target.value)}
              placeholder={labels.filters.keyword}
              title={labels.filters.keywordPlaceholder}
              className={cn(field, "pr-11")}
            />
            <Search
              className="pointer-events-none absolute top-1/2 right-4 size-[18px] -translate-y-1/2 text-neutral-700"
              aria-hidden="true"
            />
          </label>

          <button
            type="submit"
            className="mt-2 flex h-[60px] items-center justify-between gap-8 rounded-[5px] bg-brand pr-4 pl-6 text-base font-bold whitespace-nowrap text-white transition-colors hover:bg-brand-dark sm:col-span-2 sm:mt-0 lg:col-span-1 lg:ml-3 lg:min-w-[160px]"
          >
            {labels.search}
            <span className="grid size-7 place-items-center rounded-[3px] border border-white/80">
              <Search className="size-3.5" aria-hidden="true" />
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setDraft(EMPTY)
              setApplied(EMPTY)
              setPage(1)
            }}
            className="justify-self-center border-b border-neutral-500 pb-1.5 text-[14px] font-bold whitespace-nowrap text-neutral-800 hover:border-brand hover:text-brand sm:col-span-2 lg:col-span-1 lg:ml-3"
          >
            {labels.reset}
          </button>
        </form>
      </section>

      {/* Results */}
      <section aria-labelledby="list-title" className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2
            id="list-title"
            ref={listRef}
            className="scroll-mt-28 text-[24px] leading-[1.4] font-bold text-neutral-800 sm:text-[26px]"
          >
            {labels.listTitle}
          </h2>
          <p className="text-[14px] text-neutral-500" aria-live="polite">
            {labels.resultCount.replace("{n}", String(results.length))}
          </p>
        </div>

        {visible.length === 0 ? (
          <p className="mt-8 border border-dashed border-neutral-300 px-6 py-12 text-center text-neutral-600">
            {labels.empty}
          </p>
        ) : (
          <ul className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <li key={p.id}>
                <ProjectCard
                  project={p}
                  href={`${basePath}/${p.id}`}
                  locationLabel={labels.location}
                />
              </li>
            ))}
          </ul>
        )}

        {pageCount > 1 && (
          <Pagination
            page={page}
            pageCount={pageCount}
            onChange={goTo}
            labels={labels}
          />
        )}
      </section>
    </div>
  )
}

/** Shared look of the four search controls (tall, square, light border). */
const field =
  "h-[60px] w-full rounded-[2px] border border-neutral-200 bg-white pl-4 text-base outline-none transition-colors placeholder:text-neutral-500 hover:border-neutral-400 focus:border-brand"

/** Native select whose empty option doubles as its label (e.g. "Khu vực"). */
function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: Option[]
}) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          field,
          "appearance-none truncate pr-11",
          value ? "text-neutral-800" : "text-neutral-500"
        )}
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-neutral-700"
        aria-hidden="true"
      />
    </label>
  )
}

function Pagination({
  page,
  pageCount,
  onChange,
  labels,
}: {
  page: number
  pageCount: number
  onChange: (n: number) => void
  labels: Content["projectsPage"]
}) {
  const cell =
    "grid size-11 place-items-center rounded-[3px] border font-en text-[15px] font-semibold transition-colors"
  return (
    <nav aria-label="Pagination" className="mt-14 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label={labels.prev}
        className={cn(cell, "border-neutral-300 text-neutral-600 hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-40")}
      >
        <ChevronLeft className="size-4" />
      </button>
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-current={n === page ? "page" : undefined}
          className={cn(
            cell,
            n === page
              ? "border-brand bg-brand text-white"
              : "border-neutral-300 text-neutral-700 hover:border-brand hover:text-brand"
          )}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === pageCount}
        aria-label={labels.next}
        className={cn(cell, "border-neutral-300 text-neutral-600 hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-40")}
      >
        <ChevronRight className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => onChange(pageCount)}
        disabled={page === pageCount}
        className="ml-2 flex items-center gap-1 text-[14px] font-bold text-neutral-700 hover:text-brand disabled:pointer-events-none disabled:opacity-40"
      >
        {labels.last} »
      </button>
    </nav>
  )
}
