// Meta browser/click identifiers for the CAPI mirror (§7.6.3).
//  - fbp: the _fbp cookie (created by the Pixel base snippet).
//  - fbc: the _fbc cookie, with a first-party fallback — the fbclid from the
//    landing URL persisted in the _fbc format. The cookie only exists when the
//    Pixel script loads; the fallback covers exactly the blocked-Pixel case.
// localStorage (not sessionStorage): click attribution windows are long.

const FBC_KEY = 'nd-fbc'

/** Call once at app boot (before SPA navigation can clear the query string). */
export function captureFbclid(): void {
  try {
    const fbclid = new URLSearchParams(window.location.search).get('fbclid')
    if (fbclid) localStorage.setItem(FBC_KEY, `fb.1.${Date.now()}.${fbclid}`)
  } catch {
    // localStorage unavailable — continue without fbc
  }
}

function readCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

export function getFbp(): string | undefined {
  return readCookie('_fbp')
}

export function getFbc(): string | undefined {
  let stored: string | undefined
  try {
    stored = localStorage.getItem(FBC_KEY) ?? undefined
  } catch {
    stored = undefined
  }
  return readCookie('_fbc') ?? stored
}
