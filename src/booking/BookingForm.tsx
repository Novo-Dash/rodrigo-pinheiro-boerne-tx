import { useState, useEffect, useRef, useCallback } from 'react'
import type { Program } from './schedule'
import type { BookingData } from './webhook'
import { fetchPrograms, sendLeadWebhook, sendBookingWebhook, toE164 } from './webhook'
import { fbqTrack, ga4Event, gtagConversion, identify, setUserData, GADS_LEAD, GADS_BOOKING } from './analytics'
import { Step1Details } from './Step1Details'
import { Step2Schedule } from './Step2Schedule'
import { Success } from './Success'

type Step = 1 | 2 | 'success'

// Live programs (get_programs, §5.1). `loading` BEFORE first paint — no
// stale/static flash.
export type ProgramsState =
  | { status: 'loading' }
  | { status: 'ready'; programs: Program[] }
  | { status: 'error' }

interface BookingFormProps {
  /** Picks a program to pre-select once the live list arrives (CTA tags). */
  pickInitialProgram?: (programs: Program[]) => Program | null
  onDone?: () => void
  doneLabel?: string
}

function hasMergeTag(value: string): boolean {
  return value.includes('{{') || value.includes('}}')
}

// Prefill from the query string (GHL links with contact merge fields).
// Unresolved merge tags are ignored; E.164 phones get the country code
// stripped before formatting. Read once (lazy state init) — user edits win.
function initialData(): BookingData {
  const data: BookingData = {
    name: '',
    childName: '',
    email: '',
    phone: '',
    program: null,
    date: null,
    time: null,
  }
  if (typeof window === 'undefined') return data
  const params = new URLSearchParams(window.location.search)

  const name = params.get('full_name')
  if (name && !hasMergeTag(name)) data.name = name

  const email = params.get('email')
  if (email && !hasMergeTag(email)) data.email = email

  const phone = params.get('phone')
  if (phone && !hasMergeTag(phone)) {
    let digits = phone.replace(/\D/g, '')
    if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1)
    data.phone =
      digits.length === 10
        ? `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
        : phone
  }
  return data
}

export function BookingForm({ pickInitialProgram, onDone, doneLabel }: BookingFormProps) {
  const [step, setStep] = useState<Step>(1)
  const [data, setData] = useState<BookingData>(initialData)
  const [programs, setPrograms] = useState<ProgramsState>({ status: 'loading' })
  // Lead webhook + Lead events fire once per booking session, even if the
  // user goes back to step 1 and continues again. Reset on completion.
  const leadSent = useRef(false)

  // The single live fetch starts when the form mounts (modal open / /book
  // load); fetchPrograms caches per session, so re-opening doesn't refetch.
  useEffect(() => {
    let cancelled = false
    fetchPrograms()
      .then((list) => {
        if (cancelled) return
        setPrograms({ status: 'ready', programs: list })
        // Apply the CTA pre-selection once, and only if the user hasn't
        // picked a program yet.
        const preferred = pickInitialProgram?.(list) ?? null
        if (preferred) {
          setData((prev) => (prev.program ? prev : { ...prev, program: preferred }))
        }
      })
      .catch(() => {
        if (!cancelled) setPrograms({ status: 'error' })
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = useCallback((patch: Partial<BookingData>) => {
    setData((prev) => {
      const next = { ...prev, ...patch }
      // Changing program invalidates the picked date/time (different calendar).
      if (patch.program && patch.program !== prev.program) {
        next.date = null
        next.time = null
      }
      return next
    })
  }, [])

  const handleNext = useCallback(() => {
    if (!leadSent.current) {
      leadSent.current = true
      const audience = data.program?.audience
      identify({ name: data.name, email: data.email, phone: data.phone }) // Advanced Matching (§7.6.4)
      setUserData(data.email.trim(), toE164(data.phone)) // Enhanced Conversions
      sendLeadWebhook(data)
      fbqTrack('Lead', { content_category: audience })
      ga4Event('generate_lead', { audience })
      gtagConversion(GADS_LEAD)
    }
    setStep(2)
  }, [data])

  const handleConfirm = useCallback(() => {
    const audience = data.program?.audience
    fbqTrack('Schedule', { content_category: audience })
    ga4Event('trial_booked', { audience })
    gtagConversion(GADS_BOOKING)
    sendBookingWebhook(data)
    setStep('success')
  }, [data])

  const handleDone = useCallback(() => {
    setData(initialData())
    setStep(1)
    leadSent.current = false
    onDone?.()
  }, [onDone])

  return (
    <div>
      {step !== 'success' && (
        <div className="mb-5">
          <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)]">
            {step === 1 ? 'Step 1 of 2' : 'Step 2 of 2'}
          </p>
          <h2 className="text-2xl font-bold text-[var(--color-text)]">
            {step === 1 ? 'Reserve Your Free Class' : 'Pick a Date & Time'}
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            {step === 1
              ? 'No experience needed. No commitment.'
              : 'Choose the day and time that work best for you.'}
          </p>
        </div>
      )}

      {step === 1 && (
        <Step1Details data={data} programs={programs} onChange={handleChange} onNext={handleNext} />
      )}
      {step === 2 && (
        <Step2Schedule
          data={data}
          onChange={handleChange}
          onBack={() => setStep(1)}
          onConfirm={handleConfirm}
        />
      )}
      {step === 'success' && <Success data={data} onDone={handleDone} doneLabel={doneLabel} />}
    </div>
  )
}
