import { SelectHTMLAttributes, forwardRef, useId } from 'react'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  wrapperClassName?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    label,
    error,
    id: idProp,
    wrapperClassName = '',
    className = '',
    disabled,
    children,
    ...props
  },
  ref,
) {
  const generatedId = useId()
  const id = idProp ?? generatedId

  return (
    <div className={['flex flex-col gap-1.5', wrapperClassName].filter(Boolean).join(' ')}>
      {label && (
        <label htmlFor={id} className="text-label text-muted uppercase">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={id}
          disabled={disabled}
          className={[
            'w-full appearance-none bg-surface border border-border rounded-btn py-2.75 px-4 pr-9 text-md text-ink transition-colors outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer',
            error ? 'border-danger' : '',
            disabled ? 'bg-surface-disabled text-disabled cursor-not-allowed' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  )
})
