import { useEffect, useState } from 'react'
import { BENEFITS, type BenefitKey } from '@/data/nav'
import { IconHeart, IconLeaf, IconOven, IconProtein } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

const ICONS: Record<BenefitKey, typeof IconHeart> = {
  protein: IconProtein,
  baked: IconOven,
  macro: IconLeaf,
  dessert: IconHeart,
}

const ROTATE_MS = 4500

function Item({ benefitKey, label }: { benefitKey: BenefitKey; label: string }) {
  const Glyph = ICONS[benefitKey]
  return (
    <span className="flex items-center gap-2 whitespace-nowrap">
      <Glyph className="h-4 w-4 shrink-0" />
      <span className="font-display text-[10px] font-bold uppercase tracking-[0.16em] sm:text-[11px]">
        {label}
      </span>
    </span>
  )
}

/**
 * The pink benefit strip above the header. Four claims sit side by side from lg
 * up (below that, "13g+ protein in every cookie" plus three more claims does
 * not fit in one row without wrapping or overflowing — confirmed by measuring
 * real scrollWidth at 768px, not by eye); below lg the bar cycles through them
 * one at a time, and falls back to a static swipeable row when the visitor has
 * asked for reduced motion.
 */
export function AnnouncementBar() {
  const [index, setIndex] = useState(0)
  const [rotates, setRotates] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setRotates(!query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!rotates) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % BENEFITS.length)
    }, ROTATE_MS)
    return () => window.clearInterval(timer)
  }, [rotates])

  return (
    <div className="bg-blush-500 text-white">
      <div className="mx-auto flex h-9 max-w-[1560px] items-center justify-center px-5 sm:px-8 lg:px-12">
        {/* lg and up: the full set, divided */}
        <div className="hidden items-center gap-10 lg:flex">
          {BENEFITS.map((benefit, i) => (
            <span key={benefit.key} className="flex items-center gap-10">
              <Item benefitKey={benefit.key} label={benefit.short} />
              {i < BENEFITS.length - 1 ? (
                <span aria-hidden="true" className="h-3.5 w-px bg-white/35" />
              ) : null}
            </span>
          ))}
        </div>

        {/* below lg: one at a time, or a swipeable row under reduced motion */}
        <div className="w-full lg:hidden">
          {rotates ? (
            <div className="relative flex h-9 items-center justify-center">
              {BENEFITS.map((benefit, i) => (
                <span
                  key={benefit.key}
                  aria-hidden={i !== index}
                  className={cn(
                    'absolute inset-0 flex items-center justify-center transition-opacity duration-500 ease-[var(--ease-out-soft)]',
                    i === index ? 'opacity-100' : 'pointer-events-none opacity-0',
                  )}
                >
                  <Item benefitKey={benefit.key} label={benefit.short} />
                </span>
              ))}
            </div>
          ) : (
            <div className="no-scrollbar flex items-center gap-6 overflow-x-auto">
              {BENEFITS.map((benefit) => (
                <Item key={benefit.key} benefitKey={benefit.key} label={benefit.short} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
