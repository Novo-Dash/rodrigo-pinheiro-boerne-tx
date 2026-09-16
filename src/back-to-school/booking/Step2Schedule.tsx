import { useEffect } from 'react'
import { Button } from '@/back-to-school/components/ui'
import { getTimesForDay, getFirstBookableDate, formatTimeLabel, formatDateLong } from './schedule'
import { Calendar } from './Calendar'
import type { BookingData } from './webhook'

const ACADEMY_PHONE = '+1 (830) 816-0484'
const ACADEMY_PHONE_HREF = 'tel:+18308160484'

interface Step2ScheduleProps {
  data: BookingData
  onChange: (patch: Partial<BookingData>) => void
  onBack: () => void
  onConfirm: () => void
}

export function Step2Schedule({ data, onChange, onBack, onConfirm }: Step2ScheduleProps) {
  // Slots arrived WITH the program in the single get_programs call (§5.1) —
  // no second fetch, no second wait.
  const program = data.program

  // Entering the step: open the calendar on the first available date and
  // preselect it; a single available time comes preselected too (§2).
  useEffect(() => {
    if (!program || data.date) return
    const first = getFirstBookableDate(program)
    if (first) selectDate(first)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program])

  if (!program) return null

  function selectDate(date: Date) {
    if (!program) return
    const times = getTimesForDay(program, date)
    // A day with a single available time comes pre-selected.
    onChange({ date, time: times.length === 1 ? times[0] : null })
  }

  const times = data.date ? getTimesForDay(program, data.date) : []
  const firstBookable = getFirstBookableDate(program)
  const noAvailability = program.slots_error !== null || !firstBookable
  const canConfirm = !!data.date && !!data.time

  return (
    <div className="grid gap-5">
      {noAvailability ? (
        <p className="rounded-[var(--radius-sm)] bg-[var(--color-accent-subtle)] px-4 py-3 text-sm text-[var(--color-text-secondary)]">
          No times are available for this program right now. Give us a call at{' '}
          <a href={ACADEMY_PHONE_HREF} className="font-semibold underline">
            {ACADEMY_PHONE}
          </a>{' '}
          and we&apos;ll get you on the mats.
        </p>
      ) : (
        <>
          <Calendar program={program} selected={data.date} onSelect={selectDate} />

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
                      className={`h-[44px] rounded-[var(--radius-sm)] border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-dark)] ${
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
        </>
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
