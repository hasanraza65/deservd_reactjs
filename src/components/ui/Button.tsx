import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'outline' | 'dark' | 'quiet'
type Size = 'sm' | 'md' | 'lg'

type SharedProps = {
  children: ReactNode
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  className?: string
}

const BASE =
  'inline-flex items-center justify-center gap-2 font-display font-bold uppercase tracking-[0.09em] rounded-md ' +
  'transition-[background-color,color,border-color,transform] duration-200 ease-[var(--ease-out-soft)] ' +
  'active:translate-y-px disabled:pointer-events-none disabled:opacity-45 select-none'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-blush-500 text-white hover:bg-blush-600',
  outline:
    'border border-cocoa-900/25 text-cocoa-900 hover:bg-cocoa-900 hover:text-cream-100 hover:border-cocoa-900',
  dark: 'bg-cocoa-900 text-cream-100 hover:bg-cocoa-800',
  quiet: 'text-cocoa-900 hover:text-blush-600',
}

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-4 text-[11px]',
  md: 'h-11 px-6 text-xs',
  lg: 'h-[52px] px-8 text-[13px]',
}

type ButtonOnly = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof SharedProps>
type AnchorOnly = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof SharedProps | 'href'>

type Props = SharedProps &
  (
    | ({ to?: undefined; href?: undefined } & ButtonOnly)
    | ({ to: string; href?: undefined } & AnchorOnly)
    | ({ href: string; to?: undefined } & AnchorOnly)
  )

/**
 * The site's single button. Renders a `<button>`, a router `<Link>` (`to`) or an
 * `<a>` (`href`) depending on what it is given, so navigation is never faked with
 * a click handler on a non-interactive element.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  ...rest
}: Props) {
  const classes = cn(
    BASE,
    VARIANTS[variant],
    variant === 'quiet' ? SIZES[size].replace(/px-\d+/, 'px-0') : SIZES[size],
    fullWidth && 'w-full',
    className,
  )

  if (rest.to !== undefined) {
    const { to, ...linkProps } = rest as { to: string } & AnchorOnly
    return (
      <Link to={to} className={classes} {...linkProps}>
        {children}
      </Link>
    )
  }

  if (rest.href !== undefined) {
    const { href, ...anchorProps } = rest as { href: string } & AnchorOnly
    return (
      <a href={href} className={classes} {...anchorProps}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...(rest as ButtonOnly)}>
      {children}
    </button>
  )
}
