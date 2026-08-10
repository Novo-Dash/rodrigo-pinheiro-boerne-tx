import { Button } from '@/back-to-school/components/ui/Button'
import { Backdrop } from '@/back-to-school/components/ui/Backdrop'
import { CropMarks } from '@/back-to-school/components/ui/Ornaments'
import { CTA, HERO } from '@/back-to-school/data/content'

interface Props {
  onBookClick: () => void
}

/**
 * Magazine opener: the type row runs first as a spread (promise on the left,
 * the ask on the right), then one cinematic band of the academy's own kids
 * class bleeds past the container to the edges of the screen.
 *
 * The two-column header is allowed here precisely because the right column is
 * not filler prose: it carries the page's primary call to action.
 */
export function Hero({ onBookClick }: Props) {
  return (
    <section
      id="top"
      className="relative flex min-h-[calc(100dvh-4rem)] flex-col justify-center gap-10 overflow-hidden py-10 lg:gap-14 lg:py-12"
    >
      <Backdrop variant="graph" fade="top" />

      <div className="relative mx-auto w-full max-w-[1240px] px-5 md:px-8">
        {/* Trim marks, as on a printer's proof of the cover. */}
        <CropMarks className="absolute top-0 left-0 hidden h-5 w-5 text-[var(--color-orange)] lg:block" />
        <CropMarks className="absolute top-0 right-0 hidden h-5 w-5 rotate-90 text-[var(--color-orange)] lg:block" />

        <div className="grid gap-9 lg:grid-cols-[1.22fr_0.78fr] lg:items-end lg:gap-16">
          <h1
            data-reveal-hero-lines
            className="bts-font-display text-[2.25rem] leading-[1.08] font-medium text-balance sm:text-[2.75rem] lg:text-[3.25rem]"
          >
            This school year, give your child confidence that goes{' '}
            <span className="em-italic">beyond the classroom.</span>
          </h1>

          <div>
            <p
              data-hero-reveal
              className="max-w-[42ch] text-[1.0625rem] leading-relaxed text-[var(--color-ink-soft)]"
            >
              {HERO.body}
            </p>
            <div data-hero-reveal className="mt-7">
              <Button magnetic onClick={onBookClick} className="w-full sm:w-auto">
                {CTA.hero}
              </Button>
            </div>
          </div>
        </div>

        <div
          data-rule="load"
          className="mt-9 h-px w-full origin-left bg-[var(--color-orange)] lg:mt-11"
        />
      </div>

      {/* Full-bleed band. object-position keeps the children in frame while the
          crop tightens on wide screens. */}
      <figure
        data-hero-art
        className="aspect-[4/3] w-full overflow-hidden sm:aspect-[2/1] lg:aspect-[3/1]"
      >
        <img
          src="/kids-group.webp"
          width={1080}
          height={810}
          alt="Kids and teens of the RPBJJ Boerne children's program together on the academy mats"
          fetchPriority="high"
          data-parallax="0.06"
          className="parallax-media h-full w-full object-cover object-[50%_58%]"
        />
      </figure>
    </section>
  )
}
