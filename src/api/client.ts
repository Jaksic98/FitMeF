import type { ApiError, SuccessResponseDTO } from '../types'

const API_BASE = '/api'

export class ApiClientError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}

interface RequestOptions {
  skipAuthRedirect?: boolean
}

async function request<T>(path: string, init?: RequestInit, options?: RequestOptions): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    credentials: 'include',
    ...init,
  })

  if (response.status === 401) {
    if (!options?.skipAuthRedirect) {
      window.location.href = '/login'
    }
    throw new ApiClientError('UNAUTHORIZED', 'Sesija je istekla. Preusmeravanje na prijavu.')
  }

  if (response.status === 403) {
    throw new ApiClientError('FORBIDDEN', 'Nemate dozvolu za ovu akciju.')
  }

  const body: unknown = await response.json()

  if (!response.ok) {
    const err = body as ApiError
    throw new ApiClientError(err.code ?? 'UNKNOWN_ERROR', err.message ?? 'Neočekivana greška.')
  }

  return (body as SuccessResponseDTO<T>).entity
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, undefined, options),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'POST', body: data !== undefined ? JSON.stringify(data) : undefined }),
  put: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'PUT', body: data !== undefined ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
