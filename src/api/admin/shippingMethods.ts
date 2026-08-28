import { api, unwrap } from '@/lib/api'
import type { ApiShippingMethod, ShippingMethodType } from '@/types/api'

export type ShippingMethodFormValues = {
  name: string
  type: ShippingMethodType
  price: number
  estimated_delivery_text?: string
  is_active?: boolean
  sort_order?: number
}

export const adminShippingMethodsApi = {
  list: () => unwrap<ApiShippingMethod[]>(api.get('/admin/shipping-methods')),
  create: (values: ShippingMethodFormValues) => unwrap<ApiShippingMethod>(api.post('/admin/shipping-methods', values)),
  update: (id: number, values: ShippingMethodFormValues) =>
    unwrap<ApiShippingMethod>(api.put(`/admin/shipping-methods/${id}`, values)),
  delete: (id: number) => unwrap<null>(api.delete(`/admin/shipping-methods/${id}`)),
}
