import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'

/** Sends the viewport back to the top on navigation, but respects #anchors. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' })
      return
    }
    window.scrollTo({ top: 0, left: 0 })
  }, [pathname, hash])

  return null
}

export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollToTop />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-cocoa-900 focus:px-4 focus:py-2.5 focus:font-display focus:text-xs focus:font-bold focus:uppercase focus:tracking-widest focus:text-cream-100"
      >
        Skip to content
      </a>

      <Header />

      <main id="main" className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <CartDrawer />
    </div>
  )
}
