import { api, unwrap } from '@/lib/api'
import type { ApiInventoryHistory, Paginated } from '@/types/api'

export type InventoryProductRow = {
  id: number
  name: string
  sku: string
  stock_quantity: number
  low_stock_threshold: number
}

export const adminInventoryApi = {
  list: (params?: { low_stock_only?: boolean; out_of_stock_only?: boolean; page?: number }) =>
    unwrap<Paginated<InventoryProductRow>>(api.get('/admin/inventory', { params })),
  history: (productId: number, page = 1) =>
    unwrap<Paginated<ApiInventoryHistory>>(api.get(`/admin/inventory/${productId}/history`, { params: { page } })),
}
