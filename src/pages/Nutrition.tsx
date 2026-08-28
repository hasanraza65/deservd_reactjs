import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { ProductImage } from '@/components/product/ProductImage'
import { IconLeaf } from '@/components/ui/Icon'
import { INGREDIENTS } from '@/data/ingredients'
import { useAllProducts } from '@/hooks/useCatalog'
import { primaryImageUrl } from '@/lib/productImage'
import { useSeo } from '@/lib/seo'

const ALLERGENS = ['Milk', 'Eggs', 'Wheat', 'Soy', 'Nuts']

export default function Nutrition() {
  useSeo({
    title: 'Nutrition',
    description:
      "DESERV'D nutrition information — macros, ingredients and allergens for every protein cookie in the range.",
    path: '/nutrition',
  })

  const { data: products = [] } = useAllProducts()

  return (
    <div className="bg-cream-200">
      <section className="border-b border-cocoa-900/10 py-12 sm:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="What Is Inside"
              title="Nutrition"
              script="Real ingredients. Better cookies."
              subtitle="Full macros, ingredients and allergen information for every cookie we bake."
              flourish
            />
          </Reveal>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <Reveal>
            <div className="overflow-x-auto rounded-lg border border-cocoa-900/12 bg-cream-50">
              <table className="w-full min-w-[720px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-cocoa-900/10 text-left">
                    <th className="px-4 py-3 font-display text-[11px] font-bold uppercase tracking-wide text-cocoa-500">
                      Cookie
                    </th>
                    {['Calories', 'Protein', 'Carbs', 'Sugars', 'Fat', 'Fibre'].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-right font-display text-[11px] font-bold uppercase tracking-wide text-cocoa-500"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-cocoa-900/8">
                  {products.map((product) => (
                    <tr key={product.slug}>
                      <td className="flex items-center gap-3 px-4 py-3">
                        <ProductImage src={primaryImageUrl(product)} alt="" className="h-9 w-9 shrink-0 rounded-md" />
                        <span className="font-display text-[12.5px] font-bold uppercase tracking-[0.02em] text-cocoa-900">
                          {product.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-cocoa-700">{product.calories ?? '—'}</td>
                      <td className="px-4 py-3 text-right font-bold text-blush-600">{product.protein_grams ?? '—'}g</td>
                      <td className="px-4 py-3 text-right text-cocoa-700">{product.carbohydrates_grams ?? '—'}g</td>
                      <td className="px-4 py-3 text-right text-cocoa-700">{product.sugar_grams ?? '—'}g</td>
                      <td className="px-4 py-3 text-right text-cocoa-700">{product.fat_grams ?? '—'}g</td>
                      <td className="px-4 py-3 text-right text-cocoa-700">{product.fiber_grams ?? '—'}g</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </Container>
      </section>

      <section id="ingredients" className="border-t border-cocoa-900/10 bg-cream-100 py-14 sm:py-16">
        <Container>
          <Reveal>
            <h2 className="mb-8 text-center text-[clamp(1.5rem,1.2rem+1.2vw,2rem)] uppercase leading-tight text-cocoa-900">
              Ingredients Across the Range
            </h2>
          </Reveal>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 sm:gap-4">
            {INGREDIENTS.map((ingredient, i) => (
              <Reveal key={ingredient.name} delay={Math.min(i, 6) * 50}>
                <div className="flex flex-col items-center gap-2.5 text-center">
                  <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-full bg-cream-300">
                    {ingredient.image ? (
                      <img src={ingredient.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <IconLeaf className="h-7 w-7 text-cocoa-600" />
                    )}
                  </div>
                  <span className="font-display text-[11px] font-bold uppercase tracking-[0.06em] text-cocoa-800">
                    {ingredient.name}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-16">
        <Container size="narrow">
          <Reveal>
            <h2 className="mb-5 text-[clamp(1.4rem,1.15rem+1vw,1.85rem)] uppercase leading-tight text-cocoa-900">
              Allergens
            </h2>
            <p className="mb-5 text-[15px] leading-relaxed text-cocoa-700">
              Our kitchen handles the following allergens. Each product page lists exactly which apply to
              that flavour.
            </p>
            <div className="flex flex-wrap gap-2">
              {ALLERGENS.map((allergen) => (
                <span
                  key={allergen}
                  className="rounded-full border border-cocoa-900/15 bg-cream-50 px-3.5 py-1.5 text-sm font-medium text-cocoa-800"
                >
                  {allergen}
                </span>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  )
}
