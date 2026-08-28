import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adminProductsApi, type ProductFormValues } from '@/api/admin/products'
import { adminCategoriesApi } from '@/api/admin/categories'
import { useToast } from '@/context/ToastContext'
import { ApiError } from '@/lib/api'
import { formatPrice } from '@/lib/money'
import { Card, PageHeader, inputClass, labelClass } from '../components/ui'

const EMPTY: ProductFormValues = {
  category_id: null,
  name: '',
  sku: '',
  description: '',
  short_description: '',
  price: 0,
  compare_at_price: null,
  weight: '',
  protein_grams: null,
  calories: null,
  carbohydrates_grams: null,
  fat_grams: null,
  fiber_grams: null,
  sugar_grams: null,
  ingredients: [],
  allergens: [],
  storage_info: '',
  shipping_info: '',
  product_type: 'standard',
  status: 'draft',
  is_featured: false,
  stock_quantity: 0,
  low_stock_threshold: 10,
}

function numOrNull(value: string): number | null {
  return value.trim() === '' ? null : Number(value)
}

export default function ProductForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { push } = useToast()

  const { data: categories = [] } = useQuery({ queryKey: ['admin', 'categories'], queryFn: adminCategoriesApi.list })
  const { data: product } = useQuery({
    queryKey: ['admin', 'products', id],
    queryFn: () => adminProductsApi.get(Number(id)),
    enabled: isEdit,
  })

  const [form, setForm] = useState<ProductFormValues>(EMPTY)
  const [ingredientsText, setIngredientsText] = useState('')
  const [allergensText, setAllergensText] = useState('')
  const [newImages, setNewImages] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!product) return
    setForm({
      category_id: product.category?.id ?? null,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      description: product.description ?? '',
      short_description: product.short_description ?? '',
      price: product.price,
      compare_at_price: product.compare_at_price,
      weight: product.weight ?? '',
      protein_grams: product.protein_grams,
      calories: product.calories,
      carbohydrates_grams: product.carbohydrates_grams ? Number(product.carbohydrates_grams) : null,
      fat_grams: product.fat_grams ? Number(product.fat_grams) : null,
      fiber_grams: product.fiber_grams ? Number(product.fiber_grams) : null,
      sugar_grams: product.sugar_grams ? Number(product.sugar_grams) : null,
      ingredients: product.ingredients,
      allergens: product.allergens,
      storage_info: product.storage_info ?? '',
      shipping_info: product.shipping_info ?? '',
      product_type: product.product_type,
      status: product.status,
      is_featured: product.is_featured,
      stock_quantity: product.stock_quantity,
      low_stock_threshold: product.low_stock_threshold,
    })
    setIngredientsText(product.ingredients.join(', '))
    setAllergensText(product.allergens.join(', '))
  }, [product])

  function update<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setFieldErrors({})

    const values: ProductFormValues = {
      ...form,
      ingredients: ingredientsText.split(',').map((s) => s.trim()).filter(Boolean),
      allergens: allergensText.split(',').map((s) => s.trim()).filter(Boolean),
      images: newImages,
    }

    try {
      if (isEdit) {
        await adminProductsApi.update(Number(id), values)
        push('Product updated.', 'success')
      } else {
        await adminProductsApi.create(values)
        push('Product created.', 'success')
      }
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      navigate('/admin/products')
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
        setFieldErrors(Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v[0]])))
      } else {
        setError('Could not save this product.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function onDeleteImage(imageId: number) {
    if (!id) return
    await adminProductsApi.deleteImage(Number(id), imageId)
    queryClient.invalidateQueries({ queryKey: ['admin', 'products', id] })
  }

  async function onMakePrimary(imageId: number) {
    if (!id) return
    await adminProductsApi.makeImagePrimary(Number(id), imageId)
    queryClient.invalidateQueries({ queryKey: ['admin', 'products', id] })
  }

  return (
    <div>
      <PageHeader title={isEdit ? 'Edit Product' : 'New Product'} />

      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        {error ? (
          <p role="alert" className="rounded-md border border-blush-300 bg-blush-50 px-4 py-3 text-sm font-medium text-blush-700">
            {error}
          </p>
        ) : null}

        <Card className="grid gap-4 p-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Name</label>
            <input value={form.name} onChange={(e) => update('name', e.target.value)} required className={inputClass} />
            {fieldErrors.name ? <p className="mt-1 text-xs text-blush-600">{fieldErrors.name}</p> : null}
          </div>
          <div>
            <label className={labelClass}>SKU</label>
            <input value={form.sku} onChange={(e) => update('sku', e.target.value)} required className={inputClass} />
            {fieldErrors.sku ? <p className="mt-1 text-xs text-blush-600">{fieldErrors.sku}</p> : null}
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select
              value={form.category_id ?? ''}
              onChange={(e) => update('category_id', e.target.value ? Number(e.target.value) : null)}
              className={inputClass}
            >
              <option value="">None</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Product Line</label>
            <select value={form.product_type} onChange={(e) => update('product_type', e.target.value as ProductFormValues['product_type'])} className={inputClass}>
              <option value="standard">Signature (Standard)</option>
              <option value="deservd_xx">DESERV'D XX</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Short Description</label>
            <input value={form.short_description} onChange={(e) => update('short_description', e.target.value)} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={4} className={inputClass} />
          </div>
        </Card>

        <Card className="grid gap-4 p-5 sm:grid-cols-3">
          <div>
            <label className={labelClass}>Price (USD)</label>
            <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => update('price', Number(e.target.value))} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Compare-at Price</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.compare_at_price ?? ''}
              onChange={(e) => update('compare_at_price', numOrNull(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Weight</label>
            <input placeholder="120g" value={form.weight} onChange={(e) => update('weight', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Stock Quantity</label>
            <input type="number" min="0" value={form.stock_quantity} onChange={(e) => update('stock_quantity', Number(e.target.value))} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Low Stock Threshold</label>
            <input type="number" min="0" value={form.low_stock_threshold} onChange={(e) => update('low_stock_threshold', Number(e.target.value))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select value={form.status} onChange={(e) => update('status', e.target.value as ProductFormValues['status'])} className={inputClass}>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-cocoa-700 sm:col-span-3">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => update('is_featured', e.target.checked)} />
            Featured (shown as Bestseller)
          </label>
        </Card>

        <Card className="grid gap-4 p-5 sm:grid-cols-3">
          <p className="sm:col-span-3 text-[11px] font-bold uppercase tracking-[0.1em] text-cocoa-500">Nutrition</p>
          <div>
            <label className={labelClass}>Calories</label>
            <input type="number" min="0" value={form.calories ?? ''} onChange={(e) => update('calories', numOrNull(e.target.value) as number | null)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Protein (g)</label>
            <input type="number" min="0" value={form.protein_grams ?? ''} onChange={(e) => update('protein_grams', numOrNull(e.target.value) as number | null)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Carbs (g)</label>
            <input type="number" min="0" value={form.carbohydrates_grams ?? ''} onChange={(e) => update('carbohydrates_grams', numOrNull(e.target.value))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Sugar (g)</label>
            <input type="number" min="0" value={form.sugar_grams ?? ''} onChange={(e) => update('sugar_grams', numOrNull(e.target.value))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Fat (g)</label>
            <input type="number" min="0" value={form.fat_grams ?? ''} onChange={(e) => update('fat_grams', numOrNull(e.target.value))} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Fibre (g)</label>
            <input type="number" min="0" value={form.fiber_grams ?? ''} onChange={(e) => update('fiber_grams', numOrNull(e.target.value))} className={inputClass} />
          </div>
        </Card>

        <Card className="grid gap-4 p-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Ingredients (comma separated)</label>
            <textarea value={ingredientsText} onChange={(e) => setIngredientsText(e.target.value)} rows={2} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Allergens (comma separated)</label>
            <textarea value={allergensText} onChange={(e) => setAllergensText(e.target.value)} rows={2} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Storage Info</label>
            <textarea value={form.storage_info} onChange={(e) => update('storage_info', e.target.value)} rows={2} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Shipping Info</label>
            <textarea value={form.shipping_info} onChange={(e) => update('shipping_info', e.target.value)} rows={2} className={inputClass} />
          </div>
        </Card>

        <Card className="p-5">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-cocoa-500">Images</p>
          {isEdit && product && product.images.length > 0 ? (
            <div className="mb-4 flex flex-wrap gap-3">
              {product.images.map((img) => (
                <div key={img.id} className="relative w-24 overflow-hidden rounded-md border border-cocoa-900/12">
                  <img src={img.url} alt="" className="aspect-square w-full object-cover" />
                  <div className="flex items-center justify-between gap-1 bg-cream-100 px-1.5 py-1 text-[9px] font-bold uppercase">
                    <button type="button" onClick={() => onMakePrimary(img.id)} className={img.is_primary ? 'text-blush-600' : 'text-cocoa-500'}>
                      {img.is_primary ? 'Primary' : 'Set'}
                    </button>
                    <button type="button" onClick={() => onDeleteImage(img.id)} className="text-cocoa-500 hover:text-blush-600">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setNewImages(Array.from(e.target.files ?? []))}
            className="text-sm text-cocoa-700"
          />
          <p className="mt-1 text-xs text-cocoa-500">New images upload as additional photos when you save.</p>
        </Card>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-cocoa-900 px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-cream-100 hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
          </button>
          {form.price ? <span className="text-sm text-cocoa-500">Preview price: {formatPrice(form.price)}</span> : null}
        </div>
      </form>
    </div>
  )
}
