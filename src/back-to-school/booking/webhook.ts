import type { Program, SlotsMap } from './schedule'
import { PROGRAM_OVERRIDES, isoDate, formatTimeLabel } from './schedule'
import { getAttribution } from './attribution'

// FIXED for all academies — the shared n8n workflow. Do not parameterize.
const N8N_ORIGIN = 'https://n8n.novodash.com'
const N8N_PATH = 'webhook'
const BOOKING_WEBHOOK_URL = `${N8N_ORIGIN}/${N8N_PATH}/landing-page-booking`

// location_id defined once; the lead webhook URL is derived from it (the
// location_id is the segment after /hooks/), so they can never diverge.
const GHL_LOCATION_ID = 'yn2nRrAMenhqUMScVH3S'
const LEAD_WEBHOOK_URL = `https://services.leadconnectorhq.com/hooks/${GHL_LOCATION_ID}/webhook-trigger/Dse4zrUQQriuWyh8ch0y`

const SOURCE_LABEL = 'Landing Page - Back to School'

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
  if (data.program?.audience !== 'kids') return null
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
    program: data.program.name, // raw GHL calendar name -> CRM Program field (never the alias)
    audience: data.program.audience, // adults | kids — routes the shared workflow
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
    calendar_id: data.program.calendar_id, // matches calendar in n8n (rename-proof)
    location_id: GHL_LOCATION_ID,
    stage: 'appointment_selected',
    appointment_date: isoDate(data.date),
    appointment_time: formatTimeLabel(data.time),
    source: SOURCE_LABEL,
  })
}

/* ------------------------------------------------------------------ *
 * Live programs + slots, ONE call (same n8n workflow, action-discriminated)
 * ------------------------------------------------------------------ */

// ISO list per date -> "HH:MM" wall-clock list. Each ISO already carries the
// academy's timezone, so date/time come straight from the string (§5.1 — no
// timezone conversion).
function toSlotMap(raw: unknown): SlotsMap {
  const map: SlotsMap = {}
  if (!raw || typeof raw !== 'object') return map
  for (const [date, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Array.isArray(value)) continue
    const times = value
      .filter((s): s is string => typeof s === 'string')
      .map((iso) => iso.slice(11, 16))
      .filter((t) => /^\d{2}:\d{2}$/.test(t))
    if (times.length) map[date] = times.sort()
  }
  return map
}

/**
 * POST { action:"get_programs" } — the ONE live fetch (§5.1): programs and the
 * slots of every program together, once per session (module-level cache; the
 * shared workflow answers ordered adults-first). Unlike the webhooks this is
 * NOT fire-and-forget — without it there is nothing to render, so failures
 * surface as an error state in the UI.
 */
let programsPromise: Promise<Program[]> | null = null

export function fetchPrograms(): Promise<Program[]> {
  if (!programsPromise) {
    programsPromise = (async () => {
      const res = await fetch(BOOKING_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_programs',
          location_id: GHL_LOCATION_ID,
        }),
      })
      if (!res.ok) throw new Error(`get_programs responded ${res.status}`)
      const raw = (await res.json()) as { programs?: unknown[] }
      return (raw?.programs ?? [])
        .filter(
          (p): p is Record<string, unknown> =>
            !!p && typeof p === 'object' && !!(p as Record<string, unknown>).calendar_id && !!(p as Record<string, unknown>).name
        )
        .filter((p) => !PROGRAM_OVERRIDES[p.calendar_id as string]?.hide)
        .map(
          (p): Program => ({
            calendar_id: p.calendar_id as string,
            name: p.name as string,
            audience: p.audience === 'kids' ? 'kids' : 'adults',
            duration_minutes: (p.duration_minutes as number | null) ?? null,
            capacity: (p.capacity as number) ?? 0,
            slots: toSlotMap(p.slots),
            slots_error: (p.slots_error as string | null) ?? null,
          })
        )
    })()
    programsPromise.catch(() => {
      programsPromise = null // failed fetch doesn't poison the session cache
    })
  }
  return programsPromise
}
