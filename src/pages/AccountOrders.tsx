import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { StatusStepper } from '@/components/account/StatusStepper'
import { IconPlus } from '@/components/ui/Icon'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { orderApi } from '@/api/customer'
import { ApiError } from '@/lib/api'
import { formatPrice } from '@/lib/money'
import { reorderItems } from '@/lib/order'
import { useSeo } from '@/lib/seo'
import { cn } from '@/lib/cn'
import type { ApiOrder } from '@/types/api'

function summarize(order: ApiOrder): string {
  const parts: string[] = []
  for (const item of order.standalone_items ?? []) parts.push(`${item.quantity}× ${item.product_name}`)
  for (const group of order.box_groups ?? []) parts.push(`Build a Box (${group.box_size})`)
  return parts.length > 0 ? parts.join(', ') : 'Order'
}

export default function AccountOrders() {
  useSeo({
    title: 'My Orders',
    description: "Track your DESERV'D deliveries and reorder previous boxes.",
    path: '/account/orders',
    noIndex: true,
  })

  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const cart = useCart()
  const { push } = useToast()
  const [expanded, setExpanded] = useState<number | null>(null)
  const { data, isLoading } = useQuery({
    queryKey: ['orders', 'all'],
    queryFn: () => orderApi.myOrders(1),
    enabled: isAuthenticated,
  })
  const orders = data?.items ?? []

  if (authLoading) return null
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: '/account/orders' }} replace />

  async function handleReorder(order: ApiOrder) {
    try {
      const { items } = await orderApi.reorderPayload(order.id)
      reorderItems(cart, items)
      push(`Order #${order.order_number} added to your cart.`, 'success')
      cart.openDrawer()
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Could not reorder — some items may no longer be available.', 'error')
    }
  }

  return (
    <section className="bg-cream-200 py-12 sm:py-16">
      <Container size="narrow">
        <Reveal>
          <SectionHeading as="h1" eyebrow="Order History" title="My Orders" align="left" />
        </Reveal>

        <div className="mt-9 flex flex-col gap-5">
          {isLoading ? <p className="text-sm text-cocoa-500">Loading…</p> : null}
          {!isLoading && orders.length === 0 ? <p className="text-sm text-cocoa-500">No orders yet.</p> : null}

          {orders.map((order, i) => {
            const isOpen = expanded === order.id
            return (
              <Reveal key={order.id} delay={i * 70}>
                <div className="rounded-lg border border-cocoa-900/12 bg-cream-50 p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-display text-sm font-extrabold uppercase tracking-[0.06em] text-cocoa-900">
                        Order #{order.order_number}
                      </p>
                      <p className="mt-1 text-sm text-cocoa-600">{summarize(order)}</p>
                      <p className="mt-1 text-xs text-cocoa-500">
                        {order.placed_at
                          ? new Date(order.placed_at).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : ''}
                      </p>
                    </div>
                    <p className="font-display text-lg font-extrabold text-cocoa-900">{formatPrice(order.total)}</p>
                  </div>

                  <div className="mt-5 max-w-md">
                    <StatusStepper status={order.status} />
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-cocoa-900/10 pt-4">
                    <Button size="sm" variant="outline" onClick={() => setExpanded(isOpen ? null : order.id)}>
                      {isOpen ? 'Hide Order' : 'View Order'}
                    </Button>
                    <Button size="sm" onClick={() => handleReorder(order)}>
                      <IconPlus className="h-3.5 w-3.5" />
                      Reorder
                    </Button>
                  </div>

                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-[var(--ease-out-soft)]"
                    style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <div className={cn('flex flex-col gap-2 pt-4', isOpen && 'border-t border-cocoa-900/10 mt-4')}>
                        {(order.standalone_items ?? []).map((item) => (
                          <div key={item.id} className="flex justify-between text-sm text-cocoa-700">
                            <span>
                              {item.quantity}× {item.product_name}
                            </span>
                            <span className="font-bold text-cocoa-900">{formatPrice(item.total_price)}</span>
                          </div>
                        ))}
                        {(order.box_groups ?? []).map((group) => (
                          <div key={group.id} className="flex justify-between text-sm text-cocoa-700">
                            <span>Build a Box ({group.box_size})</span>
                            <span className="font-bold text-cocoa-900">{formatPrice(group.price)}</span>
                          </div>
                        ))}
                        {order.shipping_address ? (
                          <p className="mt-2 text-xs text-cocoa-500">
                            Shipped to {order.shipping_address.address_line1}, {order.shipping_address.city}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
