interface Window {
  fbq?: (command: string, event: string, params?: Record<string, unknown>) => void
  gtag?: (...args: unknown[]) => void
  dataLayer?: unknown[]
}
