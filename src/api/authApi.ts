import { apiClient } from './client'
import type { User } from '../types'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export const authApi = {
  login: (data: LoginRequest) => apiClient.post<User>('/auth/login', data),
  register: (data: RegisterRequest) => apiClient.post<null>('/auth/register', data),
  activate: (token: string) => apiClient.get<null>(`/auth/activate?token=${encodeURIComponent(token)}`),
  me: () => apiClient.get<User>('/auth/me', { skipAuthRedirect: true }),
  logout: () => apiClient.post<null>('/auth/logout'),
}
