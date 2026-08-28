import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { useAuth } from '@/context/AuthContext'
import { ApiError } from '@/lib/api'
import { useSeo } from '@/lib/seo'

type FormState = {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  passwordConfirmation: string
}

const INITIAL: FormState = { firstName: '', lastName: '', email: '', phone: '', password: '', passwordConfirmation: '' }

export default function Register() {
  useSeo({ title: 'Create Account', description: "Create your DESERV'D account.", path: '/register', noIndex: true })

  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(INITIAL)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) return <Navigate to="/account" replace />

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setFormError(null)
    if (form.password !== form.passwordConfirmation) {
      setErrors((current) => ({ ...current, passwordConfirmation: 'Passwords do not match.' }))
      return
    }

    setSubmitting(true)
    try {
      await register({
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        password: form.password,
        password_confirmation: form.passwordConfirmation,
      })
      navigate('/account', { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors({
          firstName: err.fieldError('first_name'),
          lastName: err.fieldError('last_name'),
          email: err.fieldError('email'),
          phone: err.fieldError('phone'),
          password: err.fieldError('password'),
        })
        setFormError(err.message)
      } else {
        setFormError('Could not create your account. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="bg-cream-200 py-16 sm:py-24">
      <Container size="narrow">
        <SectionHeading as="h1" eyebrow="Join Us" title="Create Account" align="left" />

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4 rounded-lg border border-cocoa-900/12 bg-cream-50 p-6 sm:p-7">
          {formError ? (
            <p role="alert" className="rounded-md border border-blush-300 bg-blush-50 px-4 py-3 text-sm font-medium text-blush-700">
              {formError}
            </p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" required value={form.firstName} onChange={(e) => update('firstName', e.target.value)} error={errors.firstName} />
            <Field label="Last name" required value={form.lastName} onChange={(e) => update('lastName', e.target.value)} error={errors.lastName} />
          </div>
          <Field label="Email" type="email" required autoComplete="email" value={form.email} onChange={(e) => update('email', e.target.value)} error={errors.email} />
          <Field label="Phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} error={errors.phone} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Password"
              type="password"
              required
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              error={errors.password}
            />
            <Field
              label="Confirm password"
              type="password"
              required
              autoComplete="new-password"
              value={form.passwordConfirmation}
              onChange={(e) => update('passwordConfirmation', e.target.value)}
              error={errors.passwordConfirmation}
            />
          </div>

          <Button type="submit" size="lg" fullWidth disabled={submitting} className="mt-2">
            {submitting ? 'Creating account…' : 'Create Account'}
          </Button>

          <p className="text-center text-sm text-cocoa-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-cocoa-900 underline underline-offset-2 hover:text-blush-600">
              Log in
            </Link>
          </p>
        </form>
      </Container>
    </section>
  )
}
