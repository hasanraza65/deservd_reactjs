import { Fragment, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adminInventoryApi } from '@/api/admin/inventory'
import { adminProductsApi } from '@/api/admin/products'
import { useToast } from '@/context/ToastContext'
import { ApiError } from '@/lib/api'
import { Badge, Card, PageHeader, Pagination, Table, Th, Td, EmptyRow, inputClass } from '../components/ui'

function AdjustRow({ productId, onDone }: { productId: number; onDone: () => void }) {
  const { push } = useToast()
  const [quantity, setQuantity] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  async function onSubmit() {
    const qty = Number(quantity)
    if (!qty) return
    setSaving(true)
    try {
      await adminProductsApi.adjustStock(productId, qty, note || undefined)
      push('Stock adjusted.', 'success')
      setQuantity('')
      setNote('')
      onDone()
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Could not adjust stock.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="+/- qty"
        className={`${inputClass} w-24`}
      />
      <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optional)" className={`${inputClass} w-48`} />
      <button
        type="button"
        onClick={onSubmit}
        disabled={saving || !quantity}
        className="rounded-md bg-cocoa-900 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-cream-100 disabled:opacity-50"
      >
        Apply
      </button>
    </div>
  )
}

function HistoryPanel({ productId }: { productId: number }) {
  const { data } = useQuery({ queryKey: ['admin', 'inventory', productId, 'history'], queryFn: () => adminInventoryApi.history(productId) })
  if (!data || data.items.length === 0) return <p className="py-2 text-xs text-cocoa-500">No history yet.</p>
  return (
    <div className="max-h-40 overflow-y-auto py-2">
      {data.items.map((entry) => (
        <div key={entry.id} className="flex items-center justify-between border-b border-cocoa-900/6 py-1.5 text-xs text-cocoa-600">
          <span>
            {entry.type} · {entry.quantity_change > 0 ? '+' : ''}
            {entry.quantity_change} → {entry.quantity_after}
            {entry.note ? ` · ${entry.note}` : ''}
          </span>
          <span className="text-cocoa-400">{new Date(entry.created_at).toLocaleDateString()}</span>
        </div>
      ))}
    </div>
  )
}

export default function Inventory() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [outOfStockOnly, setOutOfStockOnly] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'inventory', page, lowStockOnly, outOfStockOnly],
    queryFn: () => adminInventoryApi.list({ page, low_stock_only: lowStockOnly || undefined, out_of_stock_only: outOfStockOnly || undefined }),
  })

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ['admin', 'inventory'] })
  }

  return (
    <div>
      <PageHeader title="Inventory" />

      <Card className="mb-4 flex flex-wrap gap-4 p-4">
        <label className="flex items-center gap-2 text-sm text-cocoa-700">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => {
              setLowStockOnly(e.target.checked)
              setPage(1)
            }}
          />
          Low stock only
        </label>
        <label className="flex items-center gap-2 text-sm text-cocoa-700">
          <input
            type="checkbox"
            checked={outOfStockOnly}
            onChange={(e) => {
              setOutOfStockOnly(e.target.checked)
              setPage(1)
            }}
          />
          Out of stock only
        </label>
      </Card>

      <Card className="p-4">
        <Table>
          <thead>
            <tr>
              <Th>Product</Th>
              <Th>SKU</Th>
              <Th className="text-right">Stock</Th>
              <Th className="text-right">Threshold</Th>
              <Th>Adjust</Th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <EmptyRow colSpan={5}>Loading…</EmptyRow>
            ) : data && data.items.length > 0 ? (
              data.items.map((row) => (
                <Fragment key={row.id}>
                  <tr>
                    <Td className="font-bold text-cocoa-900">{row.name}</Td>
                    <Td>{row.sku}</Td>
                    <Td className="text-right">
                      {row.stock_quantity === 0 ? <Badge tone="danger">Out</Badge> : row.stock_quantity <= row.low_stock_threshold ? <Badge tone="warning">{row.stock_quantity}</Badge> : row.stock_quantity}
                    </Td>
                    <Td className="text-right">{row.low_stock_threshold}</Td>
                    <Td>
                      <button
                        type="button"
                        onClick={() => setExpanded(expanded === row.id ? null : row.id)}
                        className="text-xs font-bold uppercase tracking-wide text-cocoa-700 hover:text-blush-600"
                      >
                        {expanded === row.id ? 'Close' : 'Adjust / History'}
                      </button>
                    </Td>
                  </tr>
                  {expanded === row.id ? (
                    <tr>
                      <td colSpan={5} className="border-b border-cocoa-900/8 bg-cream-100 px-4 py-2">
                        <AdjustRow productId={row.id} onDone={refresh} />
                        <HistoryPanel productId={row.id} />
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              ))
            ) : (
              <EmptyRow colSpan={5}>No products found.</EmptyRow>
            )}
          </tbody>
        </Table>
        {data ? <Pagination page={data.pagination.current_page} lastPage={data.pagination.last_page} onChange={setPage} /> : null}
      </Card>
    </div>
  )
}
