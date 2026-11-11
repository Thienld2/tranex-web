import { HeroSlider } from "@/components/hero-slider"
import { HighlightsSection } from "@/components/highlights-section"
import { ServicesSection } from "@/components/services-section"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSlider />
        <ServicesSection />
        <HighlightsSection />
      </main>
      <SiteFooter />
    </>
  )
}
