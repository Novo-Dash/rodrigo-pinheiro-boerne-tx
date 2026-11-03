import { useRef, useState, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { testimonials } from '@/data/testimonials'

interface Props {
  onBookClick?: () => void
}

// Slight tilt per card (fan effect on side cards)
const TILTS = [2.5, -3, 5, -4.5, 3.5, -2, 4, -3.5]

const CARD_SPACING = 230
const ROTATE_Y     = -38

export function Testimonials({ onBookClick }: Props) {
  const [active, setActive] = useState(0)
  const cardRefs            = useRef<(HTMLDivElement | null)[]>([])
  const autoRef             = useRef<ReturnType<typeof setInterval> | null>(null)
  const hasMounted          = useRef(false)
  const isDragging          = useRef(false)
  const dragStartX          = useRef(0)
  const total               = testimonials.length

  const go = useCallback((idx: number) => {
    setActive(((idx % total) + total) % total)
  }, [total])

  const resetAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current)
    autoRef.current = setInterval(() => setActive(p => (p + 1) % total), 5000)
  }, [total])

  useEffect(() => {
    resetAuto()
    return () => { if (autoRef.current) clearInterval(autoRef.current) }
  }, [resetAuto])

  useEffect(() => {
    const animate = hasMounted.current

    cardRefs.current.forEach((card, i) => {
      if (!card) return
      const offset = i - active
      const abs    = Math.abs(offset)
      const props  = {
        x:       offset * CARD_SPACING,
        rotateY: offset * ROTATE_Y,
        rotateZ: offset === 0 ? 0 : TILTS[i % TILTS.length],
        scale:   abs === 0 ? 1 : 1 - abs * 0.09,
        opacity: abs === 0 ? 1 : abs === 1 ? 0.75 : abs === 2 ? 0.45 : 0,
        zIndex:  10 - abs,
      }

      if (animate) {
        gsap.to(card, { ...props, duration: 0.6, ease: 'power3.out' })
      } else {
        gsap.set(card, props)
      }
    })

    hasMounted.current = true
  }, [active])

  function onPointerDown(e: React.PointerEvent) {
    isDragging.current = true
    dragStartX.current = e.clientX
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!isDragging.current) return
    isDragging.current = false
    const delta = e.clientX - dragStartX.current
    if (Math.abs(delta) > 50) { resetAuto(); go(delta < 0 ? active + 1 : active - 1) }
  }

  return (
    <section id="testimonials" className="overflow-hidden py-24 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-8 md:px-16 xl:px-24">

        {/* Header */}
        <div className="mb-16 text-center">
          <h2
            className="text-5xl font-black uppercase tracking-tighter text-[var(--color-text)] md:text-6xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            What Our Students <span style={{ color: 'var(--color-accent)' }}>Say About Us</span>
          </h2>

          {/* Google badge */}
          <div className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5">
            <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span
              className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Excellent · 5.0 ★ · Google Reviews
            </span>
          </div>
        </div>

        {/* Fan Carousel */}
        <div
          className="relative mx-auto select-none"
          style={{ height: 390, perspective: '1200px' }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {testimonials.map((t, i) => (
              <div
                key={t.id}
                ref={el => { cardRefs.current[i] = el }}
                onClick={() => { if (i !== active) { resetAuto(); go(i) } }}
                style={{
                  position:        'absolute',
                  width:           280,
                  transformOrigin: 'center center',
                  willChange:      'transform, opacity',
                  cursor:          i !== active ? 'pointer' : 'default',
                }}
                className="rounded-[var(--radius-card)] border border-[var(--color-border-light)] bg-[var(--color-surface)] p-7 shadow-[var(--shadow-md)]"
              >
                {/* Stars */}
                <div className="mb-4 flex gap-0.5" aria-label="5 stars" role="img">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg key={s} width="14" height="14" viewBox="0 0 14 14" fill="var(--color-accent)" aria-hidden="true">
                      <path d="M7 1l1.545 4.755H14l-4.045 2.94 1.545 4.755L7 10.51l-4.5 2.94 1.545-4.755L0 5.755h5.455z" />
                    </svg>
                  ))}
                </div>

                {/* Review text — clipped on side cards */}
                <p
                  className="text-sm leading-relaxed text-[var(--color-text-secondary)]"
                  style={i !== active ? {
                    display:           '-webkit-box',
                    WebkitLineClamp:   4,
                    WebkitBoxOrient:   'vertical' as const,
                    overflow:          'hidden',
                  } : undefined}
                >
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Author */}
                <div className="mt-6 flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ background: t.avatarColor }}
                    aria-hidden="true"
                  >
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text)]">{t.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{t.timeAgo} · Google</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-10 flex flex-col items-center gap-8">
          <div className="flex items-center gap-5">
            <button
              onClick={() => { resetAuto(); go(active - 1) }}
              aria-label="Previous review"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </button>

            {/* Progress dashes */}
            <div className="flex items-center gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to review ${i + 1}`}
                  onClick={() => { resetAuto(); go(i) }}
                  className="h-0.5 rounded-full transition-all duration-300"
                  style={{
                    width:           i === active ? 24 : 8,
                    backgroundColor: i === active ? 'var(--color-accent)' : 'var(--color-border)',
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => { resetAuto(); go(active + 1) }}
              aria-label="Next review"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* CTA */}
          {onBookClick && (
            <button
              onClick={onBookClick}
              className="flex items-center gap-2 rounded-none bg-[var(--color-accent)] px-9 py-5 text-sm font-bold uppercase tracking-widest text-[var(--color-accent-ink)] shadow-[var(--shadow-cta)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(var(--accent-rgb),0.50)] hover:bg-[var(--color-accent-hover)] active:translate-y-0 active:shadow-none"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Schedule Your Free Trial Class
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

      </div>
    </section>
  )
}
