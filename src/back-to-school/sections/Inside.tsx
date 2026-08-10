import { Button } from '@/back-to-school/components/ui/Button'
import { GridColumns } from '@/back-to-school/components/ui/Backdrop'
import { GradeStripes } from '@/back-to-school/components/ui/Ornaments'
import { CTA, GALLERY, INSIDE } from '@/back-to-school/data/content'

interface Props {
  onBookClick: () => void
}

/**
 * Photo wall of the academy's own images, laid out around what the source files
 * can actually carry.
 *
 * The four properly-shot 800x1120 frames take the tall cells. The four the
 * academy only supplied at 328x240 sit in the small square cells, where they
 * render at or below their native width instead of being stretched across half
 * the viewport, which is what made them look soft before.
 */
export function Inside({ onBookClick }: Props) {
  const big = GALLERY.filter((p) => p.big)
  const small = GALLERY.filter((p) => !p.big)

  return (
    <section
      id="inside"
      className="relative overflow-hidden border-t border-[var(--color-line)] py-20 lg:py-28"
    >
      <GridColumns />

      <div className="relative mx-auto max-w-[1240px] px-5 md:px-8">
        <div className="flex items-center gap-5">
          <h2
            data-reveal-lines
            className="bts-font-display text-[1.75rem] leading-[1.14] font-medium sm:text-[2.25rem] lg:text-[2.75rem]"
          >
            {INSIDE.headline}
          </h2>
          <GradeStripes
            data-reveal
            count={4}
            className="hidden h-6 w-9 shrink-0 text-[var(--color-orange)] sm:block"
          />
        </div>

        {/* Tall row: the high-resolution frames. */}
        <div className="mt-12 grid grid-cols-2 gap-3 lg:mt-16 lg:grid-cols-4 lg:gap-4">
          {big.map((photo, i) => (
            <figure
              key={photo.src}
              data-reveal
              className="group aspect-[3/4] overflow-hidden border border-[var(--color-line)]"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                width={photo.w}
                height={photo.h}
                /* Only the outer two drift, or the whole row moves as one slab. */
                {...(i === 0 || i === 3 ? { 'data-parallax': '0.04' } : {})}
                className={`h-full w-full object-cover transition-transform duration-[600ms] ease-[var(--ease-out-quint)] group-hover:scale-[1.05] ${
                  i === 0 || i === 3 ? 'parallax-media' : ''
                }`}
              />
            </figure>
          ))}
        </div>

        {/* Square row: the small originals, never scaled past what they hold. */}
        <div className="mt-3 grid grid-cols-2 gap-3 lg:mt-4 lg:grid-cols-4 lg:gap-4">
          {small.map((photo) => (
            <figure
              key={photo.src}
              data-reveal
              className="group aspect-[4/3] overflow-hidden border border-[var(--color-line)]"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                width={photo.w}
                height={photo.h}
                className="h-full w-full object-cover transition-transform duration-[600ms] ease-[var(--ease-out-quint)] group-hover:scale-[1.05]"
              />
            </figure>
          ))}
        </div>

        <div data-reveal className="mt-14 lg:mt-16">
          <Button magnetic onClick={onBookClick} className="w-full sm:w-auto">
            {CTA.standard}
          </Button>
        </div>
      </div>
    </section>
  )
}
