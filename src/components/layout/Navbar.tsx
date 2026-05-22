import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { cn } from '@/lib/utils'

const NAV = [
  { label: 'Programs',    href: '#our-classes'     },
  { label: 'Instructors', href: '#our-instructors' },
  { label: 'FAQ',         href: '#faq'             },
]

interface NavbarProps {
  onBookClick: () => void
}

export function Navbar({ onBookClick }: NavbarProps) {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const progressRef                   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20)

      const bar      = progressRef.current
      if (!bar) return
      const progress = window.scrollY / Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      )
      gsap.to(bar, {
        scaleX:    Math.min(progress, 1),
        duration:  0.15,
        ease:      'none',
        overwrite: 'auto',
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-all duration-300',
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex h-16 md:h-20 max-w-[1320px] items-center justify-between px-6">

        {/* Logo */}
        <a href="#main-content" className="flex items-center gap-2.5">
          <img
            src="/logo.webp"
            alt="Rodrigo Pinheiro BJJ Boerne"
            className="h-10 w-10 object-contain"
            width={40}
            height={40}
          />
          <span
            className="text-xl font-normal uppercase tracking-tight leading-none transition-colors duration-300"
            style={{
              fontFamily: 'var(--font-display)',
              color: scrolled ? 'var(--color-text)' : '#fff',
            }}
          >
            RPBJJ Boerne
          </span>
        </a>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {NAV.map(item => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                'text-xs font-semibold uppercase tracking-wider transition-colors duration-200 hover:text-[var(--color-accent)]',
                scrolled ? 'text-[var(--color-text-secondary)]' : 'text-white/70'
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA + mobile hamburger */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <MagneticButton onClick={onBookClick}>
              Book Free Trial
            </MagneticButton>
          </div>

          <button
            type="button"
            className={cn(
              'md:hidden p-2 transition-colors duration-200',
              scrolled ? 'text-[var(--color-text)]' : 'text-white'
            )}
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Scroll progress bar */}
      <div
        ref={progressRef}
        className="h-0.5 origin-left"
        style={{
          background: 'var(--color-accent)',
          transform:  'scaleX(0)',
        }}
        aria-hidden="true"
      />

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-black/10">
          <nav
            className="mx-auto max-w-[1320px] px-6 py-6 flex flex-col gap-4"
            aria-label="Mobile navigation"
          >
            {NAV.map(item => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-bold uppercase leading-none hover:text-[var(--color-accent)] transition-colors"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
              >
                {item.label}
              </a>
            ))}

            <button
              type="button"
              onClick={() => { setMobileOpen(false); onBookClick() }}
              className="mt-2 w-full inline-flex min-h-[52px] items-center justify-center rounded-none bg-[var(--color-accent)] px-8 text-sm font-bold uppercase tracking-wide text-white shadow-[0_8px_30px_rgba(255,106,0,0.35)] hover:bg-[var(--color-accent-hover)] transition-all duration-200"
            >
              Book Free Trial
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="6"  x2="21" y2="6"  />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  )
}
