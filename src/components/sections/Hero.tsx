import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

interface HeroProps {
  onBookClick: () => void
  className?: string
}

export function Hero({ onBookClick, className }: HeroProps) {
  const headingRef  = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef      = useRef<HTMLDivElement>(null)
  const imageRef    = useRef<HTMLDivElement>(null)
  const ctxRef      = useRef<{ revert: () => void } | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let cancelled = false

    async function animate() {
      const { gsap } = await import('gsap')
      if (cancelled) return
      ctxRef.current?.revert()
      ctxRef.current = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.fromTo(headingRef.current,  { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.2)
          .fromTo(subtitleRef.current, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.35)
          .fromTo(ctaRef.current,      { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.48)
          .fromTo(imageRef.current,    { autoAlpha: 0, scale: 1.03 }, { autoAlpha: 1, scale: 1, duration: 1.1 }, 0.1)
      })
    }

    animate()
    return () => {
      cancelled = true
      ctxRef.current?.revert()
      ctxRef.current = null
    }
  }, [])

  return (
    <section
      id="main-content"
      aria-label="Hero: Start your BJJ journey in Boerne"
      className={cn(
        'relative min-h-screen flex items-center overflow-hidden bg-[#0D0D0D] pt-16 md:pt-20',
        className
      )}
    >
      {/* Background video */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Dark overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.65)' }}
        aria-hidden="true"
      />

      {/* Grid lines pattern */}
      <div className="pointer-events-none absolute inset-0 grid-lines-light" aria-hidden="true" />

      {/* Accent gradient */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 70% 50%, var(--color-accent), transparent)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1280px] px-6 py-16 md:px-10 md:py-24">
        <div className="flex flex-col items-center text-center gap-6">

          <h1
            ref={headingRef}
            className="text-fluid-hero uppercase text-white"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 700, opacity: 0 }}
          >
            Start Jiu-Jitsu with<br />
            <span style={{ color: 'rgba(var(--accent-rgb), 0.95)' }}>
              a World Champion Team
            </span><br />
            in Boerne
          </h1>

          <p
            ref={subtitleRef}
            className="text-fluid-body text-white/75 max-w-2xl"
            style={{ opacity: 0 }}
          >
            Led by World Champion coaches, RP Boerne has created a welcoming space for all ages and fitness levels where everyone can start with confidence. Improvement on and off the mats is seen within weeks.
          </p>

          <div ref={ctaRef} className="flex flex-wrap justify-center gap-3" style={{ opacity: 0 }}>
            <Button onClick={onBookClick} size="lg">
              Book my first free trial class
              <ArrowRight />
            </Button>
          </div>

        </div>
      </div>
    </section>
  )
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3.75 9H14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 3.75L14.25 9 9 14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
