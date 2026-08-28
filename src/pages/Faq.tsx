import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { Accordion, AccordionItem } from '@/components/ui/Accordion'
import { FAQ_ITEMS } from '@/data/faq'
import { useSeo } from '@/lib/seo'

export default function Faq() {
  useSeo({
    title: 'FAQ',
    description:
      "Answers to the most common DESERV'D questions — shipping and delivery, storage, protein content, allergens and returns.",
    path: '/faq',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_ITEMS.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  })

  return (
    <section className="bg-cream-200 py-14 sm:py-20">
      <Container size="narrow">
        <Reveal>
          <SectionHeading
            as="h1"
            eyebrow="Good to Know"
            title="FAQ"
            subtitle="Shipping, storage, macros and everything else people ask us most."
          />
        </Reveal>

        <Reveal delay={90}>
          <Accordion className="mt-10 rounded-lg border border-cocoa-900/12 bg-cream-50 px-5 sm:px-7">
            {FAQ_ITEMS.map((item) => (
              <AccordionItem key={item.id} question={item.question}>
                <p>{item.answer}</p>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Container>
    </section>
  )
}
