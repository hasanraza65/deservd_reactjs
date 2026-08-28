import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { ProductCard } from '@/components/product/ProductCard'
import { SelectField } from '@/components/ui/Field'
import { IconCookie, IconSearch } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { useCategories, useProducts } from '@/hooks/useCatalog'
import type { ProductListParams } from '@/api/catalog'
import { useSeo } from '@/lib/seo'
import { cn } from '@/lib/cn'

type SortKey = NonNullable<ProductListParams['sort']>

const SORT_LABELS: Record<SortKey, string> = {
  featured: 'Featured',
  price_asc: 'Price: Low to High',
  price_desc: 'Price: High to Low',
  name: 'Name: A to Z',
}

export default function Shop() {
  useSeo({
    title: 'Shop Cookies',
    description:
      "Shop the full DESERV'D range of bakery-style protein cookies. 13g+ protein, baked fresh in small batches, macro conscious.",
    path: '/shop',
  })

  const [params, setParams] = useSearchParams()
  const { data: categories = [] } = useCategories()

  const category = params.get('category') ?? 'all'
  const query = params.get('q') ?? ''
  const sort = (params.get('sort') as SortKey) || 'featured'
  const productType = params.get('type') ?? 'all' // 'all' | 'standard' | 'deservd_xx'

  function updateParam(key: string, value: string | null) {
    const next = new URLSearchParams(params)
    if (!value || value === 'all') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const queryParams = useMemo<ProductListParams>(
    () => ({
      per_page: 48,
      sort,
      ...(category !== 'all' ? { category } : {}),
      ...(productType !== 'all' ? { product_type: productType } : {}),
      ...(query.trim() ? { q: query.trim() } : {}),
    }),
    [category, productType, query, sort],
  )

  const { data, isLoading } = useProducts(queryParams)
  const products = data?.items ?? []

  const hasActiveFilters = category !== 'all' || productType !== 'all' || Boolean(query)

  function clearFilters() {
    setParams(new URLSearchParams(), { replace: true })
  }

  return (
    <div className="bg-cream-200">
      <section className="border-b border-cocoa-900/10 py-12 sm:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="The Full Range"
              title="Shop Cookies"
              script="Big flavour. More protein."
              subtitle="Every DESERV'D cookie, baked fresh in small batches with 13g+ of protein."
              flourish
            />
          </Reveal>
        </Container>
      </section>

      <section className="py-10 sm:py-14">
        <Container>
          <div className="flex flex-col gap-5 border-b border-cocoa-900/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => updateParam('q', e.target.value || null)}
                placeholder="Search flavours…"
                aria-label="Search cookies"
                className="w-full rounded-md border border-cocoa-900/18 bg-cream-50 py-2.5 pl-9 pr-3 text-sm text-cocoa-900 outline-none focus:border-cocoa-900"
              />
            </div>

            <div className="flex items-center gap-3">
              <SelectField
                aria-label="Line"
                value={productType}
                onChange={(e) => updateParam('type', e.target.value)}
                className="min-w-[9.5rem]"
              >
                <option value="all">All Lines</option>
                <option value="standard">Signature (13g)</option>
                <option value="deservd_xx">DESERV'D XX (20g)</option>
              </SelectField>

              <SelectField
                aria-label="Sort by"
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="min-w-[10.5rem]"
              >
                {Object.entries(SORT_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </SelectField>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => updateParam('category', 'all')}
              aria-pressed={category === 'all'}
              className={cn(
                'rounded-full border px-4 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.08em] transition-colors',
                category === 'all'
                  ? 'border-cocoa-900 bg-cocoa-900 text-cream-100'
                  : 'border-cocoa-900/20 text-cocoa-700 hover:border-cocoa-900/50',
              )}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => updateParam('category', cat.slug)}
                aria-pressed={category === cat.slug}
                className={cn(
                  'rounded-full border px-4 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.08em] transition-colors',
                  category === cat.slug
                    ? 'border-cocoa-900 bg-cocoa-900 text-cream-100'
                    : 'border-cocoa-900/20 text-cocoa-700 hover:border-cocoa-900/50',
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <p className="mt-5 text-sm text-cocoa-500" aria-live="polite">
            {isLoading ? 'Loading…' : `${products.length} ${products.length === 1 ? 'cookie' : 'cookies'}`}
          </p>

          {!isLoading && products.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <IconCookie className="h-10 w-10 text-cocoa-300" />
              <p className="font-display text-lg font-extrabold uppercase text-cocoa-900">
                No cookies match your search.
              </p>
              <Button variant="outline" onClick={clearFilters} disabled={!hasActiveFilters}>
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {products.map((product, i) => (
                <Reveal key={product.slug} delay={Math.min(i, 6) * 50}>
                  <ProductCard product={product} priority={i < 4} />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  )
}
