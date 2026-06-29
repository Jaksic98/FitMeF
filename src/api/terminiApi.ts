import { apiClient } from './client'
import type { Status, Termin } from '../types'

export interface CreateTerminRequest {
  date: string       // "YYYY-MM-DD"
  startTime: string  // "HH:mm:ss"
  endTime: string    // "HH:mm:ss"
}

export interface UpdateTerminRequest {
  date?: string
  startTime?: string // "HH:mm:ss"
  endTime?: string   // "HH:mm:ss"
  status?: Status
}

export const terminiApi = {
  getAll: (date?: string) => {
    const q = date ? `?date=${date}` : ''
    return apiClient.get<Termin[]>(`/termini${q}`)
  },

  create: (data: CreateTerminRequest) =>
    apiClient.post<Termin>('/termini', data),

  update: (id: number, data: UpdateTerminRequest) =>
    apiClient.put<Termin>(`/termini/${id}`, data),

  delete: (id: number) =>
    apiClient.delete<void>(`/termini/${id}`),
}
