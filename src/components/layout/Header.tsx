import { useAuth } from '../../contexts/AuthContext'
import { Avatar } from '../ui'
import { CreditsPill } from './CreditsPill'
import { NavTabs } from './NavTabs'

export function Header() {
  const { user } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16.5 bg-header-bg backdrop-blur-header border-b border-border-header">
      <div className="max-w-content mx-auto px-4 lg:px-7 flex items-center justify-between h-full">
        <div className="flex items-center gap-6">
          <span className="text-h4 font-extrabold text-ink select-none">FitMe</span>
          {user && <NavTabs />}
        </div>
        {user && (
          <div className="flex items-center gap-3">
            <CreditsPill />
            <Avatar name={user.username} size="sm" />
          </div>
        )}
      </div>
    </header>
  )
}
