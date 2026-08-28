import { cn } from '@/lib/cn'

type Tone = 'dark' | 'light'
type Size = 'sm' | 'md' | 'lg'

const NAME_SIZE: Record<Size, string> = {
  sm: 'text-[22px]',
  md: 'text-[26px] sm:text-[30px]',
  lg: 'text-[34px]',
}

const SCRIPT_SIZE: Record<Size, string> = {
  sm: 'text-[11px]',
  md: 'text-[12px] sm:text-[13px]',
  lg: 'text-[15px]',
}

/**
 * The DESERV'D lockup, set in type rather than shipped as a raster.
 *
 * The supplied logo file is a 1536×1024 PNG of a glossy sticker-style mark that
 * does not match the approved UI direction (and misspells "HEALTHIER"). Setting
 * the lockup in type keeps it crisp at every size, themeable on light and dark
 * grounds, and consistent with the reference header.
 */
export function Wordmark({
  tone = 'dark',
  size = 'md',
  className,
}: {
  tone?: Tone
  size?: Size
  className?: string
}) {
  return (
    <span className={cn('inline-flex flex-col leading-none', className)}>
      <span
        className={cn(
          'font-display font-black tracking-[-0.03em] leading-[0.9]',
          NAME_SIZE[size],
          tone === 'dark' ? 'text-cocoa-900' : 'text-cream-100',
        )}
      >
        DESERV’D
        <sup className="ml-[2px] align-super text-[0.34em] font-semibold tracking-normal">™</sup>
      </span>

      <span className={cn('relative mt-[3px] self-start', SCRIPT_SIZE[size])}>
        <span className="font-script text-blush-500">The Healthier Choice.</span>
        <svg
          className="absolute -bottom-[3px] left-0 w-full text-blush-500"
          viewBox="0 0 120 6"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M1 4.2c22-2.4 46-3.2 70-2.2 16 .7 32 1.6 48 2.6"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </span>
  )
}
