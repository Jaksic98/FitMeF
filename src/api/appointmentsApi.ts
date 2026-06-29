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
    apiClient.post<AppointmentSlotDTO>('/appointments', { appointmentId }),
  cancel: (id: number) =>
    apiClient.put<AppointmentSlotDTO>(`/appointments/${id}`, {}),
  reschedule: (id: number, newAppointmentId: number) =>
    apiClient.put<AppointmentSlotDTO>(`/appointments/${id}`, { newAppointmentId }),
}
