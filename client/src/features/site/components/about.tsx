import { SVGS } from '#/assets/svgs'
import { Button } from '#/components/ui/button'

export function AboutSection() {
  return (
    <section className="relative isolate overflow-hidden bg-purple-800 px-6 py-12 sm:px-10 sm:py-16 md:px-16 lg:px-[146px] lg:py-[60px]">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between sm:gap-12 lg:gap-16">
        {/* Wordmark */}
        <h2 className="text-content-inverse flex items-center gap-3 font-serif text-3xl sm:text-4xl">
          <span>About</span>
          <span className="italic">Ekehi</span>
          <img
            src={SVGS.flower}
            alt=""
            aria-hidden="true"
            className="size-7 sm:size-8"
          />
        </h2>

        {/* Description + CTA */}
        <div className="flex max-w-md flex-col gap-5">
          <p className="text-content-inverse/90 text-sm leading-relaxed sm:text-base">
            Ekehi is a business intelligence platform for women entrepreneurs
            and SME owners — providing a searchable database of active funding
            opportunities (VCs, grants, loans, credit schemes), business
            training programmes, and growth resources, all filterable by sector,
            stage, location, and funding size.
          </p>

          <Button
            asChild
            variant="secondary"
            size="md"
            className="self-start rounded-full"
          >
            <a href="#what-we-offer">Learn more</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
