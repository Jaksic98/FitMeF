import { Button } from './Button'
import { DateInput } from './DateInput'

interface FilterBarProps {
  date: string
  onDateChange: (date: string) => void
  onClear: () => void
  count?: number
}

export function FilterBar({ date, onDateChange, onClear, count }: FilterBarProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-label text-muted uppercase">Datum</span>
      <DateInput
        value={date}
        onChange={(e) => onDateChange(e.target.value)}
        className="w-44"
      />
      {date && (
        <Button variant="secondary" size="nav" onClick={onClear}>
          Poništi filter
        </Button>
      )}
      {count !== undefined && (
        <span className="text-caption font-mono text-muted ml-auto">
          {count} {count === 1 ? 'rezultat' : 'rezultata'}
        </span>
      )}
    </div>
  )
}
