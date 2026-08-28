import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { Field, SelectField } from '@/components/ui/Field'
import { SelectableCard } from '@/components/ui/SelectableCard'
import { IconCheck } from '@/components/ui/Icon'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useShippingMethods } from '@/hooks/useCatalog'
import { checkoutApi } from '@/api/checkout'
import { ApiError } from '@/lib/api'
import { formatPrice } from '@/lib/money'
import { US_STATES } from '@/data/usStates'
import { useSeo } from '@/lib/seo'
import { cn } from '@/lib/cn'

type FormState = {
  name: string
  email: string
  phone: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  zip: string
  cardNumber: string
  cardExpiry: string
  cardCvc: string
}

function initialForm(name = '', email = ''): FormState {
  return {
    name,
    email,
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  }
}

type Errors = Partial<Record<keyof FormState, string>>

function validate(form: FormState): Errors {
  const errors: Errors = {}
  if (!form.name.trim()) errors.name = 'Enter your full name.'
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address.'
  if (!form.phone.trim()) errors.phone = 'Enter a phone number.'
  if (!form.addressLine1.trim()) errors.addressLine1 = 'Enter your street address.'
  if (!form.city.trim()) errors.city = 'Enter your city.'
  if (!form.state) errors.state = 'Select a state.'
  if (!/^\d{5}(-\d{4})?$/.test(form.zip.trim())) errors.zip = 'Enter a valid ZIP code.'
  if (!/^\d{13,19}$/.test(form.cardNumber.replace(/\s/g, ''))) errors.cardNumber = 'Enter a valid card number.'
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.cardExpiry.trim())) errors.cardExpiry = 'Use MM/YY.'
  if (!/^\d{3,4}$/.test(form.cardCvc.trim())) errors.cardCvc = 'Enter a valid CVC.'
  return errors
}

export default function Checkout() {
  useSeo({ title: 'Checkout', description: "Complete your DESERV'D order.", path: '/checkout', noIndex: true })

  const cart = useCart()
  const { user } = useAuth()
  const { data: shippingMethods = [] } = useShippingMethods()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(() =>
    initialForm(user ? `${user.first_name} ${user.last_name}`.trim() : '', user?.email ?? ''),
  )
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (cart.isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-cream-200">
        <p className="text-sm text-cocoa-500">Loading…</p>
      </div>
    )
  }

  if (!cart.hasStoredItems && !submitting) {
    return <Navigate to="/cart" replace />
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    setFormError(null)
    if (Object.keys(nextErrors).length > 0) {
      document.getElementById('checkout-errors')?.focus()
      return
    }
    if (cart.shippingMethodId === null) {
      setFormError('Choose a shipping method.')
      return
    }

    setSubmitting(true)
    const [firstName, ...rest] = form.name.trim().split(/\s+/)
    const lastName = rest.join(' ') || firstName

    try {
      const order = await checkoutApi.placeOrder({
        items: cart.toCheckoutItems(),
        coupon_code: cart.couponCode,
        shipping_method_id: cart.shippingMethodId,
        payment_method: 'card',
        contact: { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() },
        shipping_address: {
          first_name: firstName,
          last_name: lastName,
          address_line1: form.addressLine1.trim(),
          address_line2: form.addressLine2.trim() || undefined,
          city: form.city.trim(),
          state: form.state,
          zip: form.zip.trim(),
          phone: form.phone.trim(),
        },
      })
      navigate('/order-confirmation', { state: { order }, replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors({
          name: err.fieldError('contact.name'),
          email: err.fieldError('contact.email'),
          phone: err.fieldError('contact.phone'),
          addressLine1: err.fieldError('shipping_address.address_line1'),
          city: err.fieldError('shipping_address.city'),
          state: err.fieldError('shipping_address.state'),
          zip: err.fieldError('shipping_address.zip'),
        })
        setFormError(err.message)
      } else {
        setFormError('Something went wrong placing your order. Please try again.')
      }
      document.getElementById('checkout-errors')?.focus()
    } finally {
      setSubmitting(false)
    }
  }

  const hasErrors = Object.values(errors).some(Boolean) || Boolean(formError)
  const pricing = cart.pricing

  return (
    <section className="bg-cream-200 py-12 sm:py-16">
      <Container>
        <SectionHeading as="h1" eyebrow="Almost There" title="Checkout" align="left" />

        <form onSubmit={onSubmit} noValidate className="mt-9 grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-8">
            {hasErrors ? (
              <p
                id="checkout-errors"
                tabIndex={-1}
                role="alert"
                className="rounded-md border border-blush-300 bg-blush-50 px-4 py-3 text-sm font-medium text-blush-700"
              >
                {formError ?? 'Please fix the highlighted fields before placing your order.'}
              </p>
            ) : null}

            <fieldset className="rounded-lg border border-cocoa-900/12 bg-cream-50 p-6">
              <legend className="mb-4 px-1 font-display text-sm font-extrabold uppercase tracking-[0.1em] text-cocoa-900">
                Contact
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Full name"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  error={errors.name}
                />
                <Field
                  label="Email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  error={errors.email}
                />
                <Field
                  label="Phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  error={errors.phone}
                  className="sm:col-span-2"
                />
              </div>
            </fieldset>

            <fieldset className="rounded-lg border border-cocoa-900/12 bg-cream-50 p-6">
              <legend className="mb-4 px-1 font-display text-sm font-extrabold uppercase tracking-[0.1em] text-cocoa-900">
                Delivery Method
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {shippingMethods.map((method) => (
                  <SelectableCard
                    key={method.id}
                    name="shipping-method"
                    value={String(method.id)}
                    checked={cart.shippingMethodId === method.id}
                    onChange={() => cart.setShippingMethodId(method.id)}
                  >
                    <span className="flex items-center justify-between font-display text-sm font-bold uppercase tracking-wide text-cocoa-900">
                      {method.name}
                      {cart.shippingMethodId === method.id ? <IconCheck className="h-4 w-4 text-blush-500" /> : null}
                    </span>
                    <span className="mt-1 text-xs text-cocoa-600">
                      {method.estimated_delivery_text ?? (method.type === 'pickup' ? 'Ready same day' : '3–5 business days')}
                      {' · '}
                      {method.price === 0 ? 'Free' : formatPrice(method.price)}
                    </span>
                  </SelectableCard>
                ))}
              </div>
            </fieldset>

            <fieldset className="rounded-lg border border-cocoa-900/12 bg-cream-50 p-6">
              <legend className="mb-4 px-1 font-display text-sm font-extrabold uppercase tracking-[0.1em] text-cocoa-900">
                Address
              </legend>
              <div className="grid gap-4 sm:grid-cols-6">
                <Field
                  label="Street address"
                  required
                  autoComplete="street-address"
                  value={form.addressLine1}
                  onChange={(e) => update('addressLine1', e.target.value)}
                  error={errors.addressLine1}
                  className="sm:col-span-6"
                />
                <Field
                  label="Apt / Suite (optional)"
                  autoComplete="address-line2"
                  value={form.addressLine2}
                  onChange={(e) => update('addressLine2', e.target.value)}
                  className="sm:col-span-6"
                />
                <Field
                  label="City"
                  required
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                  error={errors.city}
                  className="sm:col-span-3"
                />
                <SelectField
                  label="State"
                  required
                  autoComplete="address-level1"
                  value={form.state}
                  onChange={(e) => update('state', e.target.value)}
                  error={errors.state}
                  className="sm:col-span-2"
                >
                  <option value="">Select</option>
                  {US_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </SelectField>
                <Field
                  label="ZIP"
                  required
                  autoComplete="postal-code"
                  value={form.zip}
                  onChange={(e) => update('zip', e.target.value)}
                  error={errors.zip}
                  className="sm:col-span-1"
                />
              </div>
            </fieldset>

            <fieldset className="rounded-lg border border-cocoa-900/12 bg-cream-50 p-6">
              <legend className="mb-1 px-1 font-display text-sm font-extrabold uppercase tracking-[0.1em] text-cocoa-900">
                Payment
              </legend>
              <p className="mb-4 px-1 text-xs text-cocoa-500">
                Demo checkout — no real payment is processed.
              </p>
              <div className="grid gap-4 sm:grid-cols-4">
                <Field
                  label="Card number"
                  required
                  inputMode="numeric"
                  placeholder="4242 4242 4242 4242"
                  autoComplete="cc-number"
                  value={form.cardNumber}
                  onChange={(e) => update('cardNumber', e.target.value)}
                  error={errors.cardNumber}
                  className="sm:col-span-2"
                />
                <Field
                  label="Expiry"
                  required
                  placeholder="MM/YY"
                  autoComplete="cc-exp"
                  value={form.cardExpiry}
                  onChange={(e) => update('cardExpiry', e.target.value)}
                  error={errors.cardExpiry}
                />
                <Field
                  label="CVC"
                  required
                  inputMode="numeric"
                  placeholder="123"
                  autoComplete="cc-csc"
                  value={form.cardCvc}
                  onChange={(e) => update('cardCvc', e.target.value)}
                  error={errors.cardCvc}
                />
              </div>
            </fieldset>
          </div>

          <div className="lg:sticky lg:top-28 lg:h-fit">
            <div className="rounded-lg border border-cocoa-900/12 bg-cream-50 p-6">
              <h2 className="font-display text-sm font-bold uppercase tracking-[0.1em] text-cocoa-900">
                Order Summary
              </h2>

              <div className="mt-4 flex flex-col gap-3 border-b border-cocoa-900/10 pb-4">
                {cart.lines.map((line) => (
                  <div key={line.id} className="flex justify-between gap-3 text-sm">
                    <span className="text-cocoa-700">
                      {line.kind === 'product' ? `${line.quantity}× ${line.product.name}` : `Build a Box (${line.size})`}
                    </span>
                    <span className="shrink-0 font-bold text-cocoa-900">{formatPrice(line.lineTotal)}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2.5 border-b border-cocoa-900/10 py-4 text-sm">
                <div className="flex justify-between text-cocoa-700">
                  <span>Subtotal</span>
                  <span className="font-bold text-cocoa-900">
                    {pricing ? formatPrice(pricing.subtotal) : '—'}
                  </span>
                </div>
                {pricing && pricing.discount > 0 ? (
                  <div className="flex justify-between text-blush-600">
                    <span>Discount</span>
                    <span className="font-bold">−{formatPrice(pricing.discount)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-cocoa-700">
                  <span>Shipping</span>
                  <span className="font-bold text-cocoa-900">
                    {!pricing ? '—' : pricing.shipping === 0 ? 'Free' : formatPrice(pricing.shipping)}
                  </span>
                </div>
                {pricing && pricing.tax > 0 ? (
                  <div className="flex justify-between text-cocoa-700">
                    <span>Tax</span>
                    <span className="font-bold text-cocoa-900">{formatPrice(pricing.tax)}</span>
                  </div>
                ) : null}
              </div>

              <div className="flex items-center justify-between py-4">
                <span className="font-display text-sm font-bold uppercase tracking-wide text-cocoa-900">Total</span>
                <span className="font-display text-xl font-extrabold text-cocoa-900">
                  {pricing ? formatPrice(pricing.total) : '—'}
                </span>
              </div>

              <Button
                type="submit"
                size="lg"
                fullWidth
                disabled={submitting || !pricing}
                className={cn(submitting && 'opacity-80')}
              >
                {submitting ? 'Placing Order…' : 'Place Order'}
              </Button>
            </div>
          </div>
        </form>
      </Container>
    </section>
  )
}
