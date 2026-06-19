import { SVGS } from '#/assets/svgs'

export function MissionSection() {
  return (
    <section className="flex min-h-[320px] w-full flex-col items-center justify-center gap-6 bg-white px-6 py-16 text-center sm:px-10 md:px-16 lg:min-h-[500px] lg:px-[146px]">
      {/* "Our mission" label with flourishes */}
      <div className="flex items-center gap-3">
        <img
          src={SVGS.bottomLeftDeco}
          alt=""
          aria-hidden="true"
          className="h-4 w-8 opacity-60"
        />
        <span className="text-content-muted text-xs font-medium tracking-wide uppercase">
          Our mission
        </span>
        <img
          src={SVGS.bottomRightDeco}
          alt=""
          aria-hidden="true"
          className="h-4 w-8 opacity-60"
        />
      </div>

      {/* Headline */}
      <h2 className="text-content max-w-3xl font-serif text-2xl leading-snug sm:text-3xl md:text-4xl">
        Helping you discover funding and resources tailored to your needs.
      </h2>
    </section>
  )
}
