// Booking schedule config for RPBJJ Boerne.
// PROGRAM_LABEL must match the GHL calendar names exactly (it is sent as
// `program` in the lead webhook). Calendar matching in n8n is done by id
// (PROGRAM_CALENDAR_ID), which is immune to renames.

export type Program =
  | 'adults-jj'
  | 'adults-wrestling'
  | 'women'
  | 'kids-4-8'
  | 'kids-9-13'

export type Audience = 'adults' | 'kids'

export const PROGRAMS: Program[] = [
  'adults-jj',
  'adults-wrestling',
  'women',
  'kids-4-8',
  'kids-9-13',
]

export const PROGRAM_LABEL: Record<Program, string> = {
  'adults-jj': 'Adults Jiu-Jitsu',
  'adults-wrestling': 'Adults Wrestling',
  women: "Women's Class of Jiu-Jitsu",
  'kids-4-8': 'Kids (4-8 years) Jiu-Jitsu',
  'kids-9-13': 'Kids (9-13 Years) Jiu-Jitsu',
}

export const PROGRAM_AUDIENCE: Record<Program, Audience> = {
  'adults-jj': 'adults',
  'adults-wrestling': 'adults',
  women: 'adults',
  'kids-4-8': 'kids',
  'kids-9-13': 'kids',
}

export const PROGRAM_CALENDAR_ID: Record<Program, string> = {
  'adults-jj': 'y1P80txvhjcNVKu9AwuU',
  'adults-wrestling': '1AJgHFRRa3pYPUxl5Rsm',
  women: 'bDsWioTBKPgk9AnR1Xh6',
  'kids-4-8': 'ximUFAjn8dqixF5nOHZv',
  'kids-9-13': 'ExbMYzPlGtEjf3Eh6jGU',
}

// Fixed defaults, identical across academies. Live buffer/lead-time is
// enforced by GHL free-slots; BUFFER_HOURS only applies to the static fallback.
export const BOOKING_RANGE_DAYS = 14
export const BUFFER_HOURS = 5

export const ACADEMY_ADDRESS = {
  street: '28255 Frontage Rd Suite 103',
  city: 'Boerne, TX 78006',
  mapsUrl: 'https://maps.app.goo.gl/Z4EffdTNcPicS2sK8',
}

// Minimal static schedule, used ONLY as a fallback when the live slot fetch
// fails. Keys are JS weekday indexes (0 = Sunday).
const FALLBACK_SCHEDULE: Record<Program, Record<number, string[]>> = {
  'adults-jj': { 1: ['18:00'], 3: ['18:00'], 5: ['18:00'] },
  'adults-wrestling': { 2: ['18:00'], 4: ['18:00'] },
  women: { 2: ['18:00'], 4: ['18:00'] },
  'kids-4-8': { 1: ['17:00'], 3: ['17:00'] },
  'kids-9-13': { 1: ['17:00'], 3: ['17:00'] },
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

export function getFallbackTimesForDay(program: Program, date: Date): string[] {
  const times = FALLBACK_SCHEDULE[program][date.getDay()] ?? []
  const now = new Date()
  return times.filter((t) => {
    const [h, m] = t.split(':').map(Number)
    const slot = new Date(date)
    slot.setHours(h, m, 0, 0)
    return slot.getTime() - now.getTime() >= BUFFER_HOURS * 60 * 60 * 1000
  })
}

// Times for a day, reading the live GHL map (fallback schedule on error).
export function getTimesForDay(slots: SlotsMap | null, program: Program, date: Date): string[] {
  if (slots) return slots[isoDate(date)] ?? []
  return getFallbackTimesForDay(program, date)
}

export function isDateBookable(slots: SlotsMap | null, program: Program, date: Date): boolean {
  const { min, max } = getBookingWindow()
  const day = new Date(date)
  day.setHours(0, 0, 0, 0)
  if (day < min || day > max) return false
  return getTimesForDay(slots, program, date).length > 0
}

export function getFirstBookableDate(slots: SlotsMap | null, program: Program): Date | null {
  const { min } = getBookingWindow()
  for (let i = 0; i <= BOOKING_RANGE_DAYS; i++) {
    const d = new Date(min)
    d.setDate(d.getDate() + i)
    if (isDateBookable(slots, program, d)) return d
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
