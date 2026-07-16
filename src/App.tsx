import { useCallback } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BookPage } from '@/booking/BookPage'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import {
  Hero,
  OurClasses,
  Testimonials,
  HowToStart,
  OurInstructors,
  MoreOfUs,
  About,
  FAQ,
  Location,
  StickyCTABar,
} from '@/components/sections'
import { BookingModal } from '@/components/sections/BookingModal'
import { useModal } from '@/hooks/useModal'
import { useScrollDepth } from '@/hooks/useScrollDepth'
import { fbqTrack, ga4Event } from '@/booking/analytics'
import type { ModalTag } from '@/hooks/useModal'

function LandingPage() {
  const { isOpen, defaultTag, open, close } = useModal()
  useScrollDepth()

  const handleBookClick = useCallback(
    (tag?: ModalTag) => {
      open(tag ?? null)
      fbqTrack('ViewContent', { content_name: 'Trial Booking' })
      ga4Event('view_content', { content_name: 'Trial Booking' })
    },
    [open]
  )

  const handleOpenWithTag = useCallback(
    (tag: ModalTag) => {
      handleBookClick(tag)
    },
    [handleBookClick]
  )

  return (
    <div className="grain">
      <Navbar onBookClick={() => handleBookClick()} />

      <main>
        <Hero onBookClick={() => handleBookClick()} />
        <OurClasses onBookClick={handleOpenWithTag} />
        <Testimonials onBookClick={() => handleBookClick()} />
        <HowToStart onBookClick={() => handleBookClick()} />
        <OurInstructors onBookClick={() => handleBookClick()} />
        <MoreOfUs />
        <About />
        <FAQ />
        <Location />
      </main>

      <Footer onBookClick={() => handleBookClick()} />

      <BookingModal isOpen={isOpen} defaultTag={defaultTag} onClose={close} />
      <StickyCTABar onBookClick={() => handleBookClick()} />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/book" element={<BookPage />} />
      </Routes>
    </BrowserRouter>
  )
}
