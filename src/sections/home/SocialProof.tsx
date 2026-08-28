import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { IconHeart } from '@/components/ui/Icon'

/**
 * Placeholder for real customer reviews. Deliberately not fabricated — swap the
 * contents of this component for a real reviews widget/testimonial list when
 * available; the surrounding section markup stays the same.
 */
export function SocialProof() {
  return (
    <section className="bg-cream-100 py-16 sm:py-20" aria-labelledby="reviews-heading">
      <Container size="narrow" className="text-center">
        <Reveal>
          <div className="flex flex-col items-center gap-5 rounded-lg border border-dashed border-cocoa-900/20 bg-cream-50 px-8 py-14">
            <IconHeart className="h-8 w-8 text-blush-400" />
            <h2
              id="reviews-heading"
              className="text-[clamp(1.5rem,1.2rem+1vw,2rem)] uppercase leading-tight text-cocoa-900"
            >
              Real Customer Reviews Coming Soon
            </h2>
            <p className="max-w-sm text-[15px] leading-relaxed text-cocoa-600">
              We’re collecting the first reviews from DESERV’D customers. This space is ready to drop them
              in the moment they land.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
