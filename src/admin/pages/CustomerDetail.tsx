import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adminCustomersApi } from '@/api/admin/customers'
import { useToast } from '@/context/ToastContext'
import { ApiError } from '@/lib/api'
import { formatPrice } from '@/lib/money'
import { Badge, Card, PageHeader, Table, Th, Td, EmptyRow } from '../components/ui'

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { push } = useToast()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'customers', id],
    queryFn: () => adminCustomersApi.get(Number(id)),
  })

  async function toggleStatus() {
    if (!data) return
    const next = data.customer.status === 'active' ? 'disabled' : 'active'
    try {
      await adminCustomersApi.updateStatus(data.customer.id, next)
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers', id] })
      push(`Customer ${next === 'active' ? 'reactivated' : 'disabled'}.`, 'success')
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Could not update customer status.', 'error')
    }
  }

  if (isLoading || !data) return <p className="text-sm text-cocoa-500">Loading…</p>

  const { customer, orders } = data

  return (
    <div>
      <PageHeader
        title={customer.name}
        action={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={toggleStatus}
              className="rounded-md border border-cocoa-900/18 px-4 py-2 text-xs font-bold uppercase tracking-wide text-cocoa-700 hover:border-cocoa-900"
            >
              {customer.status === 'active' ? 'Disable Account' : 'Reactivate Account'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/customers')}
              className="rounded-md border border-cocoa-900/18 px-4 py-2 text-xs font-bold uppercase tracking-wide text-cocoa-700"
            >
              Back
            </button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-cocoa-500">Email</p>
          <p className="mt-1 text-sm text-cocoa-800">{customer.email}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-cocoa-500">Phone</p>
          <p className="mt-1 text-sm text-cocoa-800">{customer.phone ?? '—'}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-cocoa-500">Orders</p>
          <p className="mt-1 font-display text-lg font-extrabold text-cocoa-900">{customer.order_count}</p>
        </Card>
        <Card className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-cocoa-500">Total Spent</p>
          <p className="mt-1 font-display text-lg font-extrabold text-cocoa-900">{formatPrice(customer.total_spent)}</p>
        </Card>
      </div>

      <Card className="mt-6 p-4">
        <p className="mb-3 px-1 text-[11px] font-bold uppercase tracking-[0.1em] text-cocoa-500">Order History</p>
        <Table>
          <thead>
            <tr>
              <Th>Order</Th>
              <Th>Status</Th>
              <Th>Payment</Th>
              <Th className="text-right">Total</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <EmptyRow colSpan={5}>No orders yet.</EmptyRow>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <Td className="font-bold text-cocoa-900">#{order.order_number}</Td>
                  <Td>
                    <Badge>{order.status_label}</Badge>
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
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  )
}
