// Marketing attribution: captures the 5 standard UTM params plus fbclid/gclid
// from the landing URL, first-touch persisted in sessionStorage, plus the
// landing URL + referrer of the session's first visit. Attached to the lead
// webhook only (never to the n8n booking webhook).

const PARAM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'fbclid',
  'gclid',
] as const

const STORAGE_KEY = 'rpbjj_attribution'
const LANDING_KEY = 'rpbjj_landing'
const LANDING_URL_MAX = 1000

function isRealValue(value: string | null): value is string {
  return !!value && !value.includes('{{') && !value.includes('}}')
}

function readFromUrl(): Record<string, string> {
  const params = new URLSearchParams(window.location.search)
  const captured: Record<string, string> = {}
  for (const key of PARAM_KEYS) {
    const value = params.get(key)
    if (isRealValue(value)) captured[key] = value
  }
  return captured
}

// Landing snapshot: never strip the query string (it is the part that
// matters); truncate from the end.
function readLanding(): Record<string, string> {
  const captured: Record<string, string> = {}
  captured.landing_url = window.location.href.slice(0, LANDING_URL_MAX)
  if (isRealValue(document.referrer)) captured.landing_referrer = document.referrer
  return captured
}

// Called once at app boot (before SPA navigation can clear the query string).
// First-touch without clobber: params only store when nothing is saved yet AND
// the current URL carries at least one param; landing_url/referrer store on
// the session's first visit even without any param.
export function captureAttribution(): void {
  try {
    if (!sessionStorage.getItem(LANDING_KEY)) {
      sessionStorage.setItem(LANDING_KEY, JSON.stringify(readLanding()))
    }
  } catch {
    // Storage blocked (private mode): silently fall back to URL reads.
  }
  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return
    const captured = readFromUrl()
    if (Object.keys(captured).length === 0) return
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(captured))
  } catch {
    // Storage blocked (private mode): silently fall back to URL reads.
  }
}

export function getAttribution(): Record<string, string> {
  let params: Record<string, string> | null = null
  let landing: Record<string, string> | null = null
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) params = JSON.parse(stored) as Record<string, string>
  } catch {
    // fall through to direct URL read
  }
  try {
    const stored = sessionStorage.getItem(LANDING_KEY)
    if (stored) landing = JSON.parse(stored) as Record<string, string>
  } catch {
    // fall through to direct URL read
  }
  const captured = { ...(params ?? readFromUrl()), ...(landing ?? readLanding()) }
  if (captured.landing_url) captured.landing_url = captured.landing_url.slice(0, LANDING_URL_MAX)
  return captured
}

const META_SOURCES = new Set(['facebook', 'fb', 'instagram', 'ig', 'meta'])

// Dynamic CRM source: fbclid or a Meta utm_source -> "Landing Page - Meta
// Ads"; gclid or a google utm_source (any medium, GMB counts as Google) ->
// "Landing Page - Google"; otherwise the academy's fixed label.
export function getSourceLabel(fallback: string): string {
  const attribution = getAttribution()
  const utmSource = (attribution.utm_source ?? '').trim().toLowerCase()
  if (attribution.fbclid || META_SOURCES.has(utmSource)) return 'Landing Page - Meta Ads'
  if (attribution.gclid || utmSource.includes('google')) return 'Landing Page - Google'
  return fallback
}
