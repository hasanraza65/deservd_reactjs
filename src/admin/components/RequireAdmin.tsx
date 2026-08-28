import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

/** Gates every /admin/* route except /admin/login behind a logged-in admin user. */
export function RequireAdmin() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-200">
        <p className="text-sm text-cocoa-500">Loading…</p>
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
  }

  return <Outlet />
}
