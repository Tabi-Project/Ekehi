import { useState } from 'react'

import { IMAGES } from '#/assets/images'
import { cn } from '#/lib/utils'

type Offering = {
  id: string
  title: string
  description: string
  image: string
}

// Single source of truth for the four offerings.
// Each one currently points at the same placeholder image —
// swap the `image` value per item once dedicated photos exist.
const OFFERINGS: Array<Offering> = [
  {
    id: 'funding-database',
    title: 'Funding Database',
    description:
      'Find active grants, loans, and VC funds filtered to your sector and stage.',
    image: IMAGES.fundingDatabase,
  },
  {
    id: 'training-programmes',
    title: 'Training Programmes',
    description:
      'Browse accelerators, workshops, and courses designed for women entrepreneurs.',
    image: IMAGES.offeringsDisplay,
  },
  {
    id: 'business-tools',
    title: 'Business Tools',
    description:
      'Templates, guides, and frameworks to help you plan, pitch, and scale.',
    image: IMAGES.businessTools,
  },
  {
    id: 'mentorship-network',
    title: 'Mentorship Network',
    description:
      "Connect with experienced founders and advisors who've built what you're building.",
    image: IMAGES.mentorshipNetwork,
  },
]

export function WhatWeOfferSection() {
  // Tracks which offering is currently highlighted/hovered.
  // Defaults to the first item so something is always shown on first render —
  // matches the Figma screenshot where "Training Programmes" starts active.
  const [activeId, setActiveId] = useState<string>(OFFERINGS[1].id)

  const activeOffering =
    OFFERINGS.find((offering) => offering.id === activeId) ?? OFFERINGS[0]

  return (
    <section
      id="what-we-offer"
      className="w-full bg-white px-6 py-12 sm:px-10 sm:py-16 md:px-16 lg:px-[146px] lg:py-[100px]"
    >
      <div className="flex flex-col gap-8 lg:gap-10">
        {/* Heading row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-12">
          <h2 className="text-content font-serif text-2xl sm:text-3xl md:text-4xl">
            What we offer
          </h2>
          <p className="text-content-secondary max-w-md text-sm leading-relaxed sm:text-base">
            Grants, loans, training programmes, and growth resources for
            women-led businesses
          </p>
        </div>

        {/* Interactive content: offering list (left) + image (right) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          {/* Left: hoverable list of offerings */}
          <ul role="list" className="flex flex-col gap-2">
            {OFFERINGS.map((offering) => (
              <li key={offering.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveId(offering.id)}
                  onFocus={() => setActiveId(offering.id)}
                  className={cn(
                    'w-full rounded-xl p-4 text-left transition-colors',
                    activeId === offering.id
                      ? 'bg-primary-subtle'
                      : 'hover:bg-surface-subtle',
                  )}
                >
                  <p className="text-content text-sm font-semibold sm:text-base">
                    {offering.title}
                  </p>
                  <p className="text-content-secondary mt-1 text-sm">
                    {offering.description}
                  </p>
                </button>
              </li>
            ))}
          </ul>

          {/* Right: image that swaps based on the active offering */}
          <img
            key={activeOffering.id}
            src={activeOffering.image}
            alt={activeOffering.title}
            className="aspect-[16/10] w-full rounded-2xl object-cover"
          />
        </div>
      </div>
    </section>
  )
}
