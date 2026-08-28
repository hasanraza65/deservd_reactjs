import type { ReactNode } from 'react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { useSeo } from '@/lib/seo'

/** Shared shell for the long-form legal/support pages. */
export function LegalPage({
  title,
  updated,
  description,
  path,
  children,
}: {
  title: string
  updated: string
  description: string
  path: string
  children: ReactNode
}) {
  useSeo({ title, description, path, noIndex: true })

  return (
    <section className="bg-cream-200">
      <Container size="narrow" className="py-14 sm:py-20">
        <Reveal>
          <SectionHeading as="h1" eyebrow={`Last updated ${updated}`} title={title} align="left" />
        </Reveal>

        <Reveal delay={90}>
          <div className="prose-legal mt-10 flex flex-col gap-7 text-[15px] leading-relaxed text-cocoa-700">
            {children}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="mb-2.5 font-display text-lg font-extrabold uppercase tracking-[0.02em] text-cocoa-900">
        {heading}
      </h2>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  )
}
