import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { MAIN_NAV } from '@/data/nav'
import { formatPrice } from '@/lib/money'
import { primaryImageUrl } from '@/lib/productImage'
import { useAllProducts } from '@/hooks/useCatalog'
import { useCart } from '@/context/CartContext'
import { Wordmark } from '@/components/ui/Wordmark'
import { IconCart, IconClose, IconMenu, IconSearch, IconUser } from '@/components/ui/Icon'
import { ProductImage } from '@/components/product/ProductImage'
import { AnnouncementBar } from './AnnouncementBar'
import { MobileNav } from './MobileNav'
import { cn } from '@/lib/cn'

const MAX_RESULTS = 5

function SearchPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()
  const { data: products = [] } = useAllProducts()

  useEffect(() => {
    inputRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const term = query.trim().toLowerCase()
  const results = term
    ? products
        .filter(
          (product) =>
            product.name.toLowerCase().includes(term) ||
            (product.short_description ?? '').toLowerCase().includes(term),
        )
        .slice(0, MAX_RESULTS)
    : []

  return (
    <div className="border-t border-cocoa-900/10 bg-cream-100">
      <div className="mx-auto max-w-[1280px] px-5 py-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3 border-b border-cocoa-900/20 pb-3">
          <IconSearch className="h-5 w-5 shrink-0 text-cocoa-600" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search flavours — chocolate, marshmallow, cinnamon…"
            aria-label="Search cookies"
            aria-controls={listId}
            className="w-full bg-transparent text-base text-cocoa-900 outline-none placeholder:text-cocoa-500"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-1 text-cocoa-600 transition-colors hover:text-blush-600"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        <div id={listId} aria-live="polite">
          {term && results.length === 0 ? (
            <p className="pt-4 text-sm text-cocoa-600">
              No cookies match “{query.trim()}”. Try “chocolate” or “cinnamon”.
            </p>
          ) : null}

          {results.length > 0 ? (
            <ul className="grid gap-1 pt-3">
              {results.map((product) => (
                <li key={product.slug}>
                  <Link
                    to={`/cookies/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-cream-300"
                  >
                    <ProductImage src={primaryImageUrl(product)} alt="" className="h-11 w-11 shrink-0 rounded" />
                    <span className="flex-1">
                      <span className="block font-display text-sm font-bold uppercase tracking-wide text-cocoa-900">
                        {product.name}
                      </span>
                      <span className="block text-xs text-cocoa-600">{product.short_description}</span>
                    </span>
                    <span className="font-display text-sm font-bold text-cocoa-900">
                      {formatPrice(product.price)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { count, openDrawer } = useCart()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Any navigation closes whatever was open.
  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [location.pathname])

  return (
    <>
      <AnnouncementBar />

      <header
        className={cn(
          'sticky top-0 z-40 bg-cream-200 transition-shadow duration-300',
          scrolled ? 'shadow-[0_1px_0_rgba(48,29,14,0.12),0_8px_24px_-18px_rgba(48,29,14,0.5)]' : '',
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between gap-6 px-5 sm:px-8 lg:h-20 lg:px-12">
          <Link to="/" aria-label="DESERV’D — home" className="shrink-0">
            <Wordmark />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-7 xl:gap-9">
              {MAIN_NAV.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'relative py-2 font-display text-[12.5px] font-bold uppercase tracking-[0.13em] transition-colors',
                        'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[2px] after:origin-left after:bg-blush-500',
                        'after:transition-transform after:duration-300 after:ease-[var(--ease-out-soft)]',
                        isActive
                          ? 'text-blush-600 after:scale-x-100'
                          : 'text-cocoa-900 hover:text-blush-600 after:scale-x-0 hover:after:scale-x-100',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              aria-label="Search"
              aria-expanded={searchOpen}
              className="p-2 text-cocoa-900 transition-colors hover:text-blush-600"
            >
              <IconSearch className="h-[21px] w-[21px]" />
            </button>

            <Link
              to="/account"
              aria-label="My account"
              className="hidden p-2 text-cocoa-900 transition-colors hover:text-blush-600 sm:block"
            >
              <IconUser className="h-[21px] w-[21px]" />
            </Link>

            <button
              type="button"
              onClick={openDrawer}
              aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}
              className="relative p-2 text-cocoa-900 transition-colors hover:text-blush-600"
            >
              <IconCart className="h-[21px] w-[21px]" />
              {count > 0 ? (
                <span
                  aria-hidden="true"
                  className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-blush-500 px-1 font-display text-[10px] font-bold leading-none text-white"
                >
                  {count > 99 ? '99+' : count}
                </span>
              ) : null}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="p-2 text-cocoa-900 transition-colors hover:text-blush-600 lg:hidden"
            >
              <IconMenu className="h-[22px] w-[22px]" />
            </button>
          </div>
        </div>

        {searchOpen ? <SearchPanel onClose={() => setSearchOpen(false)} /> : null}
      </header>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
