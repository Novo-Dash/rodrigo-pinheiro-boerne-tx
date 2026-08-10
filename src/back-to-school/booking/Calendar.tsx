import { useState, useEffect } from 'react'
import type { Program } from './schedule'
import { isDateBookable, formatMonthYear, isoDate } from './schedule'

interface CalendarProps {
  program: Program
  selected: Date | null
  onSelect: (date: Date) => void
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export function Calendar({ program, selected, onSelect }: CalendarProps) {
  const [viewMonth, setViewMonth] = useState<Date>(() => {
    const base = selected ?? new Date()
    return new Date(base.getFullYear(), base.getMonth(), 1)
  })

  // Keep the visible month in sync when the selection changes externally
  // (e.g. the first bookable date is pre-selected after slots load).
  useEffect(() => {
    if (selected) setViewMonth(new Date(selected.getFullYear(), selected.getMonth(), 1))
  }, [selected])

  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (Date | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ]

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewMonth(new Date(year, month - 1, 1))}
          className="flex h-[36px] w-[36px] items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-dark)]"
          aria-label="Previous month"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <p className="text-sm font-semibold text-[var(--color-text)]">{formatMonthYear(viewMonth)}</p>
        <button
          type="button"
          onClick={() => setViewMonth(new Date(year, month + 1, 1))}
          className="flex h-[36px] w-[36px] items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-dark)]"
          aria-label="Next month"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((d) => (
          <span key={d} className="text-xs font-medium uppercase text-[var(--color-text-muted)]">
            {d}
          </span>
        ))}
        {cells.map((date, i) =>
          date ? (
            <DayCell
              key={isoDate(date)}
              date={date}
              bookable={isDateBookable(program, date)}
              selected={!!selected && isoDate(selected) === isoDate(date)}
              onSelect={onSelect}
            />
          ) : (
            <span key={`pad-${i}`} />
          )
        )}
      </div>
    </div>
  )
}

function DayCell({
  date,
  bookable,
  selected,
  onSelect,
}: {
  date: Date
  bookable: boolean
  selected: boolean
  onSelect: (date: Date) => void
}) {
  return (
    <button
      type="button"
      disabled={!bookable}
      onClick={() => onSelect(date)}
      aria-pressed={selected}
      className={`mx-auto flex h-[36px] w-[36px] items-center justify-center rounded-full text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-dark)] ${
        selected
          ? 'bg-[var(--color-accent)] font-semibold text-white'
          : bookable
            ? 'font-medium text-[var(--color-text)] hover:bg-[var(--color-accent-subtle)]'
            : 'cursor-default text-[var(--color-placeholder)]'
      }`}
    >
      {date.getDate()}
    </button>
  )
}
