import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adminCouponsApi, type CouponFormValues } from '@/api/admin/coupons'
import { useToast } from '@/context/ToastContext'
import { ApiError } from '@/lib/api'
import { formatPrice } from '@/lib/money'
import { Badge, Card, PageHeader, Pagination, Table, Th, Td, EmptyRow, inputClass, labelClass } from '../components/ui'
import type { ApiCoupon } from '@/types/api'

const EMPTY: CouponFormValues = {
  code: '',
  type: 'percentage',
  value: 10,
  min_order_amount: null,
  max_discount: null,
  usage_limit: null,
  per_customer_limit: null,
  status: 'active',
}

function CouponFields({ values, onChange }: { values: CouponFormValues; onChange: (v: CouponFormValues) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-4">
      <div>
        <label className={labelClass}>Code</label>
        <input value={values.code} onChange={(e) => onChange({ ...values, code: e.target.value.toUpperCase() })} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Type</label>
        <select value={values.type} onChange={(e) => onChange({ ...values, type: e.target.value as CouponFormValues['type'] })} className={inputClass}>
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed Amount</option>
        </select>
      </div>
      <div>
        <label className={labelClass}>Value</label>
        <input type="number" step="0.01" value={values.value} onChange={(e) => onChange({ ...values, value: Number(e.target.value) })} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Status</label>
        <select value={values.status} onChange={(e) => onChange({ ...values, status: e.target.value as 'active' | 'inactive' })} className={inputClass}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div>
        <label className={labelClass}>Min Order Amount</label>
        <input
          type="number"
          step="0.01"
          value={values.min_order_amount ?? ''}
          onChange={(e) => onChange({ ...values, min_order_amount: e.target.value ? Number(e.target.value) : null })}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Max Discount</label>
        <input
          type="number"
          step="0.01"
          value={values.max_discount ?? ''}
          onChange={(e) => onChange({ ...values, max_discount: e.target.value ? Number(e.target.value) : null })}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Usage Limit</label>
        <input
          type="number"
          value={values.usage_limit ?? ''}
          onChange={(e) => onChange({ ...values, usage_limit: e.target.value ? Number(e.target.value) : null })}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Per-Customer Limit</label>
        <input
          type="number"
          value={values.per_customer_limit ?? ''}
          onChange={(e) => onChange({ ...values, per_customer_limit: e.target.value ? Number(e.target.value) : null })}
          className={inputClass}
        />
      </div>
    </div>
  )
}

export default function Coupons() {
  const { push } = useToast()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'coupons', page], queryFn: () => adminCouponsApi.list(page) })

  const [creating, setCreating] = useState<CouponFormValues>(EMPTY)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editing, setEditing] = useState<CouponFormValues>(EMPTY)
  const [saving, setSaving] = useState(false)

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] })
  }

  async function onCreate() {
    if (!creating.code.trim()) return
    setSaving(true)
    try {
      await adminCouponsApi.create(creating)
      setCreating(EMPTY)
      invalidate()
      push('Coupon created.', 'success')
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Could not create coupon.', 'error')
    } finally {
      setSaving(false)
    }
  }

  function startEdit(coupon: ApiCoupon) {
    setEditingId(coupon.id)
    setEditing({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      min_order_amount: coupon.min_order_amount,
      max_discount: coupon.max_discount,
      usage_limit: coupon.usage_limit,
      per_customer_limit: coupon.per_customer_limit,
      status: coupon.status,
    })
  }

  async function onSaveEdit() {
    if (editingId === null) return
    setSaving(true)
    try {
      await adminCouponsApi.update(editingId, editing)
      setEditingId(null)
      invalidate()
      push('Coupon updated.', 'success')
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Could not update coupon.', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function onDelete(coupon: ApiCoupon) {
    if (!window.confirm(`Delete coupon "${coupon.code}"?`)) return
    try {
      await adminCouponsApi.delete(coupon.id)
      invalidate()
      push('Coupon deleted.', 'success')
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Could not delete coupon.', 'error')
    }
  }

  return (
    <div>
      <PageHeader title="Coupons" />

      <Card className="mb-6 p-5">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-cocoa-500">New Coupon</p>
        <CouponFields values={creating} onChange={setCreating} />
        <button
          type="button"
          onClick={onCreate}
          disabled={saving}
          className="mt-4 rounded-md bg-cocoa-900 px-5 py-2 font-display text-xs font-bold uppercase tracking-wide text-cream-100 hover:opacity-90 disabled:opacity-60"
        >
          Add Coupon
        </button>
      </Card>

      <Card className="p-4">
        <Table>
          <thead>
            <tr>
              <Th>Code</Th>
              <Th>Value</Th>
              <Th className="text-right">Used</Th>
              <Th>Status</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <EmptyRow colSpan={5}>Loading…</EmptyRow>
            ) : data && data.items.length > 0 ? (
              data.items.map((coupon) =>
                editingId === coupon.id ? (
                  <tr key={coupon.id}>
                    <td colSpan={5} className="border-b border-cocoa-900/8 px-4 py-4">
                      <CouponFields values={editing} onChange={setEditing} />
                      <div className="mt-3 flex gap-2">
                        <button type="button" onClick={onSaveEdit} disabled={saving} className="rounded-md bg-cocoa-900 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-cream-100">
                          Save
                        </button>
                        <button type="button" onClick={() => setEditingId(null)} className="rounded-md border border-cocoa-900/18 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-cocoa-700">
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={coupon.id}>
                    <Td className="font-bold text-cocoa-900">{coupon.code}</Td>
                    <Td>{coupon.type === 'percentage' ? `${coupon.value}%` : formatPrice(coupon.value)}</Td>
                    <Td className="text-right">
                      {coupon.usage_count}
                      {coupon.usage_limit ? ` / ${coupon.usage_limit}` : ''}
                    </Td>
                    <Td>
                      <Badge tone={coupon.is_currently_active ? 'success' : 'neutral'}>{coupon.status}</Badge>
                    </Td>
                    <Td>
                      <div className="flex justify-end gap-3 text-xs font-bold uppercase tracking-wide">
                        <button type="button" onClick={() => startEdit(coupon)} className="text-cocoa-700 hover:text-blush-600">
                          Edit
                        </button>
                        <button type="button" onClick={() => onDelete(coupon)} className="text-blush-600 hover:text-blush-700">
                          Delete
                        </button>
                      </div>
                    </Td>
                  </tr>
                ),
              )
            ) : (
              <EmptyRow colSpan={5}>No coupons yet.</EmptyRow>
            )}
          </tbody>
        </Table>
        {data ? <Pagination page={data.pagination.current_page} lastPage={data.pagination.last_page} onChange={setPage} /> : null}
      </Card>
    </div>
  )
}
