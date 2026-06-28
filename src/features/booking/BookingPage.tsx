import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { appointmentsApi } from '../../api/appointmentsApi'
import { authApi } from '../../api/authApi'
import { ApiClientError } from '../../api/client'
import { useAuth } from '../../contexts/AuthContext'
import { Alert, Button, Modal, useToast } from '../../components/ui'
import type { AppointmentSlotDTO } from '../../types'
import { AppointmentSlot } from './AppointmentSlot'
import { DaySelector } from './DaySelector'
import { MachineCard } from './MachineCard'

function toLocalIso(d: Date): string {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
}

export function BookingPage() {
  const { user, setUser } = useAuth()
  const { show } = useToast()
  const queryClient = useQueryClient()

  const [selectedDate, setSelectedDate] = useState(() => toLocalIso(new Date()))
  const [selectedPilatesId, setSelectedPilatesId] = useState<number | null>(null)
  const [pendingSlot, setPendingSlot] = useState<AppointmentSlotDTO | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)

  const {
    data: slots = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['available-appointments', selectedDate],
    queryFn: () => appointmentsApi.getAvailable(selectedDate),
  })

  const hasCredits = (user?.remainingAppointments ?? 0) > 0

  const machines = [
    ...new Map(
      slots.map((s) => [
        s.pilatesId,
        { id: s.pilatesId, name: s.pilatesName, position: s.pilatesPosition },
      ]),
    ).values(),
  ]

  const slotsForMachine = slots.filter((s) => s.pilatesId === selectedPilatesId)

  function handleDateChange(date: string) {
    setSelectedDate(date)
    setSelectedPilatesId(null)
    setPendingSlot(null)
  }

  function handleMachineSelect(pilatesId: number) {
    setSelectedPilatesId((prev) => (prev === pilatesId ? null : pilatesId))
    setPendingSlot(null)
  }

  function handleSlotSelect(slot: AppointmentSlotDTO) {
    setPendingSlot((prev) => (prev?.id === slot.id ? null : slot))
  }

  function openConfirm() {
    setBookingError(null)
    setIsConfirmOpen(true)
  }

  function closeConfirm() {
    if (isBooking) return
    setIsConfirmOpen(false)
    setBookingError(null)
  }

  async function handleConfirm() {
    if (!pendingSlot) return
    setIsBooking(true)
    setBookingError(null)
    try {
      await appointmentsApi.book(pendingSlot.id)
      const updated = await authApi.me()
      setUser(updated)
      await queryClient.invalidateQueries({ queryKey: ['available-appointments'] })
      setIsConfirmOpen(false)
      setPendingSlot(null)
      setSelectedPilatesId(null)
      show('Termin uspešno rezervisan!')
    } catch (err) {
      setBookingError(
        err instanceof ApiClientError ? err.message : 'Greška pri rezervaciji. Pokušaj ponovo.',
      )
    } finally {
      setIsBooking(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <DaySelector selectedDate={selectedDate} onChange={handleDateChange} />

      {!hasCredits && (
        <Alert variant="warning">
          Nemaš preostalih termina. Kontaktiraj nas za dopunu kredita.
        </Alert>
      )}

      {isError && (
        <Alert variant="error">Greška pri učitavanju termina. Pokušaj ponovo.</Alert>
      )}

      <div className="flex flex-wrap gap-6">
        <div className="flex-1 min-w-64 flex flex-col gap-3">
          <h2 className="text-label text-muted uppercase">Sprave</h2>
          {isLoading ? (
            <div className="flex flex-col gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-surface-sunken animate-pulse" />
              ))}
            </div>
          ) : machines.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border-dashed py-10 text-center text-sm text-muted">
              Nema dostupnih sprava za ovaj dan.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {machines.map((m) => (
                <MachineCard
                  key={m.id}
                  machine={m}
                  state={
                    !hasCredits ? 'disabled' : selectedPilatesId === m.id ? 'selected' : 'available'
                  }
                  onClick={() => hasCredits && handleMachineSelect(m.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-64 flex flex-col gap-3">
          <h2 className="text-label text-muted uppercase">Termini</h2>
          {!selectedPilatesId ? (
            <div className="rounded-xl border border-dashed border-border-dashed py-10 text-center text-sm text-muted">
              Izaberi spravu da vidiš termine.
            </div>
          ) : slotsForMachine.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border-dashed py-10 text-center text-sm text-muted">
              Nema dostupnih termina za ovu spravu.
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                {slotsForMachine.map((slot) => (
                  <AppointmentSlot
                    key={slot.id}
                    slot={slot}
                    isSelected={pendingSlot?.id === slot.id}
                    onClick={() => handleSlotSelect(slot)}
                  />
                ))}
              </div>
              {pendingSlot && (
                <Button variant="primary" size="lg" onClick={openConfirm} className="mt-2">
                  Rezerviši termin
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <Modal open={isConfirmOpen} onClose={closeConfirm} title="Potvrda rezervacije">
        {pendingSlot && (
          <div className="flex flex-col gap-4">
            <div className="bg-surface-subtle rounded-xl p-4 flex flex-col gap-1">
              <p className="text-label text-muted uppercase">Sprava</p>
              <p className="text-md text-ink font-medium">
                {pendingSlot.pilatesName}{' '}
                <span className="text-muted font-normal">#{pendingSlot.pilatesPosition}</span>
              </p>
              <p className="text-label text-muted uppercase mt-2">Termin</p>
              <p className="font-mono text-mono-lg text-ink">
                {pendingSlot.terminStartTime} – {pendingSlot.terminEndTime}
              </p>
              <p className="text-sm text-muted">{pendingSlot.terminDate}</p>
            </div>
            {bookingError && <Alert variant="error">{bookingError}</Alert>}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={closeConfirm}
                disabled={isBooking}
                className="flex-1"
              >
                Otkaži
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirm}
                loading={isBooking}
                className="flex-1"
              >
                Potvrdi
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
