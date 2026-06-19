import { AboutSection } from '#/features/site/components/about'
import { HeroSection } from '#/features/site/components/hero'
import { ValuePropositionSection } from '#/features/site/components/value-proposition'

export function LandingPage() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <ValuePropositionSection />
    </div>
  )
}
