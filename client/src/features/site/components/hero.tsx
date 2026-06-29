import { IMAGES } from '#/assets/images'
import { Button } from '#/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative isolate flex min-h-[600px] w-full items-end overflow-hidden pb-10 sm:pb-14 lg:min-h-[952px] lg:pb-[64px]">
      {/* Background image */}
      <img
        src={IMAGES.headerImg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full object-cover"
      />

      {/* Dark overlay for text contrast */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
      />

      {/* Content */}
      <div className="mx-auto w-full max-w-7xl px-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-16 lg:gap-[64px]">
        <h1 className="text-content-inverse max-w-[20ch] font-serif text-3xl leading-tight sm:text-4xl md:text-5xl">
          Find Funding and Resources Built for You
        </h1>

        <div className="flex max-w-sm flex-col gap-5">
          <p className="text-content-inverse/90 text-sm sm:text-base">
            Grants, loans, training programmes, and growth resources for
            women-led businesses — searchable and always up to date.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              variant="primary"
              size="md"
              className="rounded-full"
            >
              <a href="/signup">Join the network</a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="md"
              className="border-content-inverse/40 text-content-inverse hover:bg-content-inverse/10 rounded-full bg-transparent"
            >
              <a href="#what-we-offer">Learn more</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Thin purple bar at bottom edge, per Figma */}
      <div
        aria-hidden="true"
        className="bg-primary absolute inset-x-0 bottom-0 -z-10 h-1"
      />
    </section>
  )
}
