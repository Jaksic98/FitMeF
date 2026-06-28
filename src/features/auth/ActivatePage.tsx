import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { authApi } from '../../api/authApi'
import { ApiClientError } from '../../api/client'
import { Alert } from '../../components/ui'

type ActivateState = 'loading' | 'success' | 'error'

export function ActivatePage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [state, setState] = useState<ActivateState>('loading')
  const [errorMessage, setErrorMessage] = useState('Link za aktivaciju je istekao ili nije validan.')

  useEffect(() => {
    if (!token) {
      setErrorMessage('Link za aktivaciju nije validan.')
      setState('error')
      return
    }
    authApi
      .activate(token)
      .then(() => setState('success'))
      .catch((err) => {
        setErrorMessage(err instanceof ApiClientError ? err.message : 'Link za aktivaciju je istekao ili nije validan.')
        setState('error')
      })
  }, [token])

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-display text-ink select-none">FitMe</span>
        </div>
        <div className="bg-surface rounded-panel border border-border-card px-8 py-8 animate-up text-center">
          {state === 'loading' && (
            <>
              <div
                className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin mx-auto mb-4"
                role="status"
                aria-label="Učitavanje"
              />
              <p className="text-md text-muted">Aktivacija u toku...</p>
            </>
          )}
          {state === 'success' && (
            <>
              <div className="w-12 h-12 rounded-full bg-success-subtle flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-success" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h1 className="text-h2 text-ink mb-2">Nalog aktiviran</h1>
              <p className="text-md text-muted mb-6">Sada se možeš prijaviti.</p>
              <Link to="/login" className="text-sm text-ink font-medium hover:underline">
                Prijavi se
              </Link>
            </>
          )}
          {state === 'error' && (
            <>
              <Alert variant="error" className="mb-6 text-left">{errorMessage}</Alert>
              <Link to="/login" className="text-sm text-ink font-medium hover:underline">
                Idi na prijavu
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
