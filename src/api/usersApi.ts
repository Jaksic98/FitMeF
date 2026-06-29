import { apiClient } from './client'
import type { Page, PageParams, Status, User } from '../types'

export interface UpdateProfileRequest {
  phoneNumber?: string
  emailNotifications?: boolean
  calendarNotifications?: boolean
}

export interface AdminUpdateUserRequest {
  remainingAppointments?: number
  status?: Status
}

export const usersApi = {
  updateProfile: (userId: number, data: UpdateProfileRequest) =>
    apiClient.put<User>(`/users/${userId}`, data),

  getAll: ({ page, size = 5 }: PageParams) =>
    apiClient.get<Page<User>>(`/users?page=${page}&size=${size}`),

  adminUpdate: (userId: number, data: AdminUpdateUserRequest) =>
    apiClient.put<User>(`/users/${userId}`, data),
}
