import { api, unwrap } from '@/lib/api'
import type { ApiProduct, Paginated, ProductStatus, ProductType } from '@/types/api'

export type AdminProductListParams = { status?: string; category_id?: number; q?: string; page?: number }

export type ProductFormValues = {
  category_id?: number | null
  name: string
  slug?: string
  sku: string
  description?: string
  short_description?: string
  price: number
  compare_at_price?: number | null
  weight?: string
  protein_grams?: number | null
  calories?: number | null
  carbohydrates_grams?: number | null
  fat_grams?: number | null
  fiber_grams?: number | null
  sugar_grams?: number | null
  ingredients: string[]
  allergens: string[]
  storage_info?: string
  shipping_info?: string
  product_type: ProductType
  status: ProductStatus
  is_featured: boolean
  stock_quantity: number
  low_stock_threshold: number
  images?: File[]
}

/**
 * PHP only populates $_FILES for POST bodies, never PUT/PATCH — so an update
 * that includes new image files must be sent as a real POST with a spoofed
 * `_method=PUT` field (exactly what Laravel's own @method('PUT') Blade
 * directive does under the hood) rather than an actual HTTP PUT request.
 */
function toFormData(values: ProductFormValues, method?: 'PUT'): FormData {
  const form = new FormData()
  if (method) form.append('_method', method)

  const scalarKeys: (keyof ProductFormValues)[] = [
    'category_id', 'name', 'slug', 'sku', 'description', 'short_description',
    'price', 'compare_at_price', 'weight', 'protein_grams', 'calories',
    'carbohydrates_grams', 'fat_grams', 'fiber_grams', 'sugar_grams',
    'storage_info', 'shipping_info', 'product_type', 'status',
    'stock_quantity', 'low_stock_threshold',
  ]
  for (const key of scalarKeys) {
    const value = values[key]
    if (value !== undefined && value !== null) form.append(key, String(value))
  }

  form.append('is_featured', values.is_featured ? '1' : '0')
  values.ingredients.forEach((v, i) => form.append(`ingredients[${i}]`, v))
  values.allergens.forEach((v, i) => form.append(`allergens[${i}]`, v))
  values.images?.forEach((file) => form.append('images[]', file))

  return form
}

export const adminProductsApi = {
  list: (params?: AdminProductListParams) =>
    unwrap<Paginated<ApiProduct>>(api.get('/admin/products', { params })),

  get: (id: number) => unwrap<ApiProduct>(api.get(`/admin/products/${id}`)),

  create: (values: ProductFormValues) =>
    unwrap<ApiProduct>(api.post('/admin/products', toFormData(values))),

  update: (id: number, values: ProductFormValues) =>
    unwrap<ApiProduct>(api.post(`/admin/products/${id}`, toFormData(values, 'PUT'))),

  delete: (id: number) => unwrap<null>(api.delete(`/admin/products/${id}`)),

  deleteImage: (productId: number, imageId: number) =>
    unwrap<null>(api.delete(`/admin/products/${productId}/images/${imageId}`)),

  makeImagePrimary: (productId: number, imageId: number) =>
    unwrap<ApiProduct>(api.post(`/admin/products/${productId}/images/${imageId}/make-primary`)),

  reorderImages: (productId: number, imageIds: number[]) =>
    unwrap<ApiProduct>(api.post(`/admin/products/${productId}/images/reorder`, { image_ids: imageIds })),

  adjustStock: (productId: number, quantity: number, note?: string) =>
    unwrap<ApiProduct>(api.post(`/admin/products/${productId}/adjust-stock`, { quantity, note })),
}
