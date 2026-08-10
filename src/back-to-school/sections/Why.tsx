import {
  Brain,
  HandHeart,
  Heartbeat,
  Medal,
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
 * The six values read as a curriculum: a numbered entry, an icon for the thing
 * itself, and air between them instead of a hairline under every row, which
 * would turn a parent's reason to enrol into a spec sheet.
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
        <h2
          data-reveal-lines
          className="bts-font-display max-w-[26ch] text-[1.75rem] leading-[1.14] font-medium text-balance sm:text-[2.25rem] lg:text-[2.75rem]"
        >
          {WHY.headline}
        </h2>

        {/* A measured rule under the heading: the curriculum is about to start. */}
        <RulerTicks
          data-rule
          style={{ color: 'rgb(255 106 0 / 0.55)' }}
          className="mt-9 h-3 w-full origin-left lg:mt-11"
        />

        <ul className="mt-11 grid gap-x-14 gap-y-11 sm:grid-cols-2 lg:mt-14 lg:gap-y-12">
          {WHY.values.map((value, i) => {
            const Glyph = ICONS[i]
            return (
              <li key={value} data-reveal className="flex gap-5">
                <span className="flex shrink-0 flex-col items-center gap-2">
                  <Glyph
                    size={26}
                    weight="light"
                    aria-hidden="true"
                    className="text-[var(--color-orange-ink)]"
                  />
                  <span className="bts-font-display text-[0.9375rem] leading-none text-[var(--color-ink-mute)] tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </span>
                <span className="pt-0.5 text-[1.0625rem] leading-snug font-medium text-[var(--color-ink)] lg:text-[1.1875rem]">
                  {value}
                </span>
              </li>
            )
          })}
        </ul>

        <div data-reveal className="mt-14 lg:mt-16">
          <Button magnetic onClick={onBookClick} className="w-full sm:w-auto">
            {CTA.standard}
          </Button>
        </div>
      </div>
    </section>
  )
}
