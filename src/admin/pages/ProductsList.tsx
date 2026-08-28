import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adminProductsApi, type AdminProductListParams } from '@/api/admin/products'
import { adminCategoriesApi } from '@/api/admin/categories'
import { formatPrice } from '@/lib/money'
import { primaryImageUrl } from '@/lib/productImage'
import { ProductImage } from '@/components/product/ProductImage'
import { ApiError } from '@/lib/api'
import { useToast } from '@/context/ToastContext'
import { Badge, Card, PageHeader, Pagination, Table, Th, Td, EmptyRow, inputClass } from '../components/ui'

export default function ProductsList() {
  const { push } = useToast()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [categoryId, setCategoryId] = useState('')

  const { data: categories = [] } = useQuery({ queryKey: ['admin', 'categories'], queryFn: adminCategoriesApi.list })

  const params = useMemo<AdminProductListParams>(
    () => ({
      page,
      ...(q.trim() ? { q: q.trim() } : {}),
      ...(status ? { status } : {}),
      ...(categoryId ? { category_id: Number(categoryId) } : {}),
    }),
    [page, q, status, categoryId],
  )

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'products', params],
    queryFn: () => adminProductsApi.list(params),
  })

  async function onDelete(id: number, name: string) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await adminProductsApi.delete(id)
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      push('Product deleted.', 'success')
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Could not delete this product.', 'error')
    }
  }

  return (
    <div>
      <PageHeader
        title="Products"
        action={
          <Link
            to="/admin/products/new"
            className="rounded-md bg-cocoa-900 px-4 py-2 font-display text-xs font-bold uppercase tracking-wide text-cream-100 hover:opacity-90"
          >
            New Product
          </Link>
        }
      />

      <Card className="mb-4 flex flex-wrap gap-3 p-4">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setPage(1)
          }}
          placeholder="Search products…"
          className={`${inputClass} max-w-xs`}
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(1)
          }}
          className={`${inputClass} max-w-[9rem]`}
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
        <select
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value)
            setPage(1)
          }}
          className={`${inputClass} max-w-[11rem]`}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </Card>

      <Card className="p-4">
        <Table>
          <thead>
            <tr>
              <Th>Product</Th>
              <Th>SKU</Th>
              <Th>Category</Th>
              <Th className="text-right">Price</Th>
              <Th className="text-right">Stock</Th>
              <Th>Status</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <EmptyRow colSpan={7}>Loading…</EmptyRow>
            ) : data && data.items.length > 0 ? (
              data.items.map((product) => (
                <tr key={product.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <ProductImage src={primaryImageUrl(product)} alt="" className="h-10 w-10 shrink-0 rounded" />
                      <span className="font-bold text-cocoa-900">{product.name}</span>
                    </div>
                  </Td>
                  <Td>{product.sku}</Td>
                  <Td>{product.category?.name ?? '—'}</Td>
                  <Td className="text-right">{formatPrice(product.price)}</Td>
                  <Td className="text-right">
                    <span className={product.low_stock ? 'font-bold text-amber-600' : ''}>{product.stock_quantity}</span>
                  </Td>
                  <Td>
                    <Badge tone={product.status === 'active' ? 'success' : product.status === 'draft' ? 'neutral' : 'danger'}>
                      {product.status}
                    </Badge>
                  </Td>
                  <Td>
                    <div className="flex justify-end gap-3 text-xs font-bold uppercase tracking-wide">
                      <Link to={`/admin/products/${product.id}/edit`} className="text-cocoa-700 hover:text-blush-600">
                        Edit
                      </Link>
                      <button type="button" onClick={() => onDelete(product.id, product.name)} className="text-blush-600 hover:text-blush-700">
                        Delete
                      </button>
                    </div>
                  </Td>
                </tr>
              ))
            ) : (
              <EmptyRow colSpan={7}>No products found.</EmptyRow>
            )}
          </tbody>
        </Table>
        {data ? <Pagination page={data.pagination.current_page} lastPage={data.pagination.last_page} onChange={setPage} /> : null}
      </Card>
    </div>
  )
}
