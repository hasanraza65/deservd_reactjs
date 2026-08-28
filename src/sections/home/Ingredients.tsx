import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { IconLeaf } from '@/components/ui/Icon'
import { INGREDIENTS } from '@/data/ingredients'

/** "WHAT GOES INTO DESERV'D?" — the real-ingredients showcase. */
export function Ingredients() {
  return (
    <section id="ingredients" className="bg-cream-100 py-16 sm:py-20" aria-labelledby="ingredients-heading">
      <Container>
        <Reveal>
          <SectionHeading
            as="h2"
            eyebrow="Real Ingredients"
            title={<span id="ingredients-heading">What Goes Into DESERV’D?</span>}
            script="Better cookies."
          />
        </Reveal>

        <div className="mt-11 grid grid-cols-3 gap-3 sm:grid-cols-5 sm:gap-4">
          {INGREDIENTS.map((ingredient, i) => (
            <Reveal key={ingredient.name} delay={Math.min(i, 6) * 55}>
              <div className="flex flex-col items-center gap-2.5 text-center">
                <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-full bg-cream-300">
                  {ingredient.image ? (
                    <img
                      src={ingredient.image}
                      alt={ingredient.name}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <IconLeaf className="h-7 w-7 text-cocoa-600" />
                  )}
                </div>
                <span className="font-display text-[11px] font-bold uppercase tracking-[0.06em] text-cocoa-800 sm:text-xs">
                  {ingredient.name}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-12 flex flex-col items-center gap-5 text-center">
            <p className="font-script text-2xl text-blush-500 sm:text-3xl">
              Ingredients you recognize. Dessert you crave.
            </p>
            <Button to="/nutrition" variant="outline" size="md">
              See full nutrition
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
