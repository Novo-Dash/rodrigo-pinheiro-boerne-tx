import { Section, SectionHeader } from '@/components/ui'
import { scheduleSlots } from '@/data/schedule'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const TYPE_COLORS: Record<string, string> = {
  kids:   '#3B82F6',
  adults: '#FF6A00',
  women:  '#7C3AED',
  all:    '#059669',
}

export function OurSchedule() {
  return (
    <Section id="our-schedule" aria-labelledby="schedule-heading" subtle>
      <SectionHeader
        id="schedule-heading"
        label="Schedule"
        title="OUR SCHEDULE"
        subtitle="Find the right time to stay consistent on your journey."
      />

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-8">
        {[
          { type: 'kids',   label: 'Kids BJJ' },
          { type: 'adults', label: 'Adults BJJ' },
          { type: 'women',  label: 'Women BJJ' },
          { type: 'all',    label: 'Open Mat' },
        ].map(({ type, label }) => (
          <div key={type} className="flex items-center gap-2">
            <span
              className="block h-3 w-3 rounded-full"
              style={{ background: TYPE_COLORS[type] }}
              aria-hidden="true"
            />
            <span className="text-xs text-[var(--color-text-secondary)]">{label}</span>
          </div>
        ))}
      </div>

      {/* Schedule grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse" role="grid" aria-label="Class schedule">
          <thead>
            <tr>
              {DAYS.map((day) => (
                <th
                  key={day}
                  scope="col"
                  className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] border-b border-[var(--color-border)] bg-[var(--color-surface)]"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {DAYS.map((day) => {
                const daySlots = scheduleSlots.filter((s) => s.day === day)
                return (
                  <td key={day} className="align-top px-4 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                    {daySlots.length === 0 ? (
                      <span className="text-xs text-[var(--color-text-muted)]">·</span>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {daySlots.map((slot, i) => (
                          <div
                            key={i}
                            className="rounded-lg px-2 py-1.5"
                            style={{ background: `${TYPE_COLORS[slot.programType]}18` }}
                          >
                            <p className="text-xs font-semibold" style={{ color: TYPE_COLORS[slot.programType] }}>
                              {slot.label}
                            </p>
                            <p className="text-xs text-[var(--color-danger)] font-medium mt-0.5">
                              {slot.time}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </Section>
  )
}
