import { Section, SectionHeader } from '@/components/ui'
import { MagneticButton } from '@/components/ui/MagneticButton'

interface HowToStartProps {
  onBookClick: () => void
}

const STEPS = [
  {
    n: '01',
    icon: CalendarCheck,
    title: 'Fill out the form',
    body: 'Click the button and fill out the form.',
  },
  {
    n: '02',
    icon: Clock3,
    title: 'Choose your class',
    body: 'Choose your class type and pick a date & time on the calendar.',
  },
  {
    n: '03',
    icon: MailCheck,
    title: 'Confirmation',
    body: "You'll get email and SMS confirmations with all the details.",
  },
]

export function HowToStart({ onBookClick }: HowToStartProps) {
  return (
    <Section id="how-to-start" aria-labelledby="how-heading">
      <SectionHeader
        id="how-heading"
        label="Getting started"
        title="HOW TO GET STARTED?"
        titleNode={<>HOW TO GET <span style={{ color: 'var(--color-accent)' }}>STARTED?</span></>}
      />

      <div className="grid gap-6 md:grid-cols-3 md:gap-8 mb-12">
        {STEPS.map((s) => {
          const Icon = s.icon
          return (
            <article
              key={s.n}
              className="group relative bg-white border-2 border-black p-10 md:p-16 transition-all duration-200 hover:shadow-[12px_12px_0_0_var(--color-accent)] hover:-translate-x-px hover:-translate-y-px"
            >
              <div className="flex items-start justify-between">
                <div
                  className="text-6xl md:text-7xl font-black leading-none text-[var(--color-accent)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {s.n}
                </div>
                <Icon />
              </div>
              <h3
                className="mt-6 text-2xl md:text-3xl font-bold uppercase tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {s.title}
              </h3>
              <p className="mt-3 text-[var(--color-text-secondary)]">{s.body}</p>
            </article>
          )
        })}
      </div>

      <div className="flex justify-center">
        <MagneticButton onClick={onBookClick}>
          Schedule Free Trial Class
        </MagneticButton>
      </div>
    </Section>
  )
}

function CalendarCheck() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <polyline points="9 16 11 18 15 14" />
    </svg>
  )
}

function Clock3() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16.5 12" />
    </svg>
  )
}

function MailCheck() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      <path d="m16 19 2 2 4-4" />
    </svg>
  )
}
