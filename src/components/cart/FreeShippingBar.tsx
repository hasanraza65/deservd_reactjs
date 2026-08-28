import { formatPrice } from '@/lib/money'
import { usePublicSettings } from '@/hooks/useCatalog'
import { IconCheck } from '@/components/ui/Icon'

/** Progress toward free shipping — shown in the drawer and on the cart page. Threshold is a live store setting, not a hardcoded constant. */
export function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const { data: settings } = usePublicSettings()
  const thresholdCents = settings?.free_shipping_threshold_cents ?? 4500
  const threshold = thresholdCents / 100

  const remaining = Math.max(0, threshold - subtotal)
  const qualifies = remaining <= 0
  const percent = Math.min(100, Math.round((subtotal / threshold) * 100))

  return (
    <div>
      <p className="flex items-center gap-1.5 text-[13px] text-cocoa-700">
        {qualifies ? (
          <>
            <IconCheck className="h-4 w-4 text-blush-500" />
            You’ve unlocked free shipping.
          </>
        ) : (
          <>
            Add <span className="font-bold text-cocoa-900">{formatPrice(remaining)}</span> more for free
            shipping.
          </>
        )}
      </p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-cream-300">
        <div
          className="h-full rounded-full bg-blush-500 transition-[width] duration-500 ease-[var(--ease-out-soft)]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
