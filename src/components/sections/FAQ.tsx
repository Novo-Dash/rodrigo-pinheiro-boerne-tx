import { useState } from 'react'
import { Section } from '@/components/ui'
import { faqItems } from '@/data/faq'

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null)

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <Section id="faq" aria-labelledby="faq-heading" className="py-20 md:py-28">
      <div className="grid gap-10 lg:grid-cols-12">

        {/* Left — title */}
        <div className="lg:col-span-4">
          <div className="inline-block bg-[var(--color-accent)] px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent-ink)] mb-4">
            FAQ
          </div>
          <h2
            id="faq-heading"
            className="text-fluid-section uppercase leading-[0.95] tracking-tight"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
          >
            Common{' '}
            <span style={{ color: 'var(--color-accent)' }}>questions</span>
          </h2>
          <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
            We've answered the most common questions about Brazilian Jiu-Jitsu training,
            safety, and what to expect as a beginner.
          </p>
        </div>

        {/* Right — accordion */}
        <div className="lg:col-span-8 border-t-2 border-black/10">
          {faqItems.map((item, i) => {
            const isOpen = openId === item.id
            return (
              <div key={item.id} className="border-b-2 border-black/10">
                <button
                  type="button"
                  className="flex w-full items-baseline gap-4 py-8 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-inset"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  id={`faq-trigger-${item.id}`}
                  onClick={() => toggle(item.id)}
                >
                  <span
                    className="shrink-0 text-sm font-bold uppercase tracking-widest"
                    style={{ color: 'var(--color-accent-dark)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 text-lg font-semibold text-[var(--color-text)]">
                    {item.question}
                  </span>
                  <span
                    className="shrink-0 text-[var(--color-accent)] transition-transform duration-200"
                    style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0)' }}
                    aria-hidden="true"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${item.id}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${item.id}`}
                    className="pl-10 pb-5"
                  >
                    <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </Section>
  )
}
