import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { appointmentsApi } from '../../../api/appointmentsApi'
import { ApiClientError } from '../../../api/client'
import { Badge, Button, DataTable, Pagination, Select, useToast } from '../../../components/ui'
import type { AppointmentSlotDTO, AppointmentStatus } from '../../../types'

const PAGE_SIZE = 5

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  AVAILABLE: 'Slobodno',
  BOOKED: 'Zauzeto',
  CANCELED: 'Otkazano',
}

const STATUS_BADGE: Record<AppointmentStatus, 'success' | 'danger' | 'neutral'> = {
  AVAILABLE: 'success',
  BOOKED: 'neutral',
  CANCELED: 'danger',
}

const COLS = [
  { label: 'Korisnik', className: 'w-24' },
  { label: 'Sprava', className: 'w-40' },
  { label: 'Termin', className: '' },
  { label: 'Status', className: 'w-36' },
  { label: '', className: 'w-28' },
]

interface EditingState {
  id: number
  status: AppointmentStatus
  isSaving: boolean
  error: string | null
}

export function RezervacijePage() {
  const { show } = useToast()
  const queryClient = useQueryClient()

  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<EditingState | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-rezervacije', page],
    queryFn: () => appointmentsApi.getAll({ page, size: PAGE_SIZE }),
  })

  const items = data?.content ?? []

  function startEdit(item: AppointmentSlotDTO) {
    setEditing({ id: item.id, status: item.status, isSaving: false, error: null })
  }

  function cancelEdit() {
    setEditing(null)
  }

  async function saveEdit() {
    if (!editing) return
    setEditing((prev) => prev && { ...prev, isSaving: true, error: null })
    try {
      await appointmentsApi.adminUpdate(editing.id, editing.status)
      show('Rezervacija ažurirana.')
      await queryClient.invalidateQueries({ queryKey: ['admin-rezervacije'] })
      setEditing(null)
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.message : 'Greška. Pokušaj ponovo.'
      setEditing((prev) => prev && { ...prev, isSaving: false, error: msg })
    }
  }

  function formatTime(t: string) {
    return t.slice(0, 5)
  }

  function formatDate(d: string) {
    const [y, m, day] = d.split('-')
    return `${day}.${m}.${y}.`
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-h1 text-ink">Rezervacije</h1>

      <DataTable
        columns={COLS}
        isEmpty={!isLoading && items.length === 0}
        isLoading={isLoading}
        emptyLabel="Nema rezervacija."
      >
        {items.map((item) => {
          const isEditingRow = editing?.id === item.id

          return (
            <tr
              key={item.id}
              className={[
                'border-t border-line transition-colors',
                isEditingRow ? 'bg-surface-subtle animate-fade' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <td className="px-5 py-3 w-24 font-mono text-sm text-muted">
                {item.userId ?? '—'}
              </td>
              <td className="px-5 py-3 w-40 text-base text-ink">
                {item.pilatesPosition}. {item.pilatesName}
              </td>
              <td className="px-5 py-3 font-mono text-sm text-ink">
                {formatDate(item.terminDate)}{' '}
                {formatTime(item.terminStartTime)}–{formatTime(item.terminEndTime)}
              </td>
              <td className="px-5 py-3 w-36">
                {isEditingRow ? (
                  <Select
                    value={editing.status}
                    onChange={(e) =>
                      setEditing((prev) =>
                        prev ? { ...prev, status: e.target.value as AppointmentStatus } : null,
                      )
                    }
                    className="py-1.5 text-sm"
                  >
                    <option value="AVAILABLE">Slobodno</option>
                    <option value="BOOKED">Zauzeto</option>
                    <option value="CANCELED">Otkazano</option>
                  </Select>
                ) : (
                  <Badge variant={STATUS_BADGE[item.status]}>{STATUS_LABELS[item.status]}</Badge>
                )}
              </td>
              <td className="px-5 py-3 w-28">
                {isEditingRow ? (
                  <div className="flex gap-2 items-center">
                    <Button
                      variant="primary"
                      size="nav"
                      onClick={saveEdit}
                      loading={editing.isSaving}
                    >
                      Sačuvaj
                    </Button>
                    <Button variant="ghost" size="nav" onClick={cancelEdit}>
                      ✕
                    </Button>
                  </div>
                ) : (
                  <Button variant="secondary" size="nav" onClick={() => startEdit(item)}>
                    Uredi
                  </Button>
                )}
              </td>
            </tr>
          )
        })}
      </DataTable>

      {editing?.error && <p className="text-sm text-danger">{editing.error}</p>}

      {data && data.totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={data.totalPages}
          totalElements={data.totalElements}
          size={PAGE_SIZE}
          onPageChange={(p) => {
            setPage(p)
            setEditing(null)
          }}
        />
      )}
    </div>
  )
}
