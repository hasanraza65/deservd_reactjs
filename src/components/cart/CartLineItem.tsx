import { Link } from 'react-router-dom'
import type { CartLineView } from '@/context/CartContext'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/money'
import { primaryImageUrl } from '@/lib/productImage'
import { ProductImage } from '@/components/product/ProductImage'
import { QuantityStepper } from '@/components/ui/QuantityStepper'
import { IconClose } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

export function CartLineItem({ line, compact = false }: { line: CartLineView; compact?: boolean }) {
  const { setQuantity, remove } = useCart()

  const image = line.kind === 'product' ? primaryImageUrl(line.product) : primaryImageUrl(line.selections[0]?.product ?? { images: [] })
  const name = line.kind === 'product' ? line.product.name : `Build Your Box — ${line.size} Cookies`
  const meta =
    line.kind === 'product'
      ? `${line.product.protein_grams}g protein · ${line.product.weight}`
      : line.selections.map((s) => `${s.quantity}× ${s.product.name}`).join(', ')
  const href = line.kind === 'product' ? `/cookies/${line.product.slug}` : '/build-a-box'

  return (
    <div className="flex gap-3 py-4">
      <Link
        to={href}
        className="block shrink-0 overflow-hidden rounded-md bg-cream-300"
        aria-hidden="true"
        tabIndex={-1}
      >
        <ProductImage
          src={image}
          alt=""
          className={compact ? 'h-16 w-16' : 'h-24 w-24'}
        />
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-2 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={href}
              className={cn(
                'block truncate font-display font-bold uppercase tracking-[0.02em] text-cocoa-900 transition-colors hover:text-blush-600',
                compact ? 'text-[12.5px]' : 'text-sm',
              )}
            >
              {name}
            </Link>
            <p className={cn('mt-1 text-cocoa-600', compact ? 'text-[11px] line-clamp-1' : 'text-xs line-clamp-2')}>
              {meta}
            </p>
          </div>

          <button
            type="button"
            onClick={() => remove(line.id)}
            aria-label={`Remove ${name} from cart`}
            className="shrink-0 p-1 text-cocoa-400 transition-colors hover:text-blush-600"
          >
            <IconClose className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          {line.kind === 'product' ? (
            <QuantityStepper
              size="sm"
              value={line.quantity}
              onChange={(next) => setQuantity(line.id, next)}
              label={name}
            />
          ) : (
            <span className="font-display text-[11px] font-bold uppercase tracking-[0.08em] text-cocoa-500">
              {line.size} cookies
            </span>
          )}
          <span className="font-display text-sm font-bold text-cocoa-900">{formatPrice(line.lineTotal)}</span>
        </div>
      </div>
    </div>
  )
}
