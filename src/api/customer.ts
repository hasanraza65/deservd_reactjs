import { api, unwrap } from '@/lib/api'
import type { ApiAddress, ApiOrder, ApiProduct, ApiUser, CheckoutItem, Paginated } from '@/types/api'

export type AddressPayload = {
  type: 'shipping' | 'billing'
  is_default?: boolean
  first_name: string
  last_name: string
  company?: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  zip: string
  country?: string
  phone?: string
}

export const customerApi = {
  profile: () => unwrap<ApiUser>(api.get('/customer/profile')),
  updateProfile: (payload: Partial<{ first_name: string; last_name: string; email: string; phone: string }>) =>
    unwrap<ApiUser>(api.put('/customer/profile', payload)),

  addresses: () => unwrap<ApiAddress[]>(api.get('/customer/addresses')),
  addAddress: (payload: AddressPayload) => unwrap<ApiAddress>(api.post('/customer/addresses', payload)),
  updateAddress: (id: number, payload: AddressPayload) =>
    unwrap<ApiAddress>(api.put(`/customer/addresses/${id}`, payload)),
  deleteAddress: (id: number) => unwrap<null>(api.delete(`/customer/addresses/${id}`)),

  wishlist: () => unwrap<ApiProduct[]>(api.get('/customer/wishlist')),
  addToWishlist: (productId: number) => unwrap<null>(api.post('/customer/wishlist', { product_id: productId })),
  removeFromWishlist: (productId: number) => unwrap<null>(api.delete(`/customer/wishlist/${productId}`)),
}

export const orderApi = {
  myOrders: (page = 1) => unwrap<Paginated<ApiOrder>>(api.get('/orders', { params: { page } })),
  order: (id: number) => unwrap<ApiOrder>(api.get(`/orders/${id}`)),
  reorderPayload: (id: number) => unwrap<{ items: CheckoutItem[] }>(api.post(`/orders/${id}/reorder`)),
}
