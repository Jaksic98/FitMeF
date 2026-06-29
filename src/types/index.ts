export type Role = 'ADMIN' | 'CLIENT'

export type Status = 'ACTIVE' | 'INACTIVE' | 'LOCKED' | 'DELETED'

export type AppointmentStatus = 'AVAILABLE' | 'BOOKED' | 'CANCELED'

export interface User {
  id: number
  username: string
  fullName: string
  email: string
  phoneNumber?: string
  roles: Role[]
  status: Status
  remainingAppointments: number
  emailNotifications: boolean
  calendarNotifications: boolean
}

export interface Pilates {
  id: number
  name: string
  position: string
  status: Status
}

export interface Termin {
  id: number
  date: string       // "YYYY-MM-DD"
  startTime: string  // "HH:mm:ss"
  endTime: string    // "HH:mm:ss"
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

// Denormalized appointment slot — matches backend AppointmentDTO
export interface AppointmentSlotDTO {
  id: number
  terminId: number
  pilatesId: number
  userId: number | null
  status: AppointmentStatus
  terminDate: string        // "YYYY-MM-DD"
  terminStartTime: string   // "HH:mm"
  terminEndTime: string     // "HH:mm"
  pilatesPosition: string
  pilatesName: string
}

// Backend response envelopes
export interface SuccessResponseDTO<T> {
  entity: T
  success: boolean
  message: string
  path: string
  timestamp: number
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

// Pagination — backend uses 1-indexed `page` field
export interface Page<T> {
  data: T[]
  totalElements: number
  totalPages: number
  page: number
  size: number
}

export interface PageParams {
  page: number  // 1-indexed (send page=1 for first page)
  size?: number // default 5
}
