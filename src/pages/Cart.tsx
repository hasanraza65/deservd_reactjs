import { useState } from 'react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { CartLineItem } from '@/components/cart/CartLineItem'
import { FreeShippingBar } from '@/components/cart/FreeShippingBar'
import { IconCookie } from '@/components/ui/Icon'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { formatPrice } from '@/lib/money'
import { useSeo } from '@/lib/seo'

export default function Cart() {
  useSeo({
    title: 'Cart',
    description: "Review the cookies in your DESERV'D order before checkout.",
    path: '/cart',
    noIndex: true,
  })

  const { lines, pricing, isPricingLoading, pricingError, couponCode, applyCoupon, removeCoupon, isLoading, hasStoredItems } = useCart()
  const { push } = useToast()
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState<string | null>(null)
  const [isApplying, setIsApplying] = useState(false)

  async function onApplyDiscount(event: React.FormEvent) {
    event.preventDefault()
    setIsApplying(true)
    const result = await applyCoupon(code)
    setIsApplying(false)
    if (result.ok) {
      setCodeError(null)
      setCode('')
      push(result.message, 'success')
    } else {
      setCodeError(result.message)
    }
  }

  if (isLoading && hasStoredItems) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center bg-cream-200">
        <p className="text-sm text-cocoa-500">Loading…</p>
      </section>
    )
  }

  if (lines.length === 0) {
    return (
      <section className="bg-cream-200 py-20 sm:py-28">
        <Container size="narrow" className="text-center">
          <IconCookie className="mx-auto h-11 w-11 text-cocoa-300" />
          <h1 className="mt-5 text-[clamp(1.75rem,1.3rem+1.8vw,2.5rem)] uppercase leading-tight text-cocoa-900">
            Your Cart Is Craving Something.
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-cocoa-600">
            You haven't added any cookies yet. Let's fix that.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to="/shop" size="lg">
              Shop Cookies
            </Button>
            <Button to="/build-a-box" variant="outline" size="lg">
              Build a Box
            </Button>
          </div>
        </Container>
      </section>
    )
  }

  const subtotal = pricing?.subtotal ?? lines.reduce((sum, line) => sum + line.lineTotal, 0)

  return (
    <section className="bg-cream-200 py-12 sm:py-16">
      <Container>
        <Reveal>
          <SectionHeading as="h1" eyebrow="Your Order" title="Cart" align="left" />
        </Reveal>

        <div className="mt-9 grid gap-10 lg:grid-cols-[1fr_360px]">
          <Reveal className="min-w-0">
            <div className="rounded-lg border border-cocoa-900/12 bg-cream-50 px-5 sm:px-6">
              <div className="divide-y divide-cocoa-900/8">
                {lines.map((line) => (
                  <CartLineItem key={line.id} line={line} />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <Button to="/shop" variant="outline" size="md">
                Continue Shopping
              </Button>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="rounded-lg border border-cocoa-900/12 bg-cream-50 p-6">
              <h2 className="font-display text-sm font-bold uppercase tracking-[0.1em] text-cocoa-900">
                Order Summary
              </h2>

              <div className="mt-4 border-b border-cocoa-900/10 pb-4">
                <FreeShippingBar subtotal={subtotal} />
              </div>

              <form onSubmit={onApplyDiscount} className="mt-4 border-b border-cocoa-900/10 pb-4">
                <label htmlFor="discount" className="mb-1.5 block font-display text-[11px] font-bold uppercase tracking-[0.08em] text-cocoa-700">
                  Discount code
                </label>
                {couponCode ? (
                  <div className="flex items-center justify-between rounded-md border border-blush-300 bg-blush-50 px-3 py-2 text-sm">
                    <span className="font-bold text-blush-700">{couponCode}</span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs font-bold uppercase tracking-wide text-cocoa-600 underline underline-offset-2 hover:text-blush-600"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      id="discount"
                      type="text"
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value)
                        setCodeError(null)
                      }}
                      placeholder="Try DESERVD10"
                      className="w-full rounded-md border border-cocoa-900/18 bg-cream-50 px-3 py-2 text-sm text-cocoa-900 outline-none focus:border-cocoa-900"
                    />
                    <Button type="submit" variant="outline" size="sm" disabled={isApplying}>
                      {isApplying ? 'Applying…' : 'Apply'}
                    </Button>
                  </div>
                )}
                {codeError ? <p className="mt-1.5 text-xs text-blush-600">{codeError}</p> : null}
              </form>

              <div className="flex flex-col gap-2.5 border-b border-cocoa-900/10 py-4 text-sm">
                <div className="flex justify-between text-cocoa-700">
                  <span>Subtotal</span>
                  <span className="font-bold text-cocoa-900">{formatPrice(subtotal)}</span>
                </div>
                {pricing && pricing.discount > 0 ? (
                  <div className="flex justify-between text-blush-600">
                    <span>Discount</span>
                    <span className="font-bold">−{formatPrice(pricing.discount)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-cocoa-700">
                  <span>Estimated shipping</span>
                  <span className="font-bold text-cocoa-900">
                    {isPricingLoading || !pricing
                      ? '—'
                      : pricing.shipping === 0
                        ? 'Free'
                        : formatPrice(pricing.shipping)}
                  </span>
                </div>
                {pricing && pricing.tax > 0 ? (
                  <div className="flex justify-between text-cocoa-700">
                    <span>Tax</span>
                    <span className="font-bold text-cocoa-900">{formatPrice(pricing.tax)}</span>
                  </div>
                ) : null}
              </div>

              {pricingError ? <p className="pt-3 text-xs text-blush-600">{pricingError}</p> : null}

              <div className="flex items-center justify-between py-4">
                <span className="font-display text-sm font-bold uppercase tracking-wide text-cocoa-900">
                  Total
                </span>
                <span className="font-display text-xl font-extrabold text-cocoa-900">
                  {isPricingLoading || !pricing ? formatPrice(subtotal) : formatPrice(pricing.total)}
                </span>
              </div>

              {isPricingLoading || !pricing ? (
                <Button type="button" size="lg" fullWidth disabled>
                  Proceed to Checkout
                </Button>
              ) : (
                <Button to="/checkout" size="lg" fullWidth>
                  Proceed to Checkout
                </Button>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
