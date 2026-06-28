import { InputHTMLAttributes, forwardRef, useId } from 'react'

export interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  wrapperClassName?: string
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(function DateInput(
  {
    label,
    error,
    id: idProp,
    wrapperClassName = '',
    className = '',
    disabled,
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
      <input
        ref={ref}
        id={id}
        type="date"
        disabled={disabled}
        className={[
          'w-full bg-surface border border-border rounded-btn py-2.75 px-4 text-md text-ink transition-colors outline-none focus:ring-2 focus:ring-primary focus:border-primary',
          error ? 'border-danger' : '',
          disabled ? 'bg-surface-disabled text-disabled cursor-not-allowed' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  )
})
