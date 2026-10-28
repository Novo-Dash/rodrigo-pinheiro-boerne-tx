import { useEffect, useState } from 'react'

interface StickyCTABarProps {
  onBookClick: () => void
}

export function StickyCTABar({ onBookClick }: StickyCTABarProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function onScroll() { setVisible(window.scrollY > 600) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden safe-area-bottom"
      style={{ background: 'rgba(13,13,13,0.96)', backdropFilter: 'blur(12px)' }}
      role="complementary"
      aria-label="Quick booking bar"
    >
      <div className="px-4 pt-3 pb-2">
        <button
          type="button"
          onClick={onBookClick}
          className="w-full inline-flex min-h-[52px] items-center justify-center rounded-none bg-[var(--color-accent)] text-sm font-bold uppercase tracking-wide text-[var(--color-accent-ink)] shadow-[0_8px_30px_rgba(var(--accent-rgb),0.35)] hover:bg-[var(--color-accent-hover)] hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          Book Free Trial Class →
        </button>
      </div>
    </div>
  )
}
