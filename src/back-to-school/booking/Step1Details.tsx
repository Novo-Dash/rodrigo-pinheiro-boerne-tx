import { useRef, useEffect } from 'react'
import { Button } from '@/back-to-school/components/ui'
import { displayName } from './schedule'
import type { BookingData } from './webhook'
import type { ProgramsState } from './BookingForm'

const ACADEMY_PHONE = '+1 (210) 867-6156'
const ACADEMY_PHONE_HREF = 'tel:+12108676156'

interface Step1DetailsProps {
  data: BookingData
  programs: ProgramsState
  onChange: (patch: Partial<BookingData>) => void
  onNext: () => void
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '')
  return digits.length === 10 || (digits.length === 11 && digits.startsWith('1'))
}

export function isStep1Valid(data: BookingData): boolean {
  if (data.name.trim().length < 2) return false
  if (!isValidEmail(data.email)) return false
  if (!isValidPhone(data.phone)) return false
  if (!data.program) return false
  if (data.program.audience === 'kids' && data.childName.trim().length < 2) return false
  return true
}

export function Step1Details({ data, programs, onChange, onNext }: Step1DetailsProps) {
  // Audience comes from GHL (calendar group) — never recomputed from the name.
  const isKids = data.program?.audience === 'kids'
  const childRef = useRef<HTMLInputElement>(null)
  const prevKids = useRef(isKids)

  // When a kids program is picked, reveal the child field, scroll to it and focus.
  useEffect(() => {
    if (isKids && !prevKids.current) {
      childRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      childRef.current?.focus({ preventScroll: true })
    }
    prevKids.current = isKids
  }, [isKids])

  const valid = isStep1Valid(data)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (valid) onNext()
      }}
      noValidate
    >
      <div className="grid gap-4">
        <Field label="Your Name">
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            autoComplete="name"
            required
            className={inputClass}
            placeholder="Sarah Johnson"
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Email">
            <input
              type="email"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              autoComplete="email"
              required
              className={inputClass}
              placeholder="sarah@email.com"
            />
          </Field>
          <Field label="Phone">
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => onChange({ phone: formatPhone(e.target.value) })}
              autoComplete="tel"
              required
              className={inputClass}
              placeholder="(210) 000-0000"
            />
          </Field>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-[var(--color-text)]">Program</legend>

          {/* Live list from GHL (get_programs, §5.1): loading before paint,
              never a static list. */}
          {programs.status === 'loading' && (
            <div role="status" className="flex min-h-24 flex-col items-center justify-center gap-2 py-4">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)]" />
              <p className="text-sm text-[var(--color-text-muted)]">Loading programs…</p>
            </div>
          )}

          {(programs.status === 'error' ||
            (programs.status === 'ready' && programs.programs.length === 0)) && (
            <p
              role="alert"
              className="rounded-[var(--radius-sm)] bg-[var(--color-accent-subtle)] px-4 py-3 text-sm text-[var(--color-text-secondary)]"
            >
              We couldn&apos;t load our programs right now. Please call us at{' '}
              <a href={ACADEMY_PHONE_HREF} className="font-semibold underline">
                {ACADEMY_PHONE}
              </a>{' '}
              and we&apos;ll get you on the mat.
            </p>
          )}

          {programs.status === 'ready' && programs.programs.length > 0 && (
            <div className="grid gap-2">
              {programs.programs.map((p) => (
                <label
                  key={p.calendar_id}
                  className={`flex cursor-pointer items-center gap-3 rounded-[var(--radius-sm)] border px-4 py-3 transition-colors ${
                    data.program?.calendar_id === p.calendar_id
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)]'
                      : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]'
                  }`}
                >
                  <input
                    type="radio"
                    name="program"
                    value={p.calendar_id}
                    checked={data.program?.calendar_id === p.calendar_id}
                    onChange={() => onChange({ program: p })}
                    className="h-4 w-4 accent-[var(--color-accent)]"
                  />
                  <span className="text-sm font-medium text-[var(--color-text)]">{displayName(p)}</span>
                </label>
              ))}
            </div>
          )}
        </fieldset>

        {isKids && (
          <Field label="Child's Name">
            <input
              ref={childRef}
              type="text"
              value={data.childName}
              onChange={(e) => onChange({ childName: e.target.value })}
              required
              className={inputClass}
              placeholder="Alex Johnson"
            />
          </Field>
        )}

        <Button type="submit" className="mt-2 w-full" size="lg" disabled={!valid}>
          Continue
        </Button>

        <p className="text-center text-xs text-[var(--color-text-muted)]">
          By submitting, you agree to be contacted about your class.
        </p>
      </div>
    </form>
  )
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--color-text)]">{label}</label>
      {children}
    </div>
  )
}

const inputClass =
  'h-[48px] w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-base text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-dark)] transition-shadow'
