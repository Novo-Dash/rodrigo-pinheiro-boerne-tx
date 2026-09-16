import { Section, SectionHeader, Button } from '@/components/ui'

interface OurInstructorsProps {
  onBookClick: () => void
}

const instructors = [
  {
    id: 'manuel',
    firstName: 'Manuel',
    fullName: 'Manuel Ribamar',
    highlight: 'Currently competing in UFC BJJ',
    titles: [
      'World Champion · No-Gi',
      'World Champion · Gi',
      'European Champion',
      '2x Pan American Champion · Gi',
      '2x Pan American Champion · No-Gi',
    ],
  },
  {
    id: 'nathi',
    firstName: 'Nathiely',
    fullName: 'Nathiely De Jesus',
    highlight: 'ADCC Veteran',
    titles: [
      '5x World Champion · Gi',
      '3x World Champion · No-Gi',
      '2x Pan American Champion',
      '2x European Champion',
    ],
  },
]

export function OurInstructors({ onBookClick }: OurInstructorsProps) {
  return (
    <Section id="our-instructors" aria-labelledby="instructors-heading">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] items-center">

        {/* Text */}
        <div>
          <SectionHeader
            id="instructors-heading"
            label="Meet the Team"
            title="MEET MANUEL AND NATHIELY, WORLD CHAMPION HEAD COACHES"
            titleNode={<>MEET MANUEL AND NATHIELY, <span style={{ color: 'var(--color-accent)' }}>WORLD CHAMPION HEAD COACHES</span></>}
          />
          <p className="text-fluid-body text-[var(--color-text-secondary)] leading-relaxed mb-8 max-w-xl">
            Both share a story of resilience: they came from Brazil with a dream of conquering the World Championship, but it was not easy. They needed help from many people and Manuel even slept on the mats to save money. That journey made both of them world-class instructors who learned how to pursue any goal with discipline. Now, they want to pass that mindset on to their students, no matter the age or level.
          </p>
          <Button onClick={onBookClick} size="lg">
            Click to meet them in your first free trial class
          </Button>
        </div>

        {/* Single parent square */}
        <div className="relative">
          <div className="relative aspect-square overflow-hidden bg-neutral-100 border-2 border-black shadow-[16px_16px_0_0_#000] flex flex-col">

            {/* Single image filling the card */}
            <div className="relative flex-1 overflow-hidden bg-neutral-200">
              <img
                src="/11.png"
                alt="Manuel e Nathiely, Head Coaches"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

              {/* Top badge */}
              <div className="absolute left-4 top-4 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                Head Coaches
              </div>
            </div>

          </div>

          {/* Two floating credential cards at the bottom */}
          <div className="grid gap-4 mt-6 sm:grid-cols-2">
            {instructors.map((coach) => (
              <div
                key={coach.id}
                className="bg-white border-2 border-black p-4 shadow-[8px_8px_0_0_var(--color-accent)]"
              >
                <div className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] mb-1">
                  Head Coach
                </div>
                <div className="text-base font-normal uppercase leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                  {coach.fullName}
                </div>
                <div className="mt-2 inline-block bg-[var(--color-accent)] px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  {coach.highlight}
                </div>
                <ul className="mt-3 flex flex-col gap-1.5 border-t-2 border-black pt-3" role="list">
                  {coach.titles.map((title) => (
                    <li
                      key={title}
                      className="flex items-start gap-2 text-sm leading-snug text-[var(--color-text-secondary)]"
                    >
                      <span
                        className="mt-[7px] block h-1.5 w-1.5 shrink-0 bg-[var(--color-accent)]"
                        aria-hidden="true"
                      />
                      {title}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Section>
  )
}
