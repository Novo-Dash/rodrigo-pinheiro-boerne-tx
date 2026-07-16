import type { Program } from './schedule'
import { PROGRAM_LABEL, PROGRAM_AUDIENCE, PROGRAM_CALENDAR_ID, isoDate, formatTimeLabel } from './schedule'
import type { SlotsMap } from './schedule'
import { getAttribution } from './attribution'

// FIXED for all academies — the shared n8n workflow. Do not parameterize.
const N8N_ORIGIN = 'https://n8n.novodash.com'
const N8N_PATH = 'webhook'
const BOOKING_WEBHOOK_URL = `${N8N_ORIGIN}/${N8N_PATH}/landing-page-booking`

// location_id defined once; the lead webhook URL is derived from it (the
// location_id is the segment after /hooks/), so they can never diverge.
const GHL_LOCATION_ID = 'yn2nRrAMenhqUMScVH3S'
const LEAD_WEBHOOK_URL = `https://services.leadconnectorhq.com/hooks/${GHL_LOCATION_ID}/webhook-trigger/Dse4zrUQQriuWyh8ch0y`

const SOURCE_LABEL = 'Landing Page - Main'

export interface BookingData {
  name: string
  childName: string
  email: string
  phone: string
  program: Program | null
  date: Date | null
  time: string | null
}

// Fire-and-forget: never throws, never blocks the UI. keepalive delivers the
// request even if the modal closes. A CORS console error does not prove the
// request failed — the n8n execution log is the source of truth.
function post(url: string, payload: Record<string, unknown>): void {
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  })
    .then((res) => {
      if (!res.ok) {
        console.warn(`[booking] webhook ${url} responded ${res.status}`)
      } else if (import.meta.env.DEV) {
        console.info(`[booking] webhook ${url} ok`)
      }
    })
    .catch((err) => {
      console.warn(`[booking] webhook ${url} failed`, err)
    })
}

export function splitName(full: string): { first: string; last: string } {
  const parts = full.trim().split(/\s+/)
  return { first: parts[0] ?? '', last: parts.slice(1).join(' ') }
}

export function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return digits.length === 10 ? `+1${digits}` : `+${digits}`
}

// child_name goes out ONLY for kids programs with the field filled; the key
// is omitted otherwise (never send the adult's name as child_name).
function childNameOrNull(data: BookingData): string | null {
  if (!data.program || PROGRAM_AUDIENCE[data.program] !== 'kids') return null
  const name = data.childName.trim()
  return name.length > 0 ? name : null
}

export function sendLeadWebhook(data: BookingData): void {
  if (!data.program) return
  const { first, last } = splitName(data.name)
  const cn = childNameOrNull(data)
  post(LEAD_WEBHOOK_URL, {
    event: 'lead_captured',
    name: data.name.trim(),
    firstName: first,
    lastName: last,
    ...(cn ? { child_name: cn } : {}),
    email: data.email.trim(),
    phone: data.phone.trim(),
    phoneE164: toE164(data.phone),
    program: PROGRAM_LABEL[data.program],
    audience: PROGRAM_AUDIENCE[data.program],
    submittedAt: new Date().toISOString(),
    source: SOURCE_LABEL,
    ...getAttribution(),
  })
}

// ⚠️ Critical contract with the shared n8n workflow — do not change the
// schema. Calendar is matched by calendar_id; parent_name is mandatory;
// time must be h:mm AM/PM and date local YYYY-MM-DD.
export function sendBookingWebhook(data: BookingData): void {
  if (!data.program || !data.date || !data.time) return
  const cn = childNameOrNull(data)
  post(BOOKING_WEBHOOK_URL, {
    parent_name: data.name.trim(),
    ...(cn ? { child_name: cn } : {}),
    email: data.email.trim(),
    phone: data.phone.trim(),
    calendar_id: PROGRAM_CALENDAR_ID[data.program],
    location_id: GHL_LOCATION_ID,
    stage: 'appointment_selected',
    appointment_date: isoDate(data.date),
    appointment_time: formatTimeLabel(data.time),
    source: SOURCE_LABEL,
  })
}

// Live availability from GHL free-slots, via the same shared n8n workflow.
// Response: { "YYYY-MM-DD": { slots: ["<ISO with academy offset>", ...] } }.
// The ISO already carries the academy timezone, so local date/time come out
// of plain string slicing — no timezone conversion.
export async function fetchSlots(program: Program): Promise<SlotsMap> {
  const res = await fetch(BOOKING_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'get_slots',
      location_id: GHL_LOCATION_ID,
      calendar_id: PROGRAM_CALENDAR_ID[program],
    }),
  })
  if (!res.ok) throw new Error(`get_slots responded ${res.status}`)
  const raw = (await res.json()) as Record<string, { slots?: unknown }>
  const map: SlotsMap = {}
  for (const value of Object.values(raw)) {
    // Non-date keys (e.g. traceId) are skipped: only entries whose slots is an array.
    if (!value || !Array.isArray(value.slots)) continue
    for (const iso of value.slots) {
      if (typeof iso !== 'string') continue
      const day = iso.slice(0, 10)
      ;(map[day] ??= []).push(iso.slice(11, 16))
    }
  }
  return map
}
