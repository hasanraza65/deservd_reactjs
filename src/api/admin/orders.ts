import { api, unwrap } from '@/lib/api'
import type { ApiOrder, OrderStatusValue, PaymentStatusValue, Paginated } from '@/types/api'

export type AdminOrderListParams = {
  order_number?: string
  customer?: string
  status?: string
  payment_status?: string
  date_from?: string
  date_to?: string
  page?: number
}

export const adminOrdersApi = {
  list: (params?: AdminOrderListParams) => unwrap<Paginated<ApiOrder>>(api.get('/admin/orders', { params })),
  get: (id: number) => unwrap<ApiOrder>(api.get(`/admin/orders/${id}`)),
  updateStatus: (id: number, payload: { status?: OrderStatusValue; payment_status?: PaymentStatusValue }) =>
    unwrap<ApiOrder>(api.put(`/admin/orders/${id}/status`, payload)),
}
