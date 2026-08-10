import { Button } from '@/back-to-school/components/ui/Button'
import { GridColumns } from '@/back-to-school/components/ui/Backdrop'
import { GradeStripes } from '@/back-to-school/components/ui/Ornaments'
import { CTA, GALLERY, INSIDE } from '@/back-to-school/data/content'

interface Props {
  onBookClick: () => void
}

/**
 * Photo mosaic of the academy's own images. Cell sizes vary on purpose: a
 * uniform 3x2 grid of identical tiles would read as stock filler, and these
 * are real classes.
 */
const CELLS = [
  'col-span-2 aspect-[4/3] sm:col-span-2 sm:row-span-2 sm:aspect-auto',
  'col-span-1 aspect-square sm:aspect-auto',
  'col-span-1 aspect-square sm:aspect-auto',
  'col-span-2 aspect-[2/1] sm:aspect-auto',
  'col-span-1 aspect-square sm:col-span-2 sm:aspect-auto',
  'col-span-1 aspect-square sm:col-span-2 sm:aspect-auto',
]

export function Inside({ onBookClick }: Props) {
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

        <div className="mt-12 grid grid-cols-2 gap-3 sm:auto-rows-[190px] sm:grid-cols-4 lg:mt-16 lg:auto-rows-[230px] lg:gap-4">
          {GALLERY.map((photo, i) => (
            <figure
              key={photo.src}
              data-reveal
              className={`group overflow-hidden border border-[var(--color-line)] ${CELLS[i]}`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                width={328}
                height={240}
                /* Only the two large cells drift: parallax on a 190px tile is
                   noise, on a tall one it reads as depth. */
                {...(i === 0 || i === 3 ? { 'data-parallax': '0.05' } : {})}
                className={`h-full w-full object-cover transition-transform duration-[600ms] ease-[var(--ease-out-quint)] group-hover:scale-[1.06] ${
                  i === 0 || i === 3 ? 'parallax-media' : ''
                }`}
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
