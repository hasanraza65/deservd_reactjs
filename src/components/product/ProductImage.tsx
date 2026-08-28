import { IconCookie } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

/**
 * Renders a product photo, or — when a flavour has not been shot yet — an
 * honest branded placeholder instead of a stretched or mismatched stock photo.
 * See IMAGE-TODO.md for which flavours this applies to.
 */
export function ProductImage({
  src,
  alt,
  className,
  imgClassName,
  priority = false,
}: {
  src: string | null
  alt: string
  className?: string
  imgClassName?: string
  priority?: boolean
}) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn('flex items-center justify-center bg-cream-300', className)}
      >
        <div className="flex flex-col items-center gap-2 text-cocoa-500">
          <IconCookie className="h-9 w-9" />
          <span className="font-display text-[10px] font-bold uppercase tracking-[0.14em]">
            Photo coming soon
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        className={cn('h-full w-full object-cover', imgClassName)}
      />
    </div>
  )
}
