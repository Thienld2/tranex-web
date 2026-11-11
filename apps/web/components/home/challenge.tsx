import Image from "next/image"
import Link from "next/link"

import { cn } from "@workspace/ui/lib/utils"

import { ArrowBox, container, Lines, Tag } from "@/components/brand"
import { Reveal } from "@/components/reveal"
import type { Content, Story } from "@/lib/i18n/types"

export function Challenge({ t }: { t: Content }) {
  const { links: challengeLinks, stories } = t.challenge
  return (
    <section
      id="thu-thach"
      aria-labelledby="thu-thach-title"
      className="scroll-mt-24 bg-brand-soft py-16 lg:py-24"
    >
      <div className={cn(container, "grid gap-10 lg:grid-cols-[360px_1fr] lg:gap-12")}>
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <h2
            id="thu-thach-title"
            className="text-[28px] leading-[1.45] font-bold tracking-wide text-brand-dark lg:text-[34px]"
          >
            <Lines lines={t.challenge.titleLines} />
          </h2>
          <ul className="mt-8">
            {challengeLinks.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="flex items-center gap-2.5 border-b border-neutral-300 py-4 text-base font-bold text-neutral-800 hover:text-brand"
                >
                  <span className="text-brand" aria-hidden="true">
                    ›
                  </span>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((s, i) => (
            <Reveal
              as="li"
              key={s.title}
              delay={(i % 3) * 80}
              className={cn(
                s.size === "lg" && "sm:col-span-2 lg:row-span-2",
                s.size === "wide" && "sm:col-span-2"
              )}
            >
              <StoryCard story={s} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

function StoryCard({ story }: { story: Story }) {
  const wide = story.size === "wide"
  return (
    <Link
      href="#thu-thach"
      className={cn(
        "group flex h-full bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-lg",
        wide ? "flex-col gap-3 sm:flex-row" : "flex-col"
      )}
    >
      <span
        className={cn(
          "flex flex-col p-1",
          wide ? "sm:w-2/5" : "",
          story.size === "lg" ? "min-h-28" : "min-h-24"
        )}
      >
        <span>
          <Tag>{story.tag}</Tag>
        </span>
        <span className="mt-2.5 text-[16px] leading-[1.6] font-medium text-neutral-800 group-hover:text-brand lg:text-[17px]">
          {story.title}
        </span>
        <ArrowBox className="mt-auto self-end" />
      </span>
      <span
        className={cn(
          "relative block overflow-hidden bg-neutral-100",
          story.size === "lg" && "mt-3 aspect-[16/10] lg:aspect-auto lg:flex-1",
          story.size === "md" && "mt-3 aspect-[16/10]",
          wide && "aspect-[16/9] sm:aspect-auto sm:flex-1"
        )}
      >
        <Image
          src={story.image}
          alt=""
          fill
          sizes={story.size === "md" ? "(min-width: 1024px) 22vw, 50vw" : "(min-width: 1024px) 45vw, 100vw"}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </span>
    </Link>
  )
}
