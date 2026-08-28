import { Reveal } from '@/components/ui/Reveal'

/** "BAKED FRESH." — full-bleed kitchen imagery with the brand's key differentiator. */
export function BakedFresh() {
  return (
    <section className="relative overflow-hidden bg-cocoa-950" aria-labelledby="baked-fresh-heading">
      <img
        src="/images/editorial/bakery-kitchen.jpg"
        alt="A baker pulling a fresh tray of DESERV’D cookies from the oven in the commercial kitchen"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-cocoa-950/55" aria-hidden="true" />

      <div className="relative flex min-h-[380px] items-center justify-center px-6 py-20 text-center sm:min-h-[440px]">
        <Reveal>
          <div className="flex flex-col items-center">
            <h2
              id="baked-fresh-heading"
              className="text-[clamp(2.25rem,1.6rem+3vw,3.75rem)] uppercase leading-[0.95] text-cream-50"
            >
              Baked Fresh.
            </h2>
            <p className="mt-4 font-script text-2xl text-blush-300 sm:text-3xl">
              Not made to taste like a protein bar.
            </p>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-cream-200 sm:text-base">
              Cookies should taste like cookies.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
