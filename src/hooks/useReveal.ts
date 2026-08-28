import { useEffect, useRef } from 'react'

/**
 * One shared scroll-entrance: a short fade and 14px rise, once, on first sight.
 *
 * Elements render visible by default (see `[data-reveal]` in index.css) so the
 * page is never blank if JS fails or IntersectionObserver is missing — the hook
 * only opts an element *into* the hidden state when it can also reveal it again.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(delayMs = 0) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') return

    node.dataset.reveal = 'hidden'
    node.style.setProperty('--reveal-delay', `${delayMs}ms`)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const target = entry.target as HTMLElement
          target.dataset.reveal = 'shown'
          observer.unobserve(target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )

    observer.observe(node)

    // Safety net: content must never be left invisible because an observer
    // callback was starved or the element was measured at zero height.
    const failsafe = window.setTimeout(() => {
      if (node.dataset.reveal !== 'shown') node.dataset.reveal = 'shown'
    }, 1500)

    return () => {
      observer.disconnect()
      window.clearTimeout(failsafe)
    }
  }, [delayMs])

  return ref
}
