import { api, unwrap } from '@/lib/api'
import type { ApiReview, Paginated, ReviewStatusValue } from '@/types/api'

export const adminReviewsApi = {
  list: (status?: string, page = 1) =>
    unwrap<Paginated<ApiReview>>(api.get('/admin/reviews', { params: { status, page } })),
  updateStatus: (id: number, status: ReviewStatusValue) =>
    unwrap<ApiReview>(api.put(`/admin/reviews/${id}/status`, { status })),
  delete: (id: number) => unwrap<null>(api.delete(`/admin/reviews/${id}`)),
}
