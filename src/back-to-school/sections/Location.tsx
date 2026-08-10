import { EnvelopeSimple, MapPin, Phone } from '@phosphor-icons/react'
import { ACADEMY } from '@/back-to-school/data/content'
import { Backdrop } from '@/back-to-school/components/ui/Backdrop'

/**
 * A real venue, so the map is a real embed rather than a static picture of one.
 */
export function Location() {
  return (
    <section
      id="location"
      className="relative overflow-hidden border-t border-[var(--color-line)] py-20 lg:py-28"
    >
      <Backdrop variant="mat" />

      <div className="relative mx-auto max-w-[1240px] px-5 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
          <div>
            <h2
              data-reveal-lines
              className="bts-font-display text-[1.75rem] leading-[1.14] font-medium sm:text-[2.25rem] lg:text-[2.5rem]"
            >
              Where to find us
            </h2>

            <address data-reveal className="mt-7 space-y-4 text-[1.0625rem] not-italic">
              <p className="flex gap-3 leading-relaxed text-[var(--color-ink-soft)]">
                <MapPin
                  size={20}
                  weight="light"
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[var(--color-orange-ink)]"
                />
                <span>
                  {ACADEMY.street}
                  <br />
                  {ACADEMY.city}
                </span>
              </p>
              <p className="flex gap-3">
                <Phone
                  size={20}
                  weight="light"
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[var(--color-orange-ink)]"
                />
                <a
                  href={ACADEMY.phoneHref}
                  className="text-[var(--color-orange-ink)] underline underline-offset-4 hover:text-[var(--color-ink)]"
                >
                  {ACADEMY.phone}
                </a>
              </p>
              <p className="flex gap-3">
                <EnvelopeSimple
                  size={20}
                  weight="light"
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[var(--color-orange-ink)]"
                />
                <a
                  href={`mailto:${ACADEMY.email}`}
                  className="text-[var(--color-orange-ink)] underline underline-offset-4 hover:text-[var(--color-ink)]"
                >
                  {ACADEMY.email}
                </a>
              </p>
            </address>

            <a
              data-reveal
              href={ACADEMY.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-[46px] items-center border border-[var(--color-ink)] px-6 text-[0.8125rem] font-semibold tracking-[0.08em] uppercase transition-colors duration-200 hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
            >
              Open in Google Maps
            </a>
          </div>

          <div data-reveal className="border border-[var(--color-line)]">
            <iframe
              title="Map showing RPBJJ Boerne at 28255 Frontage Rd Suite 103, Boerne, TX"
              src={`https://www.google.com/maps?q=${ACADEMY.mapEmbedQuery}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block aspect-[4/3] w-full lg:aspect-[16/9]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
