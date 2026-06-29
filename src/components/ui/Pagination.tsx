import { Button } from './Button'
import { ChevronLeftIcon, ChevronRightIcon } from './icons'

interface PaginationProps {
  page: number
  totalPages: number
  totalElements: number
  size: number
  onPageChange: (page: number) => void
}

function getPageRange(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | null)[] = [1]
  if (current > 3) pages.push(null)

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) pages.push(null)
  pages.push(total)
  return pages
}

export function Pagination({ page, totalPages, totalElements, size, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const start = (page - 1) * size + 1
  const end = Math.min(page * size, totalElements)
  const range = getPageRange(page, totalPages)

  return (
    <div className="flex items-center justify-between">
      <p className="text-caption font-mono text-muted">
        {start}–{end} od {totalElements}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="icon"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Prethodna stranica"
        >
          <ChevronLeftIcon />
        </Button>

        {range.map((p, i) =>
          p === null ? (
            <span
              key={`ellipsis-${i}`}
              className="w-8.5 h-8.5 flex items-center justify-center text-sm text-muted"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? 'page' : undefined}
              className={[
                'w-8.5 h-8.5 rounded text-sm inline-flex items-center justify-center transition-colors',
                p === page
                  ? 'bg-ink text-white border border-ink'
                  : 'bg-surface border border-border text-ink hover:border-ink',
              ].join(' ')}
            >
              {p}
            </button>
          ),
        )}

        <Button
          variant="icon"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Sledeća stranica"
        >
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  )
}
