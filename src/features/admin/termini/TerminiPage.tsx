import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { terminiApi } from '../../../api/terminiApi'
import { ApiClientError } from '../../../api/client'
import {
  Alert, Button, DataTable, FilterBar, Input, Modal, Pagination, Select,
  StatusPill, useToast, PencilIcon, TrashIcon,
} from '../../../components/ui'
import type { Status, Termin } from '../../../types'

const PAGE_SIZE = 5

type ActiveModal =
  | { kind: 'none' }
  | { kind: 'create' }
  | { kind: 'edit'; item: Termin }
  | { kind: 'delete'; item: Termin }

const COLS = [
  { label: 'Datum', className: 'w-32' },
  { label: 'Vreme', className: 'w-36' },
  { label: 'Status', className: 'w-28' },
  { label: '', className: 'w-20' },
]

export function TerminiPage() {
  const { show } = useToast()
  const queryClient = useQueryClient()

  const [page, setPage] = useState(1)
  const [dateFilter, setDateFilter] = useState('')
  const [modal, setModal] = useState<ActiveModal>({ kind: 'none' })
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [status, setStatus] = useState<Status>('ACTIVE')
  const [formError, setFormError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-termini', page, dateFilter],
    queryFn: () => terminiApi.getAll({ page, size: PAGE_SIZE, date: dateFilter || undefined }),
  })

  const items = data?.content ?? []

  function handleFilterDate(d: string) {
    setDateFilter(d)
    setPage(1)
  }

  function openCreate() {
    setDate('')
    setStartTime('')
    setEndTime('')
    setFormError(null)
    setModal({ kind: 'create' })
  }

  function openEdit(item: Termin) {
    setDate(item.date)
    setStartTime(item.startTime)
    setEndTime(item.endTime)
    setStatus(item.status)
    setFormError(null)
    setModal({ kind: 'edit', item })
  }

  function closeModal() {
    setModal({ kind: 'none' })
    setIsSaving(false)
  }

  async function handleSave() {
    if (!date || !startTime || !endTime) {
      setFormError('Datum, početak i kraj su obavezni.')
      return
    }
    if (startTime >= endTime) {
      setFormError('Vreme početka mora biti pre vremena kraja.')
      return
    }
    setIsSaving(true)
    setFormError(null)
    try {
      if (modal.kind === 'create') {
        await terminiApi.create({ date, startTime, endTime })
        show('Termin kreiran.')
      } else if (modal.kind === 'edit') {
        await terminiApi.update(modal.item.id, { date, startTime, endTime, status })
        show('Termin sačuvan.')
      }
      await queryClient.invalidateQueries({ queryKey: ['admin-termini'] })
      closeModal()
    } catch (err) {
      setFormError(err instanceof ApiClientError ? err.message : 'Greška. Pokušaj ponovo.')
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    if (modal.kind !== 'delete') return
    setIsSaving(true)
    setFormError(null)
    try {
      await terminiApi.delete(modal.item.id)
      show('Termin obrisan.')
      await queryClient.invalidateQueries({ queryKey: ['admin-termini'] })
      closeModal()
    } catch (err) {
      setFormError(err instanceof ApiClientError ? err.message : 'Greška. Pokušaj ponovo.')
      setIsSaving(false)
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
      <div className="flex items-center justify-between">
        <h1 className="text-h1 text-ink">Termini</h1>
        <Button variant="primary" size="nav" onClick={openCreate}>+ Dodaj termin</Button>
      </div>

      {isError && <Alert variant="error">Greška pri učitavanju termina. Pokušaj ponovo.</Alert>}

      <FilterBar
        date={dateFilter}
        onDateChange={handleFilterDate}
        onClear={() => handleFilterDate('')}
        count={data?.totalElements}
      />

      <DataTable columns={COLS} isEmpty={!isLoading && items.length === 0} isLoading={isLoading} emptyLabel="Nema termina za izabrani datum.">
        {items.map((item) => (
          <tr key={item.id} className="border-t border-line">
            <td className="px-5 py-3.5 w-32 font-mono text-sm text-ink">{formatDate(item.date)}</td>
            <td className="px-5 py-3.5 w-36 font-mono text-sm text-ink">
              {formatTime(item.startTime)} – {formatTime(item.endTime)}
            </td>
            <td className="px-5 py-3.5 w-28"><StatusPill status={item.status} /></td>
            <td className="px-5 py-3.5 w-20">
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => openEdit(item)}
                  className="text-muted hover:text-ink transition-colors p-1"
                  aria-label="Uredi termin"
                >
                  <PencilIcon />
                </button>
                <button
                  onClick={() => { setFormError(null); setModal({ kind: 'delete', item }) }}
                  className="text-muted hover:text-danger transition-colors p-1"
                  aria-label="Obriši termin"
                >
                  <TrashIcon />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      {data && data.totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={data.totalPages}
          totalElements={data.totalElements}
          size={PAGE_SIZE}
          onPageChange={setPage}
        />
      )}

      <Modal
        open={modal.kind === 'create' || modal.kind === 'edit'}
        onClose={closeModal}
        title={modal.kind === 'create' ? 'Dodaj termin' : 'Uredi termin'}
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Datum"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <div className="flex gap-3">
            <Input
              label="Početak"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              wrapperClassName="flex-1"
            />
            <Input
              label="Kraj"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              wrapperClassName="flex-1"
            />
          </div>
          {modal.kind === 'edit' && (
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
            >
              <option value="ACTIVE">Aktivan</option>
              <option value="INACTIVE">Neaktivan</option>
            </Select>
          )}
          {formError && <Alert variant="error">{formError}</Alert>}
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={closeModal}>Otkaži</Button>
            <Button variant="primary" onClick={handleSave} loading={isSaving}>Sačuvaj</Button>
          </div>
        </div>
      </Modal>

      <Modal open={modal.kind === 'delete'} onClose={closeModal} title="Obriši termin">
        {modal.kind === 'delete' && (
          <div className="flex flex-col gap-4">
            <p className="text-base text-secondary">
              Obrisati termin{' '}
              <strong className="text-ink font-mono">
                {formatDate(modal.item.date)} {formatTime(modal.item.startTime)}–{formatTime(modal.item.endTime)}
              </strong>
              ? Ova akcija se ne može poništiti.
            </p>
            {formError && <Alert variant="error">{formError}</Alert>}
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={closeModal}>Otkaži</Button>
              <Button variant="danger-outline" onClick={handleDelete} loading={isSaving}>Obriši</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
