import { api, unwrap } from '@/lib/api'
import type { ActiveStatus, ApiCategory } from '@/types/api'

export type CategoryFormValues = {
  name: string
  slug?: string
  description?: string
  status: ActiveStatus
  sort_order?: number
}

export const adminCategoriesApi = {
  list: () => unwrap<ApiCategory[]>(api.get('/admin/categories')),
  create: (values: CategoryFormValues) => unwrap<ApiCategory>(api.post('/admin/categories', values)),
  update: (id: number, values: CategoryFormValues) => unwrap<ApiCategory>(api.put(`/admin/categories/${id}`, values)),
  delete: (id: number) => unwrap<null>(api.delete(`/admin/categories/${id}`)),
}
