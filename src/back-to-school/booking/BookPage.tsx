import { useEffect } from 'react'
import { BookingForm } from './BookingForm'
import { BrandPanel } from './BrandPanel'
import { fbqTrack, ga4Event } from './analytics'

// Standalone booking page (/book): no site navigation, same two-column
// layout and the exact same <BookingForm /> as the modal.
export function BookPage() {
  // /book has no "open modal" moment — ViewContent fires on mount.
  useEffect(() => {
    fbqTrack('ViewContent', { content_name: 'Trial Booking' })
    ga4Event('view_content', { content_name: 'Trial Booking' })
  }, [])

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[var(--color-bg)] px-4 py-10 md:py-16">
      {/* Brand-palette background: soft accent glow + hairline grid with radial mask */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(600px 400px at 50% 0%, rgba(var(--accent-rgb), 0.10), transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(0,0,0,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.045) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)',
        }}
      />

      <div className="relative mx-auto w-full max-w-[960px]">
        <div className="grid grid-cols-1 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] border-t-4 border-t-[var(--color-accent)] bg-white shadow-[var(--shadow-md)] md:grid-cols-[2fr_3fr]">
          <BrandPanel />
          <div className="px-6 py-7 md:px-8 md:py-8">
            <BookingForm doneLabel="Book another class" />
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
          Rodrigo Pinheiro BJJ &middot; Boerne, TX
        </p>
      </div>
    </div>
  )
}
