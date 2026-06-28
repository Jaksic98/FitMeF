import { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant =
  | 'primary'
  | 'accent'
  | 'secondary'
  | 'ghost'
  | 'danger-outline'
  | 'success-outline'
  | 'icon'
  | 'pill'

export type ButtonSize = 'nav' | 'default' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  children?: ReactNode
}

const VARIANT_COLORS: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-white hover:bg-ink-hover',
  accent: 'bg-primary text-white hover:bg-primary-hover',
  secondary: 'bg-surface border border-border text-ink hover:border-ink',
  ghost: 'text-secondary hover:text-ink',
  'danger-outline': 'border border-danger-border text-danger hover:bg-danger-subtle',
  'success-outline': 'border border-success-border text-success hover:bg-success-subtle',
  icon: 'bg-surface border border-border text-ink hover:border-ink',
  pill: 'bg-surface border border-border text-ink hover:border-ink',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  nav: 'py-2 px-3.75 text-sm rounded-btn',
  default: 'py-2.75 px-5 text-md rounded-lg',
  lg: 'py-3.25 px-5 text-md rounded-lg w-full',
}

const FIXED_SHAPE: Partial<Record<ButtonVariant, string>> = {
  icon: 'w-8.5 h-8.5 rounded',
  pill: 'py-1.5 px-3 text-sm rounded-pill',
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export function Button({
  variant = 'primary',
  size = 'default',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading
  const shapeClass = FIXED_SHAPE[variant] ?? SIZE_CLASSES[size]
  const colorClass = isDisabled
    ? 'bg-surface-disabled text-disabled cursor-not-allowed pointer-events-none'
    : VARIANT_COLORS[variant]

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center gap-2 transition-colors select-none',
        shapeClass,
        colorClass,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
}
