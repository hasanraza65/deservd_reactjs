import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { IconDumbbell, IconHeart, IconLeaf, IconProtein } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

const PILLARS = [
  {
    icon: IconProtein,
    title: '13g+ Protein',
    copy: 'Every standard DESERV’D cookie.',
  },
  {
    icon: IconDumbbell,
    title: '20g Protein',
    copy: 'Available in selected 150g DESERV’D XX cookies.',
  },
  {
    icon: IconLeaf,
    title: 'Macro Conscious',
    copy: 'Designed with protein, carbohydrates and fats in mind.',
  },
  {
    icon: IconHeart,
    title: 'Real Dessert',
    copy: 'Soft. Thick. Chewy. Decadent.',
  },
]

/** "DESSERT SHOULD DO MORE." — the brand's functional case, made without sounding like a supplement label. */
export function WhyDeservd() {
  return (
    <section className="bg-cocoa-900 py-16 text-cream-100 sm:py-20" aria-labelledby="why-heading">
      <Container>
        <Reveal>
          <SectionHeading
            as="h2"
            eyebrow="Why DESERV’D"
            title={<span id="why-heading">Dessert Should Do More.</span>}
            tone="light"
            subtitle="Traditional desserts weren't designed around today's nutritional goals. We're changing that."
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-cream-100/10 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 90} className="h-full">
              <div
                className={cn(
                  'flex h-full flex-col gap-4 bg-cocoa-900 p-7 transition-colors duration-300',
                  'hover:bg-cocoa-800',
                )}
              >
                <pillar.icon className="h-8 w-8 text-blush-400" />
                <h3 className="font-display text-lg font-extrabold uppercase tracking-[0.02em]">
                  {pillar.title}
                </h3>
                <p className="text-sm leading-relaxed text-cream-300">{pillar.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
