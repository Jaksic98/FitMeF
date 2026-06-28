import { ReactNode } from 'react'
import { type BadgeVariant, statusToBadge } from '../../lib/status'
import type { Status } from '../../types'

interface BadgeProps {
  variant: BadgeVariant
  children: ReactNode
  className?: string
}

const VARIANT: Record<BadgeVariant, string> = {
  success: 'bg-success-subtle text-success',
  danger: 'bg-danger-subtle text-danger',
  neutral: 'bg-neutral-subtle text-neutral',
}

export function Badge({ variant, children, className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center font-mono text-micro uppercase rounded-badge py-1.25 px-2.25',
        VARIANT[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  )
}

const STATUS_LABELS: Record<Status, string> = {
  ACTIVE: 'Aktivan',
  INACTIVE: 'Neaktivan',
  LOCKED: 'Zaključan',
  DELETED: 'Obrisan',
}

export function StatusPill({ status }: { status: Status }) {
  return <Badge variant={statusToBadge(status)}>{STATUS_LABELS[status]}</Badge>
}
