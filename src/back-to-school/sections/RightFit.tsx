import { Check } from '@phosphor-icons/react'
import { Button } from '@/back-to-school/components/ui/Button'
import { Backdrop } from '@/back-to-school/components/ui/Backdrop'
import { Sunburst } from '@/back-to-school/components/ui/Ornaments'
import { CTA, FIT } from '@/back-to-school/data/content'

interface Props {
  onBookClick: () => void
}

/**
 * The one centred moment on the page. This section is five questions a parent
 * asks themselves, so the message is the composition: a single narrow column,
 * no photo, nothing to look at but the questions.
 */
export function RightFit({ onBookClick }: Props) {
  return (
    <section
      id="right-fit"
      className="relative overflow-hidden border-t border-[var(--color-line)] py-20 lg:py-28"
    >
      <Backdrop variant="graph" />

      {/* Rays behind the questions, opening downward over the column. */}
      <Sunburst
        data-drift="18"
        rays={20}
        spread={200}
        rotate={90}
        style={{ color: 'rgb(255 106 0 / 0.06)' }}
        className="pointer-events-none absolute -top-[22rem] left-1/2 hidden h-[44rem] w-[44rem] -translate-x-1/2 lg:block"
      />

      <div className="relative mx-auto max-w-[760px] px-5 text-center md:px-8">
        <h2
          data-reveal-lines
          className="bts-font-display text-[1.75rem] leading-[1.14] font-medium text-balance sm:text-[2.25rem] lg:text-[2.75rem]"
        >
          {FIT.headline}
        </h2>

        <p
          data-reveal
          className="mx-auto mt-5 max-w-[52ch] text-[1.0625rem] leading-relaxed text-[var(--color-ink-soft)]"
        >
          {FIT.intro}
        </p>

        <ul className="mt-12 grid gap-6 text-left lg:mt-14">
          {FIT.questions.map((question) => (
            <li key={question} data-reveal className="flex gap-4">
              <Check
                size={20}
                weight="bold"
                aria-hidden="true"
                className="mt-1.5 shrink-0 text-[var(--color-orange-ink)]"
              />
              <span className="bts-font-display text-[1.125rem] leading-snug text-[var(--color-ink)] lg:text-[1.375rem]">
                {question}
              </span>
            </li>
          ))}
        </ul>

        <p
          data-reveal
          className="mx-auto mt-12 max-w-[54ch] text-[1.0625rem] leading-relaxed text-[var(--color-ink-soft)] lg:mt-14"
        >
          {FIT.closing}
        </p>

        <div data-reveal className="mt-10">
          <Button magnetic onClick={onBookClick} className="w-full sm:w-auto">
            {CTA.standard}
          </Button>
        </div>
      </div>
    </section>
  )
}
