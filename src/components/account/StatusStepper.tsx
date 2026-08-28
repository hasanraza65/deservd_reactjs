import type { OrderStatusValue } from '@/types/api'
import { IconCheck, IconClose } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

const STEPS: { key: OrderStatusValue; label: string }[] = [
  { key: 'new', label: 'Placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'baked', label: 'Baked' },
  { key: 'packaged', label: 'Packaged' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
]

export function StatusStepper({ status }: { status: OrderStatusValue }) {
  if (status === 'cancelled' || status === 'refunded') {
    return (
      <div className="flex items-center gap-2 rounded-md bg-cocoa-900/5 px-3 py-2 text-sm font-bold uppercase tracking-wide text-cocoa-600">
        <IconClose className="h-4 w-4 shrink-0" />
        {status === 'cancelled' ? 'Order Cancelled' : 'Refunded'}
      </div>
    )
  }

  const currentIndex = STEPS.findIndex((step) => step.key === status)

  return (
    <ol className="flex items-center" aria-label="Order status">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex
        const isLast = i === STEPS.length - 1
        return (
          <li key={step.key} className={cn('flex items-center', !isLast && 'flex-1')}>
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                  done ? 'border-blush-500 bg-blush-500 text-white' : 'border-cocoa-900/20 bg-cream-50 text-transparent',
                )}
              >
                <IconCheck className="h-3 w-3" />
              </span>
              <span
                className={cn(
                  'whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.06em]',
                  done ? 'text-cocoa-900' : 'text-cocoa-400',
                )}
              >
                {step.label}
              </span>
            </div>
            {!isLast ? (
              <span
                aria-hidden="true"
                className={cn('mx-1.5 h-0.5 flex-1 rounded-full', i < currentIndex ? 'bg-blush-500' : 'bg-cocoa-900/12')}
              />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
