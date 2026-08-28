import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { SITE } from '@/data/site'
import { IconInstagram } from '@/components/ui/Icon'

const GRID_IMAGES = [
  '/images/cookies/triple-chocolate.jpg',
  '/images/cookies/smores.jpg',
  '/images/editorial/hero-cookie.jpg',
  '/images/cookies/apple-cinnamon-cobbler.jpg',
  '/images/cookies/nutella-biscoff.jpg',
  '/images/cookies/birthday-cake.jpg',
]

/** "FOLLOW THE CRAVING" — editorial Instagram grid linking out to the real profile. */
export function InstagramGrid() {
  return (
    <section className="bg-cream-200 py-16 sm:py-20" aria-labelledby="instagram-heading">
      <Container>
        <Reveal>
          <div className="mb-9 flex flex-col items-center gap-2 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
            <div>
              <p className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-blush-600">
                @deservdcookies
              </p>
              <h2
                id="instagram-heading"
                className="mt-2 text-[clamp(1.75rem,1.3rem+1.8vw,2.5rem)] uppercase leading-tight text-cocoa-900"
              >
                Follow the Craving
              </h2>
            </div>
            <a
              href={SITE.instagram.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.12em] text-cocoa-900 transition-colors hover:text-blush-600"
            >
              <IconInstagram className="h-4.5 w-4.5" />
              {SITE.instagram.handle}
            </a>
          </div>
        </Reveal>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
          {GRID_IMAGES.map((src, i) => (
            <Reveal key={src} delay={i * 60}>
              <a
                href={SITE.instagram.url}
                target="_blank"
                rel="noreferrer"
                aria-label="View DESERV’D on Instagram"
                className="group relative block aspect-square overflow-hidden rounded-md bg-cream-300"
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-cocoa-950/0 transition-colors duration-300 group-hover:bg-cocoa-950/25">
                  <IconInstagram className="h-6 w-6 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
