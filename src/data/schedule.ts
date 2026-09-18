/**
 * The academy's weekly class schedule, transcribed from the printed sheet the
 * professor handed over (Sept 2026, "RODRIGO PINHEIRO BRAZILIAN JIU-JITSU
 * BOERNE / Class Schedule").
 *
 * This file is the BASE layer: every class that runs on the mats, including
 * the ones that are not open to a free trial (competition training, open mat,
 * Muay Thai). The LIVE layer is `useTrialOpenings`, which reads the same
 * get_programs call the booking modal makes and lights up only the classes GHL
 * still has a free-trial seat for. A class is wired to its calendar through
 * `trial` + TRIAL_CALENDARS (calendar_id, never the name), so renaming a
 * calendar in GHL cannot silently unwire the grid.
 *
 * Times are 24h wall clock, local to the academy (America/Chicago).
 * Day is 1 = Monday ... 6 = Saturday. Sunday is closed and never rendered.
 */

export type Track = 'adults' | 'kids' | 'women' | 'muaythai'

/** Key into TRIAL_CALENDARS. Only classes GHL can actually book carry one. */
export type TrialKey = 'adults-jj' | 'adults-nogi' | 'women' | 'kids-4-8' | 'kids-9-13'

export interface ClassSession {
  day: 1 | 2 | 3 | 4 | 5 | 6
  /** "HH:MM" 24h. */
  start: string
  /** "HH:MM" 24h, or null when the sheet gives no end time (Friday open mat). */
  end: string | null
  title: string
  level?: string
  ages?: string
  gi?: 'Gi' | 'No-Gi'
  track: Track
  /** Shows under every audience filter (open mat is for the whole academy). */
  allAges?: boolean
  trial?: TrialKey
}

/** GHL calendars that take free-trial bookings, by calendar_id (rename-proof). */
export const TRIAL_CALENDARS: Record<TrialKey, string> = {
  'adults-jj': 'y1P80txvhjcNVKu9AwuU', // Adults Jiu-Jitsu
  'adults-nogi': '1AJgHFRRa3pYPUxl5Rsm', // Adults Wrestling
  women: 'bDsWioTBKPgk9AnR1Xh6', // Women's Class of Jiu-Jitsu
  'kids-4-8': 'ximUFAjn8dqixF5nOHZv', // Kids (4-8 years) Jiu-Jitsu
  'kids-9-13': 'ExbMYzPlGtEjf3Eh6jGU', // Kids (9-13 Years) Jiu-Jitsu
}

export const classSessions: ClassSession[] = [
  /* ---- Monday ---------------------------------------------------------- */
  { day: 1, start: '06:00', end: '07:00', title: 'Jiu Jitsu', level: 'All Levels', track: 'adults' },
  { day: 1, start: '08:00', end: '09:00', title: 'Drill Class', level: 'All Levels', track: 'adults' },
  { day: 1, start: '09:30', end: '10:45', title: 'Competition Training', gi: 'Gi', track: 'adults' },
  { day: 1, start: '12:00', end: '13:00', title: 'Jiu Jitsu', level: 'Advanced', track: 'adults' },
  { day: 1, start: '16:20', end: '17:00', title: "Kid's Comp Class", gi: 'Gi', track: 'kids' },
  { day: 1, start: '17:00', end: '18:00', title: "Kid's BJJ", ages: 'Ages 9–13', track: 'kids', trial: 'kids-9-13' },
  { day: 1, start: '17:00', end: '18:00', title: 'Jiu Jitsu', level: 'Fundamentals', track: 'adults', trial: 'adults-jj' },
  { day: 1, start: '18:00', end: '19:00', title: 'Jiu Jitsu', level: 'Advanced', track: 'adults' },
  { day: 1, start: '18:00', end: '19:00', title: 'Muay Thai', level: 'All Levels', track: 'muaythai' },
  { day: 1, start: '19:15', end: '20:15', title: 'Jiu Jitsu', level: 'Fundamentals', track: 'adults', trial: 'adults-jj' },

  /* ---- Tuesday --------------------------------------------------------- */
  { day: 2, start: '06:00', end: '07:00', title: 'Jiu Jitsu', level: 'All Levels', track: 'adults' },
  { day: 2, start: '08:00', end: '09:00', title: 'Drill Class', level: 'All Levels', track: 'adults' },
  { day: 2, start: '09:30', end: '10:30', title: 'Competition Training', gi: 'No-Gi', track: 'adults' },
  { day: 2, start: '10:30', end: '11:30', title: "Women's BJJ", track: 'women' },
  { day: 2, start: '12:00', end: '13:00', title: 'Jiu Jitsu', level: 'All Levels', track: 'adults' },
  { day: 2, start: '16:20', end: '17:00', title: "Kid's Comp Class", gi: 'No-Gi', track: 'kids' },
  { day: 2, start: '16:20', end: '17:00', title: "Kid's BJJ", ages: 'Ages 3–5', track: 'kids' },
  { day: 2, start: '17:00', end: '18:00', title: "Kid's BJJ", ages: 'Ages 6–8', track: 'kids', trial: 'kids-4-8' },
  { day: 2, start: '17:00', end: '18:00', title: 'Jiu Jitsu', level: 'Fundamentals', track: 'adults', trial: 'adults-jj' },
  { day: 2, start: '18:00', end: '19:00', title: 'Jiu Jitsu', level: 'Advanced', track: 'adults' },
  { day: 2, start: '18:15', end: '19:15', title: "Women's BJJ", track: 'women', trial: 'women' },
  { day: 2, start: '19:15', end: '20:15', title: 'No-Gi', level: 'All Levels', track: 'adults' },

  /* ---- Wednesday ------------------------------------------------------- */
  { day: 3, start: '06:00', end: '07:00', title: 'Jiu Jitsu', level: 'All Levels', track: 'adults' },
  { day: 3, start: '08:00', end: '09:00', title: 'Drill Class', level: 'All Levels', track: 'adults' },
  { day: 3, start: '09:30', end: '10:45', title: 'Competition Training', gi: 'Gi', track: 'adults' },
  { day: 3, start: '12:00', end: '13:00', title: 'Jiu Jitsu', level: 'Advanced', track: 'adults' },
  { day: 3, start: '16:20', end: '17:00', title: "Kid's Comp Class", gi: 'Gi', track: 'kids' },
  { day: 3, start: '17:00', end: '18:00', title: "Kid's BJJ", ages: 'Ages 9–13', track: 'kids', trial: 'kids-9-13' },
  { day: 3, start: '17:00', end: '18:00', title: 'Jiu Jitsu', level: 'Fundamentals', track: 'adults', trial: 'adults-jj' },
  { day: 3, start: '18:00', end: '19:00', title: 'Jiu Jitsu', level: 'Advanced', track: 'adults' },
  { day: 3, start: '18:00', end: '19:00', title: 'Muay Thai', level: 'All Levels', track: 'muaythai' },
  { day: 3, start: '19:15', end: '20:15', title: 'Jiu Jitsu', level: 'Fundamentals', track: 'adults', trial: 'adults-jj' },

  /* ---- Thursday -------------------------------------------------------- */
  { day: 4, start: '06:00', end: '07:00', title: 'Jiu Jitsu', level: 'All Levels', track: 'adults' },
  { day: 4, start: '08:00', end: '09:00', title: 'Drill Class', level: 'All Levels', track: 'adults' },
  { day: 4, start: '09:30', end: '10:30', title: 'Competition Training', gi: 'No-Gi', track: 'adults' },
  { day: 4, start: '10:30', end: '11:30', title: "Women's BJJ", track: 'women' },
  { day: 4, start: '12:00', end: '13:00', title: 'Jiu Jitsu', level: 'All Levels', track: 'adults' },
  { day: 4, start: '16:20', end: '17:00', title: "Kid's Comp Class", gi: 'No-Gi', track: 'kids' },
  { day: 4, start: '16:20', end: '17:00', title: "Kid's BJJ", ages: 'Ages 3–5', track: 'kids' },
  { day: 4, start: '17:00', end: '18:00', title: "Kid's BJJ", ages: 'Ages 6–8', track: 'kids', trial: 'kids-4-8' },
  { day: 4, start: '17:00', end: '18:00', title: 'Jiu Jitsu', level: 'Fundamentals', track: 'adults', trial: 'adults-jj' },
  { day: 4, start: '18:00', end: '19:00', title: 'Jiu Jitsu', level: 'Advanced', track: 'adults' },
  { day: 4, start: '18:15', end: '19:15', title: "Women's BJJ", track: 'women', trial: 'women' },
  { day: 4, start: '19:15', end: '20:15', title: 'No-Gi', level: 'All Levels', track: 'adults', trial: 'adults-nogi' },

  /* ---- Friday ---------------------------------------------------------- */
  { day: 5, start: '10:30', end: '11:30', title: 'No-Gi Submission Grappling', track: 'adults', trial: 'adults-nogi' },
  { day: 5, start: '17:00', end: null, title: 'Open Mat', track: 'adults', allAges: true },

  /* ---- Saturday -------------------------------------------------------- */
  { day: 6, start: '10:00', end: '11:00', title: "Kid's BJJ", ages: 'All Ages', track: 'kids', trial: 'kids-4-8' },
  { day: 6, start: '11:15', end: '12:15', title: 'Jiu Jitsu', level: 'All Levels', track: 'adults' },
]

/* ------------------------------------------------------------------ *
 * Derived: columns, rows and the dashboard numbers.
 * Nothing below is written by hand. A class added above creates its own
 * column, its own row and moves the counters.
 * ------------------------------------------------------------------ */

export const DAY_LABELS: Record<number, { short: string; long: string }> = {
  1: { short: 'Mon', long: 'Monday' },
  2: { short: 'Tue', long: 'Tuesday' },
  3: { short: 'Wed', long: 'Wednesday' },
  4: { short: 'Thu', long: 'Thursday' },
  5: { short: 'Fri', long: 'Friday' },
  6: { short: 'Sat', long: 'Saturday' },
}

export const TRACK_LABELS: Record<Track, string> = {
  adults: 'Adults',
  kids: 'Kids',
  women: 'Women',
  muaythai: 'Muay Thai',
}

const TRACK_ORDER: Track[] = ['adults', 'kids', 'women', 'muaythai']

/** Days that actually have a class, left to right. */
export const scheduleDays: number[] = [...new Set(classSessions.map((s) => s.day))].sort((a, b) => a - b)

/** Start times that actually have a class, top to bottom. */
export const scheduleTimes: string[] = [...new Set(classSessions.map((s) => s.start))].sort()

/** Audience filters that actually have a class. */
export const scheduleTracks: Track[] = TRACK_ORDER.filter((t) => classSessions.some((s) => s.track === t))

/** "18:15" -> "6:15 PM" */
export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

/**
 * "6:00 – 7:00 AM" when both ends share the period, "11:15 AM – 12:15 PM" when
 * they don't. En dash is the numeric-range dash and stays; the em dash never
 * reaches the screen.
 */
export function formatRange(start: string, end: string | null): string {
  if (!end) return formatTime(start)
  const a = formatTime(start)
  const b = formatTime(end)
  const periodA = a.slice(-2)
  const periodB = b.slice(-2)
  if (periodA === periodB) return `${a.slice(0, -3)} – ${b}`
  return `${a} – ${b}`
}

/** Minutes past midnight, for sorting and for the live-opening tolerance. */
export function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

/** The line under a class title: "Fundamentals", "Ages 6–8", "No-Gi". */
export function sessionDetail(session: ClassSession): string | null {
  return session.level ?? session.ages ?? session.gi ?? null
}

/** Stable identity of a class in the week, used as a React key and for lookups. */
export function sessionId(session: ClassSession): string {
  return `${session.day}|${session.start}|${session.title}|${sessionDetail(session) ?? ''}`
}

const lastEnd = classSessions.reduce((latest, s) => {
  const end = s.end ?? s.start
  return toMinutes(end) > toMinutes(latest) ? end : latest
}, '00:00')

export const scheduleStats = {
  classesPerWeek: classSessions.length,
  daysOpen: scheduleDays.length,
  firstClass: formatTime(scheduleTimes[0]),
  lastClassEnd: formatTime(lastEnd),
  dayRange: `${DAY_LABELS[scheduleDays[0]].short} to ${DAY_LABELS[scheduleDays[scheduleDays.length - 1]].short}`,
}
