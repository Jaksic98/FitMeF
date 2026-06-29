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
  login: async (data: LoginRequest): Promise<User> => {
    await apiClient.post<{ message: string }>('/auth/login', data)
    return apiClient.get<User>('/auth/me', { skipAuthRedirect: true })
  },
  register: (data: RegisterRequest) => apiClient.post<null>('/auth/register', data),
  activate: (token: string) => apiClient.get<null>(`/auth/activate?token=${encodeURIComponent(token)}`),
  me: () => apiClient.get<User>('/auth/me', { skipAuthRedirect: true }),
  logout: () => apiClient.post<null>('/auth/logout'),
}
