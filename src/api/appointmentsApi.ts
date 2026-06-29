import { apiClient } from './client'
import type { AppointmentSlotDTO, AppointmentStatus, Page, PageParams } from '../types'

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
  getAll: ({ page, size = 5 }: PageParams) =>
    apiClient.get<Page<AppointmentSlotDTO>>(`/appointments?page=${page}&size=${size}`),
  adminUpdate: (id: number, status: AppointmentStatus) =>
    apiClient.put<AppointmentSlotDTO>(`/appointments/${id}`, { status }),
}
