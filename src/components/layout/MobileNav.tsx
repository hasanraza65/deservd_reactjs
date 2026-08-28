import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { MAIN_NAV } from '@/data/nav'
import { SITE } from '@/data/site'
import { Button } from '@/components/ui/Button'
import { Wordmark } from '@/components/ui/Wordmark'
import {
  IconClose,
  IconFacebook,
  IconInstagram,
  IconMail,
  IconTikTok,
  IconUser,
} from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

type Props = {
  open: boolean
  onClose: () => void
}

/**
 * Full-height drawer for small screens. Slides in from the right, locks the page
 * behind it, closes on Escape and moves focus into the panel on open.
 */
export function MobileNav({ open, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  return (
    <div className={cn('lg:hidden', !open && 'pointer-events-none')} aria-hidden={!open}>
      {/* backdrop */}
      <div
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-50 bg-cocoa-950/45 transition-opacity duration-300 ease-[var(--ease-out-soft)]',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-[88%] max-w-sm flex-col bg-cream-100',
          'transition-transform duration-400 ease-[var(--ease-out-soft)]',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-start justify-between border-b border-cocoa-900/10 px-6 py-5">
          <Wordmark size="sm" />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="-mr-2 -mt-1 p-2 text-cocoa-900 transition-colors hover:text-blush-600"
          >
            <IconClose className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 py-7" aria-label="Main">
          <ul className="flex flex-col gap-1">
            {MAIN_NAV.map((item, i) => (
              <li
                key={item.to}
                style={{ transitionDelay: open ? `${90 + i * 45}ms` : '0ms' }}
                className={cn(
                  'transition-[opacity,transform] duration-500 ease-[var(--ease-out-soft)]',
                  open ? 'translate-x-0 opacity-100' : 'translate-x-3 opacity-0',
                )}
              >
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'block border-b border-cocoa-900/8 py-3.5 font-display text-xl font-extrabold uppercase tracking-[0.03em] transition-colors',
                      isActive ? 'text-blush-600' : 'text-cocoa-900 hover:text-blush-600',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3">
            <Button to="/shop" size="lg" fullWidth onClick={onClose}>
              Shop Cookies
            </Button>
            <Button to="/build-a-box" variant="outline" size="lg" fullWidth onClick={onClose}>
              Build Your Box
            </Button>
          </div>

          <NavLink
            to="/account"
            onClick={onClose}
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-cocoa-700 transition-colors hover:text-blush-600"
          >
            <IconUser className="h-4.5 w-4.5" />
            My account
          </NavLink>
        </nav>

        <div className="border-t border-cocoa-900/10 px-6 py-5">
          <a
            href={`mailto:${SITE.email}`}
            className="flex items-center gap-2 text-sm text-cocoa-700 transition-colors hover:text-blush-600"
          >
            <IconMail className="h-4.5 w-4.5" />
            {SITE.email}
          </a>
          <div className="mt-4 flex items-center gap-4 text-cocoa-700">
            <a href={SITE.instagram.url} aria-label="Instagram" className="transition-colors hover:text-blush-600">
              <IconInstagram className="h-5 w-5" />
            </a>
            <a href={SITE.tiktok.url} aria-label="TikTok" className="transition-colors hover:text-blush-600">
              <IconTikTok className="h-5 w-5" />
            </a>
            <a href={SITE.facebook.url} aria-label="Facebook" className="transition-colors hover:text-blush-600">
              <IconFacebook className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
