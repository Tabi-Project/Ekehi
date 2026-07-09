import { IMAGES } from '#/assets/images'
import { Button } from '#/components/ui/button'

export function CtaSection() {
  return (
    <section className="border-line relative w-full overflow-hidden border-t-4 bg-purple-50 pt-8 pb-0 sm:pt-10 lg:h-[480px] lg:pt-[4px] lg:pb-[4px]">
      <div className="mx-auto w-full max-w-7xl px-6 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left: heading, copy, CTA */}
        <div className="flex flex-col gap-5">
          <h2 className="text-content font-serif text-3xl leading-tight sm:text-4xl md:text-5xl">
            Stop searching.
            <br />
            Start finding
          </h2>

          <p className="text-content-secondary max-w-md text-sm leading-relaxed sm:text-base">
            Discover grants, loans, and resources for women-led businesses —
            always current and easy to find.
          </p>

          <Button
            asChild
            variant="primary"
            size="md"
            className="self-start rounded-full"
          >
            <a href="/signup">Join the network</a>
          </Button>
        </div>

        {/* Right: photo */}
        <figure className="flex items-center justify-center">
          <img
            src={IMAGES.ctaSectionDisplay}
            alt="Women entrepreneurs"
            className="w-full max-w-md rounded-2xl object-cover"
          />
        </figure>
      </div>
    </section>
  )
}
