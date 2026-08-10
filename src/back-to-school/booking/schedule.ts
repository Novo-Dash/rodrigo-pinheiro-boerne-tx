// Booking schedule — types + pure date/time helpers.
//
// The program list does NOT live here (spec §5): programs AND their slots come
// live from GHL in one call (get_programs via n8n, §5.1 — see
// webhook.fetchPrograms). A `Program` is the object n8n delivers. This module
// keeps only what GHL can't know: per-academy exceptions and fixed constants.

export type Audience = 'adults' | 'kids'

/** A program exactly as the shared n8n workflow returns it (§5.1). Nothing
 *  here is ever written by hand. */
export interface Program {
  /** Matches the calendar on Webhook 2 (immune to renames). */
  calendar_id: string
  /** GHL calendar name = `program` on Webhook 1. */
  name: string
  /** From the calendar's group in GHL — never recomputed from the name. */
  audience: Audience
  duration_minutes: number | null
  capacity: number
  /** "YYYY-MM-DD" -> ["HH:MM", ...] local wall-clock times. */
  slots: SlotsMap
  slots_error: string | null
}

/**
 * Exceptions, and ONLY exceptions. Key = calendar_id.
 *   label -> display alias when the GHL name doesn't fit the public
 *   hide  -> not shown on the page (e.g. 1:1, private assessment)
 * A calendar without an entry here shows normally, under its own GHL name.
 * Starts EMPTY on a new academy; only filled when someone asks.
 */
export const PROGRAM_OVERRIDES: Record<string, { label?: string; hide?: true }> = {}

/** Display alias is visual only — webhooks always carry the raw GHL name. */
export function displayName(program: Program): string {
  return PROGRAM_OVERRIDES[program.calendar_id]?.label ?? program.name
}

// Fixed default, identical across academies. Buffer/lead-time is enforced by
// GHL itself on the free-slots side.
export const BOOKING_RANGE_DAYS = 14

export const ACADEMY_ADDRESS = {
  street: '28255 Frontage Rd Suite 103',
  city: 'Boerne, TX 78006',
  mapsUrl: 'https://maps.app.goo.gl/Z4EffdTNcPicS2sK8',
}

export type SlotsMap = Record<string, string[]>

export function getBookingWindow(): { min: Date; max: Date } {
  const min = new Date()
  min.setHours(0, 0, 0, 0)
  const max = new Date(min)
  max.setDate(max.getDate() + BOOKING_RANGE_DAYS)
  return { min, max }
}

// Local YYYY-MM-DD — never toISOString(), UTC can shift the day.
export function isoDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Times for a day, reading the program's live GHL slot map (§5.1).
export function getTimesForDay(program: Program, date: Date): string[] {
  return program.slots[isoDate(date)] ?? []
}

export function isDateBookable(program: Program, date: Date): boolean {
  const { min, max } = getBookingWindow()
  const day = new Date(date)
  day.setHours(0, 0, 0, 0)
  if (day < min || day > max) return false
  return getTimesForDay(program, date).length > 0
}

export function getFirstBookableDate(program: Program): Date | null {
  const { min } = getBookingWindow()
  for (let i = 0; i <= BOOKING_RANGE_DAYS; i++) {
    const d = new Date(min)
    d.setDate(d.getDate() + i)
    if (isDateBookable(program, d)) return d
  }
  return null
}

// "18:00" -> "6:00 PM". Produces appointment_time — n8n's Luxon parser
// requires 12h with AM/PM, never 24h.
export function formatTimeLabel(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

export function formatDateLong(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}
