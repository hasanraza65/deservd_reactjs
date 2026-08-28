import { api, unwrap } from '@/lib/api'
import type { ApiReview, Paginated } from '@/types/api'

export type StoreReviewPayload = { product_id: number; rating: number; title?: string; content: string }

export const reviewsApi = {
  forProduct: (productId: number, page = 1) =>
    unwrap<Paginated<ApiReview>>(api.get('/reviews', { params: { product_id: productId, page } })),
  submit: (payload: StoreReviewPayload) => unwrap<ApiReview>(api.post('/reviews', payload)),
}
