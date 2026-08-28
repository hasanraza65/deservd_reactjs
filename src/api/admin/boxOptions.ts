import { api, unwrap } from '@/lib/api'
import type { ApiBoxOption } from '@/types/api'

export type BoxOptionFormValues = { size: number; price: number; is_active?: boolean; sort_order?: number }

export const adminBoxOptionsApi = {
  list: () => unwrap<ApiBoxOption[]>(api.get('/admin/box-options')),
  create: (values: BoxOptionFormValues) => unwrap<ApiBoxOption>(api.post('/admin/box-options', values)),
  update: (id: number, values: BoxOptionFormValues) =>
    unwrap<ApiBoxOption>(api.put(`/admin/box-options/${id}`, values)),
  delete: (id: number) => unwrap<null>(api.delete(`/admin/box-options/${id}`)),
}
