import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { IconCheck } from '@/components/ui/Icon'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/money'
import { useSeo } from '@/lib/seo'
import type { ApiOrder } from '@/types/api'

export default function OrderConfirmation() {
  const location = useLocation()
  const order = (location.state as { order?: ApiOrder } | null)?.order
  const { clear } = useCart()

  useSeo({
    title: order ? `Order #${order.order_number}` : 'Order Confirmed',
    description: "Your DESERV'D order confirmation.",
    path: '/order-confirmation',
    noIndex: true,
  })

  // Cart is cleared here, once this page has actually taken over from
  // Checkout — clearing it inside Checkout's own submit handler raced with
  // the route transition, since Checkout could still be mounted for one more
  // render (reading a now-empty cart) before React Router swapped it out.
  useEffect(() => {
    if (order) clear()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order])

  // Direct navigation without an order in state (refresh, bookmark, back button
  // after the cart cleared) has nothing to show — send them back to shop rather
  // than render a broken confirmation page.
  if (!order) return <Navigate to="/shop" replace />

  const lineItems = [
    ...(order.standalone_items ?? []).map((item) => ({
      key: `item-${item.id}`,
      label: item.product_name,
      quantity: item.quantity,
      total: item.total_price,
    })),
    ...(order.box_groups ?? []).map((group) => ({
      key: `box-${group.id}`,
      label: `Build a Box — ${group.box_size} Cookies`,
      quantity: 1,
      total: group.price,
    })),
  ]

  return (
    <section className="bg-cream-200 py-16 sm:py-20">
      <Container size="narrow">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blush-500">
              <IconCheck className="h-7 w-7 text-white" />
            </span>
            <h1 className="mt-6 text-[clamp(1.9rem,1.4rem+2vw,2.75rem)] uppercase leading-tight text-cocoa-900">
              Thank You for Your Order.
            </h1>
            <p className="mt-2 font-display text-sm font-bold uppercase tracking-[0.1em] text-blush-600">
              Order #{order.order_number}
            </p>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-cocoa-700">
              Your DESERV’D cookies are officially on their way.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10 rounded-lg border border-cocoa-900/12 bg-cream-50 p-6 sm:p-7">
            <div className="flex flex-col gap-3 border-b border-cocoa-900/10 pb-4">
              {lineItems.map((item) => (
                <div key={item.key} className="flex justify-between gap-3 text-sm">
                  <span className="text-cocoa-700">
                    {item.quantity}× {item.label}
                  </span>
                  <span className="shrink-0 font-bold text-cocoa-900">{formatPrice(item.total)}</span>
                </div>
              ))}
            </div>

            <div className="grid gap-4 border-b border-cocoa-900/10 py-4 text-sm sm:grid-cols-2">
              <div>
                <p className="font-display text-[11px] font-bold uppercase tracking-[0.1em] text-cocoa-500">
                  Delivery method
                </p>
                <p className="mt-1 text-cocoa-800">{order.shipping_method_name ?? '—'}</p>
              </div>
              <div>
                <p className="font-display text-[11px] font-bold uppercase tracking-[0.1em] text-cocoa-500">
                  Order status
                </p>
                <p className="mt-1 text-cocoa-800">{order.status_label}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-b border-cocoa-900/10 py-4 text-sm">
              <div className="flex justify-between text-cocoa-700">
                <span>Subtotal</span>
                <span className="font-bold text-cocoa-900">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount_amount > 0 ? (
                <div className="flex justify-between text-blush-600">
                  <span>Discount</span>
                  <span className="font-bold">−{formatPrice(order.discount_amount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-cocoa-700">
                <span>Shipping</span>
                <span className="font-bold text-cocoa-900">
                  {order.shipping_cost === 0 ? 'Free' : formatPrice(order.shipping_cost)}
                </span>
              </div>
              {order.tax_amount > 0 ? (
                <div className="flex justify-between text-cocoa-700">
                  <span>Tax</span>
                  <span className="font-bold text-cocoa-900">{formatPrice(order.tax_amount)}</span>
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-between pt-4">
              <span className="font-display text-sm font-bold uppercase tracking-wide text-cocoa-900">Total</span>
              <span className="font-display text-xl font-extrabold text-cocoa-900">{formatPrice(order.total)}</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button to="/account/orders" size="lg">
              View Order
            </Button>
            <Button to="/shop" variant="outline" size="lg">
              Continue Shopping
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
