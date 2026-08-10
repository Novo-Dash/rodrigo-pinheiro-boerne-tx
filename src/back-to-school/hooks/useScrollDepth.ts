import { useEffect, useRef } from 'react'

const DEPTHS = [25, 50, 75, 90]

export function useScrollDepth() {
  const fired = useRef<Set<number>>(new Set())

  useEffect(() => {
    function onScroll() {
      const scrolled = window.scrollY + window.innerHeight
      const total = document.documentElement.scrollHeight
      const pct = Math.round((scrolled / total) * 100)

      for (const depth of DEPTHS) {
        if (pct >= depth && !fired.current.has(depth)) {
          fired.current.add(depth)
          if (typeof window.gtag === 'function') {
            window.gtag('event', `scroll_depth_${depth}`, {
              event_category: 'engagement',
            })
          }
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
}
