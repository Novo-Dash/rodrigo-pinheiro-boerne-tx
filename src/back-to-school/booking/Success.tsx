import { Button } from '@/back-to-school/components/ui'
import { formatDateLong, formatTimeLabel, ACADEMY_ADDRESS } from './schedule'
import type { BookingData } from './webhook'

interface SuccessProps {
  data: BookingData
  onDone: () => void
  doneLabel?: string
}

export function Success({ data, onDone, doneLabel = 'Close' }: SuccessProps) {
  return (
    <div className="flex flex-col items-center gap-5 py-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <circle cx="16" cy="16" r="16" fill="#16a34a" opacity="0.15" />
          <path d="M10 16l4 4 8-8" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-[var(--color-text)]">You&apos;re all set!</h2>
      {data.date && data.time && (
        <p className="text-base text-[var(--color-text-secondary)]">
          Your trial class is booked for{' '}
          <strong className="text-[var(--color-text)]">
            {formatDateLong(data.date)} at {formatTimeLabel(data.time)}
          </strong>
          .
        </p>
      )}
      <div className="text-sm text-[var(--color-text-muted)]">
        <p>{ACADEMY_ADDRESS.street}</p>
        <p>{ACADEMY_ADDRESS.city}</p>
        <a
          href={ACADEMY_ADDRESS.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block underline hover:text-[var(--color-accent)]"
        >
          Get directions
        </a>
      </div>
      <Button onClick={onDone} variant="secondary" size="md">
        {doneLabel}
      </Button>
    </div>
  )
}
