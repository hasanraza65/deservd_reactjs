import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  /** Small uppercase label above the title. */
  eyebrow?: string
  title: ReactNode
  /** Handwritten line, as used under the headline in the reference. */
  script?: string
  subtitle?: ReactNode
  align?: 'left' | 'center'
  tone?: 'dark' | 'light'
  /** The small pink marks that bracket section titles in the reference. */
  flourish?: boolean
  as?: 'h1' | 'h2' | 'h3'
  className?: string
}

function Flourish({ side }: { side: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 34 16"
      className={cn('h-3.5 w-8 shrink-0 text-blush-500', side === 'right' && 'scale-x-[-1]')}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M32 8H14M26 2.5 20.5 8l5.5 5.5M17 3.5 12 8l5 4.5" />
    </svg>
  )
}

/** Shared section header: eyebrow, title, optional script line and subtitle. */
export function SectionHeading({
  eyebrow,
  title,
  script,
  subtitle,
  align = 'center',
  tone = 'dark',
  flourish = false,
  as: Tag = 'h2',
  className,
}: Props) {
  const centered = align === 'center'

  return (
    <div
      className={cn(
        'flex flex-col',
        centered ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            'mb-3 font-display text-[11px] font-bold uppercase tracking-[0.22em]',
            tone === 'dark' ? 'text-blush-600' : 'text-blush-300',
          )}
        >
          {eyebrow}
        </p>
      ) : null}

      <div className={cn('flex items-center gap-4', centered ? 'justify-center' : 'justify-start')}>
        {flourish && centered ? <Flourish side="left" /> : null}
        <Tag
          className={cn(
            'text-[clamp(1.75rem,1.2rem+2.1vw,2.75rem)] leading-[1.05] uppercase',
            tone === 'dark' ? 'text-cocoa-900' : 'text-cream-100',
          )}
        >
          {title}
        </Tag>
        {flourish && centered ? <Flourish side="right" /> : null}
      </div>

      {script ? (
        <p
          className={cn(
            'mt-1 font-script text-[clamp(1.25rem,1rem+1vw,1.9rem)] leading-tight',
            tone === 'dark' ? 'text-blush-500' : 'text-blush-300',
          )}
        >
          {script}
        </p>
      ) : null}

      {subtitle ? (
        <p
          className={cn(
            'mt-3 max-w-xl text-[15px] leading-relaxed',
            tone === 'dark' ? 'text-cocoa-700' : 'text-cream-300',
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
