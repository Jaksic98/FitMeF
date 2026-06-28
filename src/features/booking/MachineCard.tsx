interface Machine {
  id: number
  name: string
  position: string
}

type MachineState = 'available' | 'selected' | 'disabled'

interface MachineCardProps {
  machine: Machine
  state: MachineState
  onClick?: () => void
}

export function MachineCard({ machine, state, onClick }: MachineCardProps) {
  const isSelected = state === 'selected'
  const isDisabled = state === 'disabled'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-pressed={isSelected}
      className={[
        'flex items-center gap-4 rounded-xl border px-4 py-3 transition-colors text-left w-full',
        isSelected
          ? 'bg-ink border-ink text-white'
          : isDisabled
            ? 'bg-surface-sunken border-border opacity-50 cursor-not-allowed'
            : 'bg-surface-subtle border-border hover:border-ink',
      ].join(' ')}
    >
      <span className={['font-mono text-sm shrink-0', isSelected ? 'text-white opacity-70' : 'text-muted'].join(' ')}>
        #{machine.position}
      </span>
      <span className={['text-base font-medium', isSelected ? 'text-white' : 'text-ink'].join(' ')}>
        {machine.name}
      </span>
    </button>
  )
}
