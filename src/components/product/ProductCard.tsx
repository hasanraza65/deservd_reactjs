import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '@/lib/money'
import { primaryImageUrl } from '@/lib/productImage'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/context/ToastContext'
import { Button } from '@/components/ui/Button'
import { IconCheck } from '@/components/ui/Icon'
import { ProductImage } from './ProductImage'
import { cn } from '@/lib/cn'
import type { ApiProduct } from '@/types/api'

const CONFIRM_MS = 1600

type Props = {
  product: ApiProduct
  /** Skip lazy-loading for cards that are above the fold. */
  priority?: boolean
  className?: string
}

export function ProductCard({ product, priority = false, className }: Props) {
  const { add } = useCart()
  const { push } = useToast()
  const [justAdded, setJustAdded] = useState(false)
  const isXX = product.product_type === 'deservd_xx'
  const badge = product.is_featured ? 'Bestseller' : null

  useEffect(() => {
    if (!justAdded) return
    const timer = window.setTimeout(() => setJustAdded(false), CONFIRM_MS)
    return () => window.clearTimeout(timer)
  }, [justAdded])

  return (
    <article
      className={cn(
        'group flex flex-col overflow-hidden rounded-lg border transition-colors duration-300 ease-[var(--ease-out-soft)]',
        isXX
          ? 'border-cocoa-900 bg-cocoa-900 hover:border-blush-400'
          : 'border-cocoa-900/12 bg-cream-50 hover:border-cocoa-900/30',
        className,
      )}
    >
      <Link
        to={`/cookies/${product.slug}`}
        className="relative block overflow-hidden bg-cream-300"
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProductImage
          src={primaryImageUrl(product)}
          alt=""
          priority={priority}
          className="aspect-4/3 w-full"
          imgClassName="transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
        />
        {badge ? (
          <span className="absolute right-0 top-0 bg-blush-500 px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-[0.14em] text-white">
            {badge}
          </span>
        ) : null}
        {isXX ? (
          <span className="absolute left-0 top-0 bg-cocoa-900 px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-[0.14em] text-blush-300">
            XX · {product.protein_grams}g
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <h3
          className={cn(
            'font-display text-[13px] font-extrabold uppercase leading-[1.25] tracking-[0.04em]',
            isXX ? 'text-cream-100' : 'text-cocoa-900',
          )}
        >
          <Link
            to={`/cookies/${product.slug}`}
            className={cn(
              'transition-colors',
              isXX
                ? 'hover:text-blush-300 focus-visible:text-blush-300'
                : 'hover:text-blush-600 focus-visible:text-blush-600',
            )}
          >
            {product.name}
          </Link>
        </h3>

        <p
          className={cn(
            'mt-1.5 font-display text-[11px] font-bold uppercase tracking-[0.1em]',
            isXX ? 'text-blush-300' : 'text-blush-500',
          )}
        >
          {product.protein_grams}g Protein
          <span
            className={cn(
              'ml-1.5 font-normal tracking-normal normal-case',
              isXX ? 'text-cream-400' : 'text-cocoa-500',
            )}
          >
            · {product.weight}
          </span>
        </p>

        <p
          className={cn(
            'mt-2 line-clamp-2 text-[13px] leading-relaxed',
            isXX ? 'text-cream-300' : 'text-cocoa-600',
          )}
        >
          {product.short_description}
        </p>

        <div className="mt-auto pt-4">
          <p
            className={cn(
              'mb-2.5 font-display text-sm font-bold',
              isXX ? 'text-cream-100' : 'text-cocoa-900',
            )}
          >
            {formatPrice(product.price)}
          </p>
          <Button
            size="sm"
            fullWidth
            disabled={!product.in_stock}
            onClick={() => {
              add(product.id)
              setJustAdded(true)
              push(`${product.name} added to cart.`, 'success')
            }}
            aria-label={`Add ${product.name} to cart`}
          >
            {!product.in_stock ? 'Out of Stock' : justAdded ? (
              <>
                <IconCheck className="h-3.5 w-3.5" />
                Added
              </>
            ) : (
              'Add to Cart'
            )}
          </Button>
        </div>
      </div>
    </article>
  )
}
