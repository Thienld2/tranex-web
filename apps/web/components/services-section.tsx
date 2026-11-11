import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@workspace/ui/lib/utils"

import { container, Eyebrow } from "@/components/brand"
import { services } from "@/lib/site-data"

export function ServicesSection() {
  return (
    <section
      id="linh-vuc"
      aria-labelledby="linh-vuc-title"
      className="scroll-mt-20 bg-white py-10 lg:py-6 lg:pb-4"
    >
      <div className={container}>
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div>
            <Eyebrow>Lĩnh vực hoạt động</Eyebrow>
            <h2
              id="linh-vuc-title"
              className="mt-2 text-2xl font-bold text-brand-dark uppercase sm:text-[26px]"
            >
              Giải pháp toàn diện cho ngành xây dựng
            </h2>
          </div>
          <Link
            href="#linh-vuc"
            className="group inline-flex items-center gap-2 text-sm font-medium text-brand hover:text-brand-dark"
          >
            Xem tất cả lĩnh vực
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-3.5">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <li key={service.title}>
                <Link
                  href="#linh-vuc"
                  className={cn(
                    "group flex h-full flex-col overflow-hidden rounded-lg border bg-white",
                    "transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-xl hover:shadow-brand-dark/10"
                  )}
                >
                  <div className="relative aspect-[16/7.5] overflow-hidden">
                    <Image
                      src={service.image}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 gap-3 p-4 pb-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand text-white ring-4 ring-brand/10">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <div className="flex flex-1 flex-col pt-1.5">
                      <h3 className="text-[15px] font-semibold text-brand-dark">
                        {service.title}
                      </h3>
                      <p className="mt-2.5 text-[12.5px] leading-relaxed text-neutral-500">
                        {service.description}
                      </p>
                      <ArrowRight
                        className="mt-auto size-4 self-end pt-0 text-brand-dark transition-transform group-hover:translate-x-1 group-hover:text-brand"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
