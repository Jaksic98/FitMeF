import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { appointmentsApi } from '../../api/appointmentsApi'
import { authApi } from '../../api/authApi'
import { ApiClientError } from '../../api/client'
import { useAuth } from '../../contexts/AuthContext'
import { Alert, Button, Modal, useToast } from '../../components/ui'
import type { AppointmentSlotDTO } from '../../types'
import { AppointmentSlot } from '../booking/AppointmentSlot'
import { DaySelector } from '../booking/DaySelector'
import { MachineCard } from '../booking/MachineCard'

const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000

function toLocalIso(d: Date): string {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')
}

function canCancel(slot: AppointmentSlotDTO): boolean {
  const start = new Date(`${slot.terminDate}T${slot.terminStartTime}:00`)
  return new Date() < new Date(start.getTime() - TWELVE_HOURS_MS)
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('sr-RS', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function MyAppointmentsPage() {
  const { user, setUser } = useAuth()
  const { show } = useToast()
  const queryClient = useQueryClient()

  const [cancelTarget, setCancelTarget] = useState<AppointmentSlotDTO | null>(null)
  const [isCanceling, setIsCanceling] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)

  const [rescheduleTarget, setRescheduleTarget] = useState<AppointmentSlotDTO | null>(null)
  const [rescheduleDate, setRescheduleDate] = useState(() => toLocalIso(new Date()))
  const [rescheduleSelectedPilatesId, setRescheduleSelectedPilatesId] = useState<number | null>(null)
  const [rescheduleSelectedSlot, setRescheduleSelectedSlot] = useState<AppointmentSlotDTO | null>(null)
  const [isRescheduling, setIsRescheduling] = useState(false)
  const [rescheduleError, setRescheduleError] = useState<string | null>(null)

  const {
    data: slots = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['my-appointments', user?.id],
    queryFn: () => appointmentsApi.getMyAppointments(user!.id),
    enabled: !!user,
  })

  const booked = slots.filter((s) => s.status === 'BOOKED')

  const { data: availableSlots = [], isLoading: isLoadingAvailable } = useQuery({
    queryKey: ['available-appointments', rescheduleDate],
    queryFn: () => appointmentsApi.getAvailable(rescheduleDate),
    enabled: !!rescheduleTarget,
  })

  const rescheduleMachines = [
    ...new Map(
      availableSlots.map((s) => [
        s.pilatesId,
        { id: s.pilatesId, name: s.pilatesName, position: s.pilatesPosition },
      ]),
    ).values(),
  ]

  const rescheduleSlotsForMachine = availableSlots.filter(
    (s) => s.pilatesId === rescheduleSelectedPilatesId,
  )

  function openCancel(slot: AppointmentSlotDTO) {
    setCancelTarget(slot)
    setCancelError(null)
  }

  function closeCancel() {
    if (isCanceling) return
    setCancelTarget(null)
    setCancelError(null)
  }

  async function handleConfirmCancel() {
    if (!cancelTarget) return
    setIsCanceling(true)
    setCancelError(null)
    try {
      await appointmentsApi.cancel(cancelTarget.id)
      await queryClient.invalidateQueries({ queryKey: ['my-appointments'] })
      setCancelTarget(null)
      show('Termin otkazan.')
    } catch (err) {
      setCancelError(
        err instanceof ApiClientError ? err.message : 'Greška pri otkazivanju. Pokušaj ponovo.',
      )
    } finally {
      setIsCanceling(false)
    }
  }

  function openReschedule(slot: AppointmentSlotDTO) {
    setRescheduleTarget(slot)
    setRescheduleDate(toLocalIso(new Date()))
    setRescheduleSelectedPilatesId(null)
    setRescheduleSelectedSlot(null)
    setRescheduleError(null)
  }

  function closeReschedule() {
    if (isRescheduling) return
    setRescheduleTarget(null)
    setRescheduleError(null)
  }

  function handleRescheduleDateChange(date: string) {
    setRescheduleDate(date)
    setRescheduleSelectedPilatesId(null)
    setRescheduleSelectedSlot(null)
  }

  function handleRescheduleMachineSelect(pilatesId: number) {
    setRescheduleSelectedPilatesId((prev) => (prev === pilatesId ? null : pilatesId))
    setRescheduleSelectedSlot(null)
  }

  async function handleConfirmReschedule() {
    if (!rescheduleTarget || !rescheduleSelectedSlot) return
    setIsRescheduling(true)
    setRescheduleError(null)
    try {
      await appointmentsApi.reschedule(rescheduleTarget.id, rescheduleSelectedSlot.id)
      const updated = await authApi.me()
      setUser(updated)
      await queryClient.invalidateQueries({ queryKey: ['my-appointments'] })
      await queryClient.invalidateQueries({ queryKey: ['available-appointments'] })
      setRescheduleTarget(null)
      show('Termin uspešno premešten.')
    } catch (err) {
      setRescheduleError(
        err instanceof ApiClientError
          ? err.message
          : 'Greška pri pomeranju termina. Pokušaj ponovo.',
      )
    } finally {
      setIsRescheduling(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-24 rounded-card bg-surface-sunken animate-pulse" />
        ))}
      </div>
    )
  }

  if (isError) {
    return <Alert variant="error">Greška pri učitavanju termina. Pokušaj ponovo.</Alert>
  }

  return (
    <div className="flex flex-col gap-4">
      {booked.length === 0 ? (
        <div className="border-2 border-dashed border-border-dashed rounded-panel p-12 flex flex-col items-center justify-center text-center gap-3">
          <p className="text-md text-muted">Nemate rezervisanih termina.</p>
        </div>
      ) : (
        booked.map((slot) => {
          const cancellable = canCancel(slot)
          return (
            <div
              key={slot.id}
              className="bg-surface border border-border-card rounded-card p-5 flex flex-wrap items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-ink">
                  {slot.pilatesName}{' '}
                  <span className="font-normal text-muted">#{slot.pilatesPosition}</span>
                </p>
                <p className="font-mono text-mono-lg text-ink leading-none mt-1">
                  {slot.terminStartTime} – {slot.terminEndTime}
                </p>
                <p className="text-sm text-muted mt-1">{formatDate(slot.terminDate)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {cancellable ? (
                  <>
                    <Button variant="secondary" size="nav" onClick={() => openReschedule(slot)}>
                      Premesti
                    </Button>
                    <Button variant="danger-outline" size="nav" onClick={() => openCancel(slot)}>
                      Otkaži
                    </Button>
                  </>
                ) : (
                  <span className="text-sm text-warning font-medium flex items-center gap-1.5">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M7 11V7a5 5 0 0110 0v4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    Zaključano
                  </span>
                )}
              </div>
            </div>
          )
        })
      )}

      <Modal open={!!cancelTarget} onClose={closeCancel} title="Otkazivanje termina">
        {cancelTarget && (
          <div className="flex flex-col gap-4">
            <div className="bg-surface-subtle rounded-xl p-4 flex flex-col gap-1">
              <p className="text-label text-muted uppercase">Sprava</p>
              <p className="text-md text-ink font-medium">
                {cancelTarget.pilatesName}{' '}
                <span className="text-muted font-normal">#{cancelTarget.pilatesPosition}</span>
              </p>
              <p className="text-label text-muted uppercase mt-2">Termin</p>
              <p className="font-mono text-mono-lg text-ink">
                {cancelTarget.terminStartTime} – {cancelTarget.terminEndTime}
              </p>
              <p className="text-sm text-muted">{formatDate(cancelTarget.terminDate)}</p>
            </div>
            <Alert variant="warning">Kredit se ne vraća pri otkazivanju.</Alert>
            {cancelError && <Alert variant="error">{cancelError}</Alert>}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={closeCancel}
                disabled={isCanceling}
                className="flex-1"
              >
                Nazad
              </Button>
              <Button
                variant="danger-outline"
                onClick={handleConfirmCancel}
                loading={isCanceling}
                className="flex-1"
              >
                Otkaži termin
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!rescheduleTarget} onClose={closeReschedule} title="Pomeranje termina">
        {rescheduleTarget && (
          <div className="flex flex-col gap-4">
            <Alert variant="danger">
              Pomeraš: {rescheduleTarget.pilatesName} {rescheduleTarget.terminStartTime}–
              {rescheduleTarget.terminEndTime} ({formatDate(rescheduleTarget.terminDate)})
            </Alert>
            <DaySelector selectedDate={rescheduleDate} onChange={handleRescheduleDateChange} />
            {isLoadingAvailable ? (
              <div className="flex flex-col gap-2">
                {[0, 1].map((i) => (
                  <div key={i} className="h-14 rounded-xl bg-surface-sunken animate-pulse" />
                ))}
              </div>
            ) : rescheduleMachines.length === 0 ? (
              <p className="text-sm text-muted text-center py-4">
                Nema dostupnih sprava za ovaj dan.
              </p>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  {rescheduleMachines.map((m) => (
                    <MachineCard
                      key={m.id}
                      machine={m}
                      state={rescheduleSelectedPilatesId === m.id ? 'selected' : 'available'}
                      onClick={() => handleRescheduleMachineSelect(m.id)}
                    />
                  ))}
                </div>
                {rescheduleSelectedPilatesId && (
                  <div className="flex flex-col gap-2">
                    {rescheduleSlotsForMachine.length === 0 ? (
                      <p className="text-sm text-muted text-center py-2">
                        Nema slobodnih termina za ovu spravu.
                      </p>
                    ) : (
                      rescheduleSlotsForMachine.map((slot) => (
                        <AppointmentSlot
                          key={slot.id}
                          slot={slot}
                          isSelected={rescheduleSelectedSlot?.id === slot.id}
                          onClick={() =>
                            setRescheduleSelectedSlot((prev) =>
                              prev?.id === slot.id ? null : slot,
                            )
                          }
                        />
                      ))
                    )}
                  </div>
                )}
              </>
            )}
            {rescheduleError && <Alert variant="error">{rescheduleError}</Alert>}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={closeReschedule}
                disabled={isRescheduling}
                className="flex-1"
              >
                Otkaži
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmReschedule}
                loading={isRescheduling}
                disabled={!rescheduleSelectedSlot}
                className="flex-1"
              >
                Potvrdi premeštanje
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
