import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { AppLayout } from '../components/layout'
import { LoginPage, RegisterPage, ActivatePage } from '../features/auth'
import { BookingPage } from '../features/booking'
import { MyAppointmentsPage } from '../features/myappointments'
import { ProfilePage } from '../features/profile'
import { SpravePage } from '../features/admin/sprave'
import { TerminiPage } from '../features/admin/termini'
import { RezervacijePage } from '../features/admin/rezervacije'
import { KorisniciPage } from '../features/admin/korisnici'
import type { ReactNode } from 'react'

function GuestGuard({ children }: { children: ReactNode }) {
  const { user, isAdmin, isLoading } = useAuth()
  if (isLoading) return null
  if (user) return <Navigate to={isAdmin ? '/admin/sprave' : '/'} replace />
  return <>{children}</>
}

function AdminGuard({ children }: { children: ReactNode }) {
  const { user, isAdmin, isLoading } = useAuth()
  if (isLoading) return null
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <p className="p-8 text-center text-danger">Pristup odbijen.</p>
  return <>{children}</>
}

function ClientGuard({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()
  if (isLoading) return null
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Auth — bez shell-a */}
      <Route path="/login" element={<GuestGuard><LoginPage /></GuestGuard>} />
      <Route path="/register" element={<GuestGuard><RegisterPage /></GuestGuard>} />
      <Route path="/activate" element={<ActivatePage />} />

      {/* App shell — sve autentifikovane rute */}
      <Route element={<AppLayout />}>
        {/* Client — Modul 5–6 */}
        <Route path="/" element={<ClientGuard><BookingPage /></ClientGuard>} />
        <Route path="/termini" element={<ClientGuard><MyAppointmentsPage /></ClientGuard>} />
        <Route path="/profil" element={<ClientGuard><ProfilePage /></ClientGuard>} />

        {/* Admin — Modul 7 */}
        <Route path="/admin/sprave" element={<AdminGuard><SpravePage /></AdminGuard>} />
        <Route path="/admin/termini" element={<AdminGuard><TerminiPage /></AdminGuard>} />
        <Route path="/admin/rezervacije" element={<AdminGuard><RezervacijePage /></AdminGuard>} />
        <Route path="/admin/korisnici" element={<AdminGuard><KorisniciPage /></AdminGuard>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
