import { useEffect } from 'react'
import './bts.css'
import { BookPage as NdBookPage } from '@/nd'
import { BOOKING_COPY } from '@/back-to-school/data/content'

/* The campaign's /book: the Novo Dash kit's booking page with the campaign's
   lead source and texts, in the campaign's palette. */
export default function BookPage() {
  useEffect(() => {
    document.documentElement.classList.add('bts-page')
    return () => document.documentElement.classList.remove('bts-page')
  }, [])
  return <NdBookPage source="Landing Page - Back to School" copy={BOOKING_COPY} />
}
