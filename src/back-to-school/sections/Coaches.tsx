import { Trophy } from '@phosphor-icons/react'
import { Backdrop } from '@/back-to-school/components/ui/Backdrop'
import { Sunburst } from '@/back-to-school/components/ui/Ornaments'
import { COACHES } from '@/back-to-school/data/content'

/**
 * Credibility, placed early: the trust signal a parent needs sits in its own
 * chapter right under the argument, rather than being crammed into the hero as
 * a micro-strip. Bios and titles are the academy's own published copy.
 */
export function Coaches() {
  return (
    <section
      id="coaches"
      className="relative overflow-hidden bg-[var(--color-paper-2)] py-20 lg:py-28"
    >
      <Backdrop variant="dots" />

      {/* Half a ray fan rising from the bottom edge, behind the lineage story. */}
      <Sunburst
        data-drift="24"
        rays={18}
        spread={180}
        rotate={-90}
        style={{ color: 'rgb(255 106 0 / 0.07)' }}
        className="pointer-events-none absolute -bottom-72 left-1/2 hidden h-[36rem] w-[36rem] -translate-x-1/2 lg:block"
      />

      <div className="relative mx-auto max-w-[1240px] px-5 md:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <figure
            data-reveal
            className="order-2 aspect-square overflow-hidden border border-[var(--color-line)] lg:order-1"
          >
            <img
              src="/lutadores.webp"
              width={629}
              height={629}
              alt="Manuel Ribamar and Nathiely De Jesus, head coaches at RPBJJ Boerne"
              loading="lazy"
              data-parallax="0.05"
              className="parallax-media h-full w-full object-cover"
            />
          </figure>

          <div className="order-1 lg:order-2">
            <h2
              data-reveal-lines
              className="bts-font-display max-w-[20ch] text-[1.75rem] leading-[1.14] font-medium text-balance sm:text-[2.25rem] lg:text-[2.5rem]"
            >
              Meet the coaches your child will train with.
            </h2>

            <p
              data-reveal
              className="mt-6 max-w-[56ch] text-[1.0625rem] leading-relaxed text-[var(--color-ink-soft)]"
            >
              {COACHES.story}
            </p>

            <dl data-reveal className="mt-10 grid gap-8 sm:grid-cols-2">
              {COACHES.people.map((person) => (
                <div key={person.name} className="border-t border-[var(--color-ink)] pt-4">
                  <dt className="bts-font-display flex items-center gap-2 text-[1.25rem] font-semibold text-[var(--color-ink)]">
                    <Trophy
                      size={18}
                      weight="light"
                      aria-hidden="true"
                      className="shrink-0 text-[var(--color-orange-ink)]"
                    />
                    {person.name}
                  </dt>
                  <dd className="mt-1 text-[0.9375rem] leading-snug text-[var(--color-ink-soft)]">
                    {person.titles.map((title) => (
                      <span key={title} className="block">
                        {title}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
