import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** A radio-style card used for box sizes, delivery methods, etc. */
export function SelectableCard({
  name,
  value,
  checked,
  onChange,
  children,
  className,
}: {
  name: string
  value: string
  checked: boolean
  onChange: () => void
  children: ReactNode
  className?: string
}) {
  return (
    <label
      className={cn(
        'relative flex cursor-pointer flex-col rounded-md border px-4 py-3.5 transition-colors',
        checked
          ? 'border-cocoa-900 bg-cream-50 ring-1 ring-cocoa-900'
          : 'border-cocoa-900/18 bg-cream-50 hover:border-cocoa-900/40',
        className,
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {children}
    </label>
  )
}
