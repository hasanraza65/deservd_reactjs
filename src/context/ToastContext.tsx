import { createContext, use, useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { IconCheck, IconClose } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

type ToastTone = 'default' | 'success' | 'error'

type Toast = {
  id: string
  message: string
  tone: ToastTone
}

type ToastContextValue = {
  push: (message: string, tone?: ToastTone) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)
const DURATION_MS = 3600

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const push = useCallback(
    (message: string, tone: ToastTone = 'default') => {
      const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
      setToasts((current) => [...current, { id, message, tone }])
      window.setTimeout(() => dismiss(id), DURATION_MS)
    },
    [dismiss],
  )

  const value = useMemo<ToastContextValue>(() => ({ push }), [push])

  return (
    <ToastContext value={value}>
      {children}

      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex flex-col items-center gap-2 px-4 pb-6 sm:items-end sm:px-6"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={cn(
              'pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-md border px-4 py-3 shadow-[0_12px_32px_-12px_rgba(48,29,14,0.35)]',
              'animate-[toast-in_0.35s_var(--ease-out-soft)]',
              toast.tone === 'success' && 'border-cocoa-900/10 bg-cocoa-900 text-cream-100',
              toast.tone === 'error' && 'border-blush-600/30 bg-blush-50 text-blush-700',
              toast.tone === 'default' && 'border-cocoa-900/10 bg-cream-50 text-cocoa-900',
            )}
          >
            {toast.tone === 'success' ? (
              <IconCheck className="h-4.5 w-4.5 shrink-0 text-blush-400" />
            ) : null}
            <p className="flex-1 text-sm leading-snug">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
              className="shrink-0 opacity-60 transition-opacity hover:opacity-100"
            >
              <IconClose className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext>
  )
}

export function useToast(): ToastContextValue {
  const context = use(ToastContext)
  if (!context) throw new Error('useToast must be used inside a ToastProvider')
  return context
}
