interface Window {
  fbq?: (
    command: string,
    event: string,
    params?: Record<string, unknown>,
    options?: { eventID?: string }
  ) => void
  gtag?: (...args: unknown[]) => void
  dataLayer?: unknown[]
}
