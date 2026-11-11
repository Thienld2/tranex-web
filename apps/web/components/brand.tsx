import Link from "next/link"

import { cn } from "@workspace/ui/lib/utils"

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id="tranex-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1fa65c" />
          <stop offset="1" stopColor="#0e6b3d" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="11" fill="url(#tranex-mark)" />
      {/* T */}
      <path d="M9 12h19v5.2h-6.8V37h-5.4V17.2H9z" fill="#fff" />
      {/* Arrow-like X stroke pointing forward */}
      <path
        d="M26.5 24.5 37 12h-6.6l-7.4 8.9zM27.2 27.2 36.8 37h-6.7l-6.6-6.8z"
        fill="#c9f29b"
      />
    </svg>
  )
}

export function Logo({
  variant = "dark",
  href = "/",
  className,
}: {
  variant?: "dark" | "light"
  href?: string
  className?: string
}) {
  const light = variant === "light"
  return (
    <Link
      href={href}
      aria-label="TRANEX"
      className={cn("flex items-center gap-2.5", className)}
    >
      <LogoMark className="size-11" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[28px] font-extrabold tracking-wide",
            light ? "text-white" : "text-brand-dark"
          )}
        >
          TRANEX
        </span>
        <span
          className={cn(
            "mt-1 text-[8.5px] font-medium tracking-[0.2em] uppercase",
            light ? "text-white/70" : "text-brand"
          )}
        >
          Nexus for a better future
        </span>
      </span>
    </Link>
  )
}

export function FlagVN({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <circle cx="10" cy="10" r="10" fill="#da251d" />
      <path
        d="m10 4.6 1.3 3.9h4.1l-3.3 2.4 1.3 3.9L10 12.4l-3.4 2.4 1.3-3.9-3.3-2.4h4.1z"
        fill="#ffcd00"
      />
    </svg>
  )
}

export function FlagJP({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <circle cx="10" cy="10" r="9.5" fill="#fff" stroke="#d4d4d4" />
      <circle cx="10" cy="10" r="4.2" fill="#bc002d" />
    </svg>
  )
}

const socialPaths = {
  facebook: (
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  ),
  youtube: (
    <>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </>
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
}

export function SocialIcon({
  name,
  className,
}: {
  name: keyof typeof socialPaths
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {socialPaths[name]}
    </svg>
  )
}

/** Small uppercase label with a leading dash, used above section titles. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-2 font-en text-sm font-bold tracking-wide text-brand uppercase",
        className
      )}
    >
      <span className="h-0.5 w-4 rounded-full bg-brand" aria-hidden="true" />
      {children}
    </p>
  )
}

export const container = "mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-12"

/** Small solid square with an arrow — the site's signature link affordance. */
export function ArrowBox({
  className,
  tone = "brand",
}: {
  className?: string
  tone?: "brand" | "white" | "dark"
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-[26px] shrink-0 place-items-center rounded-[3px] transition-transform group-hover:translate-x-0.5",
        tone === "brand" && "bg-brand text-white",
        tone === "white" && "bg-white text-brand",
        tone === "dark" && "bg-brand-deep text-white",
        className
      )}
    >
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none">
        <path
          d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

/** Section title with a short dark underline, as on Japanese corporate sites. */
export function SectionHeading({
  title,
  sub,
  id,
  className,
}: {
  title: string
  sub?: string
  id?: string
  className?: string
}) {
  return (
    <div className={className}>
      <h2
        id={id}
        className="inline-block border-b-2 border-brand-dark pb-2 text-[26px] leading-[1.4] font-bold tracking-wide text-brand-dark sm:text-[32px]"
      >
        {title}
      </h2>
      {sub && <p className="mt-3 text-base text-neutral-600">{sub}</p>}
    </div>
  )
}

/** Renders text lines separated by <br />. */
export function Lines({ lines }: { lines: string[] }) {
  return lines.map((line, i) => (
    <span key={line}>
      {i > 0 && <br />}
      {line}
    </span>
  ))
}

/** Small outlined tag used on news / story cards. */
export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-[2px] border border-brand/60 px-2 py-0.5 text-[12.5px] leading-tight font-medium text-brand">
      {children}
    </span>
  )
}
