import { apiClient } from './client'
import type { AppointmentSlotDTO } from '../types'

export const appointmentsApi = {
  getAvailable: (date?: string) =>
    apiClient.get<AppointmentSlotDTO[]>(
      date ? `/appointments/available?date=${date}` : '/appointments/available',
    ),
  book: (appointmentId: number) =>
    apiClient.post<AppointmentSlotDTO>('/appointments', { appointmentId }),
}
