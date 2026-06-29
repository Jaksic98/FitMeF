import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../../../api/usersApi'
import { ApiClientError } from '../../../api/client'
import {
  Alert, Avatar, Button, DataTable, Input, Modal, Pagination, Select,
  StatusPill, useToast, PencilIcon,
} from '../../../components/ui'
import type { Status, User } from '../../../types'

const PAGE_SIZE = 5

const COLS = [
  { label: 'Korisnik', className: 'w-40' },
  { label: 'Imejl', className: '' },
  { label: 'Status', className: 'w-28' },
  { label: 'Termini', className: 'w-20' },
  { label: '', className: 'w-16' },
]

interface EditForm {
  remainingAppointments: string
  status: Status
}

export function KorisniciPage() {
  const { show } = useToast()
  const queryClient = useQueryClient()

  const [page, setPage] = useState(1)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form, setForm] = useState<EditForm>({ remainingAppointments: '', status: 'ACTIVE' })
  const [formError, setFormError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-korisnici', page],
    queryFn: () => usersApi.getAll({ page, size: PAGE_SIZE }),
  })

  const items = data?.data ?? []

  function openEdit(user: User) {
    setForm({
      remainingAppointments: String(user.remainingAppointments),
      status: user.status,
    })
    setFormError(null)
    setEditingUser(user)
  }

  function closeModal() {
    setEditingUser(null)
    setIsSaving(false)
  }

  async function handleSave() {
    if (!editingUser) return
    const credits = Number(form.remainingAppointments)
    if (!Number.isInteger(credits) || credits < 0) {
      setFormError('Preostali termini moraju biti nenegativan ceo broj.')
      return
    }
    setIsSaving(true)
    setFormError(null)
    try {
      await usersApi.adminUpdate(editingUser.id, {
        remainingAppointments: credits,
        status: form.status,
      })
      show('Korisnik sačuvan.')
      await queryClient.invalidateQueries({ queryKey: ['admin-korisnici'] })
      closeModal()
    } catch (err) {
      setFormError(err instanceof ApiClientError ? err.message : 'Greška. Pokušaj ponovo.')
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-h1 text-ink">Korisnici</h1>

      {isError && <Alert variant="error">Greška pri učitavanju korisnika. Pokušaj ponovo.</Alert>}

      <DataTable
        columns={COLS}
        isEmpty={!isLoading && items.length === 0}
        isLoading={isLoading}
        emptyLabel="Nema korisnika."
      >
        {items.map((user) => (
          <tr key={user.id} className="border-t border-line">
            <td className="px-5 py-3 w-40">
              <div className="flex items-center gap-2.5">
                <Avatar name={user.username} size="sm" />
                <span className="text-base text-ink truncate">{user.username}</span>
              </div>
            </td>
            <td className="px-5 py-3 text-sm text-secondary truncate">{user.email}</td>
            <td className="px-5 py-3 w-28">
              <StatusPill status={user.status} />
            </td>
            <td className="px-5 py-3 w-20 font-mono text-sm text-ink text-center">
              {user.remainingAppointments}
            </td>
            <td className="px-5 py-3 w-16">
              <div className="flex justify-end">
                <button
                  onClick={() => openEdit(user)}
                  className="text-muted hover:text-ink transition-colors p-1"
                  aria-label={`Uredi ${user.username}`}
                >
                  <PencilIcon />
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
        open={editingUser !== null}
        onClose={closeModal}
        title={editingUser ? `Uredi: ${editingUser.username}` : ''}
      >
        {editingUser && (
          <div className="flex flex-col gap-4">
            <Input
              label="Preostali termini"
              type="number"
              min="0"
              value={form.remainingAppointments}
              onChange={(e) => setForm((f) => ({ ...f, remainingAppointments: e.target.value }))}
            />
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Status }))}
            >
              <option value="ACTIVE">Aktivan</option>
              <option value="INACTIVE">Neaktivan</option>
              <option value="LOCKED">Zaključan</option>
            </Select>
            {formError && <Alert variant="error">{formError}</Alert>}
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={closeModal}>Otkaži</Button>
              <Button variant="primary" onClick={handleSave} loading={isSaving}>Sačuvaj</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
