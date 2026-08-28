import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useSeo } from '@/lib/seo'

export default function NotFound() {
  useSeo({
    title: 'Page not found',
    description: 'That page has been eaten. Browse the full DESERV\u2019D cookie range instead.',
    path: '/404',
    noIndex: true,
  })

  return (
    <section className="bg-cream-200">
      <Container size="narrow" className="py-24 text-center sm:py-32">
        <SectionHeading
          as="h1"
          eyebrow="404"
          title="This one got eaten"
          script="Nothing to see here."
          subtitle="The page you were after does not exist. The cookies, thankfully, still do."
        />
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button to="/shop" size="lg">
            Shop cookies
          </Button>
          <Button to="/" variant="outline" size="lg">
            Back to home
          </Button>
        </div>
      </Container>
    </section>
  )
}
