import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { authApi } from '../../api/authApi'
import { ApiClientError } from '../../api/client'
import { Alert, Button, Input } from '../../components/ui'

interface RegisterFields {
  username: string
  email: string
  password: string
}

export function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFields>()

  async function onSubmit(data: RegisterFields) {
    setServerError(null)
    try {
      await authApi.register(data)
      setIsSuccess(true)
    } catch (err) {
      setServerError(err instanceof ApiClientError ? err.message : 'Greška pri registraciji. Pokušaj ponovo.')
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-display text-ink select-none">FitMe</span>
        </div>
        {isSuccess ? (
          <div className="bg-surface rounded-panel border border-border-card px-8 py-8 animate-up text-center">
            <div className="w-12 h-12 rounded-full bg-success-subtle flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-success" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-h2 text-ink mb-2">Registracija uspešna</h1>
            <p className="text-md text-muted mb-6">Proveri mejl za aktivacioni link.</p>
            <Link to="/login" className="text-sm text-ink font-medium hover:underline">
              Idi na prijavu
            </Link>
          </div>
        ) : (
          <div className="bg-surface rounded-panel border border-border-card px-8 py-8 animate-up">
            <h1 className="text-h2 text-ink mb-6">Registracija</h1>
            {serverError && (
              <Alert variant="error" className="mb-4">{serverError}</Alert>
            )}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
              <Input
                label="Korisničko ime"
                type="text"
                autoComplete="username"
                error={errors.username?.message}
                {...register('username', {
                  required: 'Korisničko ime je obavezno',
                  minLength: { value: 3, message: 'Minimum 3 karaktera' },
                })}
              />
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
                autoComplete="new-password"
                error={errors.password?.message}
                {...register('password', {
                  required: 'Lozinka je obavezna',
                  minLength: { value: 6, message: 'Minimum 6 karaktera' },
                })}
              />
              <Button type="submit" size="lg" loading={isSubmitting} className="mt-2">
                Registruj se
              </Button>
            </form>
            <p className="mt-5 text-sm text-center text-muted">
              Već imaš nalog?{' '}
              <Link to="/login" className="text-ink font-medium hover:underline">
                Prijavi se
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
