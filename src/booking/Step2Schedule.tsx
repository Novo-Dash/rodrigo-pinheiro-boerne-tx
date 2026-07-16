import { useState, useEffect } from 'react'
import { Button } from '@/components/ui'
import type { Program, SlotsMap } from './schedule'
import { getTimesForDay, getFirstBookableDate, formatTimeLabel, formatDateLong } from './schedule'
import { fetchSlots } from './webhook'
import { Calendar } from './Calendar'
import type { BookingData } from './webhook'

interface Step2ScheduleProps {
  data: BookingData
  onChange: (patch: Partial<BookingData>) => void
  onBack: () => void
  onConfirm: () => void
}

type SlotsState =
  | { status: 'loading' }
  | { status: 'ready'; slots: SlotsMap }
  | { status: 'error' }

export function Step2Schedule({ data, onChange, onBack, onConfirm }: Step2ScheduleProps) {
  const program = data.program as Program
  // Loading is the initial state — nothing is painted before slots resolve,
  // so there is no flash of a stale/static schedule.
  const [state, setState] = useState<SlotsState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })
    fetchSlots(program)
      .then((slots) => {
        if (!cancelled) setState({ status: 'ready', slots })
      })
      .catch((err) => {
        console.warn('[booking] get_slots failed, using fallback schedule', err)
        if (!cancelled) setState({ status: 'error' })
      })
    return () => {
      cancelled = true
    }
  }, [program])

  const slots = state.status === 'ready' ? state.slots : null

  // Once slots arrive, open on the first bookable date and pre-select it.
  useEffect(() => {
    if (state.status === 'loading' || data.date) return
    const first = getFirstBookableDate(slots, program)
    if (first) selectDate(first)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status])

  function selectDate(date: Date) {
    const times = getTimesForDay(slots, program, date)
    // A day with a single available time comes pre-selected.
    onChange({ date, time: times.length === 1 ? times[0] : null })
  }

  if (state.status === 'loading') {
    return (
      <div className="flex flex-col items-center gap-4 py-14">
        <Spinner />
        <p className="text-base font-medium text-[var(--color-text-muted)]">Loading available times…</p>
      </div>
    )
  }

  const times = data.date ? getTimesForDay(slots, program, data.date) : []
  const canConfirm = !!data.date && !!data.time

  return (
    <div className="grid gap-5">
      {state.status === 'error' && (
        <p className="rounded-[var(--radius-sm)] bg-[var(--color-accent-subtle)] px-4 py-3 text-sm text-[var(--color-text-secondary)]" role="alert">
          We couldn&apos;t load live availability — showing our regular schedule. Your booking
          will still be confirmed by our team.
        </p>
      )}

      <Calendar program={program} slots={slots} selected={data.date} onSelect={selectDate} />

      {data.date && (
        <div>
          <p className="mb-2 text-sm font-medium text-[var(--color-text)]">
            Times for {formatDateLong(data.date)}
          </p>
          {times.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">No times available for this day.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {times.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onChange({ time: t })}
                  aria-pressed={data.time === t}
                  className={`h-[44px] rounded-[var(--radius-sm)] border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                    data.time === t
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
                      : 'border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)]'
                  }`}
                >
                  {formatTimeLabel(t)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button type="button" variant="secondary" size="lg" onClick={onBack}>
          Back
        </Button>
        <Button type="button" size="lg" className="flex-1" disabled={!canConfirm} onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin" width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="16" stroke="var(--color-border)" strokeWidth="4" />
      <path d="M20 4a16 16 0 0 1 16 16" stroke="var(--color-accent)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}
