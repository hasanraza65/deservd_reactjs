import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { useSeo } from '@/lib/seo'

export default function Story() {
  useSeo({
    title: 'Our Story',
    description:
      "The DESERV'D story — why we bake protein cookies that taste like real dessert instead of a protein bar.",
    path: '/story',
  })

  return (
    <div className="bg-cream-200">
      <section className="relative overflow-hidden bg-cocoa-950">
        <img
          src="/images/editorial/hero-cookie.jpg"
          alt="Hands breaking open a warm DESERV’D protein cookie"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cocoa-950 via-cocoa-950/40 to-cocoa-950/10" aria-hidden="true" />
        <Container className="relative flex min-h-[52vh] flex-col justify-end py-14 sm:min-h-[60vh] sm:py-20">
          <Reveal>
            <p className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-blush-300">
              Our Story
            </p>
            <h1 className="mt-3 max-w-2xl text-[clamp(2.25rem,1.5rem+3.2vw,4rem)] uppercase leading-[0.98] text-cream-50">
              Built by Family.
              <br />
              Built with Purpose.
            </h1>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container size="narrow">
          <Reveal>
            <div className="flex flex-col gap-6 text-[17px] leading-relaxed text-cocoa-800 sm:text-lg">
              <p className="font-script text-3xl leading-tight text-blush-500 sm:text-4xl">
                Why does eating better mean giving up dessert?
              </p>
              <p>
                DESERV’D™ began as a father-and-daughter baking company with one question — and we never
                found a good answer for why it had to be that way.
              </p>
              <p>
                We’re building DESERV’D to challenge that idea. Our mission is to create desserts that
                still feel like the foods you crave, while incorporating more protein and more purposeful
                nutrition.
              </p>
              <p>We’re starting with cookies. But the vision is much bigger.</p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-cocoa-900/10 bg-cream-100 py-16 sm:py-20">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div className="overflow-hidden rounded-lg">
                <img
                  src="/images/editorial/bakery-kitchen.jpg"
                  alt="A baker pulling a fresh tray of cookies from the oven"
                  loading="lazy"
                  className="aspect-4/3 w-full object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={90}>
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-blush-600">
                Baked Fresh
              </p>
              <h2 className="mt-3 text-[clamp(1.75rem,1.3rem+1.8vw,2.5rem)] uppercase leading-tight text-cocoa-900">
                Cookies should taste like cookies.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-cocoa-700 sm:text-base">
                Every DESERV’D cookie is baked fresh in small batches — not manufactured to hit a
                protein target and hope it still tastes like dessert. We started from the flavour first,
                then built the nutrition around it, not the other way around.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-16 text-center sm:py-20">
        <Container size="narrow">
          <Reveal>
            <p className="font-script text-3xl text-blush-500 sm:text-4xl">Every bite. Deserved.</p>
            <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-cocoa-700">
              That's the whole idea. Try the lineup and taste what we mean.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button to="/shop" size="lg">
                Shop Cookies
              </Button>
              <Button to="/build-a-box" variant="outline" size="lg">
                Build Your Box
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  )
}
