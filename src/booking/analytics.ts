// Tracking helpers: Meta Pixel via fbq, GA4 + Google Ads via gtag.
// One path per event (no GTM). All fire-and-forget: a missing tag never
// breaks the lead/booking flow.

const GOOGLE_ADS_ID = 'AW-16869042105'

export const GADS_LEAD = GOOGLE_ADS_ID ? `${GOOGLE_ADS_ID}/JI_yCN6m2NEcELnP5Os-` : ''
export const GADS_BOOKING = GOOGLE_ADS_ID ? `${GOOGLE_ADS_ID}/ep2sCOGm2NEcELnP5Os-` : ''

export function fbqTrack(event: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
  window.fbq('track', event, params || {})
}

export function ga4Event(event: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', event, params || {})
}

export function gtagConversion(sendTo: string): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  if (!sendTo) return
  window.gtag('event', 'conversion', { send_to: sendTo })
}

// Enhanced Conversions: set once before the Lead conversion; gtag hashes the
// values itself. A no-op unless Enhanced Conversions is enabled in Google Ads.
export function setUserData(email: string, phoneE164: string): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('set', 'user_data', { email, phone_number: phoneE164 })
}
