import { apiClient } from './client'
import type { Page, PageParams, Pilates, Status } from '../types'

export interface CreatePilatesRequest {
  name: string
  position: number
}

export interface UpdatePilatesRequest {
  name?: string
  position?: number
  status?: Status
}

export const pilatesApi = {
  getAll: ({ page, size = 5 }: PageParams) =>
    apiClient.get<Page<Pilates>>(`/pilates?page=${page}&size=${size}`),

  create: (data: CreatePilatesRequest) =>
    apiClient.post<Pilates>('/pilates', data),

  update: (id: number, data: UpdatePilatesRequest) =>
    apiClient.put<Pilates>(`/pilates/${id}`, data),

  delete: (id: number) =>
    apiClient.delete<void>(`/pilates/${id}`),
}
