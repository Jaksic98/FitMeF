import { InputHTMLAttributes, forwardRef, useId, useState } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  wrapperClassName?: string
}

const BASE =
  'w-full bg-surface border border-border rounded-lg py-2.75 px-4 text-md text-ink placeholder:text-disabled transition-colors outline-none focus:ring-2 focus:ring-primary focus:border-primary'

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    hint,
    id: idProp,
    wrapperClassName = '',
    className = '',
    disabled,
    type = 'text',
    ...props
  },
  ref,
) {
  const generatedId = useId()
  const id = idProp ?? generatedId
  const [showPw, setShowPw] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPw ? 'text' : 'password') : type

  return (
    <div className={['flex flex-col gap-1.5', wrapperClassName].filter(Boolean).join(' ')}>
      {label && (
        <label htmlFor={id} className="text-label text-muted uppercase">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={id}
          type={inputType}
          disabled={disabled}
          className={[
            BASE,
            error ? 'border-danger focus:ring-danger focus:border-danger' : '',
            disabled ? 'bg-surface-disabled text-disabled cursor-not-allowed' : '',
            isPassword ? 'pr-10' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
            aria-label={showPw ? 'Sakrij lozinku' : 'Prikaži lozinku'}
          >
            {showPw ? (
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      {hint && !error && <p className="text-sm text-muted">{hint}</p>}
    </div>
  )
})
