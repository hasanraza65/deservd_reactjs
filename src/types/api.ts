/**
 * Mirrors the Laravel API Resources exactly (see deservd-laravel/app/Http/Resources).
 * Decimal-cast nutrition fields come back as strings — that's a Laravel decimal
 * cast serializing to preserve precision, not a bug — so they're typed `string`
 * here and rendered as-is rather than parsed for arithmetic.
 */

export type { Paginated } from '@/lib/api'

export type ProductType = 'standard' | 'deservd_xx'
export type ProductStatus = 'draft' | 'active' | 'archived'
export type ActiveStatus = 'active' | 'inactive'
export type OrderStatusValue =
  | 'new' | 'confirmed' | 'preparing' | 'baked' | 'packaged' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
export type PaymentStatusValue = 'pending' | 'paid' | 'failed' | 'refunded'
export type FulfillmentStatusValue = 'unfulfilled' | 'processing' | 'fulfilled'
export type CouponType = 'fixed' | 'percentage'
export type ReviewStatusValue = 'pending' | 'approved' | 'rejected'
export type AddressType = 'shipping' | 'billing'
export type ShippingMethodType = 'shipping' | 'pickup'
export type UserRole = 'admin' | 'customer'
export type UserStatusValue = 'active' | 'disabled'

export type ApiCategory = {
  id: number
  name: string
  slug: string
  description: string | null
  status: ActiveStatus
  sort_order: number
  products_count?: number
}

export type ApiProductImage = {
  id: number
  url: string
  is_primary: boolean
  sort_order: number
}

export type ApiProduct = {
  id: number
  name: string
  slug: string
  sku: string
  description: string | null
  short_description: string | null
  price: number
  compare_at_price: number | null
  weight: string | null
  protein_grams: number | null
  calories: number | null
  carbohydrates_grams: string | null
  fat_grams: string | null
  fiber_grams: string | null
  sugar_grams: string | null
  ingredients: string[]
  allergens: string[]
  storage_info: string | null
  shipping_info: string | null
  product_type: ProductType
  product_type_label: string
  status: ProductStatus
  is_featured: boolean
  stock_quantity: number
  low_stock_threshold: number
  in_stock: boolean
  low_stock: boolean
  category: ApiCategory | null
  images: ApiProductImage[]
  created_at: string
  updated_at: string
}

export type ApiUser = {
  id: number
  first_name: string
  last_name: string
  name: string
  email: string
  phone: string | null
  role: UserRole
  status: UserStatusValue
  email_verified_at: string | null
  created_at: string
}

export type ApiAddress = {
  id: number
  type: AddressType
  is_default: boolean
  first_name: string
  last_name: string
  company: string | null
  address_line1: string
  address_line2: string | null
  city: string
  state: string
  zip: string
  country: string
  phone: string | null
}

export type ApiOrderItem = {
  id: number
  product_id: number | null
  product_name: string
  product_sku: string | null
  product_image_path: string | null
  quantity: number
  unit_price: number
  total_price: number
  metadata: Record<string, unknown> | null
}

export type ApiOrderItemGroup = {
  id: number
  type: string
  box_size: number | null
  price: number
  items?: ApiOrderItem[]
}

export type ApiOrder = {
  id: number
  order_number: string
  status: OrderStatusValue
  status_label: string
  payment_status: PaymentStatusValue
  fulfillment_status: FulfillmentStatusValue
  subtotal: number
  discount_amount: number
  shipping_cost: number
  tax_amount: number
  total: number
  coupon_code: string | null
  shipping_method_name: string | null
  payment_method: string | null
  notes: string | null
  shipping_address: Record<string, string> | null
  billing_address: Record<string, string> | null
  customer_email: string | null
  customer_phone: string | null
  customer?: ApiUser
  standalone_items?: ApiOrderItem[]
  box_groups?: ApiOrderItemGroup[]
  placed_at: string | null
  created_at: string
}

export type ApiBoxOption = {
  id: number
  size: number
  price: number
  is_active: boolean
}

export type ApiShippingMethod = {
  id: number
  name: string
  type: ShippingMethodType
  price: number
  estimated_delivery_text: string | null
  is_active: boolean
}

export type ApiReview = {
  id: number
  rating: number
  title: string | null
  content: string
  status: ReviewStatusValue
  customer_name?: string
  product?: ApiProduct
  created_at: string
}

export type ApiCoupon = {
  id: number
  code: string
  type: CouponType
  value: number
  min_order_amount: number | null
  max_discount: number | null
  starts_at: string | null
  expires_at: string | null
  usage_limit: number | null
  per_customer_limit: number | null
  usage_count: number
  status: ActiveStatus
  is_currently_active: boolean
  created_at: string
}

export type ApiCustomer = {
  id: number
  first_name: string
  last_name: string
  name: string
  email: string
  phone: string | null
  status: UserStatusValue
  email_verified_at: string | null
  order_count: number
  total_spent: number
  registered_at: string
}

export type ApiInventoryHistory = {
  id: number
  type: string
  quantity_change: number
  quantity_after: number
  note: string | null
  caused_by: { id: number; first_name: string; last_name: string } | null
  created_at: string
}

export type CartCalculation = {
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  coupon_applied: string | null
  shipping_method: ApiShippingMethod
}

/** The item shape the checkout/cart-calculate endpoints expect — see StoreOrderRequest/CalculateCartRequest. */
export type CheckoutItem =
  | { type: 'product'; product_id: number; quantity: number }
  | { type: 'box'; box_size: number; selections: { product_id: number; quantity: number }[] }

export type DashboardData = {
  summary: {
    total_orders: number
    total_revenue: number
    total_customers: number
    total_products: number
    pending_orders: number
    completed_orders: number
  }
  range_stats: {
    orders_count: number
    revenue: number
    average_order_value: number
    products_sold: number
    new_customers: number
  }
  orders_by_status: Record<OrderStatusValue, number>
  sales_by_date: { date: string; orders: number; revenue: number }[]
  best_sellers: { product_id: number; product_name: string; units_sold: number; revenue: number }[]
  recent_orders: ApiOrder[]
  recent_customers: ApiUser[]
  range: { from: string; to: string }
}

export type AppSettings = {
  store_name: string
  store_email: string
  store_phone_primary: string
  store_phone_secondary: string
  currency: string
  tax_rate_percent: number
  free_shipping_threshold_cents: number
  local_pickup_enabled: boolean
  store_open: boolean
}
