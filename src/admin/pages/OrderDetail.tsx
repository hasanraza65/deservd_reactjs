import { Fragment } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adminOrdersApi } from '@/api/admin/orders'
import { useToast } from '@/context/ToastContext'
import { ApiError } from '@/lib/api'
import { formatPrice } from '@/lib/money'
import { Badge, Card, PageHeader, Table, Th, Td } from '../components/ui'
import type { OrderStatusValue, PaymentStatusValue } from '@/types/api'

const PIPELINE: OrderStatusValue[] = ['new', 'confirmed', 'preparing', 'baked', 'packaged', 'shipped', 'delivered']
const NEXT_LABEL: Partial<Record<OrderStatusValue, string>> = {
  new: 'Confirm Order',
  confirmed: 'Start Preparing',
  preparing: 'Mark Baked',
  baked: 'Mark Packaged',
  packaged: 'Mark Shipped',
  shipped: 'Mark Delivered',
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { push } = useToast()

  const { data: order, isLoading } = useQuery({
    queryKey: ['admin', 'orders', id],
    queryFn: () => adminOrdersApi.get(Number(id)),
  })

  async function updateStatus(payload: { status?: OrderStatusValue; payment_status?: PaymentStatusValue }) {
    try {
      await adminOrdersApi.updateStatus(Number(id), payload);
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders', id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      push('Order updated.', 'success')
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Could not update this order.', 'error')
    }
  }

  if (isLoading || !order) return <p className="text-sm text-cocoa-500">Loading…</p>

  const pipelineIndex = PIPELINE.indexOf(order.status)
  const canAdvance = pipelineIndex >= 0 && pipelineIndex < PIPELINE.length - 1
  const nextStatus = canAdvance ? PIPELINE[pipelineIndex + 1] : null
  const canCancel = order.status !== 'delivered' && order.status !== 'cancelled' && order.status !== 'refunded'

  return (
    <div>
      <PageHeader
        title={`Order #${order.order_number}`}
        action={
          <button
            type="button"
            onClick={() => navigate('/admin/orders')}
            className="rounded-md border border-cocoa-900/18 px-4 py-2 text-xs font-bold uppercase tracking-wide text-cocoa-700"
          >
            Back to Orders
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-6">
          <Card className="p-5">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-cocoa-500">Items</p>
            <Table>
              <thead>
                <tr>
                  <Th>Item</Th>
                  <Th className="text-right">Qty</Th>
                  <Th className="text-right">Price</Th>
                </tr>
              </thead>
              <tbody>
                {(order.standalone_items ?? []).map((item) => (
                  <tr key={`item-${item.id}`}>
                    <Td>{item.product_name}</Td>
                    <Td className="text-right">{item.quantity}</Td>
                    <Td className="text-right">{formatPrice(item.total_price)}</Td>
                  </tr>
                ))}
                {(order.box_groups ?? []).map((group) => (
                  <Fragment key={`box-${group.id}`}>
                    <tr>
                      <Td className="font-bold text-cocoa-900">Build a Box — {group.box_size} cookies</Td>
                      <Td className="text-right">1</Td>
                      <Td className="text-right">{formatPrice(group.price)}</Td>
                    </tr>
                    {(group.items ?? []).map((item) => (
                      <tr key={`box-item-${item.id}`}>
                        <Td className="pl-8 text-cocoa-500">{item.product_name}</Td>
                        <Td className="text-right text-cocoa-500">{item.quantity}</Td>
                        <Td></Td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </Table>

            <div className="mt-4 flex flex-col gap-1.5 border-t border-cocoa-900/10 pt-4 text-sm">
              <div className="flex justify-between text-cocoa-700">
                <span>Subtotal</span>
                <span className="font-bold text-cocoa-900">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount_amount > 0 ? (
                <div className="flex justify-between text-blush-600">
                  <span>Discount {order.coupon_code ? `(${order.coupon_code})` : ''}</span>
                  <span className="font-bold">−{formatPrice(order.discount_amount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-cocoa-700">
                <span>Shipping</span>
                <span className="font-bold text-cocoa-900">{formatPrice(order.shipping_cost)}</span>
              </div>
              {order.tax_amount > 0 ? (
                <div className="flex justify-between text-cocoa-700">
                  <span>Tax</span>
                  <span className="font-bold text-cocoa-900">{formatPrice(order.tax_amount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between border-t border-cocoa-900/10 pt-2 text-base font-display font-extrabold text-cocoa-900">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-cocoa-500">Shipping Address</p>
            {order.shipping_address ? (
              <p className="text-sm leading-relaxed text-cocoa-700">
                {order.shipping_address.first_name} {order.shipping_address.last_name}
                <br />
                {order.shipping_address.address_line1}
                {order.shipping_address.address_line2 ? <>, {order.shipping_address.address_line2}</> : null}
                <br />
                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
              </p>
            ) : (
              <p className="text-sm text-cocoa-500">No shipping address on file.</p>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="p-5">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-cocoa-500">Customer</p>
            <p className="text-sm font-bold text-cocoa-900">{order.customer?.name ?? 'Guest'}</p>
            <p className="text-sm text-cocoa-600">{order.customer_email}</p>
            <p className="text-sm text-cocoa-600">{order.customer_phone}</p>
          </Card>

          <Card className="p-5">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-cocoa-500">Fulfillment</p>
            <div className="mb-3 flex items-center gap-2">
              <Badge>{order.status_label}</Badge>
              <Badge tone={order.payment_status === 'paid' ? 'success' : order.payment_status === 'failed' ? 'danger' : 'warning'}>
                {order.payment_status}
              </Badge>
            </div>

            <div className="flex flex-col gap-2">
              {nextStatus ? (
                <button
                  type="button"
                  onClick={() => updateStatus({ status: nextStatus })}
                  className="rounded-md bg-cocoa-900 px-4 py-2 text-xs font-bold uppercase tracking-wide text-cream-100 hover:opacity-90"
                >
                  {NEXT_LABEL[order.status]}
                </button>
              ) : null}
              {canCancel ? (
                <button
                  type="button"
                  onClick={() => window.confirm('Cancel this order?') && updateStatus({ status: 'cancelled' })}
                  className="rounded-md border border-blush-300 px-4 py-2 text-xs font-bold uppercase tracking-wide text-blush-600 hover:bg-blush-50"
                >
                  Cancel Order
                </button>
              ) : null}
              {order.payment_status === 'paid' ? (
                <button
                  type="button"
                  onClick={() => window.confirm('Mark this order refunded?') && updateStatus({ status: 'refunded', payment_status: 'refunded' })}
                  className="rounded-md border border-cocoa-900/18 px-4 py-2 text-xs font-bold uppercase tracking-wide text-cocoa-700"
                >
                  Refund
                </button>
              ) : null}
              {order.payment_status === 'pending' ? (
                <button
                  type="button"
                  onClick={() => updateStatus({ payment_status: 'paid' })}
                  className="rounded-md border border-cocoa-900/18 px-4 py-2 text-xs font-bold uppercase tracking-wide text-cocoa-700"
                >
                  Mark Paid
                </button>
              ) : null}
            </div>
          </Card>

          <Card className="p-5">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-cocoa-500">Delivery / Notes</p>
            <p className="text-sm text-cocoa-700">{order.shipping_method_name ?? '—'}</p>
            {order.notes ? <p className="mt-2 text-sm text-cocoa-600">{order.notes}</p> : null}
          </Card>
        </div>
      </div>
    </div>
  )
}
