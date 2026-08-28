import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Wordmark } from '@/components/ui/Wordmark'
import { IconClose, IconMenu } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/coupons', label: 'Coupons' },
  { to: '/admin/reviews', label: 'Reviews' },
  { to: '/admin/inventory', label: 'Inventory' },
  { to: '/admin/settings', label: 'Settings' },
]

function SidebarLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'rounded-md px-3.5 py-2.5 font-display text-[13px] font-bold uppercase tracking-[0.05em] transition-colors',
              isActive ? 'bg-cocoa-900 text-cream-100' : 'text-cocoa-700 hover:bg-cocoa-900/8',
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function onLogout() {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-cream-200">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-cocoa-900/10 bg-cream-50 lg:flex">
        <div className="border-b border-cocoa-900/10 px-5 py-5">
          <Wordmark size="sm" />
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cocoa-400">Admin</p>
        </div>
        <SidebarLinks />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-cocoa-950/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-cream-50">
            <div className="flex items-center justify-between border-b border-cocoa-900/10 px-5 py-5">
              <Wordmark size="sm" />
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <IconClose className="h-5 w-5 text-cocoa-900" />
              </button>
            </div>
            <SidebarLinks onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-cocoa-900/10 bg-cream-50 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="p-1 text-cocoa-900 lg:hidden"
          >
            <IconMenu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-cocoa-700">
              {user?.first_name} {user?.last_name}
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-md border border-cocoa-900/18 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-cocoa-700 transition-colors hover:border-cocoa-900 hover:text-cocoa-900"
            >
              Log Out
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
