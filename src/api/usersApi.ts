import { apiClient } from './client'
import type { User } from '../types'

export interface UpdateProfileRequest {
  phone?: string
  emailNotifications?: boolean
  calendarNotifications?: boolean
}

export const usersApi = {
  updateProfile: (userId: number, data: UpdateProfileRequest) =>
    apiClient.put<User>(`/users/${userId}`, data),
}
