import { ReactNode } from 'react'

export type AlertVariant = 'danger' | 'warning' | 'error'

interface AlertProps {
  variant?: AlertVariant
  children: ReactNode
  className?: string
}

const VARIANT: Record<AlertVariant, string> = {
  danger: 'bg-danger-subtle border border-danger-border text-danger-emphasis',
  warning: 'bg-surface border border-warning-border text-warning-text',
  error: 'bg-danger-subtle text-danger-emphasis',
}

export function Alert({ variant = 'error', children, className = '' }: AlertProps) {
  return (
    <div
      role="alert"
      className={['rounded-xl px-4 py-3 text-sm', VARIANT[variant], className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}
