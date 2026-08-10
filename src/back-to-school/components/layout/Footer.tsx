import { FacebookLogo, InstagramLogo } from '@phosphor-icons/react'
import { Button } from '@/back-to-school/components/ui/Button'
import { Backdrop } from '@/back-to-school/components/ui/Backdrop'
import { Sunburst } from '@/back-to-school/components/ui/Ornaments'
import { ACADEMY, CTA, FOOTER_COPY } from '@/back-to-school/data/content'

interface Props {
  onBookClick: () => void
}

/**
 * The page's one dark block, and it closes the page: final call to action and
 * footer are a single ink chapter rather than two, so the light prospectus
 * never flips theme mid-scroll.
 */
export function Footer({ onBookClick }: Props) {
  return (
    <footer className="relative overflow-hidden bg-[var(--color-ink)] text-[var(--color-paper)]">
      <Backdrop variant="blueprint" />

      {/* The rays close the page the way they open it, at the opposite corner. */}
      <Sunburst
        data-drift="20"
        rays={22}
        style={{ color: 'rgb(255 106 0 / 0.10)' }}
        className="pointer-events-none absolute -bottom-[26rem] -left-56 hidden h-[46rem] w-[46rem] lg:block"
      />

      <div className="relative mx-auto max-w-[1240px] px-5 py-20 md:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <img
              src="/logo.webp"
              alt=""
              width={56}
              height={56}
              loading="lazy"
              className="h-14 w-14 object-contain"
            />
            <p
              data-reveal
              className="bts-font-display mt-7 max-w-[54ch] text-[1.0625rem] leading-[1.55] sm:text-[1.1875rem] lg:text-[1.3125rem]"
            >
              {FOOTER_COPY}
            </p>
            <Button magnetic onClick={onBookClick} className="mt-9 w-full sm:w-auto">
              {CTA.standard}
            </Button>
          </div>

          <div className="lg:pt-2">
            <address className="space-y-5 text-[0.9375rem] leading-relaxed not-italic text-white/65">
              <p>
                {ACADEMY.street}
                <br />
                {ACADEMY.city}
              </p>
              <p className="flex flex-col gap-1.5">
                <a href={ACADEMY.phoneHref} className="transition-colors hover:text-white">
                  {ACADEMY.phone}
                </a>
                <a href={`mailto:${ACADEMY.email}`} className="transition-colors hover:text-white">
                  {ACADEMY.email}
                </a>
              </p>
            </address>

            <div className="mt-7 flex items-center gap-3">
              <a
                href={ACADEMY.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="RPBJJ Boerne on Instagram"
                className="grid h-11 w-11 place-items-center border border-white/25 transition-colors hover:border-[var(--color-orange)] hover:bg-[var(--color-orange)] hover:text-[var(--color-ink)]"
              >
                <InstagramLogo size={20} weight="regular" aria-hidden="true" />
              </a>
              <a
                href={ACADEMY.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="RPBJJ Boerne on Facebook"
                className="grid h-11 w-11 place-items-center border border-white/25 transition-colors hover:border-[var(--color-orange)] hover:bg-[var(--color-orange)] hover:text-[var(--color-ink)]"
              >
                <FacebookLogo size={20} weight="regular" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/15 pt-7 text-[0.8125rem] text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 All rights reserved.</p>
          <p>By Novo Dash</p>
        </div>
      </div>
    </footer>
  )
}
