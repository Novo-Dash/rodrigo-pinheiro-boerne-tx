import { useMemo, useState } from 'react'
import { Section, SectionHeader } from '@/components/ui'
import { MagneticButton } from '@/components/ui/MagneticButton'
import {
  classSessions,
  scheduleTracks,
  scheduleStats,
  DAY_LABELS,
  TRACK_LABELS,
  formatRange,
  formatTime,
  sessionDetail,
  sessionId,
} from '@/data/schedule'
import type { ClassSession, Track } from '@/data/schedule'
import { useTrialOpenings } from '@/hooks/useTrialOpenings'
import type { ModalTag } from '@/hooks/useModal'

interface OurScheduleProps {
  onBookClick: (tag?: ModalTag) => void
}

type Filter = Track | 'all'

/** Every clickable class lands in the booking modal, pre-tagged. Nothing on
 *  this section points anywhere else. */
const TRACK_TAG: Record<Track, ModalTag> = {
  adults: 'adults',
  kids: 'kids',
  women: 'women',
  muaythai: 'adults',
}

/** Today at the academy, not on the visitor's clock: a student in another
 *  timezone would otherwise see the wrong column lit. */
function academyWeekday(): number {
  try {
    const short = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      weekday: 'short',
    }).format(new Date())
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(short)
  } catch {
    return new Date().getDay()
  }
}

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-2 border-black bg-white px-4 py-4 sm:px-5 sm:py-5">
      <p
        className="text-3xl sm:text-4xl leading-none uppercase text-[var(--color-text)]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {value}
      </p>
      <p className="mt-2 text-[14px] leading-snug text-[var(--color-text-secondary)]">{label}</p>
    </div>
  )
}

function SessionCard({
  session,
  trialOpen,
  showTime,
  onBookClick,
}: {
  session: ClassSession
  trialOpen: boolean
  showTime?: boolean
  onBookClick: (tag?: ModalTag) => void
}) {
  const detail = sessionDetail(session)
  const range = formatRange(session.start, session.end)
  const body = (
    <>
      {trialOpen && (
        <span
          className="-mx-2.5 -mt-2 mb-2 block h-1 bg-[var(--color-accent)]"
          aria-hidden="true"
        />
      )}
      {showTime && (
        <span className="mb-1 block text-[14px] font-semibold text-[var(--color-text-secondary)]">
          {range}
        </span>
      )}
      <span
        className="block text-[16px] leading-none uppercase text-[var(--color-text)]"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {session.title}
      </span>
      {detail && (
        <span className="mt-1 block text-[14px] leading-snug text-[var(--color-text-secondary)]">
          {detail}
        </span>
      )}
      {trialOpen && (
        <span className="mt-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-accent-dark)]">
          Free trial
        </span>
      )}
    </>
  )

  const skin = [
    'block w-full text-left border-2 border-black px-2.5 py-2',
    session.track === 'kids' ? 'bg-[var(--color-accent-subtle)]' : 'bg-white',
  ].join(' ')

  if (!trialOpen) return <div className={skin}>{body}</div>

  return (
    <button
      type="button"
      onClick={() => onBookClick(TRACK_TAG[session.track])}
      aria-label={`Book a free trial: ${session.title}${detail ? `, ${detail}` : ''}, ${DAY_LABELS[session.day].long} ${range}`}
      className={`${skin} cursor-pointer shadow-[3px_3px_0_0_#000] transition-transform duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0`}
    >
      {body}
    </button>
  )
}

export function OurSchedule({ onBookClick }: OurScheduleProps) {
  const [filter, setFilter] = useState<Filter>('all')
  const [pickedDay, setPickedDay] = useState<number | null>(null)
  const { sentinelRef, isTrialOpen, loaded } = useTrialOpenings()

  // Columns, rows and filters are all derived: a class added to the sheet
  // creates its own column and its own row, with no change here.
  const visible = useMemo(
    () => classSessions.filter((s) => filter === 'all' || s.allAges || s.track === filter),
    [filter]
  )
  const days = useMemo<number[]>(() => [...new Set(visible.map((s) => s.day as number))].sort((a, b) => a - b), [visible])
  const times = useMemo(() => [...new Set(visible.map((s) => s.start))].sort(), [visible])

  const today = academyWeekday()
  // The picked day can fall outside the filter (pick Friday, then filter Kids),
  // so the rendered day is always validated against what is on screen.
  const activeDay = pickedDay && days.includes(pickedDay) ? pickedDay : days.includes(today) ? today : days[0]

  const trialCount = useMemo(() => classSessions.filter((s) => isTrialOpen(s)).length, [isTrialOpen])

  const cellsAt = (day: number, time: string) =>
    visible.filter((s) => s.day === day && s.start === time)

  return (
    <Section id="schedule" aria-labelledby="schedule-heading" subtle>
      <div ref={sentinelRef} aria-hidden="true" />

      <SectionHeader
        id="schedule-heading"
        label="Class schedule"
        title="OUR SCHEDULE"
        titleNode={
          <>
            OUR <span style={{ color: 'var(--color-accent)' }}>SCHEDULE</span>
          </>
        }
        subtitle="Mats open six days a week in Boerne. Find the class that fits your week, then book the free trial on the spot."
      />

      {/* Dashboard */}
      <div className="-mt-6 mb-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatTile value={String(scheduleStats.classesPerWeek)} label="classes every week" />
        <StatTile value={String(scheduleStats.daysOpen)} label={`days a week, ${scheduleStats.dayRange}`} />
        <StatTile
          value={scheduleStats.firstClass}
          label={`first class on the mats, last one ends ${scheduleStats.lastClassEnd}`}
        />
        {loaded && trialCount > 0 ? (
          <StatTile value={String(trialCount)} label="classes open for a free trial right now" />
        ) : (
          <StatTile value="Free" label="your first class, every program" />
        )}
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          Filter
        </span>
        {(['all', ...scheduleTracks] as Filter[]).map((option) => {
          const active = filter === option
          return (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              aria-pressed={active}
              className={`min-h-[40px] cursor-pointer border-2 border-black px-4 text-[13px] font-bold uppercase tracking-wide transition-colors duration-200 ${
                active
                  ? 'bg-[var(--color-text)] text-white'
                  : 'bg-white text-[var(--color-text)] hover:bg-[var(--color-accent-subtle)]'
              }`}
            >
              {option === 'all' ? 'All classes' : TRACK_LABELS[option]}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-2">
        <span className="flex items-center gap-2 text-[14px] text-[var(--color-text-secondary)]">
          <span
            className="block h-4 w-4 border-2 border-black bg-[var(--color-accent-subtle)]"
            aria-hidden="true"
          />
          Kids classes
        </span>
        <span className="flex items-center gap-2 text-[14px] text-[var(--color-text-secondary)]">
          <span className="block h-4 w-4 border-2 border-black bg-white" aria-hidden="true">
            <span className="block h-1 w-full bg-[var(--color-accent)]" />
          </span>
          Free trial open, tap to book
        </span>
      </div>

      {/* Calendar, desktop */}
      <div className="hidden border-2 border-black bg-white lg:block">
        <table className="w-full table-fixed border-collapse">
          <caption className="sr-only">
            Weekly class schedule, {scheduleStats.dayRange}, times local to Boerne, Texas
          </caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky top-20 z-10 w-[104px] border-b-2 border-black bg-[var(--color-text)] px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60"
              >
                Time
              </th>
              {days.map((day) => {
                const isToday = day === today
                return (
                  <th
                    key={day}
                    scope="col"
                    className={`sticky top-20 z-10 border-b-2 border-l border-black/15 px-3 py-3 text-left ${
                      isToday ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-text)]'
                    }`}
                  >
                    <span
                      className="block text-[15px] uppercase leading-none text-white"
                      style={{ fontFamily: 'var(--font-display)' }}
                      aria-hidden="true"
                    >
                      {DAY_LABELS[day].short}
                    </span>
                    <span className="sr-only">{DAY_LABELS[day].long}</span>
                    {isToday && (
                      <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                        Today
                      </span>
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {times.map((time) => (
              <tr key={time}>
                <th
                  scope="row"
                  className="border-t border-black/15 bg-[var(--color-surface-alt)] px-3 py-3 text-left align-top text-[15px] uppercase leading-none text-[var(--color-text)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {formatTime(time)}
                </th>
                {days.map((day) => {
                  const sessions = cellsAt(day, time)
                  return (
                    <td
                      key={day}
                      className={`border-t border-l border-black/15 px-2 py-2 align-top ${
                        day === today ? 'bg-[var(--color-accent-subtle)]/50' : ''
                      }`}
                    >
                      {sessions.length === 0 ? (
                        <span className="block text-center text-[var(--color-text-muted)]" aria-hidden="true">
                          ·
                        </span>
                      ) : (
                        <div className="flex flex-col gap-2">
                          {sessions.map((session) => (
                            <SessionCard
                              key={sessionId(session)}
                              session={session}
                              trialOpen={isTrialOpen(session)}
                              onBookClick={onBookClick}
                            />
                          ))}
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Calendar, phone and tablet: one day at a time */}
      <div className="lg:hidden">
        {/* A 6-up grid, not a scroller: every day has to be reachable without
            discovering that the row slides. */}
        <div
          className="mb-5 grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}
        >
          {days.map((day) => {
            const active = day === activeDay
            return (
              <button
                key={day}
                type="button"
                onClick={() => setPickedDay(day)}
                aria-pressed={active}
                className={`min-h-[44px] cursor-pointer border-2 border-black px-1 text-[15px] uppercase leading-none transition-colors duration-200 ${
                  active ? 'bg-[var(--color-text)] text-white' : 'bg-white text-[var(--color-text)]'
                }`}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <span aria-hidden="true">{DAY_LABELS[day].short}</span>
                <span className="sr-only">{DAY_LABELS[day].long}</span>
              </button>
            )
          })}
        </div>

        <div className="border-2 border-black bg-white">
          <p className="flex items-baseline justify-between gap-3 border-b-2 border-black bg-[var(--color-text)] px-4 py-3">
            <span
              className="text-[18px] uppercase leading-none text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {DAY_LABELS[activeDay].long}
            </span>
            <span className="text-[14px] text-white/60">
              {visible.filter((s) => s.day === activeDay).length} classes
            </span>
          </p>
          <div className="flex flex-col gap-3 p-4">
            {visible
              .filter((s) => s.day === activeDay)
              .sort((a, b) => a.start.localeCompare(b.start))
              .map((session) => (
                <SessionCard
                  key={sessionId(session)}
                  session={session}
                  trialOpen={isTrialOpen(session)}
                  showTime
                  onBookClick={onBookClick}
                />
              ))}
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
          New here? Start with any class marked for a free trial. We will have a gi waiting for you.
        </p>
        <MagneticButton onClick={() => onBookClick()}>
          Book your free class
        </MagneticButton>
      </div>
    </Section>
  )
}
