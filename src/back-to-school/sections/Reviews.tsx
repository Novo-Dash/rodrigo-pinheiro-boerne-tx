import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import type { EmblaCarouselType } from 'embla-carousel'
import { ArrowLeft, ArrowRight, Quotes, Star } from '@phosphor-icons/react'
import gsap from 'gsap'
import { Button } from '@/back-to-school/components/ui/Button'
import { Backdrop } from '@/back-to-school/components/ui/Backdrop'
import { GradeStripes } from '@/back-to-school/components/ui/Ornaments'
import { CTA, REVIEWS, STUDENTS } from '@/back-to-school/data/content'

interface Props {
  onBookClick: () => void
}

function Stars() {
  return (
    <span className="flex gap-0.5" aria-label="Rated 5 out of 5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={14} weight="fill" className="text-[var(--color-orange-deep)]" />
      ))}
    </span>
  )
}

/**
 * Reviews as a draggable rail rather than a static grid.
 *
 * The motion is doing a job: the card nearest the middle is at full weight and
 * its neighbours sit back, so at any moment there is exactly one review being
 * read and the rest read as "there are more of these". Distance to centre is
 * measured from the real geometry and written straight to the transform, never
 * through React state, so dragging stays at frame rate.
 */
export function Reviews({ onBookClick }: Props) {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const [emblaRef, embla] = useEmblaCarousel(
    { loop: true, align: 'center', skipSnaps: false, dragFree: false },
    reduced ? [] : [Autoplay({ delay: 5200, stopOnMouseEnter: true, stopOnInteraction: false })]
  )
  const [selected, setSelected] = useState(0)

  /** Weight each card by how close its centre is to the rail's centre. */
  const paint = useCallback(
    (api: EmblaCarouselType) => {
      if (reduced) return
      const root = api.containerNode().parentElement
      if (!root) return
      const mid = root.getBoundingClientRect().left + root.clientWidth / 2

      api.slideNodes().forEach((slide) => {
        const card = slide.firstElementChild as HTMLElement | null
        if (!card) return
        const r = slide.getBoundingClientRect()
        const d = Math.abs(mid - (r.left + r.width / 2)) / root.clientWidth
        gsap.set(card, {
          scale: gsap.utils.clamp(0.9, 1, 1 - d * 0.22),
          opacity: gsap.utils.clamp(0.32, 1, 1 - d * 1.15),
        })
      })
    },
    [reduced]
  )

  useEffect(() => {
    if (!embla) return
    const sync = () => setSelected(embla.selectedScrollSnap())
    paint(embla)
    sync()
    embla.on('scroll', paint).on('reInit', paint).on('select', sync)
    return () => {
      embla.off('scroll', paint).off('reInit', paint).off('select', sync)
    }
  }, [embla, paint])

  return (
    <section
      id="reviews"
      className="relative overflow-hidden border-t border-[var(--color-line)] py-20 lg:py-28"
    >
      <Backdrop variant="ruled" />

      <div className="relative mx-auto max-w-[1240px] px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2
            data-reveal-lines
            className="bts-font-display max-w-[22ch] text-[1.75rem] leading-[1.14] font-medium text-balance sm:text-[2.25rem] lg:text-[2.75rem]"
          >
            {STUDENTS.headline}
          </h2>

          <div data-reveal className="flex items-center gap-4">
            <GradeStripes
              count={4}
              className="hidden h-5 w-9 text-[var(--color-orange)] sm:block"
            />
            <button
              type="button"
              onClick={() => embla?.scrollPrev()}
              aria-label="Previous review"
              className="grid h-12 w-12 place-items-center border border-[var(--color-ink)] text-[var(--color-ink)] transition-colors duration-200 hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => embla?.scrollNext()}
              aria-label="Next review"
              className="grid h-12 w-12 place-items-center border border-[var(--color-ink)] text-[var(--color-ink)] transition-colors duration-200 hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
            >
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* The rail bleeds past the container so the neighbouring cards are cut by
          the screen edge, which is what tells the reader it can be dragged. */}
      <div data-reveal className="relative mt-12 lg:mt-16">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {REVIEWS.map((review) => (
              <div
                key={review.name}
                className="min-w-0 flex-[0_0_86%] pl-5 sm:flex-[0_0_58%] md:pl-8 lg:flex-[0_0_40%]"
              >
                <figure className="flex h-full flex-col border border-[var(--color-line)] bg-[var(--color-card)] p-7 lg:p-9">
                  <Quotes
                    size={26}
                    weight="fill"
                    aria-hidden="true"
                    className="text-[var(--color-orange)]"
                  />
                  <blockquote className="bts-font-display mt-5 flex-1 text-[1.125rem] leading-[1.5] text-[var(--color-ink)] lg:text-[1.3125rem]">
                    {review.text}
                  </blockquote>
                  <figcaption className="mt-7 flex items-center justify-between gap-4 border-t border-[var(--color-line)] pt-5">
                    <span className="text-[0.9375rem] font-medium text-[var(--color-ink-soft)]">
                      {review.name}
                    </span>
                    <Stars />
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1240px] px-5 md:px-8">
        {/* Progress marks double as the pager: the active one grows into a bar.
            The mark is 3px tall but its button is not: the padding gives each
            one a full-height touch target without changing how it looks. */}
        <div className="mt-7 flex items-center gap-2">
          {REVIEWS.map((review, i) => (
            <button
              key={review.name}
              type="button"
              aria-label={`Show the review by ${review.name}`}
              aria-current={selected === i}
              onClick={() => embla?.scrollTo(i)}
              className="group py-3"
            >
              <span
                className={`block h-[3px] transition-all duration-500 ease-[var(--ease-out-quint)] ${
                  selected === i
                    ? 'w-12 bg-[var(--color-orange)]'
                    : 'w-6 bg-[var(--color-line)] group-hover:bg-[var(--color-ink-mute)]'
                }`}
              />
            </button>
          ))}
        </div>

        <div data-reveal className="mt-12 lg:mt-14">
          <Button magnetic onClick={onBookClick} className="w-full sm:w-auto">
            {CTA.standard}
          </Button>
        </div>
      </div>
    </section>
  )
}
