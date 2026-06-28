import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export function CreditsPill() {
  const { user, isClient } = useAuth()
  const navigate = useNavigate()

  if (!isClient || !user) return null

  return (
    <button
      onClick={() => navigate('/profil')}
      className="flex items-center gap-1.5 rounded-pill bg-surface-muted px-3 py-1.5 text-sm font-mono hover:bg-neutral-subtle transition-colors"
      aria-label={`${user.remainingAppointments} preostalih termina — idi na profil`}
    >
      <span className="w-2 h-2 rounded-full bg-primary shrink-0" aria-hidden="true" />
      <span className="text-ink font-medium">{user.remainingAppointments}</span>
    </button>
  )
}
