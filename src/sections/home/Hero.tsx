import { BENEFITS, type BenefitKey } from '@/data/nav'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { IconHeart, IconLeaf, IconOven, IconProtein } from '@/components/ui/Icon'

const ICONS: Record<BenefitKey, typeof IconHeart> = {
  protein: IconProtein,
  baked: IconOven,
  macro: IconLeaf,
  dessert: IconHeart,
}

/** Two-line benefit labels, so the row keeps an even rhythm at every width. */
const BENEFIT_LINES: Record<BenefitKey, [string, string]> = {
  protein: ['13G+', 'Protein'],
  baked: ['Baked', 'Fresh'],
  macro: ['Macro', 'Conscious'],
  dessert: ['Real', 'Dessert'],
}

function BenefitRow() {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 sm:gap-x-0">
      {BENEFITS.map((benefit, i) => {
        const Glyph = ICONS[benefit.key]
        const [first, second] = BENEFIT_LINES[benefit.key]
        return (
          <li
            key={benefit.key}
            className={
              i > 0
                ? 'flex min-w-0 items-center gap-2.5 sm:border-l sm:border-cocoa-900/15 sm:pl-3.5'
                : 'flex min-w-0 items-center gap-2.5 sm:pr-3.5'
            }
          >
            <Glyph className="h-6 w-6 shrink-0 text-blush-500 sm:h-6.5 sm:w-6.5" />
            <span className="font-display text-[10px] font-bold uppercase leading-[1.3] tracking-[0.045em] sm:text-[10.5px] text-cocoa-900">
              {first}
              <br />
              {second}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream-200" aria-labelledby="hero-heading">
      <Container className="relative">
        <div className="max-w-[560px] py-12 sm:py-16 lg:w-[48%] lg:max-w-none lg:py-24 xl:py-28">
          <Reveal>
            <h1
              id="hero-heading"
              className="font-display text-[clamp(2.6rem,1.2rem+5.4vw,5rem)] font-black uppercase leading-[0.92] tracking-[-0.035em]"
            >
              <span className="block text-cocoa-900">Every Bite.</span>
              <span className="block text-blush-500">Deserved.</span>
            </h1>
          </Reveal>

          <Reveal delay={110}>
            <p className="relative mt-3 inline-block font-script text-[clamp(1.5rem,1.1rem+1.6vw,2.4rem)] leading-tight text-cocoa-900">
              The Healthier Choice.
              <svg
                className="absolute -bottom-1 left-0 w-full text-cocoa-900"
                viewBox="0 0 200 7"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M2 5.2C38 2.4 76 1.4 114 2.1c28 .5 56 1.5 84 3"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </p>
          </Reveal>

          <Reveal delay={190}>
            <p className="mt-7 max-w-md text-[15px] leading-relaxed text-cocoa-700 sm:text-base">
              Bakery-style cookies created to taste like dessert — with protein and more purposeful
              macros.
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Button to="/shop" size="lg">
                Shop Cookies
              </Button>
              <Button to="/build-a-box" variant="outline" size="lg">
                Build Your Box
              </Button>
            </div>
          </Reveal>

          <Reveal delay={340}>
            <div className="mt-11 border-t border-cocoa-900/15 pt-7 lg:mt-14">
              <BenefitRow />
            </div>
          </Reveal>
        </div>
      </Container>

      {/* Photograph: below the copy on small screens, bled to the right edge from
          lg up so the cookie stays the focal point. Absolute from lg, so DOM
          order puts the headline first on mobile without a second markup path. */}
      <div className="mt-2 sm:mt-4 lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:w-[52%] xl:w-[54%]">
        <img
          src="/images/editorial/hero-cookie.jpg"
          alt="Hands breaking open a warm DESERV’D protein cookie topped with fruit and crumble"
          width={1402}
          height={915}
          fetchPriority="high"
          decoding="async"
          className="hero-photo-mask h-[58vw] max-h-[380px] w-full object-cover object-[52%_45%] sm:h-[42vw] lg:h-full lg:max-h-none"
        />
      </div>
    </section>
  )
}
