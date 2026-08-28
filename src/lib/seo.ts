import { useEffect } from 'react'
import { SITE } from '@/data/site'

type SeoOptions = {
  /** Page title without the brand suffix — the suffix is added automatically. */
  title: string
  description: string
  /** Route path, e.g. "/shop". Used to build the canonical + og:url. */
  path: string
  /** Absolute or root-relative image path for social cards. */
  image?: string
  /** Set on pages that should not be indexed (cart, checkout, account). */
  noIndex?: boolean
  /** Optional schema.org payload rendered as JSON-LD. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

const MANAGED = 'data-seo-managed'

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(MANAGED, 'true')
    document.head.appendChild(el)
  }
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value)
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.rel = rel
    el.setAttribute(MANAGED, 'true')
    document.head.appendChild(el)
  }
  el.href = href
}

/**
 * Per-route document head management.
 *
 * This is a client-rendered SPA, so crawlers that do not execute JavaScript see
 * only the static tags in index.html. Google renders JS and will pick these up;
 * if the brief later requires guaranteed crawlability for every route, the fix
 * is prerendering or a move to SSR — not more tags here.
 */
export function useSeo({ title, description, path, image, noIndex, jsonLd }: SeoOptions) {
  useEffect(() => {
    const fullTitle = path === '/' ? `${SITE.name} — ${title}` : `${title} | ${SITE.name}`
    const url = `${SITE.url}${path}`
    const socialImage = image
      ? image.startsWith('http')
        ? image
        : `${SITE.url}${image}`
      : `${SITE.url}/images/editorial/hero-cookie.jpg`

    document.title = fullTitle

    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: noIndex ? 'noindex, nofollow' : 'index, follow',
    })

    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: url })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: socialImage })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' })

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: fullTitle })
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: description,
    })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: socialImage })

    upsertLink('canonical', url)
  }, [title, description, path, image, noIndex])

  useEffect(() => {
    if (!jsonLd) return
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute(MANAGED, 'true')
    script.textContent = JSON.stringify(jsonLd)
    document.head.appendChild(script)
    return () => {
      script.remove()
    }
  }, [jsonLd])
}

/** schema.org Organization payload for the homepage. */
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.legalName,
  alternateName: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/favicon.svg`,
  email: SITE.email,
  telephone: SITE.phones[0],
  description: SITE.description,
  sameAs: [SITE.instagram.url, SITE.tiktok.url, SITE.facebook.url],
}
