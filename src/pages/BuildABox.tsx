import { useMemo, useState } from 'react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { SelectableCard } from '@/components/ui/SelectableCard'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { ProductImage } from '@/components/product/ProductImage'
import { IconBox, IconCheck } from '@/components/ui/Icon'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { useBuildABoxOptions } from '@/hooks/useCatalog'
import { formatPrice } from '@/lib/money'
import { primaryImageUrl } from '@/lib/productImage'
import { useSeo } from '@/lib/seo'
import { cn } from '@/lib/cn'

export default function BuildABox() {
  useSeo({
    title: 'Build Your Box',
    description: "Build your own DESERV'D box — choose 4, 6, 8 or 12 protein cookies and mix any flavours you like.",
    path: '/build-a-box',
  })

  const { addBox, openDrawer } = useCart()
  const { push } = useToast()
  const { data, isLoading } = useBuildABoxOptions()
  const boxOptions = useMemo(() => (data?.box_options ?? []).slice().sort((a, b) => a.size - b.size), [data])
  const eligibleProducts = data?.eligible_products ?? []

  const [size, setSize] = useState<number | null>(null)
  const [selections, setSelections] = useState<Record<number, number>>({})
  const [justAdded, setJustAdded] = useState(false)

  const activeSize = size ?? boxOptions[0]?.size ?? 0
  const total = useMemo(() => Object.values(selections).reduce((sum, qty) => sum + qty, 0), [selections])
  const remaining = activeSize - total
  const isComplete = activeSize > 0 && total === activeSize
  const priceForSize = (s: number) => boxOptions.find((o) => o.size === s)?.price ?? 0

  function setQty(productId: number, qty: number) {
    setJustAdded(false)
    setSelections((current) => {
      const next = { ...current }
      if (qty <= 0) delete next[productId]
      else next[productId] = qty
      return next
    })
  }

  function changeSize(nextSize: number) {
    setSize(nextSize)
    setJustAdded(false)
    setSelections((current) => {
      let budget = nextSize
      const next: Record<number, number> = {}
      for (const [id, qty] of Object.entries(current)) {
        if (budget <= 0) break
        const take = Math.min(qty, budget)
        next[Number(id)] = take
        budget -= take
      }
      return next
    })
  }

  function handleAddBox() {
    const boxSelections = Object.entries(selections).map(([productId, quantity]) => ({
      productId: Number(productId),
      quantity,
    }))
    addBox(activeSize, boxSelections)
    setSelections({})
    setJustAdded(true)
    push(`Your ${activeSize}-cookie box was added to cart.`, 'success')
    openDrawer()
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-cream-200">
        <p className="text-sm text-cocoa-500">Loading…</p>
      </div>
    )
  }

  return (
    <div className="bg-cream-200">
      <section className="border-b border-cocoa-900/10 py-12 sm:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              as="h1"
              eyebrow="Mix Your Own"
              title="Build Your Box"
              script="Choose. Pick. Enjoy."
              subtitle="Pick your box size, choose your cookies, and we bake them fresh to order."
              flourish
            />
          </Reveal>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <div className="flex flex-col gap-10">
              <Reveal>
                <div>
                  <h2 className="mb-4 font-display text-xs font-bold uppercase tracking-[0.14em] text-cocoa-500">
                    1. Choose your size
                  </h2>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {boxOptions.map((option) => (
                      <SelectableCard
                        key={option.size}
                        name="box-size"
                        value={String(option.size)}
                        checked={activeSize === option.size}
                        onChange={() => changeSize(option.size)}
                        className="items-center py-5 text-center"
                      >
                        <span className="font-display text-2xl font-extrabold text-cocoa-900">{option.size}</span>
                        <span className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-cocoa-600">
                          Cookies
                        </span>
                        <span className="mt-1 text-xs text-blush-600">{formatPrice(option.price)}</span>
                      </SelectableCard>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={70}>
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-display text-xs font-bold uppercase tracking-[0.14em] text-cocoa-500">
                      2. Pick your cookies
                    </h2>
                    <span
                      className={cn(
                        'font-display text-xs font-bold uppercase tracking-[0.1em]',
                        isComplete ? 'text-blush-600' : 'text-cocoa-600',
                      )}
                      aria-live="polite"
                    >
                      {total} / {activeSize} Cookies
                    </span>
                  </div>

                  <div className="flex flex-col divide-y divide-cocoa-900/8 rounded-lg border border-cocoa-900/12 bg-cream-50">
                    {eligibleProducts.map((product) => {
                      const qty = selections[product.id] ?? 0
                      const canIncrease = remaining > 0
                      return (
                        <div key={product.id} className="flex items-center gap-4 px-4 py-3.5 sm:px-5">
                          <ProductImage
                            src={primaryImageUrl(product)}
                            alt=""
                            className="h-14 w-14 shrink-0 rounded-md"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-display text-[13px] font-bold uppercase tracking-[0.02em] text-cocoa-900">
                              {product.name}
                            </p>
                            <p className="text-xs text-cocoa-500">{product.protein_grams}g protein · {product.weight}</p>
                          </div>
                          <QuantityStepper
                            size="sm"
                            label={product.name}
                            value={qty}
                            min={0}
                            max={qty + Math.max(0, remaining)}
                            disabled={qty === 0 && !canIncrease}
                            onChange={(next) => setQty(product.id, next)}
                          />
                        </div>
                      )
                    })}
                  </div>

                  {remaining > 0 ? (
                    <p className="mt-3 text-sm text-cocoa-600">
                      Add {remaining} more {remaining === 1 ? 'cookie' : 'cookies'} to complete your box.
                    </p>
                  ) : null}
                </div>
              </Reveal>
            </div>

            <Reveal delay={130} className="lg:sticky lg:top-28 lg:h-fit">
              <div className="rounded-lg border border-cocoa-900/12 bg-cream-50 p-6">
                <h2 className="font-display text-sm font-bold uppercase tracking-[0.1em] text-cocoa-900">
                  3. Enjoy
                </h2>

                {isComplete ? (
                  <div className="mt-4 flex items-center gap-2 rounded-md bg-blush-50 px-3 py-2.5 text-sm font-bold text-blush-700">
                    <IconCheck className="h-4 w-4 shrink-0" />
                    Your box is ready!
                  </div>
                ) : (
                  <p className="mt-4 flex items-center gap-2 text-sm text-cocoa-600">
                    <IconBox className="h-4 w-4 shrink-0 text-cocoa-400" />
                    Pick {activeSize} cookies to complete your box.
                  </p>
                )}

                <div className="mt-5 flex flex-col gap-2.5 border-t border-cocoa-900/10 pt-4">
                  {Object.entries(selections).map(([productId, qty]) => {
                    const product = eligibleProducts.find((p) => p.id === Number(productId))
                    if (!product) return null
                    return (
                      <div key={productId} className="flex justify-between text-sm text-cocoa-700">
                        <span>
                          {qty}× {product.name}
                        </span>
                      </div>
                    )
                  })}
                  {Object.keys(selections).length === 0 ? (
                    <p className="text-sm text-cocoa-500">No cookies selected yet.</p>
                  ) : null}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-cocoa-900/10 pt-4">
                  <span className="font-display text-sm font-bold uppercase tracking-wide text-cocoa-900">
                    Box price
                  </span>
                  <span className="font-display text-xl font-extrabold text-cocoa-900">
                    {formatPrice(priceForSize(activeSize))}
                  </span>
                </div>

                <Button
                  size="lg"
                  fullWidth
                  className="mt-5"
                  disabled={!isComplete}
                  onClick={handleAddBox}
                >
                  {justAdded ? 'Added to Cart' : 'Add Box to Cart'}
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </div>
  )
}
