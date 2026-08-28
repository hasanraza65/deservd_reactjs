import type { ReactNode } from 'react'
import { useReveal } from '@/hooks/useReveal'

/** Wraps children in the site's shared scroll entrance. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  /** Stagger offset in milliseconds. */
  delay?: number
  className?: string
}) {
  const ref = useReveal<HTMLDivElement>(delay)
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
