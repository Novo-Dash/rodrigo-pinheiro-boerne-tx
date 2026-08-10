import { GradeStripes, Sunburst } from '@/back-to-school/components/ui/Ornaments'

type Tone = 'ink' | 'orange'

interface Props {
  items: readonly string[]
  tone?: Tone
  /** Seconds for one full pass. Longer band = longer duration, or it reads fast. */
  duration?: number
  className?: string
}

const TONES: Record<Tone, string> = {
  ink: 'bg-[var(--color-ink)] text-[var(--color-paper)]',
  orange: 'bg-[var(--color-orange)] text-[var(--color-ink)]',
}

/**
 * A moving band of the campaign's own words.
 *
 * The track is duplicated and the animation travels exactly half its width, so
 * the loop is seamless without measuring anything in JS. Hovering pauses it,
 * and reduced motion stops it dead with the first copy in place, which still
 * reads as a normal static band.
 *
 * The duplicate is aria-hidden: a screen reader hears the phrases once.
 */
export function Marquee({ items, tone = 'ink', duration = 38, className = '' }: Props) {
  const Track = ({ copy }: { copy: number }) => (
    <div className="flex shrink-0 items-center" aria-hidden={copy > 0 ? true : undefined}>
      {items.map((item, i) => (
        <span key={`${copy}-${item}-${i}`} className="flex shrink-0 items-center">
          <span className="font-display px-7 text-[1.0625rem] whitespace-nowrap sm:text-[1.25rem] lg:px-9 lg:text-[1.5rem]">
            {item}
          </span>
          {/* Alternating separators, both drawn from the academy's own crest. */}
          {i % 2 === 0 ? (
            <Sunburst
              rays={12}
              className="h-4 w-4 shrink-0 opacity-70 lg:h-[1.15rem] lg:w-[1.15rem]"
            />
          ) : (
            <GradeStripes count={3} className="h-3.5 w-5 shrink-0 opacity-70" />
          )}
        </span>
      ))}
    </div>
  )

  return (
    <div
      className={`marquee overflow-hidden py-3.5 lg:py-4 ${TONES[tone]} ${className}`}
      style={{ ['--marquee-duration' as string]: `${duration}s` }}
    >
      <div className="marquee-track">
        <Track copy={0} />
        <Track copy={1} />
      </div>
    </div>
  )
}
