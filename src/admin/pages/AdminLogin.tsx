import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Wordmark } from '@/components/ui/Wordmark'
import { useAuth } from '@/context/AuthContext'
import { ApiError } from '@/lib/api'
import { inputClass, labelClass } from '../components/ui'

export default function AdminLogin() {
  const { login, isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated && isAdmin) {
    const redirectTo = (location.state as { from?: string } | null)?.from ?? '/admin'
    return <Navigate to={redirectTo} replace />
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const user = await login({ email, password })
      if (user.role !== 'admin') {
        setError('This account does not have admin access.')
        return
      }
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not log in. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-200 px-4">
      <div className="w-full max-w-sm rounded-lg border border-cocoa-900/12 bg-cream-50 p-7">
        <div className="mb-6 text-center">
          <Wordmark className="items-center" />
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cocoa-400">Admin Panel</p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {error ? (
            <p role="alert" className="rounded-md border border-blush-300 bg-blush-50 px-3 py-2 text-sm font-medium text-blush-700">
              {error}
            </p>
          ) : null}

          <div>
            <label className={labelClass} htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-md bg-cocoa-900 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-cream-100 transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? 'Logging in…' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  )
}
