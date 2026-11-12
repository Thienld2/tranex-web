import { SideTabsClient } from "@/components/side-tabs-client"
import type { Content } from "@/lib/i18n/types"

/**
 * Server wrapper: passes only plain, serialisable data to the interactive
 * tabs (the full content object contains icon components).
 */
export function SideTabs({ t }: { t: Content }) {
  return (
    <SideTabsClient
      locale={t.locale}
      tabLabels={t.sideTabs}
      company={{
        phone: t.company.phone,
        phoneHref: t.company.phoneHref,
        hours: t.company.hours,
        email: t.company.email,
      }}
      ui={{
        quickLinks: t.ui.quickLinks,
        callNow: t.ui.callNow,
        contactConsult: t.ui.contactConsult,
        requestProfile: t.ui.requestProfile,
        requestProfileSubject: t.ui.requestProfileSubject,
        contactPanelTitle: t.ui.contactPanelTitle,
        close: t.ui.close,
      }}
    />
  )
}
