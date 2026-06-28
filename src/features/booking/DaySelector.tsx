const DAYS_TO_SHOW = 7
const DAY_NAMES = ['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub']

function toLocalIso(d: Date): string {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
}

interface DaySelectorProps {
  selectedDate: string
  onChange: (date: string) => void
}

export function DaySelector({ selectedDate, onChange }: DaySelectorProps) {
  const days = Array.from({ length: DAYS_TO_SHOW }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d
  })

  return (
    <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Izaberi datum">
      {days.map((day) => {
        const iso = toLocalIso(day)
        const isSelected = iso === selectedDate
        return (
          <button
            key={iso}
            type="button"
            onClick={() => onChange(iso)}
            aria-pressed={isSelected}
            className={[
              'flex flex-col items-center justify-center w-[62px] h-[62px] rounded-xl border shrink-0 transition-colors',
              isSelected
                ? 'bg-ink text-white border-ink'
                : 'bg-surface border-border text-ink hover:border-ink',
            ].join(' ')}
          >
            <span className="text-caption">{DAY_NAMES[day.getDay()]}</span>
            <span className="font-mono text-mono-lg leading-none">{day.getDate()}</span>
          </button>
        )
      })}
    </div>
  )
}
