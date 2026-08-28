import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { adminOrdersApi, type AdminOrderListParams } from '@/api/admin/orders'
import { formatPrice } from '@/lib/money'
import { Badge, Card, PageHeader, Pagination, Table, Th, Td, EmptyRow, inputClass } from '../components/ui'

const STATUS_TONE: Record<string, 'neutral' | 'success' | 'warning' | 'danger' | 'info'> = {
  new: 'info',
  confirmed: 'info',
  preparing: 'warning',
  baked: 'warning',
  packaged: 'warning',
  shipped: 'success',
  delivered: 'success',
  cancelled: 'danger',
  refunded: 'danger',
}

export default function OrdersList() {
  const [page, setPage] = useState(1)
  const [orderNumber, setOrderNumber] = useState('')
  const [customer, setCustomer] = useState('')
  const [status, setStatus] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')

  const params = useMemo<AdminOrderListParams>(
    () => ({
      page,
      ...(orderNumber.trim() ? { order_number: orderNumber.trim() } : {}),
      ...(customer.trim() ? { customer: customer.trim() } : {}),
      ...(status ? { status } : {}),
      ...(paymentStatus ? { payment_status: paymentStatus } : {}),
    }),
    [page, orderNumber, customer, status, paymentStatus],
  )

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'orders', params],
    queryFn: () => adminOrdersApi.list(params),
  })

  return (
    <div>
      <PageHeader title="Orders" />

      <Card className="mb-4 flex flex-wrap gap-3 p-4">
        <input
          value={orderNumber}
          onChange={(e) => {
            setOrderNumber(e.target.value)
            setPage(1)
          }}
          placeholder="Order #"
          className={`${inputClass} max-w-[9rem]`}
        />
        <input
          value={customer}
          onChange={(e) => {
            setCustomer(e.target.value)
            setPage(1)
          }}
          placeholder="Customer name or email"
          className={`${inputClass} max-w-xs`}
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(1)
          }}
          className={`${inputClass} max-w-[10rem]`}
        >
          <option value="">All Statuses</option>
          {['new', 'confirmed', 'preparing', 'baked', 'packaged', 'shipped', 'delivered', 'cancelled', 'refunded'].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={paymentStatus}
          onChange={(e) => {
            setPaymentStatus(e.target.value)
            setPage(1)
          }}
          className={`${inputClass} max-w-[10rem]`}
        >
          <option value="">All Payments</option>
          {['pending', 'paid', 'failed', 'refunded'].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Card>

      <Card className="p-4">
        <Table>
          <thead>
            <tr>
              <Th>Order</Th>
              <Th>Customer</Th>
              <Th>Status</Th>
              <Th>Payment</Th>
              <Th className="text-right">Total</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <EmptyRow colSpan={6}>Loading…</EmptyRow>
            ) : data && data.items.length > 0 ? (
              data.items.map((order) => (
                <tr key={order.id}>
                  <Td className="font-bold text-cocoa-900">#{order.order_number}</Td>
                  <Td>{order.customer?.name ?? order.customer_email ?? 'Guest'}</Td>
                  <Td>
                    <Badge tone={STATUS_TONE[order.status] ?? 'neutral'}>{order.status_label}</Badge>
                  </Td>
                  <Td className="capitalize">{order.payment_status}</Td>
                  <Td className="text-right">{formatPrice(order.total)}</Td>
                  <Td>
                    <Link to={`/admin/orders/${order.id}`} className="text-xs font-bold uppercase tracking-wide text-cocoa-700 hover:text-blush-600">
                      View
                    </Link>
                  </Td>
                </tr>
              ))
            ) : (
              <EmptyRow colSpan={6}>No orders found.</EmptyRow>
            )}
          </tbody>
        </Table>
        {data ? <Pagination page={data.pagination.current_page} lastPage={data.pagination.last_page} onChange={setPage} /> : null}
      </Card>
    </div>
  )
}
