import { HTMLAttributes, ReactNode } from 'react'

export type CardVariant = 'content' | 'list' | 'stat' | 'info' | 'empty-state'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  children?: ReactNode
}

const VARIANT: Record<CardVariant, string> = {
  content: 'bg-surface border border-border-card rounded-card p-6',
  list: 'bg-surface border border-border-card rounded-card overflow-hidden',
  stat: 'bg-ink text-white rounded-panel p-6 relative overflow-hidden',
  info: 'bg-surface-subtle rounded-xl p-4',
  'empty-state':
    'border-2 border-dashed border-border-dashed rounded-panel p-12 flex flex-col items-center justify-center text-center gap-3',
}

export function Card({ variant = 'content', children, className = '', ...props }: CardProps) {
  return (
    <div {...props} className={[VARIANT[variant], className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}
