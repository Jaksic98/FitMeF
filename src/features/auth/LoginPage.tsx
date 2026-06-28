import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { authApi } from '../../api/authApi'
import { ApiClientError } from '../../api/client'
import { useAuth } from '../../contexts/AuthContext'
import { Alert, Button, Input } from '../../components/ui'

interface LoginFields {
  email: string
  password: string
}

export function LoginPage() {
  const { setUser } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFields>()

  async function onSubmit(data: LoginFields) {
    setServerError(null)
    try {
      const user = await authApi.login(data)
      setUser(user)
      navigate(user.role === 'ADMIN' ? '/admin/sprave' : '/', { replace: true })
    } catch (err) {
      setServerError(err instanceof ApiClientError ? err.message : 'Greška pri prijavi. Pokušaj ponovo.')
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-display text-ink select-none">FitMe</span>
        </div>
        <div className="bg-surface rounded-panel border border-border-card px-8 py-8 animate-up">
          <h1 className="text-h2 text-ink mb-6">Prijava</h1>
          {serverError && (
            <Alert variant="error" className="mb-4">{serverError}</Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email je obavezan',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Email format nije validan' },
              })}
            />
            <Input
              label="Lozinka"
              type="password"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password', { required: 'Lozinka je obavezna' })}
            />
            <Button type="submit" size="lg" loading={isSubmitting} className="mt-2">
              Prijavi se
            </Button>
          </form>
          <p className="mt-5 text-sm text-center text-muted">
            Nemaš nalog?{' '}
            <Link to="/register" className="text-ink font-medium hover:underline">
              Registruj se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
