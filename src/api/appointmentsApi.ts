import { apiClient } from './client'
import type { AppointmentSlotDTO } from '../types'

export const appointmentsApi = {
  getAvailable: (date?: string) =>
    apiClient.get<AppointmentSlotDTO[]>(
      date ? `/appointments/available?date=${date}` : '/appointments/available',
    ),

  getMyAppointments: (userId: number) =>
    apiClient.get<AppointmentSlotDTO[]>(`/appointments/user/${userId}`),

  book: (appointmentId: number) =>
    apiClient.post<AppointmentSlotDTO>('/appointments', { appointmentId, userId: null }),

  cancel: (id: number) =>
    apiClient.put<AppointmentSlotDTO>(`/appointments/${id}`, { targetAppointmentId: null }),

  reschedule: (id: number, targetAppointmentId: number) =>
    apiClient.put<AppointmentSlotDTO>(`/appointments/${id}`, { targetAppointmentId }),

  getAll: () =>
    apiClient.get<AppointmentSlotDTO[]>('/appointments'),

  adminCancel: (id: number) =>
    apiClient.put<AppointmentSlotDTO>(`/appointments/${id}`, { targetAppointmentId: null }),

  adminReschedule: (id: number, targetAppointmentId: number) =>
    apiClient.put<AppointmentSlotDTO>(`/appointments/${id}`, { targetAppointmentId }),

  adminDelete: (id: number) =>
    apiClient.delete<void>(`/appointments/${id}`),
}
