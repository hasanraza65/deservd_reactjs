import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { Accordion, AccordionItem } from '@/components/ui/Accordion'
import { TextAreaField } from '@/components/ui/Field'
import { ProductImage } from '@/components/product/ProductImage'
import { ProductCard } from '@/components/product/ProductCard'
import { IconCheck, IconStar } from '@/components/ui/Icon'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/context/AuthContext'
import { useAllProducts, useProduct } from '@/hooks/useCatalog'
import { reviewsApi } from '@/api/reviews'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/api'
import { formatPrice } from '@/lib/money'
import { primaryImageUrl } from '@/lib/productImage'
import { useSeo } from '@/lib/seo'
import { cn } from '@/lib/cn'
import NotFound from './NotFound'

function ReviewsPanel({ productId }: { productId: number }) {
  const { isAuthenticated } = useAuth()
  const { push } = useToast()
  const queryClient = useQueryClient()
  const { data } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => reviewsApi.forProduct(productId),
  })
  const reviews = data?.items ?? []

  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!content.trim()) {
      setError('Share a few words about the cookie.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await reviewsApi.submit({ product_id: productId, rating, title: title.trim() || undefined, content: content.trim() })
      setSubmitted(true)
      setTitle('')
      setContent('')
      setRating(5)
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] })
      push('Thanks — your review is awaiting approval.', 'success')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not submit your review.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-4 flex flex-col gap-6">
      {reviews.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {reviews.map((review) => (
            <li key={review.id} className="border-b border-cocoa-900/8 pb-4 last:border-0">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <IconStar key={i} className={cn('h-3.5 w-3.5', i < review.rating ? 'text-blush-500' : 'text-cocoa-200')} />
                ))}
              </div>
              {review.title ? <p className="mt-1.5 font-display text-sm font-bold text-cocoa-900">{review.title}</p> : null}
              <p className="mt-1 text-sm leading-relaxed text-cocoa-700">{review.content}</p>
              {review.customer_name ? <p className="mt-1.5 text-xs text-cocoa-500">{review.customer_name}</p> : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-cocoa-500">No reviews yet — be the first to try it.</p>
      )}

      {isAuthenticated ? (
        <form onSubmit={onSubmit} className="rounded-lg border border-cocoa-900/12 bg-cream-50 p-5">
          <p className="mb-3 font-display text-[11px] font-bold uppercase tracking-[0.08em] text-cocoa-700">
            Leave a review
          </p>
          <div className="mb-3 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button key={i} type="button" onClick={() => setRating(i + 1)} aria-label={`${i + 1} stars`}>
                <IconStar className={cn('h-5 w-5', i < rating ? 'text-blush-500' : 'text-cocoa-200')} />
              </button>
            ))}
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            className="mb-3 w-full rounded-md border border-cocoa-900/18 bg-cream-50 px-3.5 py-2.5 text-sm text-cocoa-900 outline-none focus:border-cocoa-900"
          />
          <TextAreaField
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What did you think?"
            rows={3}
            error={error ?? undefined}
          />
          <Button type="submit" size="sm" className="mt-3" disabled={submitting || submitted}>
            {submitted ? 'Submitted' : submitting ? 'Submitting…' : 'Submit Review'}
          </Button>
        </form>
      ) : (
        <p className="text-xs text-cocoa-500">
          <a href="/login" className="underline underline-offset-2 hover:text-blush-600">
            Log in
          </a>{' '}
          to leave a review.
        </p>
      )}
    </div>
  )
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { data: product, isLoading } = useProduct(slug)
  const { data: allProducts = [] } = useAllProducts()
  const navigate = useNavigate()
  const { add } = useCart()
  const { push } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  useSeo({
    title: product?.name ?? (isLoading ? 'Loading…' : 'Cookie not found'),
    description: product
      ? `${product.name} — ${product.short_description ?? ''} ${product.protein_grams ?? ''}g+ protein, baked fresh by DESERV'D.`
      : 'This cookie could not be found.',
    path: `/cookies/${slug ?? ''}`,
    image: product ? (primaryImageUrl(product) ?? undefined) : undefined,
    jsonLd: product
      ? {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description ?? product.short_description ?? '',
          offers: { '@type': 'Offer', priceCurrency: 'USD', price: product.price.toFixed(2) },
        }
      : undefined,
  })

  const related = useMemo(() => {
    if (!product) return []
    const sameCategory = allProducts.filter((p) => p.slug !== product.slug && p.category?.id === product.category?.id)
    const rest = allProducts.filter((p) => p.slug !== product.slug && p.category?.id !== product.category?.id)
    return [...sameCategory, ...rest].slice(0, 4)
  }, [allProducts, product])

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-cream-200">
        <p className="text-sm text-cocoa-500">Loading…</p>
      </div>
    )
  }

  if (!product) return <NotFound />

  const isXX = product.product_type === 'deservd_xx'
  const images = product.images.length > 0 ? product.images.map((img) => img.url) : [primaryImageUrl(product)]

  function handleAddToCart() {
    add(product!.id, quantity)
    setJustAdded(true)
    push(`${quantity}× ${product!.name} added to cart.`, 'success')
    window.setTimeout(() => setJustAdded(false), 1800)
  }

  function handleBuyNow() {
    add(product!.id, quantity)
    navigate('/checkout')
  }

  return (
    <div className="bg-cream-200">
      <section className="py-10 sm:py-14">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <div className="flex flex-col gap-3">
                <div
                  className={cn(
                    'relative overflow-hidden rounded-lg',
                    isXX ? 'bg-cocoa-900' : 'bg-cream-300',
                  )}
                >
                  <ProductImage
                    src={images[0]}
                    alt={product.name}
                    priority
                    className="aspect-square w-full"
                  />
                  {product.is_featured ? (
                    <span className="absolute right-0 top-0 bg-blush-500 px-3 py-1.5 font-display text-xs font-bold uppercase tracking-[0.14em] text-white">
                      Bestseller
                    </span>
                  ) : null}
                  {isXX ? (
                    <span className="absolute left-0 top-0 bg-cocoa-900 px-3 py-1.5 font-display text-xs font-bold uppercase tracking-[0.14em] text-blush-300">
                      DESERV’D XX™
                    </span>
                  ) : null}
                </div>

                {images.length > 1 ? (
                  <div className="grid grid-cols-5 gap-3">
                    {images.map((src, i) => (
                      <div key={i} className="overflow-hidden rounded-md bg-cream-300">
                        <ProductImage src={src} alt="" className="aspect-square w-full" />
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </Reveal>

            <Reveal delay={90}>
              <div>
                <p className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-blush-600">
                  {product.protein_grams}g Protein · {product.weight}
                </p>
                <h1 className="mt-2 text-[clamp(1.9rem,1.4rem+2vw,2.75rem)] uppercase leading-[1.05] text-cocoa-900">
                  {product.name}
                </h1>
                <p className="mt-3 text-[15px] leading-relaxed text-cocoa-700 sm:text-base">
                  {product.description ?? product.short_description}
                </p>

                <p className="mt-6 font-display text-2xl font-extrabold text-cocoa-900">
                  {formatPrice(product.price)}
                  {product.compare_at_price ? (
                    <span className="ml-2 text-base font-medium text-cocoa-400 line-through">
                      {formatPrice(product.compare_at_price)}
                    </span>
                  ) : null}
                </p>

                {!product.in_stock ? (
                  <p className="mt-3 text-sm font-bold text-blush-600">Currently out of stock.</p>
                ) : null}

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <QuantityStepper label={product.name} value={quantity} onChange={setQuantity} min={1} max={12} />

                  <div className="flex flex-1 min-w-[220px] gap-3">
                    <Button size="lg" className="flex-1" disabled={!product.in_stock} onClick={handleAddToCart}>
                      {justAdded ? (
                        <>
                          <IconCheck className="h-4 w-4" />
                          Added
                        </>
                      ) : (
                        'Add to Cart'
                      )}
                    </Button>
                    <Button size="lg" variant="dark" className="flex-1" disabled={!product.in_stock} onClick={handleBuyNow}>
                      Buy Now
                    </Button>
                  </div>
                </div>

                <Accordion className="mt-9 border-t border-cocoa-900/10">
                  <AccordionItem question="Nutrition" defaultOpen>
                    <dl className="grid grid-cols-3 gap-y-3 sm:grid-cols-6">
                      {[
                        ['Calories', product.calories ?? '—'],
                        ['Protein', `${product.protein_grams ?? '—'}g`],
                        ['Carbs', `${product.carbohydrates_grams ?? '—'}g`],
                        ['Sugars', `${product.sugar_grams ?? '—'}g`],
                        ['Fat', `${product.fat_grams ?? '—'}g`],
                        ['Fibre', `${product.fiber_grams ?? '—'}g`],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <dt className="text-xs uppercase tracking-wide text-cocoa-500">{label}</dt>
                          <dd className="font-display text-base font-extrabold text-cocoa-900">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </AccordionItem>

                  {product.ingredients.length > 0 ? (
                    <AccordionItem question="Ingredients">
                      <p>{product.ingredients.join(', ')}.</p>
                    </AccordionItem>
                  ) : null}

                  {product.allergens.length > 0 ? (
                    <AccordionItem question="Allergens">
                      <p>Contains: {product.allergens.join(', ')}.</p>
                    </AccordionItem>
                  ) : null}

                  {product.storage_info ? (
                    <AccordionItem question="Storage">
                      <p>{product.storage_info}</p>
                    </AccordionItem>
                  ) : null}

                  {product.shipping_info ? (
                    <AccordionItem question="Shipping">
                      <p>{product.shipping_info}</p>
                    </AccordionItem>
                  ) : null}

                  <AccordionItem question="Reviews">
                    <ReviewsPanel productId={product.id} />
                  </AccordionItem>
                </Accordion>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {related.length > 0 ? (
        <section className="border-t border-cocoa-900/10 py-14 sm:py-16">
          <Container>
            <Reveal>
              <h2 className="mb-8 text-[clamp(1.5rem,1.2rem+1.2vw,2rem)] uppercase leading-tight text-cocoa-900">
                You Might Also Like
              </h2>
            </Reveal>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 60}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </div>
  )
}
