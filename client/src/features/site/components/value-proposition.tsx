import { IMAGES } from '#/assets/images'

export function ValuePropositionSection() {
  return (
    <section className="w-full bg-white py-12 sm:py-16 lg:py-[80px]">
      <div className="mx-auto w-full max-w-7xl px-6 flex flex-col gap-8">
        {/* Heading row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-12">
          <h2 className="text-content max-w-[18ch] font-serif text-2xl leading-snug sm:text-3xl md:text-4xl">
            We&rsquo;re building more than a database
          </h2>

          <p className="text-content-secondary max-w-md text-sm leading-relaxed sm:text-base">
            We track open grants, women-focused VC funds, angel networks,
            government schemes, accelerators, and the ecosystem shifts that
            matter — all in one structured place.
          </p>
        </div>

        {/* Image */}
        <img
          src={IMAGES.valuePropositionDisplay}
          alt="Women entrepreneurs collaborating in a co-working space"
          className="aspect-[790/385] w-full rounded-2xl object-cover"
        />

        {/* Two-column supporting text */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-20">
          <p className="text-content-secondary text-sm leading-relaxed sm:text-base">
            You get clear summaries, real deadlines, eligibility breakdowns, and
            direct application links. No digging. No insider spreadsheets. Just
            aligned access.
          </p>
          <p className="text-content-secondary text-sm leading-relaxed sm:text-base">
            Access straightforward summaries, firm deadlines, eligibility
            details, and direct links to apply. No searching, no secret files —
            just seamless, transparent access.
          </p>
        </div>
      </div>
    </section>
  )
}
