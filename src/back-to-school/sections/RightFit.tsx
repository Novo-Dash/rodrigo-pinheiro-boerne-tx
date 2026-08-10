import { Check } from '@phosphor-icons/react'
import { Button } from '@/back-to-school/components/ui/Button'
import { Backdrop } from '@/back-to-school/components/ui/Backdrop'
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
      {/* Sober on purpose: the questions are the section, so the mesh is dots at
          a wide pitch rather than graph paper, and the ray fan is gone. */}
      <Backdrop variant="dots" />

      <div className="relative mx-auto max-w-[880px] px-5 text-center md:px-8">
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

        {/* One card per question. The last one is given the full width so five
            items fill the grid exactly, with no empty cell at the end. */}
        <ul className="mt-12 grid gap-4 text-left sm:grid-cols-2 lg:mt-14">
          {FIT.questions.map((question, i) => (
            <li
              key={question}
              data-reveal
              className={`group flex items-start gap-4 border border-[var(--color-line)] bg-[var(--color-card)] p-6 transition-[transform,border-color,box-shadow] duration-300 ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:border-[var(--color-orange)] hover:shadow-[0_16px_40px_-24px_rgba(23,20,15,0.35)] lg:p-7 ${
                i === FIT.questions.length - 1 ? 'sm:col-span-2' : ''
              }`}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center border border-[var(--color-line)] transition-colors duration-300 group-hover:border-[var(--color-orange)] group-hover:bg-[var(--color-orange)]">
                <Check
                  size={17}
                  weight="bold"
                  aria-hidden="true"
                  className="text-[var(--color-orange-ink)] transition-colors duration-300 group-hover:text-[var(--color-ink)]"
                />
              </span>
              <span className="bts-font-display pt-1 text-[1.0625rem] leading-snug text-[var(--color-ink)] lg:text-[1.1875rem]">
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
