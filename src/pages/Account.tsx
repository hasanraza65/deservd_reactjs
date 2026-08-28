import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { Field, SelectField } from '@/components/ui/Field'
import { ProductImage } from '@/components/product/ProductImage'
import { StatusStepper } from '@/components/account/StatusStepper'
import { IconCheck, IconClose } from '@/components/ui/Icon'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { customerApi, type AddressPayload } from '@/api/customer'
import { orderApi } from '@/api/customer'
import { ApiError } from '@/lib/api'
import { formatPrice } from '@/lib/money'
import { primaryImageUrl } from '@/lib/productImage'
import { US_STATES } from '@/data/usStates'
import { useSeo } from '@/lib/seo'
import { cn } from '@/lib/cn'
import type { ApiAddress } from '@/types/api'

type Tab = 'orders' | 'profile' | 'addresses' | 'wishlist'

const TABS: { key: Tab; label: string }[] = [
  { key: 'orders', label: 'Orders' },
  { key: 'profile', label: 'Profile' },
  { key: 'addresses', label: 'Addresses' },
  { key: 'wishlist', label: 'Wishlist' },
]

const EMPTY_ADDRESS: AddressPayload = {
  type: 'shipping',
  first_name: '',
  last_name: '',
  address_line1: '',
  city: '',
  state: '',
  zip: '',
  is_default: false,
}

function ProfileTab() {
  const { user, refresh } = useAuth()
  const { push } = useToast()
  const [form, setForm] = useState({
    first_name: user?.first_name ?? '',
    last_name: user?.last_name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
  })
  const [saving, setSaving] = useState(false)

  async function onSave() {
    setSaving(true)
    try {
      await customerApi.updateProfile(form)
      await refresh()
      push('Profile changes saved.', 'success')
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Could not save your profile.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg rounded-lg border border-cocoa-900/12 bg-cream-50 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" value={form.first_name} onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))} />
        <Field label="Last name" value={form.last_name} onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))} />
        <Field label="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="sm:col-span-2" />
        <Field label="Phone" type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="sm:col-span-2" />
      </div>
      <Button size="md" className="mt-5" onClick={onSave} disabled={saving}>
        {saving ? 'Saving…' : 'Save Changes'}
      </Button>
    </div>
  )
}

function AddressForm({ onCancel, onSaved }: { onCancel: () => void; onSaved: () => void }) {
  const { push } = useToast()
  const [form, setForm] = useState<AddressPayload>(EMPTY_ADDRESS)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await customerApi.addAddress(form)
      push('Address added.', 'success')
      onSaved()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save this address.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-cocoa-900/12 bg-cream-50 p-5">
      {error ? <p className="mb-3 text-sm text-blush-600">{error}</p> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="First name" required value={form.first_name} onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))} />
        <Field label="Last name" required value={form.last_name} onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))} />
        <Field label="Address" required value={form.address_line1} onChange={(e) => setForm((f) => ({ ...f, address_line1: e.target.value }))} className="sm:col-span-2" />
        <Field label="City" required value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
        <SelectField label="State" required value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}>
          <option value="">Select</option>
          {US_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </SelectField>
        <Field label="ZIP" required value={form.zip} onChange={(e) => setForm((f) => ({ ...f, zip: e.target.value }))} />
        <SelectField label="Type" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as 'shipping' | 'billing' }))}>
          <option value="shipping">Shipping</option>
          <option value="billing">Billing</option>
        </SelectField>
      </div>
      <label className="mt-3 flex items-center gap-2 text-sm text-cocoa-700">
        <input type="checkbox" checked={form.is_default} onChange={(e) => setForm((f) => ({ ...f, is_default: e.target.checked }))} />
        Set as default
      </label>
      <div className="mt-4 flex gap-2">
        <Button type="submit" size="sm" disabled={saving}>
          {saving ? 'Saving…' : 'Save Address'}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

function AddressesTab() {
  const { push } = useToast()
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const { data: addresses = [] } = useQuery({ queryKey: ['customer', 'addresses'], queryFn: customerApi.addresses })

  async function onDelete(address: ApiAddress) {
    try {
      await customerApi.deleteAddress(address.id)
      queryClient.invalidateQueries({ queryKey: ['customer', 'addresses'] })
      push('Address removed.', 'success')
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Could not remove this address.', 'error')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((address) => (
          <div key={address.id} className="rounded-lg border border-cocoa-900/12 bg-cream-50 p-5">
            <div className="flex items-center justify-between">
              <p className="font-display text-sm font-extrabold uppercase text-cocoa-900">
                {address.first_name} {address.last_name}
              </p>
              {address.is_default ? (
                <span className="rounded-full bg-blush-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blush-700">
                  Default
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-cocoa-700">
              {address.address_line1}
              <br />
              {address.city}, {address.state} {address.zip}
            </p>
            <button
              type="button"
              onClick={() => onDelete(address)}
              className="mt-3 flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-cocoa-500 hover:text-blush-600"
            >
              <IconClose className="h-3 w-3" />
              Remove
            </button>
          </div>
        ))}
      </div>

      {showForm ? (
        <AddressForm
          onCancel={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false)
            queryClient.invalidateQueries({ queryKey: ['customer', 'addresses'] })
          }}
        />
      ) : (
        <Button size="md" variant="outline" className="self-start" onClick={() => setShowForm(true)}>
          Add Address
        </Button>
      )}
    </div>
  )
}

function WishlistTab() {
  const { push } = useToast()
  const cart = useCart()
  const queryClient = useQueryClient()
  const { data: products = [] } = useQuery({ queryKey: ['customer', 'wishlist'], queryFn: customerApi.wishlist })

  async function onRemove(productId: number) {
    await customerApi.removeFromWishlist(productId)
    queryClient.invalidateQueries({ queryKey: ['customer', 'wishlist'] })
  }

  if (products.length === 0) {
    return <p className="text-sm text-cocoa-500">Nothing saved yet — tap the heart on any cookie to add it here.</p>
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {products.map((product) => (
        <div key={product.id} className="flex items-center gap-4 rounded-lg border border-cocoa-900/12 bg-cream-50 p-4">
          <ProductImage src={primaryImageUrl(product)} alt="" className="h-16 w-16 shrink-0 rounded-md" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-[13px] font-bold uppercase text-cocoa-900">{product.name}</p>
            <p className="text-sm text-cocoa-600">{formatPrice(product.price)}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Button
              size="sm"
              onClick={() => {
                cart.add(product.id)
                push(`${product.name} added to cart.`, 'success')
                cart.openDrawer()
              }}
            >
              <IconCheck className="h-3.5 w-3.5" />
              Add
            </Button>
            <button
              type="button"
              onClick={() => onRemove(product.id)}
              className="text-[11px] font-bold uppercase tracking-wide text-cocoa-500 hover:text-blush-600"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Account() {
  useSeo({
    title: 'My Account',
    description: "Manage your DESERV'D account details and delivery addresses.",
    path: '/account',
    noIndex: true,
  })

  const { user, isAuthenticated, isLoading } = useAuth()
  const [tab, setTab] = useState<Tab>('orders')
  const { data: recentOrders = [] } = useQuery({
    queryKey: ['orders', 'recent'],
    queryFn: () => orderApi.myOrders(1),
    select: (data) => data.items.slice(0, 2),
    enabled: isAuthenticated,
  })

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-cream-200">
        <p className="text-sm text-cocoa-500">Loading…</p>
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" state={{ from: '/account' }} replace />

  return (
    <section className="bg-cream-200 py-12 sm:py-16">
      <Container>
        <Reveal>
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-blush-600">
            Welcome Back
          </p>
          <h1 className="mt-1 text-[clamp(1.9rem,1.4rem+2vw,2.75rem)] uppercase leading-tight text-cocoa-900">
            {user?.first_name}
          </h1>
        </Reveal>

        <Reveal delay={60}>
          <div className="mt-8 flex gap-1 overflow-x-auto border-b border-cocoa-900/10">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                aria-current={tab === t.key ? 'page' : undefined}
                className={cn(
                  'relative shrink-0 px-4 py-3 font-display text-[12px] font-bold uppercase tracking-[0.08em] transition-colors',
                  tab === t.key ? 'text-blush-600' : 'text-cocoa-600 hover:text-cocoa-900',
                )}
              >
                {t.label}
                {tab === t.key ? (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-blush-500" />
                ) : null}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={110} className="mt-8">
          {tab === 'orders' ? (
            <div className="flex flex-col gap-4">
              {recentOrders.length === 0 ? (
                <p className="text-sm text-cocoa-500">No orders yet.</p>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="rounded-lg border border-cocoa-900/12 bg-cream-50 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-sm font-extrabold uppercase text-cocoa-900">
                          Order #{order.order_number}
                        </p>
                      </div>
                      <p className="font-display text-base font-extrabold text-cocoa-900">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                    <div className="mt-4 max-w-xs">
                      <StatusStepper status={order.status} />
                    </div>
                  </div>
                ))
              )}
              <Button to="/account/orders" variant="outline" size="md" className="self-start">
                View All Orders
              </Button>
            </div>
          ) : null}

          {tab === 'profile' ? <ProfileTab /> : null}
          {tab === 'addresses' ? <AddressesTab /> : null}
          {tab === 'wishlist' ? <WishlistTab /> : null}
        </Reveal>
      </Container>
    </section>
  )
}
