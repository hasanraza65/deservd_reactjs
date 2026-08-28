import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { ProductCard } from '@/components/product/ProductCard'
import { useAllProducts } from '@/hooks/useCatalog'

/** "FIND YOUR FAVORITE" — the signature (non-XX) flavours, live from the catalogue. */
export function CookieCollection() {
  const { data: products = [] } = useAllProducts()
  const signature = products.filter((p) => p.product_type === 'standard').slice(0, 6)

  return (
    <section className="bg-cream-200 py-16 sm:py-20" aria-labelledby="collection-heading">
      <Container>
        <Reveal>
          <SectionHeading
            as="h2"
            eyebrow="The Lineup"
            title={<span id="collection-heading">Find Your Favorite</span>}
            subtitle="Big flavour. More protein. Real dessert."
            flourish
          />
        </Reveal>

        <div className="mt-11 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6">
          {signature.map((product, i) => (
            <Reveal key={product.slug} delay={Math.min(i, 4) * 70}>
              <ProductCard product={product} priority={i < 2} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={140}>
          <div className="mt-11 flex justify-center">
            <Button to="/shop" variant="outline" size="lg">
              Shop All Cookies
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
