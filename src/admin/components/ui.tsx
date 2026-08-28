import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('rounded-lg border border-cocoa-900/12 bg-cream-50', className)}>{children}</div>
}

export function PageHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="font-display text-xl font-extrabold uppercase tracking-[0.03em] text-cocoa-900">{title}</h1>
      {action}
    </div>
  )
}

export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card className="p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-cocoa-500">{label}</p>
      <p className="mt-2 font-display text-2xl font-extrabold text-cocoa-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-cocoa-500">{hint}</p> : null}
    </Card>
  )
}

const TONE_CLASSES: Record<string, string> = {
  neutral: 'bg-cocoa-900/8 text-cocoa-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-blush-100 text-blush-700',
  info: 'bg-sky-100 text-sky-700',
}

export function Badge({ tone = 'neutral', children }: { tone?: keyof typeof TONE_CLASSES; children: ReactNode }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide', TONE_CLASSES[tone])}>
      {children}
    </span>
  )
}

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">{children}</table>
    </div>
  )
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <th className={cn('border-b border-cocoa-900/10 px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-cocoa-500', className)}>
      {children}
    </th>
  )
}

export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cn('border-b border-cocoa-900/8 px-4 py-3 align-middle text-cocoa-800', className)}>{children}</td>
}

export function EmptyRow({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-10 text-center text-sm text-cocoa-500">
        {children}
      </td>
    </tr>
  )
}

export function Pagination({
  page,
  lastPage,
  onChange,
}: {
  page: number
  lastPage: number
  onChange: (page: number) => void
}) {
  if (lastPage <= 1) return null
  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="rounded-md border border-cocoa-900/18 px-3 py-1.5 font-bold uppercase tracking-wide text-cocoa-700 disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-cocoa-600">
        Page {page} of {lastPage}
      </span>
      <button
        type="button"
        disabled={page >= lastPage}
        onClick={() => onChange(page + 1)}
        className="rounded-md border border-cocoa-900/18 px-3 py-1.5 font-bold uppercase tracking-wide text-cocoa-700 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  )
}

export const inputClass =
  'w-full rounded-md border border-cocoa-900/18 bg-cream-50 px-3 py-2 text-sm text-cocoa-900 outline-none focus:border-cocoa-900'
export const labelClass = 'mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-cocoa-600'
