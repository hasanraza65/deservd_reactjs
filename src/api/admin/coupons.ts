import { api, unwrap } from '@/lib/api'
import type { ActiveStatus, ApiCoupon, CouponType, Paginated } from '@/types/api'

export type CouponFormValues = {
  code: string
  type: CouponType
  value: number
  min_order_amount?: number | null
  max_discount?: number | null
  starts_at?: string | null
  expires_at?: string | null
  usage_limit?: number | null
  per_customer_limit?: number | null
  status: ActiveStatus
}

export const adminCouponsApi = {
  list: (page = 1) => unwrap<Paginated<ApiCoupon>>(api.get('/admin/coupons', { params: { page } })),
  get: (id: number) => unwrap<ApiCoupon>(api.get(`/admin/coupons/${id}`)),
  create: (values: CouponFormValues) => unwrap<ApiCoupon>(api.post('/admin/coupons', values)),
  update: (id: number, values: CouponFormValues) => unwrap<ApiCoupon>(api.put(`/admin/coupons/${id}`, values)),
  delete: (id: number) => unwrap<null>(api.delete(`/admin/coupons/${id}`)),
}
