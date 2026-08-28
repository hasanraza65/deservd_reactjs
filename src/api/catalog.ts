import { api, unwrap } from '@/lib/api'
import type { ApiBoxOption, ApiCategory, ApiProduct, Paginated } from '@/types/api'

export type ProductListParams = {
  category?: string
  product_type?: string
  featured?: boolean
  q?: string
  sort?: 'featured' | 'price_asc' | 'price_desc' | 'name'
  per_page?: number
  page?: number
}

export const catalogApi = {
  products: (params?: ProductListParams) => unwrap<Paginated<ApiProduct>>(api.get('/products', { params })),
  product: (slug: string) => unwrap<ApiProduct>(api.get(`/products/${slug}`)),
  categories: () => unwrap<ApiCategory[]>(api.get('/categories')),
  buildABoxOptions: () =>
    unwrap<{ box_options: ApiBoxOption[]; eligible_products: ApiProduct[] }>(api.get('/build-a-box')),
}
