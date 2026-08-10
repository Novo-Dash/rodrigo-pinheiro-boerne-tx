import { CalendarCheck, CursorClick, EnvelopeSimple } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { Button } from '@/back-to-school/components/ui/Button'
import { Backdrop } from '@/back-to-school/components/ui/Backdrop'
import { CTA, HOW } from '@/back-to-school/data/content'

interface Props {
  onBookClick: () => void
}

/**
 * A timeline, not three cards: one rule runs through all three markers so the
 * steps read as one continuous booking flow. Each marker is the step's own
 * icon sitting on the rule, on a solid tile that cuts the line behind it.
 */
const ICONS: Icon[] = [CursorClick, CalendarCheck, EnvelopeSimple]

export function HowToStart({ onBookClick }: Props) {
  return (
    <section
      id="how"
      className="relative overflow-hidden bg-[var(--color-paper-2)] py-20 lg:py-28"
    >
      <Backdrop variant="mat" />

      <div className="relative mx-auto max-w-[1240px] px-5 md:px-8">
        <h2
          data-reveal-lines
          className="bts-font-display text-[1.75rem] leading-[1.14] font-medium sm:text-[2.25rem] lg:text-[2.75rem]"
        >
          {HOW.headline}
        </h2>

        <ol className="relative mt-12 grid gap-10 lg:mt-16 lg:grid-cols-3 lg:gap-12">
          {/* The connecting rule, in two layers: a static hairline for the whole
              path, and an orange trace that runs 1 -> 2 -> 3 on a loop so the
              three markers read as one flow instead of three separate boxes.
              Vertical on mobile, horizontal from lg up. */}
          <span
            aria-hidden="true"
            className="absolute top-6 bottom-6 left-[23px] w-px bg-[var(--color-line)] lg:top-[23px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-full"
          />
          <span
            aria-hidden="true"
            className="trace-y absolute top-6 bottom-6 left-[23px] w-px bg-[var(--color-orange)] lg:hidden"
          />
          <span
            aria-hidden="true"
            className="trace-x absolute top-[23px] right-0 left-0 hidden h-px bg-[var(--color-orange)] lg:block"
          />

          {HOW.steps.map((step, i) => {
            const Glyph = ICONS[i]
            return (
              <li key={step.n} data-reveal className="relative pl-16 lg:pt-16 lg:pl-0">
                <span
                  aria-hidden="true"
                  /* Each marker pulses as the trace reaches it: the delays are
                     the trace's own timing, split across the three steps. */
                  style={{ ['--step-delay' as string]: `${i * 1.1}s` }}
                  className="step-marker absolute top-0 left-0 grid h-12 w-12 place-items-center border border-[var(--color-ink)] bg-[var(--color-orange)] text-[var(--color-ink)]"
                >
                  <Glyph size={22} weight="regular" />
                </span>
                <p className="text-[0.75rem] font-semibold tracking-[0.16em] text-[var(--color-ink-soft)] uppercase">
                  {step.n}
                </p>
                <p className="bts-font-display mt-2 max-w-[30ch] text-[1.1875rem] leading-snug text-[var(--color-ink)] lg:text-[1.375rem]">
                  {step.text}
                </p>
              </li>
            )
          })}
        </ol>

        <div data-reveal className="mt-14 lg:mt-16">
          <Button magnetic onClick={onBookClick} className="w-full sm:w-auto">
            {CTA.schedule}
          </Button>
        </div>
      </div>
    </section>
  )
}
