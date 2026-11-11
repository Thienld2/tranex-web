"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import { cn } from "@workspace/ui/lib/utils"

import { projects } from "@/lib/site-data"

export function ProjectCarousel() {
  const [index, setIndex] = useState(0)
  const count = projects.length
  const go = (n: number) => setIndex(((n % count) + count) % count)
  const project = projects[index]!

  return (
    <div aria-roledescription="carousel" aria-label="Dự án tiêu biểu">
      <div className="relative aspect-[16/8.5] overflow-hidden rounded-md bg-neutral-200">
        {projects.map((p, i) => (
          <Image
            key={p.title}
            src={p.image}
            alt={p.title}
            fill
            sizes="(min-width: 1024px) 26vw, 100vw"
            aria-hidden={i !== index}
            className={cn(
              "object-cover transition-opacity duration-500",
              i === index ? "opacity-100" : "opacity-0"
            )}
          />
        ))}
        <div className="absolute inset-0 bg-linear-to-t from-black/25 to-transparent" />
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Dự án trước"
          className="absolute top-1/2 left-2.5 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-brand-dark"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Dự án tiếp theo"
          className="absolute top-1/2 right-2.5 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-brand-dark"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div aria-live="polite" className="mt-4">
        <h3 className="text-sm font-semibold text-brand-dark">
          {project.title}
        </h3>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-xs text-neutral-500">
          {project.tags.map((tag, i) => (
            <span key={tag} className="flex items-center gap-2">
              {i > 0 && (
                <span className="h-3 w-px bg-neutral-300" aria-hidden="true" />
              )}
              {tag}
            </span>
          ))}
        </p>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {projects.map((p, i) => (
          <button
            key={p.title}
            type="button"
            onClick={() => go(i)}
            aria-label={`Xem dự án ${i + 1}`}
            aria-current={i === index}
            className={cn(
              "size-1.5 rounded-full transition-colors",
              i === index ? "bg-brand-dark" : "bg-neutral-300 hover:bg-neutral-400"
            )}
          />
        ))}
      </div>
    </div>
  )
}
