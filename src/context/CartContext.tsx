import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { checkoutApi } from '@/api/checkout'
import { ApiError } from '@/lib/api'
import { useAllProducts, useBuildABoxOptions, useShippingMethods } from '@/hooks/useCatalog'
import type { ApiProduct, CartCalculation, CheckoutItem } from '@/types/api'

/**
 * Cart *contents* (which products, which quantities, which box flavours)
 * still live entirely in localStorage — there is no server-persisted cart.
 * But *pricing* is never computed here: every time the contents, coupon code
 * or shipping method change, this calls the backend's /cart/calculate and
 * trusts its numbers, exactly like the real checkout does. See
 * CheckoutPricingService on the Laravel side for why that split exists.
 */

export type BoxSelection = { productId: number; quantity: number }

export type ProductLine = {
  kind: 'product'
  id: string
  productId: number
  quantity: number
}

export type BoxLine = {
  kind: 'box'
  id: string
  size: number
  selections: BoxSelection[]
}

export type CartLine = ProductLine | BoxLine

export type ProductLineView = ProductLine & {
  product: ApiProduct
  lineTotal: number
}

export type BoxLineView = Omit<BoxLine, 'selections'> & {
  selections: (BoxSelection & { product: ApiProduct })[]
  lineTotal: number
}

export type CartLineView = ProductLineView | BoxLineView

type CartContextValue = {
  lines: CartLineView[]
  count: number
  /** True while the product catalogue is still loading — `lines` may read as empty even when localStorage has stored items. */
  isLoading: boolean
  /** Whether the cart has stored items at all, independent of whether the catalogue has loaded yet. */
  hasStoredItems: boolean

  pricing: CartCalculation | null
  isPricingLoading: boolean
  pricingError: string | null

  shippingMethodId: number | null
  setShippingMethodId: (id: number) => void

  couponCode: string | null
  applyCoupon: (code: string) => Promise<{ ok: boolean; message: string }>
  removeCoupon: () => void

  add: (productId: number, quantity?: number) => void
  addBox: (size: number, selections: BoxSelection[]) => void
  remove: (id: string) => void
  setQuantity: (id: string, quantity: number) => void
  clear: () => void

  /** Slug/id of the most recent single-product addition — lets the UI acknowledge an add. */
  lastAddedProductId: number | null
  isDrawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void

  /** The exact payload shape /checkout and /cart/calculate expect. */
  toCheckoutItems: () => CheckoutItem[]
}

const STORAGE_KEY = 'deservd.cart.v3'
const COUPON_KEY = 'deservd.cart.coupon'
const MAX_PER_LINE = 24

const CartContext = createContext<CartContextValue | null>(null)

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

function sanitizeLines(parsed: unknown): CartLine[] {
  if (!Array.isArray(parsed)) return []
  const lines: CartLine[] = []

  for (const raw of parsed) {
    if (typeof raw !== 'object' || raw === null) continue
    const entry = raw as Record<string, unknown>

    if (entry.kind === 'product' && typeof entry.productId === 'number' && typeof entry.quantity === 'number') {
      lines.push({
        kind: 'product',
        id: typeof entry.id === 'string' ? entry.id : makeId('line'),
        productId: entry.productId,
        quantity: Math.min(MAX_PER_LINE, Math.max(1, Math.round(entry.quantity))),
      })
      continue
    }

    if (entry.kind === 'box' && typeof entry.size === 'number' && Array.isArray(entry.selections)) {
      const selections = entry.selections
        .filter(
          (s): s is BoxSelection =>
            typeof s === 'object' && s !== null &&
            typeof (s as BoxSelection).productId === 'number' &&
            typeof (s as BoxSelection).quantity === 'number',
        )
        .map((s) => ({ productId: s.productId, quantity: Math.max(1, Math.round(s.quantity)) }))
      if (selections.length === 0) continue
      lines.push({
        kind: 'box',
        id: typeof entry.id === 'string' ? entry.id : makeId('box'),
        size: entry.size,
        selections,
      })
    }
  }

  return lines
}

function readStoredLines(): CartLine[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? sanitizeLines(JSON.parse(raw)) : []
  } catch {
    return []
  }
}

function readStoredCoupon(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(COUPON_KEY)
  } catch {
    return null
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readStoredLines)
  const [couponCode, setCouponCode] = useState<string | null>(readStoredCoupon)
  const [lastAddedProductId, setLastAddedProductId] = useState<number | null>(null)
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [shippingMethodId, setShippingMethodId] = useState<number | null>(null)

  const { data: products, isLoading: isCatalogLoading } = useAllProducts()
  const { data: shippingMethods } = useShippingMethods()
  const { data: boxData } = useBuildABoxOptions()
  const boxPriceBySize = useMemo(
    () => new Map((boxData?.box_options ?? []).map((o) => [o.size, o.price])),
    [boxData],
  )

  const [pricing, setPricing] = useState<CartCalculation | null>(null)
  const [isPricingLoading, setPricingLoading] = useState(false)
  const [pricingError, setPricingError] = useState<string | null>(null)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      // Storage unavailable — the cart still works for this session.
    }
  }, [lines])

  useEffect(() => {
    try {
      if (couponCode) window.localStorage.setItem(COUPON_KEY, couponCode)
      else window.localStorage.removeItem(COUPON_KEY)
    } catch {
      // Non-fatal.
    }
  }, [couponCode])

  // Default to the first active shipping method once it's loaded.
  useEffect(() => {
    if (shippingMethodId === null && shippingMethods && shippingMethods.length > 0) {
      setShippingMethodId(shippingMethods[0].id)
    }
  }, [shippingMethods, shippingMethodId])

  const toCheckoutItems = useCallback((): CheckoutItem[] => {
    return lines.map((line) =>
      line.kind === 'product'
        ? { type: 'product', product_id: line.productId, quantity: line.quantity }
        : {
            type: 'box',
            box_size: line.size,
            selections: line.selections.map((s) => ({ product_id: s.productId, quantity: s.quantity })),
          },
    )
  }, [lines])

  // Recompute the authoritative price breakdown whenever contents, coupon or
  // shipping method change — never derived locally.
  useEffect(() => {
    if (lines.length === 0 || shippingMethodId === null) {
      setPricing(null)
      setPricingError(null)
      return
    }

    let cancelled = false
    setPricingLoading(true)
    setPricingError(null)

    checkoutApi
      .calculateCart({ items: toCheckoutItems(), coupon_code: couponCode, shipping_method_id: shippingMethodId })
      .then((result) => {
        if (!cancelled) setPricing(result)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setPricing(null)
        setPricingError(err instanceof ApiError ? err.message : 'Could not calculate your cart total.')
      })
      .finally(() => {
        if (!cancelled) setPricingLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, couponCode, shippingMethodId])

  const add = useCallback((productId: number, quantity = 1) => {
    setLines((current) => {
      const existing = current.find(
        (line): line is ProductLine => line.kind === 'product' && line.productId === productId,
      )
      if (!existing) {
        return [...current, { kind: 'product', id: makeId('line'), productId, quantity: Math.min(MAX_PER_LINE, quantity) }]
      }
      return current.map((line) =>
        line.kind === 'product' && line.id === existing.id
          ? { ...line, quantity: Math.min(MAX_PER_LINE, line.quantity + quantity) }
          : line,
      )
    })
    setLastAddedProductId(productId)
  }, [])

  const addBox = useCallback((size: number, selections: BoxSelection[]) => {
    setLines((current) => [...current, { kind: 'box', id: makeId('box'), size, selections }])
  }, [])

  const remove = useCallback((id: string) => {
    setLines((current) => current.filter((line) => line.id !== id))
  }, [])

  const setQuantity = useCallback((id: string, quantity: number) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((line) => line.id !== id)
        : current.map((line) =>
            line.id === id && line.kind === 'product'
              ? { ...line, quantity: Math.min(MAX_PER_LINE, quantity) }
              : line,
          ),
    )
  }, [])

  const clear = useCallback(() => {
    setLines([])
    setCouponCode(null)
    setPricing(null)
  }, [])

  const applyCoupon = useCallback(
    async (rawCode: string): Promise<{ ok: boolean; message: string }> => {
      const code = rawCode.trim().toUpperCase()
      if (!code) return { ok: false, message: 'Enter a discount code.' }
      if (shippingMethodId === null) return { ok: false, message: 'Add an item to your cart first.' }

      try {
        const result = await checkoutApi.calculateCart({
          items: toCheckoutItems(),
          coupon_code: code,
          shipping_method_id: shippingMethodId,
        })
        setCouponCode(code)
        setPricing(result)
        return { ok: true, message: `${code} applied — saved $${result.discount.toFixed(2)}.` }
      } catch (err) {
        return { ok: false, message: err instanceof ApiError ? err.message : 'That code did not work.' }
      }
    },
    [shippingMethodId, toCheckoutItems],
  )

  const removeCoupon = useCallback(() => setCouponCode(null), [])

  const openDrawer = useCallback(() => setDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  const lineViews = useMemo<CartLineView[]>(() => {
    if (!products) return []
    const byId = new Map(products.map((p) => [p.id, p]))

    return lines.flatMap<CartLineView>((line) => {
      if (line.kind === 'product') {
        const product = byId.get(line.productId)
        if (!product) return []
        return [{ ...line, product, lineTotal: product.price * line.quantity }]
      }

      const resolvedSelections = line.selections.flatMap((selection) => {
        const product = byId.get(selection.productId)
        return product ? [{ ...selection, product }] : []
      })
      if (resolvedSelections.length === 0) return []
      const lineTotal = boxPriceBySize.get(line.size) ?? 0
      return [{ ...line, selections: resolvedSelections, lineTotal }]
    })
  }, [lines, products, boxPriceBySize])

  const count = useMemo(
    () => lines.reduce((total, line) => total + (line.kind === 'product' ? line.quantity : line.size), 0),
    [lines],
  )

  const value: CartContextValue = {
    lines: lineViews,
    count,
    isLoading: isCatalogLoading,
    hasStoredItems: lines.length > 0,
    pricing,
    isPricingLoading,
    pricingError,
    shippingMethodId,
    setShippingMethodId,
    couponCode,
    applyCoupon,
    removeCoupon,
    add,
    addBox,
    remove,
    setQuantity,
    clear,
    lastAddedProductId,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    toCheckoutItems,
  }

  return <CartContext value={value}>{children}</CartContext>
}

export function useCart(): CartContextValue {
  const context = use(CartContext)
  if (!context) throw new Error('useCart must be used inside a CartProvider')
  return context
}
