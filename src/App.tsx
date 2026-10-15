import { useCallback } from 'react'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BookingProvider, BookPage } from '@/nd'

/* Back to School campaign — a route here, not a second repo/Vercel project.
   Lazy: the main page never downloads its theme, fonts or sections. */
const BackToSchoolPage = lazy(() => import('@/back-to-school/BackToSchoolPage'))
const BtsBookPage = lazy(() => import('@/back-to-school/BookPage'))
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import {
  Hero,
  OurClasses,
  OurSchedule,
  Testimonials,
  HowToStart,
  OurInstructors,
  MoreOfUs,
  About,
  FAQ,
  Location,
  StickyCTABar,
} from '@/components/sections'
import { useModal } from '@/hooks/useModal'
import HalloweenLayer from '@/halloween/HalloweenLayer' // Halloween provisorio: sai com esta linha, a do JSX e src/halloween

function LandingPage() {
  const { open } = useModal()

  // Every CTA opens the Novo Dash booking modal (ViewContent fires inside it).
  const handleBookClick = useCallback(() => open(), [open])

  return (
    <div className="grain">
      <Navbar onBookClick={() => handleBookClick()} />

      <main>
        <Hero onBookClick={() => handleBookClick()} />
        <OurClasses onBookClick={handleBookClick} />
        <OurSchedule onBookClick={handleBookClick} />
        <Testimonials onBookClick={() => handleBookClick()} />
        <HowToStart onBookClick={() => handleBookClick()} />
        <OurInstructors onBookClick={() => handleBookClick()} />
        <MoreOfUs />
        <About />
        <FAQ />
        <Location />
      </main>

      <Footer onBookClick={() => handleBookClick()} />

      <StickyCTABar onBookClick={() => handleBookClick()} />

      <HalloweenLayer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <BookingProvider>
              <LandingPage />
            </BookingProvider>
          }
        />
        <Route path="/book" element={<BookPage />} />
        <Route
          path="/back-to-school"
          element={
            <Suspense fallback={null}>
              <BackToSchoolPage />
            </Suspense>
          }
        />
        <Route
          path="/back-to-school/book"
          element={
            <Suspense fallback={null}>
              <BtsBookPage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
