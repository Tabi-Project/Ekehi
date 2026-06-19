import { AboutSection } from '#/features/site/components/about'
import { HeroSection } from '#/features/site/components/hero'
import { MissionSection } from '#/features/site/components/mission'
import { ValuePropositionSection } from '#/features/site/components/value-proposition'

import { WhatWeOfferSection } from '../components/what-we-offer'

export function LandingPage() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <ValuePropositionSection />
      <MissionSection />
      <WhatWeOfferSection />
    </div>
  )
}
