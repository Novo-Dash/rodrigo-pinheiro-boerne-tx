import { useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { ModalTag } from '@/back-to-school/hooks/useModal'
import type { Program } from '@/back-to-school/booking/schedule'
import { BookingForm } from '@/back-to-school/booking/BookingForm'
import { BrandPanel } from '@/back-to-school/booking/BrandPanel'

interface BookingModalProps {
  isOpen: boolean
  defaultTag: ModalTag
  onClose: () => void
}

// CTA tags pre-select a program from the LIVE list where unambiguous. This is
// UI convenience only (no match -> nothing pre-selected, the user picks); the
// audience used for logic always comes from GHL, never from the name. 'kids'
// stays unselected — there can be several kids programs, the parent picks one.
const TAG_TO_PICKER: Record<Exclude<ModalTag, null>, (programs: Program[]) => Program | null> = {
  adults: (programs) =>
    programs.find((p) => p.audience === 'adults' && !/women/i.test(p.name)) ?? null,
  women: (programs) => programs.find((p) => /women/i.test(p.name)) ?? null,
  kids: () => null,
  both: () => null,
}

export function BookingModal({ isOpen, defaultTag, onClose }: BookingModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) onClose()
    },
    [onClose]
  )

  if (!isOpen) return null

  const pickInitialProgram = defaultTag ? TAG_TO_PICKER[defaultTag] : undefined

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 backdrop-blur-sm p-0 md:items-center md:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Reserve Your Free Class"
      onClick={handleOverlayClick}
    >
      <div className="relative grid max-h-[90dvh] w-full max-w-[960px] grid-cols-1 overflow-hidden rounded-t-[var(--radius-lg)] bg-white shadow-[var(--shadow-lg)] md:grid-cols-[2fr_3fr] md:rounded-[var(--radius-lg)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-[44px] w-[44px] items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-dark)]"
          aria-label="Close modal"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Left: brand panel (fixed). Right: the shared form — the only part
            that scrolls if the viewport is short; the modal itself never does. */}
        <BrandPanel />
        <div className="overflow-y-auto px-6 py-7 md:px-8 md:py-8">
          <BookingForm pickInitialProgram={pickInitialProgram} onDone={onClose} />
        </div>
      </div>
    </div>,
    document.body
  )
}
