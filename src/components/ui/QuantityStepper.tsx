import { IconMinus, IconPlus } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

type Props = {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
  label: string
  size?: 'sm' | 'md'
  disabled?: boolean
  className?: string
}

/** The one quantity control for the site — cart lines, product detail, Build-a-Box. */
export function QuantityStepper({
  value,
  onChange,
  min = 0,
  max = 99,
  label,
  size = 'md',
  disabled = false,
  className,
}: Props) {
  const canDecrease = !disabled && value > min
  const canIncrease = !disabled && value < max

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border border-cocoa-900/20',
        size === 'sm' ? 'h-9' : 'h-11',
        disabled && 'opacity-50',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => canDecrease && onChange(value - 1)}
        disabled={!canDecrease}
        aria-label={`Decrease ${label} quantity`}
        className={cn(
          'flex h-full items-center justify-center text-cocoa-700 transition-colors',
          size === 'sm' ? 'w-8' : 'w-10',
          canDecrease ? 'hover:bg-cream-300 hover:text-blush-600' : 'cursor-not-allowed',
        )}
      >
        <IconMinus className="h-3.5 w-3.5" />
      </button>

      <span
        aria-live="polite"
        aria-atomic="true"
        className={cn(
          'flex h-full min-w-[2.25rem] items-center justify-center font-display font-bold text-cocoa-900',
          size === 'sm' ? 'text-[13px]' : 'text-sm',
        )}
      >
        {value}
      </span>

      <button
        type="button"
        onClick={() => canIncrease && onChange(value + 1)}
        disabled={!canIncrease}
        aria-label={`Increase ${label} quantity`}
        className={cn(
          'flex h-full items-center justify-center text-cocoa-700 transition-colors',
          size === 'sm' ? 'w-8' : 'w-10',
          canIncrease ? 'hover:bg-cream-300 hover:text-blush-600' : 'cursor-not-allowed',
        )}
      >
        <IconPlus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
