'use client'

import { Calendar, Clock, Loader2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

export function AppointmentPicker({ selectedDate, selectedStartMs, onSelectDate, onSelectSlot, disabled }) {
  const [dates, setDates] = useState([])
  const [slots, setSlots] = useState([])
  const [loadingDates, setLoadingDates] = useState(true)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoadingDates(true)
      setError('')
      try {
        const res = await fetch('/api/appointments/slots', { cache: 'no-store', credentials: 'same-origin' })
        const body = await res.json()
        if (!res.ok) throw new Error(body.error || 'Could not load dates')
        if (cancelled) return
        const list = body.bookableDates ?? []
        setDates(list)
        if (list.length && !selectedDate) onSelectDate(list[0].value)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load calendar')
      } finally {
        if (!cancelled) setLoadingDates(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [onSelectDate])

  const loadSlots = useCallback(async (date) => {
    if (!date) return
    setLoadingSlots(true)
    setError('')
    try {
      const res = await fetch(`/api/appointments/slots?date=${encodeURIComponent(date)}`, {
        cache: 'no-store',
        credentials: 'same-origin',
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || 'Could not load times')
      setSlots(body.slots ?? [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load times')
      setSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }, [])

  useEffect(() => {
    if (selectedDate) loadSlots(selectedDate)
  }, [selectedDate, loadSlots])

  return (
    <div className="space-y-4">
      <p className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Clock className="h-4 w-4 shrink-0 text-tpr-accent" aria-hidden />
        All times shown in Eastern Time (Mon–Sat, 8:00 AM – 7:00 PM). Each visit reserves a 90-minute window.
      </p>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div>
        <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <Calendar className="h-4 w-4 text-tpr-accent" aria-hidden />
          Select a date
        </p>
        {loadingDates ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Loading dates…
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {dates.map((d) => (
              <button
                key={d.value}
                type="button"
                disabled={disabled}
                onClick={() => onSelectDate(d.value)}
                className={`min-h-11 rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-all ${
                  selectedDate === d.value
                    ? 'border-tpr-accent bg-tpr-accent text-white'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-tpr-accent'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedDate && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Select a time</p>
          {loadingSlots ? (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Loading times…
            </div>
          ) : slots.length === 0 ? (
            <p className="text-sm text-slate-600">No open times on this date. Please choose another day.</p>
          ) : (
            <div className="grid max-h-48 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
              {slots.map((slot) => (
                <button
                  key={slot.startMs}
                  type="button"
                  disabled={disabled}
                  onClick={() => onSelectSlot(slot.startMs)}
                  className={`min-h-11 rounded-lg border-2 px-2 py-2 text-sm font-semibold transition-all ${
                    selectedStartMs === slot.startMs
                      ? 'border-tpr-accent bg-tpr-accent/10 text-tpr-accent ring-2 ring-tpr-accent/25'
                      : 'border-slate-200 bg-white text-slate-800 hover:border-tpr-accent'
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
