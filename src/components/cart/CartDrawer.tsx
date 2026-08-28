import { useEffect, useRef } from 'react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/money'
import { Button } from '@/components/ui/Button'
import { Wordmark } from '@/components/ui/Wordmark'
import { IconClose, IconCookie } from '@/components/ui/Icon'
import { CartLineItem } from './CartLineItem'
import { FreeShippingBar } from './FreeShippingBar'
import { cn } from '@/lib/cn'

/** Reusable slide-in cart drawer, opened from the header cart icon. */
export function CartDrawer() {
  const { lines, pricing, isPricingLoading, isDrawerOpen, closeDrawer } = useCart()
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isDrawerOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDrawer()
    }

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isDrawerOpen, closeDrawer])

  const subtotal = pricing?.subtotal ?? lines.reduce((sum, line) => sum + line.lineTotal, 0)

  return (
    <div className={cn(!isDrawerOpen && 'pointer-events-none')} aria-hidden={!isDrawerOpen}>
      <div
        onClick={closeDrawer}
        className={cn(
          'fixed inset-0 z-[60] bg-cocoa-950/45 transition-opacity duration-300 ease-[var(--ease-out-soft)]',
          isDrawerOpen ? 'opacity-100' : 'opacity-0',
        )}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Cart"
        className={cn(
          'fixed inset-y-0 right-0 z-[60] flex w-[90%] max-w-md flex-col bg-cream-100',
          'transition-transform duration-400 ease-[var(--ease-out-soft)]',
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-cocoa-900/10 px-6 py-5">
          <h2 className="font-display text-base font-extrabold uppercase tracking-[0.06em] text-cocoa-900">
            Your Cart {lines.length > 0 ? `(${lines.length})` : ''}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeDrawer}
            aria-label="Close cart"
            className="-mr-2 p-2 text-cocoa-900 transition-colors hover:text-blush-600"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <IconCookie className="h-10 w-10 text-cocoa-300" />
            <p className="font-display text-lg font-extrabold uppercase text-cocoa-900">
              Your cart is craving something.
            </p>
            <Button to="/shop" onClick={closeDrawer}>
              Shop Cookies
            </Button>
          </div>
        ) : (
          <>
            <div className="border-b border-cocoa-900/10 px-6 py-4">
              <FreeShippingBar subtotal={subtotal} />
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              <div className="divide-y divide-cocoa-900/8">
                {lines.map((line) => (
                  <CartLineItem key={line.id} line={line} compact />
                ))}
              </div>
            </div>

            <div className="border-t border-cocoa-900/10 px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-display text-sm font-bold uppercase tracking-wide text-cocoa-700">
                  Subtotal
                </span>
                <span className="font-display text-base font-extrabold text-cocoa-900">
                  {isPricingLoading ? '…' : formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                <Button to="/checkout" size="lg" fullWidth onClick={closeDrawer}>
                  Checkout
                </Button>
                <Button to="/cart" variant="outline" size="lg" fullWidth onClick={closeDrawer}>
                  View Cart
                </Button>
              </div>
            </div>
          </>
        )}

        <div className="border-t border-cocoa-900/10 px-6 py-4">
          <Wordmark size="sm" />
        </div>
      </div>
    </div>
  )
}
