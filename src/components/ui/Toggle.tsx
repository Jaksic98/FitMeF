interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  className?: string
}

export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
}: ToggleProps) {
  return (
    <label
      className={[
        'flex items-center gap-3',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={[
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-pill p-0.5 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
          checked ? 'bg-primary' : 'bg-switch-off',
          disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span
          className={[
            'inline-block h-5 w-5 rounded-full bg-surface shadow-sm transition-transform duration-150',
            checked ? 'translate-x-5' : 'translate-x-0',
          ].join(' ')}
        />
      </button>
      {label && (
        <span className="text-md text-ink select-none">{label}</span>
      )}
    </label>
  )
}
