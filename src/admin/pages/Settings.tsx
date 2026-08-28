import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adminSettingsApi } from '@/api/admin/settings'
import { adminShippingMethodsApi, type ShippingMethodFormValues } from '@/api/admin/shippingMethods'
import { adminBoxOptionsApi, type BoxOptionFormValues } from '@/api/admin/boxOptions'
import { useToast } from '@/context/ToastContext'
import { ApiError } from '@/lib/api'
import { formatPrice } from '@/lib/money'
import { Card, PageHeader, Table, Th, Td, EmptyRow, inputClass, labelClass } from '../components/ui'
import type { AppSettings } from '@/types/api'

function GeneralSettings() {
  const { push } = useToast()
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'settings'], queryFn: adminSettingsApi.get })
  const [form, setForm] = useState<AppSettings | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (data) setForm(data)
  }, [data])

  async function onSave() {
    if (!form) return
    setSaving(true)
    try {
      await adminSettingsApi.update(form)
      push('Settings saved.', 'success')
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Could not save settings.', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading || !form) return <p className="text-sm text-cocoa-500">Loading…</p>

  return (
    <Card className="grid gap-4 p-5 sm:grid-cols-2">
      <div>
        <label className={labelClass}>Store Name</label>
        <input value={form.store_name} onChange={(e) => setForm({ ...form, store_name: e.target.value })} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Store Email</label>
        <input value={form.store_email} onChange={(e) => setForm({ ...form, store_email: e.target.value })} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Phone (Primary)</label>
        <input value={form.store_phone_primary} onChange={(e) => setForm({ ...form, store_phone_primary: e.target.value })} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Phone (Secondary)</label>
        <input value={form.store_phone_secondary} onChange={(e) => setForm({ ...form, store_phone_secondary: e.target.value })} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Currency</label>
        <input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Tax Rate (%)</label>
        <input type="number" step="0.01" value={form.tax_rate_percent} onChange={(e) => setForm({ ...form, tax_rate_percent: Number(e.target.value) })} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Free Shipping Threshold ($)</label>
        <input
          type="number"
          step="0.01"
          value={form.free_shipping_threshold_cents / 100}
          onChange={(e) => setForm({ ...form, free_shipping_threshold_cents: Math.round(Number(e.target.value) * 100) })}
          className={inputClass}
        />
      </div>
      <div className="flex items-end gap-4">
        <label className="flex items-center gap-2 text-sm text-cocoa-700">
          <input type="checkbox" checked={form.local_pickup_enabled} onChange={(e) => setForm({ ...form, local_pickup_enabled: e.target.checked })} />
          Local pickup enabled
        </label>
        <label className="flex items-center gap-2 text-sm text-cocoa-700">
          <input type="checkbox" checked={form.store_open} onChange={(e) => setForm({ ...form, store_open: e.target.checked })} />
          Store open
        </label>
      </div>
      <div className="sm:col-span-2">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="rounded-md bg-cocoa-900 px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-cream-100 hover:opacity-90 disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </Card>
  )
}

const EMPTY_METHOD: ShippingMethodFormValues = { name: '', type: 'shipping', price: 0, estimated_delivery_text: '', is_active: true }

function ShippingMethodsSection() {
  const { push } = useToast()
  const queryClient = useQueryClient()
  const { data: methods = [] } = useQuery({ queryKey: ['admin', 'shipping-methods'], queryFn: adminShippingMethodsApi.list })
  const [form, setForm] = useState<ShippingMethodFormValues>(EMPTY_METHOD)

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['admin', 'shipping-methods'] })
  }

  async function onCreate() {
    if (!form.name.trim()) return
    try {
      await adminShippingMethodsApi.create(form)
      setForm(EMPTY_METHOD)
      invalidate()
      push('Shipping method added.', 'success')
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Could not add shipping method.', 'error')
    }
  }

  async function onToggle(id: number, values: ShippingMethodFormValues, isActive: boolean) {
    await adminShippingMethodsApi.update(id, { ...values, is_active: isActive })
    invalidate()
  }

  async function onDelete(id: number) {
    if (!window.confirm('Delete this shipping method?')) return
    await adminShippingMethodsApi.delete(id)
    invalidate()
  }

  return (
    <Card className="p-5">
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-cocoa-500">Shipping Methods</p>
      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Type</Th>
            <Th className="text-right">Price</Th>
            <Th>Active</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {methods.length === 0 ? (
            <EmptyRow colSpan={5}>No shipping methods yet.</EmptyRow>
          ) : (
            methods.map((method) => (
              <tr key={method.id}>
                <Td className="font-bold text-cocoa-900">{method.name}</Td>
                <Td className="capitalize">{method.type}</Td>
                <Td className="text-right">{method.price === 0 ? 'Free' : formatPrice(method.price)}</Td>
                <Td>
                  <input
                    type="checkbox"
                    checked={method.is_active}
                    onChange={(e) =>
                      onToggle(
                        method.id,
                        { name: method.name, type: method.type, price: method.price, estimated_delivery_text: method.estimated_delivery_text ?? '' },
                        e.target.checked,
                      )
                    }
                  />
                </Td>
                <Td>
                  <button type="button" onClick={() => onDelete(method.id)} className="text-xs font-bold uppercase tracking-wide text-blush-600 hover:text-blush-700">
                    Delete
                  </button>
                </Td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <div className="mt-4 grid gap-3 border-t border-cocoa-900/10 pt-4 sm:grid-cols-4">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className={inputClass} />
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ShippingMethodFormValues['type'] })} className={inputClass}>
          <option value="shipping">Shipping</option>
          <option value="pickup">Pickup</option>
        </select>
        <input
          type="number"
          step="0.01"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          placeholder="Price"
          className={inputClass}
        />
        <input
          value={form.estimated_delivery_text}
          onChange={(e) => setForm({ ...form, estimated_delivery_text: e.target.value })}
          placeholder="e.g. 3-5 business days"
          className={inputClass}
        />
      </div>
      <button
        type="button"
        onClick={onCreate}
        className="mt-3 rounded-md bg-cocoa-900 px-5 py-2 font-display text-xs font-bold uppercase tracking-wide text-cream-100 hover:opacity-90"
      >
        Add Method
      </button>
    </Card>
  )
}

const EMPTY_BOX: BoxOptionFormValues = { size: 4, price: 0, is_active: true }

function BoxOptionsSection() {
  const { push } = useToast()
  const queryClient = useQueryClient()
  const { data: options = [] } = useQuery({ queryKey: ['admin', 'box-options'], queryFn: adminBoxOptionsApi.list })
  const [form, setForm] = useState<BoxOptionFormValues>(EMPTY_BOX)

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['admin', 'box-options'] })
  }

  async function onCreate() {
    try {
      await adminBoxOptionsApi.create(form)
      setForm(EMPTY_BOX)
      invalidate()
      push('Box option added.', 'success')
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Could not add box option.', 'error')
    }
  }

  async function onUpdatePrice(id: number, size: number, price: number) {
    await adminBoxOptionsApi.update(id, { size, price })
    invalidate()
  }

  async function onDelete(id: number) {
    if (!window.confirm('Delete this box size?')) return
    await adminBoxOptionsApi.delete(id)
    invalidate()
  }

  return (
    <Card className="p-5">
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.1em] text-cocoa-500">Build-a-Box Sizes & Pricing</p>
      <Table>
        <thead>
          <tr>
            <Th>Size</Th>
            <Th className="text-right">Price</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {options.length === 0 ? (
            <EmptyRow colSpan={3}>No box options yet.</EmptyRow>
          ) : (
            options.map((option) => (
              <tr key={option.id}>
                <Td>{option.size} cookies</Td>
                <Td className="text-right">
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={option.price}
                    onBlur={(e) => onUpdatePrice(option.id, option.size, Number(e.target.value))}
                    className={`${inputClass} w-28 text-right`}
                  />
                </Td>
                <Td>
                  <button type="button" onClick={() => onDelete(option.id)} className="text-xs font-bold uppercase tracking-wide text-blush-600 hover:text-blush-700">
                    Delete
                  </button>
                </Td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <div className="mt-4 flex gap-3 border-t border-cocoa-900/10 pt-4">
        <input
          type="number"
          value={form.size}
          onChange={(e) => setForm({ ...form, size: Number(e.target.value) })}
          placeholder="Size"
          className={`${inputClass} w-28`}
        />
        <input
          type="number"
          step="0.01"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          placeholder="Price"
          className={`${inputClass} w-28`}
        />
        <button
          type="button"
          onClick={onCreate}
          className="rounded-md bg-cocoa-900 px-5 py-2 font-display text-xs font-bold uppercase tracking-wide text-cream-100 hover:opacity-90"
        >
          Add Size
        </button>
      </div>
    </Card>
  )
}

export default function Settings() {
  return (
    <div>
      <PageHeader title="Settings" />
      <div className="flex flex-col gap-6">
        <GeneralSettings />
        <ShippingMethodsSection />
        <BoxOptionsSection />
      </div>
    </div>
  )
}
