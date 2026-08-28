import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const CONTROL_CLASS =
  'w-full rounded-md border bg-cream-50 px-3.5 py-2.5 text-[15px] text-cocoa-900 outline-none transition-colors placeholder:text-cocoa-400 focus:border-cocoa-900'

type BaseProps = {
  /** Omit to render an unlabelled control — pass `aria-label` instead for accessibility. */
  label?: string
  error?: string
  hint?: string
  className?: string
  required?: boolean
}

type InputProps = BaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'id'>

export function Field({ label, error, hint, className, required, ...rest }: InputProps) {
  const id = useId()
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className={className}>
      {label ? (
        <label htmlFor={id} className="mb-1.5 block font-display text-[11px] font-bold uppercase tracking-[0.08em] text-cocoa-700">
          {label}
          {required ? <span className="text-blush-500"> *</span> : null}
        </label>
      ) : null}
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={cn(CONTROL_CLASS, error ? 'border-blush-500' : 'border-cocoa-900/18')}
        {...rest}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-blush-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-cocoa-500">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

type TextareaProps = BaseProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className' | 'id'>

export function TextAreaField({ label, error, hint, className, required, ...rest }: TextareaProps) {
  const id = useId()
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className={className}>
      {label ? (
        <label htmlFor={id} className="mb-1.5 block font-display text-[11px] font-bold uppercase tracking-[0.08em] text-cocoa-700">
          {label}
          {required ? <span className="text-blush-500"> *</span> : null}
        </label>
      ) : null}
      <textarea
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={cn(CONTROL_CLASS, 'resize-none', error ? 'border-blush-500' : 'border-cocoa-900/18')}
        {...rest}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-blush-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-cocoa-500">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

type SelectProps = BaseProps & {
  children: ReactNode
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'id'>

export function SelectField({ label, error, hint, className, required, children, ...rest }: SelectProps) {
  const id = useId()
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className={className}>
      {label ? (
        <label htmlFor={id} className="mb-1.5 block font-display text-[11px] font-bold uppercase tracking-[0.08em] text-cocoa-700">
          {label}
          {required ? <span className="text-blush-500"> *</span> : null}
        </label>
      ) : null}
      <select
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={cn(CONTROL_CLASS, 'appearance-none bg-no-repeat', error ? 'border-blush-500' : 'border-cocoa-900/18')}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23301d0e' stroke-width='1.6'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1rem',
        }}
        {...rest}
      >
        {children}
      </select>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-blush-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-cocoa-500">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
