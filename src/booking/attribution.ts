// Marketing attribution: captures the 5 standard UTM params from the landing
// URL, first-touch persisted in sessionStorage. Attached to the lead webhook
// only (never to the n8n booking webhook).

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const

const STORAGE_KEY = 'rpbjj_attribution'

function isRealValue(value: string | null): value is string {
  return !!value && !value.includes('{{') && !value.includes('}}')
}

function readFromUrl(): Record<string, string> {
  const params = new URLSearchParams(window.location.search)
  const captured: Record<string, string> = {}
  for (const key of UTM_KEYS) {
    const value = params.get(key)
    if (isRealValue(value)) captured[key] = value
  }
  return captured
}

// Called once at app boot (before SPA navigation can clear the query string).
// First-touch without clobber: only stores when nothing is saved yet AND the
// current URL carries at least one param.
export function captureAttribution(): void {
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
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as Record<string, string>
  } catch {
    // fall through to direct URL read
  }
  return readFromUrl()
}
