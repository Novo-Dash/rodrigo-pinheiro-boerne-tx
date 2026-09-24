import { useEffect, useRef, useState, useCallback } from 'react'
import { fetchPrograms } from '@/nd'
import { TRIAL_CALENDARS, toMinutes } from '@/data/schedule'
import type { ClassSession } from '@/data/schedule'

/**
 * Live layer over the printed schedule: which classes still have a free-trial
 * seat. Source is `fetchPrograms` — the SAME class list the booking
 * modal loads, sharing its module-level cache, so the section costs no extra
 * request.
 *
 * The call is fired by an IntersectionObserver 800px ahead of the section, not
 * on mount: a visitor who bounces in the hero never pays for it.
 *
 * ⚠️ The response is AVAILABILITY, not the class list. A full class never comes
 * back, and a class without a calendar (open mat, Muay Thai, competition
 * training) never does either. So it can only ADD a badge: a failed or empty
 * response leaves the grid exactly as the sheet has it.
 */

/** The printed sheet and the GHL calendar can disagree by a few minutes on the
 *  same class (the sheet says 6:15 PM for Women's, GHL opens 6:00 PM). Same
 *  weekday within this window is the same class. Kept tight so the 5:00 PM and
 *  the 7:15 PM classes can never be confused with each other. */
const MATCH_TOLERANCE_MIN = 20

type OpeningMap = Record<string, number[]>

function weekdayOf(isoDate: string): number {
  // Noon local, never midnight: a midnight parse can roll to the previous day.
  return new Date(`${isoDate}T12:00:00`).getDay()
}

export function useTrialOpenings() {
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const [openings, setOpenings] = useState<OpeningMap | null>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    let cancelled = false

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        observer.disconnect()

        fetchPrograms()
          .then((programs) => {
            if (cancelled) return
            const map: OpeningMap = {}
            for (const program of programs) {
              const minutes = new Set<number>()
              for (const [date, times] of Object.entries(program.slots)) {
                const weekday = weekdayOf(date)
                for (const time of times) minutes.add(weekday * 1440 + toMinutes(time))
              }
              if (minutes.size) map[program.calendar_id] = [...minutes]
            }
            // Empty answer never wipes the grid: it just means no badge.
            setOpenings(map)
          })
          .catch(() => {
            if (!cancelled) setOpenings({})
          })
      },
      { rootMargin: '800px' }
    )

    observer.observe(el)
    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [])

  const isTrialOpen = useCallback(
    (session: ClassSession): boolean => {
      if (!openings || !session.trial) return false
      const slots = openings[TRIAL_CALENDARS[session.trial]]
      if (!slots) return false
      const target = session.day * 1440 + toMinutes(session.start)
      return slots.some((slot) => Math.abs(slot - target) <= MATCH_TOLERANCE_MIN)
    },
    [openings]
  )

  return { sentinelRef, isTrialOpen, loaded: openings !== null }
}
