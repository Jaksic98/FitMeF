import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types'
import { authApi } from '../api/authApi'

interface AuthContextValue {
  user: User | null
  setUser: (user: User | null) => void
  isAdmin: boolean
  isClient: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function init() {
      try {
        const u = await authApi.me()
        setUser(u)
      } catch {
        // not authenticated — user stays null
      } finally {
        setIsLoading(false)
      }
    }
    void init()
  }, [])

  const value: AuthContextValue = {
    user,
    setUser,
    isAdmin: user?.role === 'ADMIN',
    isClient: user?.role === 'CLIENT',
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
