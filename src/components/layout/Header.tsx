import { useAuth } from '../../contexts/AuthContext'
import { Avatar } from '../ui'
import { CreditsPill } from './CreditsPill'
import { NavTabs } from './NavTabs'

export function Header() {
  const { user } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16.5 bg-header-bg backdrop-blur-header border-b border-border-header">
      <div className="max-w-content mx-auto px-4 lg:px-7 flex items-center h-full gap-3">
        <span className="text-h4 font-extrabold text-ink select-none shrink-0">FitMe</span>
        {user && (
          <div className="flex-1 min-w-0 overflow-x-auto scrollbar-none">
            <NavTabs />
          </div>
        )}
        {user && (
          <div className="flex items-center gap-3 shrink-0">
            <CreditsPill />
            <Avatar name={user.username} size="sm" />
          </div>
        )}
      </div>
    </header>
  )
}
