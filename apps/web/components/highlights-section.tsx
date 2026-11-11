import { ArrowLeft, ArrowRight, CircleDot, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@workspace/ui/lib/utils"

import { container, Eyebrow } from "@/components/brand"
import { ProjectCarousel } from "@/components/project-carousel"
import { about, news } from "@/lib/site-data"

export function HighlightsSection() {
  return (
    <section className="bg-brand-soft py-10 lg:py-5">
      <div
        className={cn(
          container,
          "grid gap-10 lg:grid-cols-[1.55fr_1fr_1fr] lg:gap-0 lg:divide-x lg:divide-neutral-300/70"
        )}
      >
        {/* About */}
        <div
          id="gioi-thieu"
          className="flex scroll-mt-24 flex-col gap-6 sm:flex-row sm:items-center lg:pr-10"
        >
          <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden sm:aspect-[4/4.1] sm:w-48 lg:w-[30%]">
            <Image
              src={about.image}
              alt="Tòa nhà văn phòng kính hiện đại"
              fill
              sizes="(min-width: 640px) 200px, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <Eyebrow className="text-[11px]">Về TRANEX</Eyebrow>
            <h2 className="mt-2.5 text-xl leading-snug font-semibold text-brand-dark sm:text-[22px] lg:text-xl">
              {about.title[0]}
              <br />
              {about.title[1]}
            </h2>
            <p className="mt-3.5 text-[13.5px] leading-relaxed text-neutral-500">
              {about.description}
            </p>
            <Link
              href="#gioi-thieu"
              className="group mt-4 inline-flex items-center gap-2 rounded-full border border-brand-dark px-4 py-1.5 text-xs font-medium text-brand-dark transition-colors hover:bg-brand-dark hover:text-white"
            >
              Tìm hiểu thêm
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Featured projects */}
        <div id="du-an" className="scroll-mt-24 lg:px-5">
          <h2 className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-brand-dark uppercase">
            <CircleDot className="size-3.5 text-brand" aria-hidden="true" />
            Dự án tiêu biểu
          </h2>
          <ProjectCarousel />
        </div>

        {/* News */}
        <div id="tin-tuc" className="flex scroll-mt-24 flex-col lg:pl-5">
          <h2 className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-brand-dark uppercase">
            <ArrowLeft className="size-3.5 text-brand" aria-hidden="true" />
            Tin tức &amp; sự kiện
          </h2>
          <ul className="divide-y divide-neutral-300/70">
            {news.map((item) => (
              <li key={item.title} className="first:*:pt-0">
                <Link
                  href="#tin-tuc"
                  className="group flex items-start gap-3.5 py-2.5"
                >
                  <span className="relative aspect-[16/10] w-16 shrink-0 overflow-hidden rounded-sm">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[12.5px] leading-snug font-medium text-neutral-800 transition-colors group-hover:text-brand">
                      {item.title}
                    </span>
                    <span className="mt-1.5 flex items-center gap-1.5 text-[11px] text-neutral-400">
                      <Clock className="size-3" aria-hidden="true" />
                      <time dateTime={toIso(item.date)}>{item.date}</time>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="#tin-tuc"
            className="group mt-auto inline-flex items-center gap-2 self-end pt-3 text-xs font-medium text-brand-dark hover:text-brand"
          >
            Xem tất cả tin tức
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function toIso(date: string) {
  const [d, m, y] = date.split("/")
  return `${y}-${m}-${d}`
}
