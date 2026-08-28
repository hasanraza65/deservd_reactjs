import { Link } from 'react-router-dom'
import { FOOTER_NAV } from '@/data/nav'
import { SITE } from '@/data/site'
import { Container } from '@/components/ui/Container'
import { Wordmark } from '@/components/ui/Wordmark'
import {
  IconFacebook,
  IconInstagram,
  IconMail,
  IconPhone,
  IconTikTok,
} from '@/components/ui/Icon'

const SOCIALS = [
  { label: 'Instagram', href: SITE.instagram.url, Glyph: IconInstagram },
  { label: 'TikTok', href: SITE.tiktok.url, Glyph: IconTikTok },
  { label: 'Facebook', href: SITE.facebook.url, Glyph: IconFacebook },
]

export function Footer() {
  return (
    <footer className="bg-cocoa-900 text-cream-200">
      <Container className="py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4 lg:pr-8">
            <Wordmark tone="light" size="lg" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-cream-400">
              Bakery-style cookies with protein and more purposeful macros. Indulgent flavour in
              every soft, chewy bite.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {SOCIALS.map(({ label, href, Glyph }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cream-300 transition-colors hover:text-blush-300"
                >
                  <Glyph className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-5">
            {FOOTER_NAV.map((column) => (
              <nav key={column.heading} aria-label={column.heading}>
                <h2 className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-blush-400">
                  {column.heading}
                </h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {column.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        className="text-sm text-cream-300 transition-colors hover:text-white"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="lg:col-span-3">
            <h2 className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-blush-400">
              Have Questions?
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {SITE.phones.map((phone) => (
                <li key={phone}>
                  <a
                    href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                    className="flex items-center gap-2.5 text-sm text-cream-300 transition-colors hover:text-white"
                  >
                    <IconPhone className="h-4.5 w-4.5 shrink-0 text-blush-400" />
                    {phone}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-2.5 text-sm text-cream-300 transition-colors hover:text-white"
                >
                  <IconMail className="h-4.5 w-4.5 shrink-0 text-blush-400" />
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-cream-200/12 pt-6">
          <p className="text-center font-display text-[10.5px] uppercase tracking-[0.16em] text-cream-500">
            © {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}
