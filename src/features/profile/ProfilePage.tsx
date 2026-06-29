import { useState } from 'react'
import { ApiClientError } from '../../api/client'
import { usersApi } from '../../api/usersApi'
import { useAuth } from '../../contexts/AuthContext'
import { Alert, Avatar, Button, Card, Input, Toggle, useToast } from '../../components/ui'

export function ProfilePage() {
  const { user, setUser } = useAuth()
  const { show } = useToast()

  const [phone, setPhone] = useState(user?.phoneNumber ?? '')
  const [emailNotif, setEmailNotif] = useState(user?.emailNotifications ?? true)
  const [calendarNotif, setCalendarNotif] = useState(user?.calendarNotifications ?? true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  if (!user) return null

  async function handleSave() {
    if (!user) return
    setIsSaving(true)
    setSaveError(null)
    try {
      const updated = await usersApi.updateProfile(user.id, {
        phoneNumber: phone.trim() || undefined,
        emailNotifications: emailNotif,
        calendarNotifications: calendarNotif,
      })
      setUser(updated)
      show('Profil sačuvan.')
    } catch (err) {
      setSaveError(
        err instanceof ApiClientError ? err.message : 'Greška pri čuvanju. Pokušaj ponovo.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div className="flex items-center gap-4">
        <Avatar name={user.username} size="lg" />
        <div>
          <p className="text-h4 text-ink">{user.username}</p>
          <p className="text-sm text-muted">{user.email}</p>
        </div>
      </div>

      <Card variant="stat">
        <div className="relative z-10">
          <p className="text-label text-on-dark uppercase mb-2">Preostali termini</p>
          <p className="text-stat font-mono text-white">{user.remainingAppointments}</p>
        </div>
        <div
          aria-hidden="true"
          className="absolute -right-8 -top-8 w-32 h-32 rounded-full border border-ink-line opacity-40 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -right-4 -bottom-12 w-48 h-48 rounded-full border border-ink-line opacity-25 pointer-events-none"
        />
      </Card>

      <Card variant="content">
        <div className="flex flex-col gap-5">
          <h2 className="text-h4 text-ink">Podaci</h2>

          <Input
            label="Telefon"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+381..."
          />

          <div className="h-px bg-line" />

          <div className="flex flex-col gap-4">
            <p className="text-label text-muted uppercase">Obaveštenja</p>
            <div className="flex items-center justify-between">
              <span className="text-base text-ink">Imejl obaveštenja</span>
              <Toggle checked={emailNotif} onChange={setEmailNotif} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-ink">Kalendar obaveštenja</span>
              <Toggle checked={calendarNotif} onChange={setCalendarNotif} />
            </div>
          </div>

          {saveError && <Alert variant="error">{saveError}</Alert>}

          <Button variant="primary" onClick={handleSave} loading={isSaving}>
            Sačuvaj
          </Button>
        </div>
      </Card>
    </div>
  )
}
