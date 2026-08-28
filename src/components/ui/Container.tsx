import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type ContainerProps = {
  children: ReactNode
  className?: string
  as?: ElementType
  /** `wide` for full-bleed sections, `narrow` for long-form reading columns. */
  size?: 'default' | 'wide' | 'narrow'
}

const SIZES: Record<NonNullable<ContainerProps['size']>, string> = {
  default: 'max-w-[1280px]',
  wide: 'max-w-[1560px]',
  narrow: 'max-w-[760px]',
}

/** The single horizontal rhythm for the whole site. */
export function Container({ children, className, as: Tag = 'div', size = 'default' }: ContainerProps) {
  return (
    <Tag className={cn('mx-auto w-full px-5 sm:px-8 lg:px-12', SIZES[size], className)}>
      {children}
    </Tag>
  )
}
