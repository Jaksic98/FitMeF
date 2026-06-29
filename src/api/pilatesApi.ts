import { apiClient } from './client'
import type { Pilates, Status } from '../types'

export interface CreatePilatesRequest {
  name: string
  position: string
}

export interface UpdatePilatesRequest {
  name?: string
  position?: string
  status?: Status
}

export const pilatesApi = {
  getAll: () =>
    apiClient.get<Pilates[]>('/pilates'),

  create: (data: CreatePilatesRequest) =>
    apiClient.post<Pilates>('/pilates', data),

  update: (id: number, data: UpdatePilatesRequest) =>
    apiClient.put<Pilates>(`/pilates/${id}`, data),

  delete: (id: number) =>
    apiClient.delete<void>(`/pilates/${id}`),
}
