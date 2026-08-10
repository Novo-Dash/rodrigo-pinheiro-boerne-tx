import { useState } from 'react'
import { Plus } from '@phosphor-icons/react'
import { Button } from '@/back-to-school/components/ui/Button'
import { Backdrop } from '@/back-to-school/components/ui/Backdrop'
import { GradeStripes } from '@/back-to-school/components/ui/Ornaments'
import { CTA, FAQ_ITEMS } from '@/back-to-school/data/content'

interface Props {
  onBookClick: () => void
}

/**
 * Accordion. The headline column stays put while the answers open beside it,
 * which is the one place on the page where a two-column header earns itself:
 * the right column is the interactive element, not filler text.
 */
export function Faq({ onBookClick }: Props) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-[var(--color-paper-2)] py-20 lg:py-28"
    >
      <Backdrop variant="ruled" />

      <div className="relative mx-auto max-w-[1240px] px-5 md:px-8">
        {/* items-start is what lets the left column stick: on a stretched grid
            item the sticky box is already as tall as the row and has nothing to
            travel through. With it, the block rides the whole accordion. */}
        <div className="grid items-start gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div className="lg:sticky lg:top-24">
            <div data-reveal className="flex items-center gap-3">
              <span className="inline-flex items-center border border-[var(--color-ink)] bg-[var(--color-orange)] px-3 py-1.5 text-[0.6875rem] font-semibold tracking-[0.16em] text-[var(--color-ink)] uppercase">
                Back to School
              </span>
              <GradeStripes count={3} className="h-4 w-5 text-[var(--color-orange)]" />
            </div>

            <h2
              data-reveal-lines
              className="bts-font-display mt-5 text-[1.75rem] leading-[1.14] font-medium sm:text-[2.25rem] lg:text-[2.75rem]"
            >
              Common questions
            </h2>
          </div>

          <div data-reveal className="border-t border-[var(--color-ink)]">
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = open === i
              return (
                <div key={item.q} className="border-b border-[var(--color-line)]">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      className="flex w-full items-start justify-between gap-6 py-5 text-left"
                    >
                      <span className="bts-font-display text-[1.0625rem] leading-snug font-medium text-[var(--color-ink)] lg:text-[1.25rem]">
                        {item.q}
                      </span>
                      <Plus
                        size={20}
                        weight="bold"
                        aria-hidden="true"
                        className={`mt-0.5 shrink-0 text-[var(--color-orange-ink)] transition-transform duration-300 ${
                          isOpen ? 'rotate-45' : ''
                        }`}
                      />
                    </button>
                  </h3>

                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[var(--ease-out-quint)] ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[62ch] pb-6 text-[1rem] leading-relaxed text-[var(--color-ink-soft)]">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}

            <div className="mt-12">
              <Button magnetic onClick={onBookClick} className="w-full sm:w-auto">
                {CTA.standard}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
