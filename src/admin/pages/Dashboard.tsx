import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { adminDashboardApi } from '@/api/admin/dashboard'
import { formatPrice } from '@/lib/money'
import { Card, PageHeader, StatCard, Table, Th, Td, EmptyRow } from '../components/ui'

const RANGE_OPTIONS = [
  { key: '7d', label: 'Last 7 Days' },
  { key: '30d', label: 'Last 30 Days' },
  { key: '90d', label: 'Last 90 Days' },
]

export default function Dashboard() {
  const [range, setRange] = useState('30d')
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'dashboard', range],
    queryFn: () => adminDashboardApi.get({ range }),
  })

  if (isLoading || !data) {
    return <p className="text-sm text-cocoa-500">Loading…</p>
  }

  const maxRevenue = Math.max(1, ...data.sales_by_date.map((d) => d.revenue))

  return (
    <div>
      <PageHeader
        title="Dashboard"
        action={
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="rounded-md border border-cocoa-900/18 bg-cream-50 px-3 py-2 text-sm text-cocoa-900 outline-none"
          >
            {RANGE_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={formatPrice(data.summary.total_revenue)} />
        <StatCard label="Total Orders" value={String(data.summary.total_orders)} hint={`${data.summary.pending_orders} pending`} />
        <StatCard label="Customers" value={String(data.summary.total_customers)} />
        <StatCard label="Products" value={String(data.summary.total_products)} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Orders (Range)" value={String(data.range_stats.orders_count)} />
        <StatCard label="Revenue (Range)" value={formatPrice(data.range_stats.revenue)} />
        <StatCard label="Avg Order Value" value={formatPrice(data.range_stats.average_order_value)} />
        <StatCard label="New Customers" value={String(data.range_stats.new_customers)} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="p-5">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.1em] text-cocoa-500">Revenue by Day</p>
          {data.sales_by_date.length === 0 ? (
            <p className="text-sm text-cocoa-500">No sales in this range yet.</p>
          ) : (
            <div className="flex h-40 items-end gap-1.5">
              {data.sales_by_date.map((d) => (
                <div key={d.date} className="flex flex-1 flex-col items-center gap-1" title={`${d.date}: ${formatPrice(d.revenue)}`}>
                  <div
                    className="w-full rounded-t bg-blush-400"
                    style={{ height: `${Math.max(4, (d.revenue / maxRevenue) * 100)}%` }}
                  />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.1em] text-cocoa-500">Orders by Status</p>
          <div className="flex flex-col gap-2">
            {Object.entries(data.orders_by_status).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <span className="capitalize text-cocoa-700">{status}</span>
                <span className="font-bold text-cocoa-900">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-cocoa-500">Best Sellers</p>
          <Table>
            <thead>
              <tr>
                <Th>Product</Th>
                <Th className="text-right">Units</Th>
                <Th className="text-right">Revenue</Th>
              </tr>
            </thead>
            <tbody>
              {data.best_sellers.length === 0 ? (
                <EmptyRow colSpan={3}>No sales yet.</EmptyRow>
              ) : (
                data.best_sellers.map((row) => (
                  <tr key={row.product_id}>
                    <Td>{row.product_name}</Td>
                    <Td className="text-right">{row.units_sold}</Td>
                    <Td className="text-right">{formatPrice(row.revenue)}</Td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card>

        <Card className="p-5">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-cocoa-500">Recent Orders</p>
          <Table>
            <thead>
              <tr>
                <Th>Order</Th>
                <Th>Status</Th>
                <Th className="text-right">Total</Th>
              </tr>
            </thead>
            <tbody>
              {data.recent_orders.length === 0 ? (
                <EmptyRow colSpan={3}>No orders yet.</EmptyRow>
              ) : (
                data.recent_orders.map((order) => (
                  <tr key={order.id}>
                    <Td>
                      <Link to={`/admin/orders/${order.id}`} className="font-bold text-cocoa-900 hover:text-blush-600">
                        #{order.order_number}
                      </Link>
                    </Td>
                    <Td className="capitalize">{order.status_label}</Td>
                    <Td className="text-right">{formatPrice(order.total)}</Td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
