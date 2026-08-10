import {
  Backpack,
  Brain,
  HandHeart,
  Heartbeat,
  Medal,
  PencilRuler,
  ShieldCheck,
  Sparkle,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { Button } from '@/back-to-school/components/ui/Button'
import { GridColumns } from '@/back-to-school/components/ui/Backdrop'
import { RulerTicks } from '@/back-to-school/components/ui/Ornaments'
import { CTA, WHY } from '@/back-to-school/data/content'

interface Props {
  onBookClick: () => void
}

/**
 * The six values read as a curriculum. Headline and CTA are centred so the
 * chapter opens and closes on the page's axis, with the entries themselves
 * still left-read inside their tiles.
 *
 * Icon order matches WHY.values: discipline, respect, confidence, resilience,
 * self-control, healthy habits.
 */
const ICONS: Icon[] = [Medal, HandHeart, ShieldCheck, Sparkle, Brain, Heartbeat]

export function Why({ onBookClick }: Props) {
  return (
    <section
      id="why"
      className="relative overflow-hidden border-t border-[var(--color-line)] py-20 lg:py-28"
    >
      <GridColumns />

      <div className="relative mx-auto max-w-[1240px] px-5 md:px-8">
        {/* Back to school, said with the two objects a parent packs in September. */}
        <div data-reveal className="flex items-center justify-center gap-3">
          <Backpack
            size={24}
            weight="light"
            aria-hidden="true"
            className="text-[var(--color-orange-ink)]"
          />
          <RulerTicks
            style={{ color: 'rgb(255 106 0 / 0.5)' }}
            className="h-3 w-24 sm:w-36"
          />
          <PencilRuler
            size={24}
            weight="light"
            aria-hidden="true"
            className="text-[var(--color-orange-ink)]"
          />
        </div>

        <h2
          data-reveal-lines
          className="bts-font-display mx-auto mt-7 max-w-[32ch] text-center text-[1.75rem] leading-[1.14] font-medium text-balance sm:text-[2.25rem] lg:text-[2.75rem]"
        >
          {WHY.headline}
        </h2>

        <ul className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:gap-y-11">
          {WHY.values.map((value, i) => {
            const Glyph = ICONS[i]
            return (
              <li key={value} data-reveal className="flex items-start gap-5">
                <span className="relative grid h-14 w-14 shrink-0 place-items-center border border-[var(--color-line)] bg-[var(--color-card)]">
                  <Glyph
                    size={26}
                    weight="light"
                    aria-hidden="true"
                    className="text-[var(--color-orange-ink)]"
                  />
                  <span
                    aria-hidden="true"
                    className="bts-font-display absolute -top-2 -left-2 grid h-6 w-6 place-items-center bg-[var(--color-orange)] text-[0.75rem] leading-none font-semibold text-[var(--color-ink)] tabular-nums"
                  >
                    {i + 1}
                  </span>
                </span>
                <span className="pt-3 text-[1.0625rem] leading-snug font-medium text-[var(--color-ink)] lg:text-[1.1875rem]">
                  {value}
                </span>
              </li>
            )
          })}
        </ul>

        <div data-reveal className="mt-14 flex justify-center lg:mt-16">
          <Button magnetic onClick={onBookClick} className="w-full sm:w-auto">
            {CTA.standard}
          </Button>
        </div>
      </div>
    </section>
  )
}
