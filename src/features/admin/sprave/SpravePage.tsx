import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { pilatesApi } from '../../../api/pilatesApi'
import { ApiClientError } from '../../../api/client'
import {
  Alert, Button, DataTable, Input, Modal, Pagination, Select, StatusPill, useToast,
  PencilIcon, TrashIcon,
} from '../../../components/ui'
import type { Pilates, Status } from '../../../types'

const PAGE_SIZE = 5

type ActiveModal =
  | { kind: 'none' }
  | { kind: 'create' }
  | { kind: 'edit'; item: Pilates }
  | { kind: 'delete'; item: Pilates }

const COLS = [
  { label: 'Poz.', className: 'w-16' },
  { label: 'Naziv', className: '' },
  { label: 'Status', className: 'w-28' },
  { label: '', className: 'w-20' },
]

export function SpravePage() {
  const { show } = useToast()
  const queryClient = useQueryClient()

  const [page, setPage] = useState(1)
  const [modal, setModal] = useState<ActiveModal>({ kind: 'none' })
  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [status, setStatus] = useState<Status>('ACTIVE')
  const [formError, setFormError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-sprave', page],
    queryFn: () => pilatesApi.getAll({ page, size: PAGE_SIZE }),
  })

  const items = data?.content ?? []

  function openCreate() {
    setName('')
    setPosition('')
    setStatus('ACTIVE')
    setFormError(null)
    setModal({ kind: 'create' })
  }

  function openEdit(item: Pilates) {
    setName(item.name)
    setPosition(String(item.position))
    setStatus(item.status)
    setFormError(null)
    setModal({ kind: 'edit', item })
  }

  function closeModal() {
    setModal({ kind: 'none' })
    setIsSaving(false)
  }

  async function handleSave() {
    if (!name.trim() || !position.trim()) {
      setFormError('Naziv i pozicija su obavezni.')
      return
    }
    const pos = Number(position)
    if (!Number.isInteger(pos) || pos < 1) {
      setFormError('Pozicija mora biti pozitivan ceo broj.')
      return
    }
    setIsSaving(true)
    setFormError(null)
    try {
      if (modal.kind === 'create') {
        await pilatesApi.create({ name: name.trim(), position: pos })
        show('Sprava kreirana.')
      } else if (modal.kind === 'edit') {
        await pilatesApi.update(modal.item.id, { name: name.trim(), position: pos, status })
        show('Sprava sačuvana.')
      }
      await queryClient.invalidateQueries({ queryKey: ['admin-sprave'] })
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
      await pilatesApi.delete(modal.item.id)
      show('Sprava obrisana.')
      await queryClient.invalidateQueries({ queryKey: ['admin-sprave'] })
      closeModal()
    } catch (err) {
      setFormError(err instanceof ApiClientError ? err.message : 'Greška. Pokušaj ponovo.')
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 text-ink">Sprave</h1>
        <Button variant="primary" size="nav" onClick={openCreate}>+ Dodaj spravu</Button>
      </div>

      <DataTable columns={COLS} isEmpty={!isLoading && items.length === 0} isLoading={isLoading} emptyLabel="Nema sprava.">
        {items.map((item) => (
          <tr key={item.id} className="border-t border-line">
            <td className="px-5 py-3.5 w-16 font-mono text-sm text-muted">{item.position}</td>
            <td className="px-5 py-3.5 text-base text-ink">{item.name}</td>
            <td className="px-5 py-3.5 w-28"><StatusPill status={item.status} /></td>
            <td className="px-5 py-3.5 w-20">
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => openEdit(item)}
                  className="text-muted hover:text-ink transition-colors p-1"
                  aria-label={`Uredi ${item.name}`}
                >
                  <PencilIcon />
                </button>
                <button
                  onClick={() => { setFormError(null); setModal({ kind: 'delete', item }) }}
                  className="text-muted hover:text-danger transition-colors p-1"
                  aria-label={`Obriši ${item.name}`}
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
        title={modal.kind === 'create' ? 'Dodaj spravu' : 'Uredi spravu'}
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Naziv"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="npr. Reformer A"
          />
          <Input
            label="Pozicija"
            type="number"
            min="1"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
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

      <Modal open={modal.kind === 'delete'} onClose={closeModal} title="Obriši spravu">
        {modal.kind === 'delete' && (
          <div className="flex flex-col gap-4">
            <p className="text-base text-secondary">
              Obrisati spravu <strong className="text-ink">{modal.item.name}</strong>? Ova akcija se ne može poništiti.
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
