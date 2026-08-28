# DESERV'D — Frontend

Premium protein cookie brand. **Frontend only** — no backend, no database, no
Shopify, no Stripe, no real payments and no real authentication. Everything that
would come from a server is mock data.

## Stack

React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · React Router 7

Tailwind 4 is configured CSS-first: design tokens live in the `@theme` block at
the top of `src/index.css`, not in a `tailwind.config.js`.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build
npm run preview    # serve the production build
npm run typecheck
```

## Design tokens

Colours were sampled from the approved UI reference rather than guessed:

| Token | Value | Used for |
| --- | --- | --- |
| `blush-500` | `#d9556d` | DESERV'D pink — CTAs, accents, announcement bar |
| `cocoa-900` | `#301d0e` | Deep chocolate — headings, footer, dark bands |
| `cream-200` | `#f5ece7` | Page background |
| `cream-100` | `#faf4ef` | Raised surfaces, drawer |

Type: **Archivo** (display/UI), **Inter** (body), **Yellowtail** (the script
accent). Loaded from Google Fonts with `preconnect` and `display=swap`.

Motion is deliberately restrained — one shared easing curve
(`--ease-out-soft`), one shared scroll entrance (`useReveal`), and a full
`prefers-reduced-motion` opt-out.

## Structure

```
src/
  components/
    account/    StatusStepper
    cart/       CartDrawer, CartLineItem, FreeShippingBar
    layout/     Header, AnnouncementBar, MobileNav, Footer, Layout, LegalPage
    product/    ProductCard, ProductImage
    ui/         Button, Container, SectionHeading, Wordmark, Reveal, Icon,
                Accordion, Field, QuantityStepper, SelectableCard
  context/      CartContext (mock cart + Build-a-Box lines + discount codes,
                persisted to localStorage), ToastContext
  data/         site, nav, products, box, orders, ingredients, faq, usStates
  hooks/        useReveal
  lib/          cn, seo, order (checkout → order object, reorder helper)
  pages/        one file per route
  sections/
    home/       Hero, CookieCollection, WhyDeservd, Ingredients, StoryTeaser,
                BakedFresh, SocialProof, InstagramGrid
```

## Routes

`/` · `/shop` · `/cookies/:slug` · `/build-a-box` · `/cart` · `/checkout` ·
`/order-confirmation` · `/account` · `/account/orders` · `/story` ·
`/nutrition` · `/faq` · `/contact` · `/shipping` · `/privacy` · `/terms` ·
`/refund-policy` · `*` (404)

Every route is fully built — no stub pages remain. `/order-confirmation` only
renders with router state from a completed checkout; visiting it directly
redirects to `/shop`.

## What works end to end

- **Shop**: search, category filters (Classic / Chocolate / Specialty / 20g
  Protein), protein filter, sort — all via URL search params.
- **Build a Box**: size selector, per-flavour steppers that hard-cap at the
  box size (verified: filling the box blocks every other flavour until a slot
  is freed), live progress, flat box pricing, adds a single box line to cart.
- **Cart**: quantity controls, remove, discount codes (`DESERVD10`,
  `FIRSTBOX`), free-shipping progress, persisted to `localStorage`.
- **Checkout**: contact/delivery/payment form with real validation, simulated
  order creation, redirects to a confirmation page carrying the order via
  router state, then clears the cart.
- **Account**: tabbed dashboard (Orders/Profile/Addresses/Saved Boxes) and a
  full order history with a status stepper and working **Reorder** (re-adds
  every line from a past order, including boxes, to the current cart).
- **Toasts** confirm add-to-cart, discount applied, reorder, profile save,
  contact form submission.

All of the above was exercised programmatically (not just eyeballed) — see
the QA note below.

## SEO

- Per-route `<title>`, description, canonical, Open Graph and Twitter tags via
  the `useSeo` hook (`src/lib/seo.ts`); no extra dependency.
- `Organization` JSON-LD on the homepage, `FAQPage` JSON-LD on `/faq`.
- `robots.txt` and `sitemap.xml` in `public/`; cart, checkout, account and the
  order confirmation are `noindex`.
- Semantic landmarks, one `h1` per page, skip link, descriptive image `alt`.

**Known limit:** this is a client-rendered SPA, so crawlers that do not execute
JavaScript see only the static tags in `index.html`. Google renders JS and will
pick up the per-route tags. If guaranteed crawlability for every route becomes a
requirement, the fix is prerendering or SSR — not more meta tags.

## Images

`scripts/fetch-images.mjs` and `scripts/fetch-ingredients.mjs` download the
stock placeholders from Pexels, pinned by photo ID (not search position —
Pexels reorders results between calls):

```bash
PEXELS_API_KEY=... node scripts/fetch-images.mjs
PEXELS_API_KEY=... node scripts/fetch-ingredients.mjs
```

The API key is read from the environment and is deliberately not committed.
Images are committed, so these only need re-running to change the set.

See [IMAGE-TODO.md](IMAGE-TODO.md) for which images are real DESERV'D product
photography, which are stock stand-ins, and which flavours (Red Velvet,
Cookies & Cream) have no accurate photo available and render a "photo coming
soon" tile instead of the wrong dessert.

## QA performed this stage

Beyond `npm run build`/`typecheck` (both clean):

- Every route smoke-tested for expected rendered content (no blank/crashed
  pages).
- Console/runtime-exception sweep across all interactive routes via CDP —
  zero errors or warnings.
- Real interaction tests via CDP: add-to-cart, Build-a-Box completion and its
  size cap, discount code application, full checkout submission (invalid →
  blocked with a visible error, then valid → order placed → redirected to
  confirmation with the correct order data).
- Horizontal-overflow sweep: 17 routes × 8 breakpoints (360–1440px) via real
  device-metrics emulation (`scrollWidth` vs `innerWidth`), not screenshots —
  headless Chrome's `--screenshot` flag has its own viewport-clamping and
  paint-timing quirks that produce false positives, so overflow and paint
  claims in this project are backed by measured DOM values, not by eye.
- Found and fixed one real bug this way: the announcement bar's full 4-item
  row didn't fit at exactly 768px (18px real overflow) — it now switches to
  the compact rotating version below `lg` instead of `md`.

## Notes for the next stage

- Nutrition figures in `src/data/products.ts` are **placeholders** and must be
  replaced with verified values before launch.
- Legal page copy (Privacy, Terms, Shipping, Refund Policy) is template
  boilerplate flagged in-page as a placeholder — needs real legal review.
- Deploying to a static host needs an SPA rewrite to `index.html`;
  `public/_redirects` covers Netlify.
