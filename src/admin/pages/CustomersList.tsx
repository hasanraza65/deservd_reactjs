import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { adminCustomersApi, type AdminCustomerListParams } from '@/api/admin/customers'
import { formatPrice } from '@/lib/money'
import { Badge, Card, PageHeader, Pagination, Table, Th, Td, EmptyRow, inputClass } from '../components/ui'

export default function CustomersList() {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')

  const params = useMemo<AdminCustomerListParams>(
    () => ({ page, ...(q.trim() ? { q: q.trim() } : {}), ...(status ? { status } : {}) }),
    [page, q, status],
  )

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'customers', params],
    queryFn: () => adminCustomersApi.list(params),
  })

  return (
    <div>
      <PageHeader title="Customers" />

      <Card className="mb-4 flex flex-wrap gap-3 p-4">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setPage(1)
          }}
          placeholder="Search customers…"
          className={`${inputClass} max-w-xs`}
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(1)
          }}
          className={`${inputClass} max-w-[9rem]`}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="disabled">Disabled</option>
        </select>
      </Card>

      <Card className="p-4">
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th className="text-right">Orders</Th>
              <Th className="text-right">Total Spent</Th>
              <Th>Status</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <EmptyRow colSpan={6}>Loading…</EmptyRow>
            ) : data && data.items.length > 0 ? (
              data.items.map((customer) => (
                <tr key={customer.id}>
                  <Td className="font-bold text-cocoa-900">{customer.name}</Td>
                  <Td>{customer.email}</Td>
                  <Td className="text-right">{customer.order_count}</Td>
                  <Td className="text-right">{formatPrice(customer.total_spent)}</Td>
                  <Td>
                    <Badge tone={customer.status === 'active' ? 'success' : 'danger'}>{customer.status}</Badge>
                  </Td>
                  <Td>
                    <Link to={`/admin/customers/${customer.id}`} className="text-xs font-bold uppercase tracking-wide text-cocoa-700 hover:text-blush-600">
                      View
                    </Link>
                  </Td>
                </tr>
              ))
            ) : (
              <EmptyRow colSpan={6}>No customers found.</EmptyRow>
            )}
          </tbody>
        </Table>
        {data ? <Pagination page={data.pagination.current_page} lastPage={data.pagination.last_page} onChange={setPage} /> : null}
      </Card>
    </div>
  )
}
