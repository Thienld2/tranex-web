import { ja } from "./ja"
import type { Content, Locale, NavItem } from "./types"
import { vi } from "./vi"

export * from "./types"

const contents: Record<Locale, Content> = { vi, ja }

/**
 * Site-wide navigation must work from every page, so in-page anchors
 * ("#tin-tuc") are rewritten to point at the home page ("/vi#tin-tuc").
 */
const absolutize = (href: string, locale: Locale) =>
  href.startsWith("#") ? `/${locale}${href}` : href

const withAbsoluteNav = (t: Content): Content => ({
  ...t,
  nav: t.nav.map(
    (item): NavItem => ({
      ...item,
      href: absolutize(item.href, t.locale),
      children: item.children?.map((c) => ({
        ...c,
        href: absolutize(c.href, t.locale),
      })),
    })
  ),
})

const resolved: Record<Locale, Content> = {
  vi: withAbsoluteNav(contents.vi),
  ja: withAbsoluteNav(contents.ja),
}

export const getContent = (locale: Locale): Content => resolved[locale]

/** Turns an in-page anchor into a link to that anchor on the home page. */
export const homeAnchor = (locale: Locale, href: string) =>
  absolutize(href, locale)

/** Labels for the language switcher (shown as-is in every locale). */
export const localeLabels: Record<Locale, string> = { vi: "VI", ja: "JP" }
