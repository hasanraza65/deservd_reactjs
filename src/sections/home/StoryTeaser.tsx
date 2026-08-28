import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'

/** Homepage teaser for "Our Story" — the full editorial version lives at /story. */
export function StoryTeaser() {
  return (
    <section className="bg-cream-200 py-16 sm:py-20" aria-labelledby="story-teaser-heading">
      <Container size="narrow" className="text-center">
        <Reveal>
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-blush-600">
            Our Story
          </p>
          <h2
            id="story-teaser-heading"
            className="mt-3 text-[clamp(1.75rem,1.2rem+2vw,2.5rem)] uppercase leading-[1.1] text-cocoa-900"
          >
            Built by Family.
            <br />
            Built with Purpose.
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <div className="mx-auto mt-7 flex max-w-xl flex-col gap-4 text-[15px] leading-relaxed text-cocoa-700 sm:text-base">
            <p>
              DESERV’D™ began as a father-and-daughter baking company with one question: why does eating
              better mean giving up dessert?
            </p>
            <p>We’re building DESERV’D to challenge that idea — starting with cookies.</p>
          </div>
        </Reveal>

        <Reveal delay={180}>
          <div className="mt-8">
            <Button to="/story" variant="outline" size="md">
              Read Our Story
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
