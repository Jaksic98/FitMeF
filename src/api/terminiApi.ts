import { apiClient } from './client'
import type { Page, PageParams, Status, Termin } from '../types'

export interface CreateTerminRequest {
  date: string       // "YYYY-MM-DD"
  startTime: string  // "HH:mm"
  endTime: string    // "HH:mm"
}

export interface UpdateTerminRequest {
  date?: string
  startTime?: string
  endTime?: string
  status?: Status
}

export const terminiApi = {
  getAll: ({ page, size = 5, date }: PageParams & { date?: string }) => {
    const q = new URLSearchParams({ page: String(page), size: String(size) })
    if (date) q.set('date', date)
    return apiClient.get<Page<Termin>>(`/termini?${q}`)
  },

  create: (data: CreateTerminRequest) =>
    apiClient.post<Termin>('/termini', data),

  update: (id: number, data: UpdateTerminRequest) =>
    apiClient.put<Termin>(`/termini/${id}`, data),

  delete: (id: number) =>
    apiClient.delete<void>(`/termini/${id}`),
}
