/**
 * Thin-line illustrative icon set (48×48 grid), drawn for TRANEX in the style
 * of Japanese corporate sites: hairline strokes, rounded joins, no fills.
 * All icons accept `className` (size/colour via currentColor) and `strokeWidth`.
 */
import type { ComponentType, ReactNode } from "react"

export type IconProps = { className?: string; strokeWidth?: number }
export type Icon = ComponentType<IconProps>

function Line({
  children,
  className,
  strokeWidth = 1.5,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  )
}

/* ---------------------------------------------------------------- */
/* Navigation / CTA                                                  */
/* ---------------------------------------------------------------- */

export const BookIcon: Icon = (p) => (
  <Line {...p}>
    <path d="M24 13c-4.5-3.2-10.5-3.8-17-3.2v26.4c6.5-.6 12.5 0 17 3.2 4.5-3.2 10.5-3.8 17-3.2V9.8c-6.5-.6-12.5 0-17 3.2Z" />
    <path d="M24 13v26.2" />
  </Line>
)

export const MailIcon: Icon = (p) => (
  <Line {...p}>
    <rect x="6" y="11" width="36" height="26" rx="2" />
    <path d="m7 13 17 13.5L41 13" />
  </Line>
)

/** Person presenting at a board — events / seminars. */
export const EventIcon: Icon = (p) => (
  <Line {...p}>
    <rect x="22" y="7" width="20" height="15" rx="1" />
    <path d="m27 33 5-11 5 11" />
    <circle cx="12" cy="15.5" r="3.5" />
    <path d="M6 41V29.5a5 5 0 0 1 5-5h3.5l7.5-5" />
    <path d="M14.5 41V30.5" />
  </Line>
)

/** Two buildings — projects / track record. */
export const BuildingsIcon: Icon = (p) => (
  <Line {...p}>
    <path d="M5 41h38" />
    <path d="M9 41V12.5L24 8v33" />
    <path d="M24 41V19h14v22" />
    <path d="M14 15.5h5M14 21h5M14 26.5h5M14 32h5M29 24.5h4M29 30h4M29 35.5h4" />
  </Line>
)

/* ---------------------------------------------------------------- */
/* Support cards                                                     */
/* ---------------------------------------------------------------- */

/** Document with a calculator — estimates & quotations. */
export const EstimateIcon: Icon = (p) => (
  <Line {...p}>
    <path d="M23 41H11a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h15l6 6v8" />
    <path d="M26 7v6h6" />
    <path d="M14 15h8M14 20.5h13M14 26h7" />
    <circle cx="16" cy="33.5" r="3" />
    <path d="m14.7 33.6 1 1 1.7-2" />
    <rect x="26" y="25" width="15" height="17" rx="2" />
    <path d="M29 29h9" />
    <path d="M29.5 33.5h.01M33.5 33.5h.01M37.5 33.5h.01M29.5 38h.01M33.5 38h.01M37.5 38h.01" strokeWidth={2.4} />
  </Line>
)

/** Open hand holding a building — after-sales support. */
export const HandBuildingIcon: Icon = (p) => (
  <Line {...p}>
    <path d="M18 27V7h18v20" />
    <path d="M15.5 7h23" />
    <path d="M22 11.5v3M27 11.5v3M32 11.5v3M22 18v3M27 18v3M32 18v3" />
    <path d="M4 29h4.5v12H4" />
    <path d="M8.5 31.5c4-1.6 7.5-1.6 10.5 0l6 2.5c1.7.7 1.3 3.2-.6 3.2H16.5" />
    <path d="M8.5 39c6.5 1.7 13.5 2 20.5-.6l12-5.6c1.8-.9.9-3.4-1.1-2.9L27.5 34" />
  </Line>
)

/* ---------------------------------------------------------------- */
/* Services                                                          */
/* ---------------------------------------------------------------- */

/** House elevation with a set square — design consulting. */
export const DesignIcon: Icon = (p) => (
  <Line {...p}>
    <path d="M6 22 22 9l16 13" />
    <path d="M10 19v20h17" />
    <path d="M18 39v-9h7v5" />
    <path d="M30 26v16h12z" />
    <path d="M33.5 35v3.5H37z" />
  </Line>
)

/** Wireframe cube — BIM models. */
export const BimIcon: Icon = (p) => (
  <Line {...p}>
    <path d="M24 6 40 15v18L24 42 8 33V15Z" />
    <path d="m8 15 16 9 16-9M24 24v18" />
    <path d="m16 10.5 16 9v9M32 10.5l-16 9v9" strokeDasharray="2 2.5" />
  </Line>
)

/** Beam on two columns — precast concrete. */
export const PrecastIcon: Icon = (p) => (
  <Line {...p}>
    <path d="M4 41h40" />
    <rect x="5" y="13" width="38" height="8" rx="1" />
    <path d="M11 13v8M19 13v8M27 13v8M35 13v8" />
    <path d="M10 21h6v20h-6zM32 21h6v20h-6z" />
  </Line>
)

/** Brick wall — building materials. */
export const MaterialsIcon: Icon = (p) => (
  <Line {...p}>
    <rect x="5" y="12" width="38" height="27" rx="1" />
    <path d="M5 21h38M5 30h38" />
    <path d="M17.5 12v9M30.5 12v9M11 21v9M24 21v9M37 21v9M17.5 30v9M30.5 30v9" />
  </Line>
)

/** Excavator — construction machinery. */
export const ExcavatorIcon: Icon = (p) => (
  <Line {...p}>
    <rect x="4" y="34" width="25" height="8" rx="4" />
    <circle cx="9" cy="38" r="1.5" />
    <circle cx="24" cy="38" r="1.5" />
    <path d="M7 34v-8h17v8" />
    <path d="M10 26v-8h7l3 8" />
    <path d="m21 26 9-13 9 6" />
    <path d="m39 19 3 9h-7.5z" />
  </Line>
)

/* ---------------------------------------------------------------- */
/* Solid glyphs                                                      */
/* ---------------------------------------------------------------- */

export function PhoneSolidIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
    </svg>
  )
}

/* ---------------------------------------------------------------- */
/* Social (official brand colours)                                   */
/* ---------------------------------------------------------------- */

export function FacebookColor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <defs>
        <clipPath id="fb-clip">
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <circle cx="12" cy="12" r="12" fill="#0866FF" />
      <path
        clipPath="url(#fb-clip)"
        fill="#fff"
        d="M13.4 24v-9.3h3l.45-3.4H13.4V9.1c0-1 .3-1.65 1.7-1.65h1.8V4.4c-.3-.05-1.4-.14-2.65-.14-2.6 0-4.4 1.6-4.4 4.5v2.55H7v3.4h2.85V24z"
      />
    </svg>
  )
}

export function YoutubeColor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <rect x="0.5" y="4.5" width="23" height="15" rx="4.5" fill="#FF0000" />
      <path d="M9.75 8.75v6.5L15.5 12z" fill="#fff" />
    </svg>
  )
}

export function InstagramColor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="ig-grad" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FEDA75" />
          <stop offset="0.3" stopColor="#FA7E1E" />
          <stop offset="0.55" stopColor="#D62976" />
          <stop offset="0.8" stopColor="#962FBF" />
          <stop offset="1" stopColor="#4F5BD5" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="url(#ig-grad)" strokeWidth="2.2" />
      <circle cx="12" cy="12" r="4.3" stroke="url(#ig-grad)" strokeWidth="2.2" />
      <circle cx="17.4" cy="6.6" r="1.3" fill="url(#ig-grad)" />
    </svg>
  )
}

export function LinkedinColor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <rect x="1" y="1" width="22" height="22" rx="3.5" fill="#0A66C2" />
      <rect x="5.4" y="9.4" width="2.9" height="8.6" fill="#fff" />
      <circle cx="6.85" cy="6.6" r="1.7" fill="#fff" />
      <path
        fill="#fff"
        d="M10.5 9.4h2.8v1.2c.45-.8 1.45-1.45 2.9-1.45 2.75 0 3.25 1.8 3.25 4.1V18h-2.9v-4.1c0-1-.05-2.2-1.35-2.2-1.35 0-1.6 1.05-1.6 2.15V18h-2.9z"
      />
    </svg>
  )
}
