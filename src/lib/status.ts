import type { AppointmentStatus, Status } from '../types'

export type BadgeVariant = 'success' | 'danger' | 'neutral'
export type SlotVariant = 'available' | 'booked' | 'canceled'

export function statusToBadge(status: Status): BadgeVariant {
  switch (status) {
    case 'ACTIVE':
      return 'success'
    case 'LOCKED':
      return 'danger'
    case 'INACTIVE':
    case 'DELETED':
      return 'neutral'
  }
}

export function appointmentStatusToSlot(status: AppointmentStatus): SlotVariant {
  switch (status) {
    case 'AVAILABLE':
      return 'available'
    case 'BOOKED':
      return 'booked'
    case 'CANCELED':
      return 'canceled'
  }
}
