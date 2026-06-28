export type Role = 'ADMIN' | 'CLIENT'

export type Status = 'ACTIVE' | 'INACTIVE' | 'LOCKED' | 'DELETED'

export type AppointmentStatus = 'AVAILABLE' | 'BOOKED' | 'CANCELED'

export interface User {
  id: number
  username: string
  email: string
  phone?: string
  role: Role
  status: Status
  remainingAppointments: number
  emailNotifications: boolean
  calendarNotifications: boolean
}

export interface Pilates {
  id: number
  name: string
  position: number
  status: Status
}

export interface Termin {
  id: number
  date: string       // "YYYY-MM-DD"
  startTime: string  // "HH:mm"
  endTime: string    // "HH:mm"
  status: Status
}

export interface Appointment {
  id: number
  status: AppointmentStatus
  userId: number
  terminId: number
  termin?: Termin
  user?: User
}

// Backend response envelopes
export interface SuccessResponseDTO<T> {
  data: T
  message: string
  path: string
  timestamp: string
}

export interface ErrorResponseDTO {
  code: string
  message: string
  path: string
  timestamp: string
}

export interface ApiError {
  code: string
  message: string
}

// Pagination — backend is 1-indexed; page field here is 0-indexed as returned by Spring
export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface PageParams {
  page: number  // 1-indexed (send page=1 for first page)
  size?: number // default 5
}
