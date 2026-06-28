import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

type Tab = { to: string; label: string; end?: boolean }

const ADMIN_TABS: Tab[] = [
  { to: '/admin/sprave', label: 'Sprave' },
  { to: '/admin/termini', label: 'Termini' },
  { to: '/admin/rezervacije', label: 'Rezervacije' },
  { to: '/admin/korisnici', label: 'Korisnici' },
]

const CLIENT_TABS: Tab[] = [
  { to: '/', label: 'Rezervacija', end: true },
  { to: '/termini', label: 'Moji termini' },
  { to: '/profil', label: 'Profil' },
]

export function NavTabs() {
  const { isAdmin } = useAuth()
  const tabs = isAdmin ? ADMIN_TABS : CLIENT_TABS

  return (
    <nav className="flex items-center gap-1" aria-label="Navigacija">
      {tabs.map(({ to, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            [
              'px-3.75 py-2 text-sm font-medium rounded-btn transition-colors',
              isActive
                ? 'bg-ink text-white'
                : 'text-secondary hover:text-ink',
            ].join(' ')
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
