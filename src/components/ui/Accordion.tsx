import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import { IconPlus } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

type AccordionItemProps = {
  question: string
  children: ReactNode
  defaultOpen?: boolean
  className?: string
}

/**
 * A single accordion row. Uses a CSS grid-rows trick (0fr → 1fr) rather than
 * max-height, so the open transition works regardless of content length.
 */
export function AccordionItem({ question, children, defaultOpen = false, className }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()

  return (
    <div className={cn('border-b border-cocoa-900/10', className)}>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-trigger`}
          onClick={() => setOpen((current) => !current)}
          className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-blush-600"
        >
          <span className="font-display text-[15px] font-bold uppercase tracking-[0.02em] text-cocoa-900 sm:text-base">
            {question}
          </span>
          <IconPlus
            aria-hidden="true"
            className={cn(
              'h-5 w-5 shrink-0 text-blush-500 transition-transform duration-300 ease-[var(--ease-out-soft)]',
              open && 'rotate-45',
            )}
          />
        </button>
      </h3>

      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-trigger`}
        className="grid transition-[grid-template-rows] duration-300 ease-[var(--ease-out-soft)]"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="pb-5 text-[15px] leading-relaxed text-cocoa-700">{children}</div>
        </div>
      </div>
    </div>
  )
}

export function Accordion({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}
