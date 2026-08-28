import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adminReviewsApi } from '@/api/admin/reviews'
import { useToast } from '@/context/ToastContext'
import { ApiError } from '@/lib/api'
import { Badge, Card, PageHeader, Pagination, Table, Th, Td, EmptyRow, inputClass } from '../components/ui'

export default function Reviews() {
  const { push } = useToast()
  const queryClient = useQueryClient()
  const [status, setStatus] = useState('pending')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'reviews', status, page],
    queryFn: () => adminReviewsApi.list(status || undefined, page),
  })

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] })
  }

  async function onApprove(id: number) {
    try {
      await adminReviewsApi.updateStatus(id, 'approved')
      invalidate()
      push('Review approved.', 'success')
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Could not approve this review.', 'error')
    }
  }

  async function onReject(id: number) {
    try {
      await adminReviewsApi.updateStatus(id, 'rejected')
      invalidate()
      push('Review rejected.', 'success')
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Could not reject this review.', 'error')
    }
  }

  async function onDelete(id: number) {
    if (!window.confirm('Delete this review permanently?')) return
    try {
      await adminReviewsApi.delete(id)
      invalidate()
      push('Review deleted.', 'success')
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Could not delete this review.', 'error')
    }
  }

  return (
    <div>
      <PageHeader title="Reviews" />

      <Card className="mb-4 flex flex-wrap gap-3 p-4">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(1)
          }}
          className={`${inputClass} max-w-[10rem]`}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </Card>

      <Card className="p-4">
        <Table>
          <thead>
            <tr>
              <Th>Product</Th>
              <Th>Rating</Th>
              <Th>Review</Th>
              <Th>Customer</Th>
              <Th>Status</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <EmptyRow colSpan={6}>Loading…</EmptyRow>
            ) : data && data.items.length > 0 ? (
              data.items.map((review) => (
                <tr key={review.id}>
                  <Td>{review.product?.name ?? '—'}</Td>
                  <Td>{review.rating} / 5</Td>
                  <Td className="max-w-xs">
                    {review.title ? <p className="font-bold text-cocoa-900">{review.title}</p> : null}
                    <p className="line-clamp-2 text-cocoa-700">{review.content}</p>
                  </Td>
                  <Td>{review.customer_name ?? '—'}</Td>
                  <Td>
                    <Badge tone={review.status === 'approved' ? 'success' : review.status === 'rejected' ? 'danger' : 'warning'}>
                      {review.status}
                    </Badge>
                  </Td>
                  <Td>
                    <div className="flex justify-end gap-3 text-xs font-bold uppercase tracking-wide">
                      {review.status !== 'approved' ? (
                        <button type="button" onClick={() => onApprove(review.id)} className="text-emerald-700 hover:opacity-80">
                          Approve
                        </button>
                      ) : null}
                      {review.status !== 'rejected' ? (
                        <button type="button" onClick={() => onReject(review.id)} className="text-cocoa-700 hover:text-blush-600">
                          Reject
                        </button>
                      ) : null}
                      <button type="button" onClick={() => onDelete(review.id)} className="text-blush-600 hover:text-blush-700">
                        Delete
                      </button>
                    </div>
                  </Td>
                </tr>
              ))
            ) : (
              <EmptyRow colSpan={6}>No reviews found.</EmptyRow>
            )}
          </tbody>
        </Table>
        {data ? <Pagination page={data.pagination.current_page} lastPage={data.pagination.last_page} onChange={setPage} /> : null}
      </Card>
    </div>
  )
}
