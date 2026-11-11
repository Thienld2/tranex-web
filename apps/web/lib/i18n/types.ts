import type { Icon } from "@/components/icons"

export const locales = ["vi", "ja"] as const
export type Locale = (typeof locales)[number]

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value)

export type NavLink = { label: string; href: string }
export type NavItem = NavLink & {
  children?: NavLink[]
  /** Image shown on the left of the mega menu panel. */
  image?: string
  /** Shows an "opens elsewhere" icon. */
  external?: boolean
}

export type Service = {
  title: string
  description: string
  image: string
  icon: Icon
}

export type Story = {
  tag: string
  title: string
  image: string
  /** Layout hint for the mosaic grid. */
  size: "lg" | "md" | "wide"
}

export type Content = {
  locale: Locale
  meta: { title: string; description: string }
  company: {
    legalName: string
    tagline: string
    address: string
    phone: string
    phoneHref: string
    hours: string
    email: string
  }
  ui: {
    mainNav: string
    siteMap: string
    quickLinks: string
    language: string
    openMenu: string
    closeMenu: string
    closeNotice: string
    backToTop: string
    hotline: string
    /** Appended to a nav label for the mega menu overview link. */
    overviewSuffix: string
    viewAll: string
    viewDetails: string
    free: string
    requestProfile: string
    requestProfileSubject: string
    contactConsult: string
    callNow: string
    policies: string[]
  }
  nav: NavItem[]
  sideTabs: [string, string, string]
  hero: {
    ariaLabel: string
    eyebrow: string
    titleLines: string[]
    description: string
    images: { src: string; alt: string }[]
    notice: { tag: string; title: string; image: string; href: string }
  }
  news: { title: string; items: { date: string; tag: string; title: string }[] }
  events: {
    title: string
    items: { tags: string[]; date: string; title: string; image: string }[]
  }
  consulting: {
    label: string
    titleLines: string[]
    description: string
    image: string
    imageAlt: string
  }
  services: { eyebrow: string; title: string; viewAll: string; items: Service[] }
  buildingTypes: {
    title: string
    sub: string
    viewAll: string
    items: { title: string; image: string }[]
  }
  support: { title: string; description: string; icon: Icon }[]
  crane: { image: string; alt: string }
  challenge: { titleLines: string[]; links: NavLink[]; stories: Story[] }
  about: {
    label: string
    titleLines: string[]
    paragraphs: string[]
    cards: { title: string; image?: string }[]
    links: NavLink[]
  }
  pickup: {
    title: string
    items: {
      eyebrow: string
      title: string
      image: string
      tone: "brand" | "dark" | "light"
    }[]
  }
  contactCta: {
    lines: string[]
    note: string
    brochures: { label: string; title: string; image: string }[]
  }
  projectsPage: {
    metaTitle: string
    metaDescription: string
    breadcrumbHome: string
    title: string
    pickupTitle: string
    searchTitle: string
    filters: {
      category: string
      region: string
      tag: string
      keyword: string
      keywordPlaceholder: string
    }
    search: string
    reset: string
    listTitle: string
    location: string
    /** "{n}" is replaced by the number of results. */
    resultCount: string
    empty: string
    prev: string
    next: string
    last: string
  }
  projectDetail: {
    simTitle: string
    scrollHint: string
    skip: string
    /** Sub-headline under the project name in the film intro. */
    introTagline: string
    /** Labels drawn on the generated site plan. */
    plan: {
      title: string
      scale: string
      street: string
      sidewalk: string
      sea: string
      garden: string
      rooms: {
        living: string
        kitchen: string
        bed: string
        bath: string
        garage: string
        stair: string
        terrace: string
      }
    }
    /**
     * Film scenes after the intro: concept → construction → finishes →
     * home → interior. Caption = before + accent (script) + after.
     */
    scenes: {
      label: string
      before: string
      accent: string
      after: string
      description: string
    }[]
    infoTitle: string
    fields: {
      category: string
      region: string
      location: string
      structure: string
      features: string
    }
    /** "{name}" is replaced by the project name. */
    overview: string
    relatedTitle: string
    backToList: string
    viewDetail: string
  }
}
