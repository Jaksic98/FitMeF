import { ReactNode } from 'react'

export interface DataTableColumn {
  label: string
  className?: string
}

interface DataTableProps {
  columns: DataTableColumn[]
  children?: ReactNode
  isEmpty?: boolean
  emptyLabel?: string
  isLoading?: boolean
}

export function DataTable({ columns, children, isEmpty, emptyLabel, isLoading }: DataTableProps) {
  const spanAll = columns.length

  return (
    <div className="rounded-card border border-border-card overflow-hidden bg-surface">
      <table className="w-full border-collapse">
        <thead className="bg-surface-subtle">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className={[
                  'text-label text-muted uppercase px-5 py-3 text-left font-normal',
                  col.className,
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={spanAll} className="py-10 text-center text-sm text-muted">
                Učitavanje…
              </td>
            </tr>
          ) : isEmpty ? (
            <tr>
              <td colSpan={spanAll} className="py-10 text-center text-sm text-muted">
                {emptyLabel ?? 'Nema podataka.'}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  )
}
