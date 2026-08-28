import { api, unwrap } from '@/lib/api'
import type { ApiOrder, ApiShippingMethod, CartCalculation, CheckoutItem } from '@/types/api'

export type CalculateCartPayload = {
  items: CheckoutItem[]
  coupon_code?: string | null
  shipping_method_id: number
}

export type StoreOrderPayload = CalculateCartPayload & {
  payment_method?: string
  notes?: string
  contact: { name: string; email: string; phone: string }
  shipping_address: {
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
  billing_address?: StoreOrderPayload['shipping_address']
}

export const checkoutApi = {
  shippingMethods: () => unwrap<ApiShippingMethod[]>(api.get('/shipping-methods')),
  calculateCart: (payload: CalculateCartPayload) => unwrap<CartCalculation>(api.post('/cart/calculate', payload)),
  placeOrder: (payload: StoreOrderPayload) => unwrap<ApiOrder>(api.post('/checkout', payload)),
}
