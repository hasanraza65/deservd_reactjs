import { api, unwrap } from '@/lib/api'
import type { ApiCustomer, ApiOrder, Paginated, UserStatusValue } from '@/types/api'

export type AdminCustomerListParams = { status?: string; q?: string; page?: number }

export const adminCustomersApi = {
  list: (params?: AdminCustomerListParams) => unwrap<Paginated<ApiCustomer>>(api.get('/admin/customers', { params })),
  get: (id: number) => unwrap<{ customer: ApiCustomer; orders: ApiOrder[] }>(api.get(`/admin/customers/${id}`)),
  updateStatus: (id: number, status: UserStatusValue) =>
    unwrap<ApiCustomer>(api.put(`/admin/customers/${id}/status`, { status })),
}
