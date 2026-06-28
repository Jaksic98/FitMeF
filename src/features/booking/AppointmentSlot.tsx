import type { AppointmentSlotDTO } from '../../types'

function isPast(slot: AppointmentSlotDTO): boolean {
  return new Date(`${slot.terminDate}T${slot.terminStartTime}:00`) <= new Date()
}

interface AppointmentSlotProps {
  slot: AppointmentSlotDTO
  isSelected: boolean
  onClick: () => void
}

export function AppointmentSlot({ slot, isSelected, onClick }: AppointmentSlotProps) {
  const past = isPast(slot)

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={past}
      aria-pressed={isSelected}
      className={[
        'w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-colors',
        isSelected
          ? 'border-ink bg-surface-subtle'
          : past
            ? 'bg-surface-sunken border-border opacity-50 cursor-not-allowed'
            : 'bg-surface border-border-card hover:border-ink',
      ].join(' ')}
    >
      <span className="font-mono text-mono-lg text-ink">
        {slot.terminStartTime} – {slot.terminEndTime}
      </span>
      {isSelected && (
        <span className="text-sm text-success font-medium">Izabrano</span>
      )}
    </button>
  )
}
