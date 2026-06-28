import { ReactNode } from 'react'

export type SegmentedVariant = 'role' | 'view'

export interface Segment<T extends string = string> {
  value: T
  label: ReactNode
}

interface SegmentedControlProps<T extends string = string> {
  variant?: SegmentedVariant
  segments: Segment<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

const CONTAINER: Record<SegmentedVariant, string> = {
  role: 'bg-track rounded-pill p-1',
  view: 'bg-surface border border-border rounded-xl p-1',
}

const ACTIVE: Record<SegmentedVariant, string> = {
  role: 'bg-ink text-white shadow-sm rounded-pill',
  view: 'bg-surface shadow-sm rounded-lg',
}

const INACTIVE = 'text-muted'

export function SegmentedControl<T extends string>({
  variant = 'role',
  segments,
  value,
  onChange,
  className = '',
}: SegmentedControlProps<T>) {
  return (
    <div className={['flex', CONTAINER[variant], className].filter(Boolean).join(' ')}>
      {segments.map((seg) => {
        const isActive = seg.value === value
        return (
          <button
            key={seg.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(seg.value)}
            className={[
              'flex-1 py-1.5 px-3 text-sm transition-all duration-150',
              isActive ? ACTIVE[variant] : INACTIVE,
            ].join(' ')}
          >
            {seg.label}
          </button>
        )
      })}
    </div>
  )
}
