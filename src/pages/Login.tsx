import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { useAuth } from '@/context/AuthContext'
import { ApiError } from '@/lib/api'
import { useSeo } from '@/lib/seo'

export default function Login() {
  useSeo({ title: 'Log In', description: "Log in to your DESERV'D account.", path: '/login', noIndex: true })

  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) {
    const redirectTo = (location.state as { from?: string } | null)?.from ?? '/account'
    return <Navigate to={redirectTo} replace />
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const user = await login({ email, password })
      navigate(user.role === 'admin' ? '/admin' : '/account', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not log in. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="bg-cream-200 py-16 sm:py-24">
      <Container size="narrow">
        <SectionHeading as="h1" eyebrow="Welcome Back" title="Log In" align="left" />

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4 rounded-lg border border-cocoa-900/12 bg-cream-50 p-6 sm:p-7">
          {error ? (
            <p role="alert" className="rounded-md border border-blush-300 bg-blush-50 px-4 py-3 text-sm font-medium text-blush-700">
              {error}
            </p>
          ) : null}

          <Field
            label="Email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Field
            label="Password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" size="lg" fullWidth disabled={submitting} className="mt-2">
            {submitting ? 'Logging in…' : 'Log In'}
          </Button>

          <p className="text-center text-sm text-cocoa-600">
            New here?{' '}
            <Link to="/register" className="font-bold text-cocoa-900 underline underline-offset-2 hover:text-blush-600">
              Create an account
            </Link>
          </p>
        </form>
      </Container>
    </section>
  )
}
