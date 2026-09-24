import { useCallback, useEffect, useRef } from 'react'
import './bts.css'
import { BookingProvider, useBooking } from '@/nd'
import { Header } from '@/back-to-school/components/layout/Header'
import { Footer } from '@/back-to-school/components/layout/Footer'
import { Hero } from '@/back-to-school/sections/Hero'
import { Why } from '@/back-to-school/sections/Why'
import { Coaches } from '@/back-to-school/sections/Coaches'
import { Reviews } from '@/back-to-school/sections/Reviews'
import { HowToStart } from '@/back-to-school/sections/HowToStart'
import { RightFit } from '@/back-to-school/sections/RightFit'
import { Inside } from '@/back-to-school/sections/Inside'
import { Faq } from '@/back-to-school/sections/Faq'
import { Location } from '@/back-to-school/sections/Location'
import { Marquee } from '@/back-to-school/components/ui/Marquee'
import { BOOKING_COPY, MARQUEE } from '@/back-to-school/data/content'
import { initMotion } from '@/back-to-school/motion'

/* The campaign's leads carry their own source and the campaign's modal texts. */
export default function BackToSchoolPage() {
  return (
    <BookingProvider source="Landing Page - Back to School" copy={BOOKING_COPY}>
      <Page />
    </BookingProvider>
  )
}

function Page() {
  const { open } = useBooking()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rootRef.current) return
    return initMotion(rootRef.current)
  }, [])

  /* The client's theme owns <body>; flag <html> so this route's background
     shows behind overscroll instead of the main site's. */
  useEffect(() => {
    document.documentElement.classList.add('bts-page')
    return () => document.documentElement.classList.remove('bts-page')
  }, [])

  // Every CTA on the page is the same intent, so they all land here: the
  // Novo Dash booking modal (ViewContent fires inside it).
  const handleBookClick = useCallback(() => open(), [open])

  return (
    <div ref={rootRef} className="bts">
      <Header onBookClick={handleBookClick} />

      <main id="main-content">
        <Hero onBookClick={handleBookClick} />
        <Marquee items={MARQUEE} tone="ink" duration={42} />
        <Why onBookClick={handleBookClick} />
        <Coaches />
        <Reviews onBookClick={handleBookClick} />
        <HowToStart onBookClick={handleBookClick} />
        <RightFit onBookClick={handleBookClick} />
        <Inside onBookClick={handleBookClick} />
        <Marquee items={MARQUEE} tone="orange" duration={34} />
        <Faq onBookClick={handleBookClick} />
        <Location />
      </main>

      <Footer onBookClick={handleBookClick} />
    </div>
  )
}

