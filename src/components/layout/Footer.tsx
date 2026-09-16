interface FooterProps {
  onBookClick: () => void
}

export function Footer({ onBookClick }: FooterProps) {
  return (
    <footer className="bg-[#0D0D0D] text-white">

      {/* Marquee banner */}
      <div className="overflow-hidden border-y border-white/10 py-8">
        <div className="carousel-track flex whitespace-nowrap items-center">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex items-center gap-10 pr-10 shrink-0">
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className="text-5xl md:text-7xl font-black uppercase leading-none"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Start your journey{' '}
                  <span style={{ color: 'var(--color-accent)' }}>· RPBJJ Boerne ·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 md:px-10 py-16">
        <div className="grid gap-12 md:grid-cols-3">

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-4">
            <img
              src="/logo.webp"
              alt="Rodrigo Pinheiro BJJ"
              className="h-14 w-auto object-contain self-start"
            />
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Rodrigo Pinheiro BJJ Boerne is a Brazilian Jiu-Jitsu academy led by World Champion head coaches, built to serve students of all ages and experience levels.
            </p>
          </div>

          {/* Col 2 — Links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-5">
              Navigate
            </p>
            <ul className="flex flex-col gap-3" role="list">
              {[
                { href: '#our-classes', label: 'Programs' },
                { href: '#our-instructors', label: 'Instructors' },
                { href: '#faq', label: 'FAQ' },
                { href: '#location', label: 'Location' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-5">
              Contact
            </p>
            <ul className="flex flex-col gap-3 text-sm text-white/60" role="list">
              <li>
                <a
                  href="tel:+18308160484"
                  className="hover:text-white transition-colors"
                >
                  +1 (830) 816-0484
                </a>
              </li>
              <li>
                <a
                  href="mailto:ribabjj@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  ribabjj@gmail.com
                </a>
              </li>
              <li className="leading-relaxed">
                28255 Frontage Rd Suite 103<br />
                Boerne, TX 78006
              </li>
            </ul>

            {/* Social icons */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.instagram.com/rpbjj_boerne/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 grid place-items-center border border-white/20 hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
              </a>
            </div>

            <button
              type="button"
              onClick={onBookClick}
              className="mt-6 inline-flex min-h-[44px] items-center rounded-none bg-[var(--color-accent)] px-6 text-xs font-bold uppercase tracking-wide text-white hover:bg-[var(--color-accent-hover)] shadow-[0_8px_30px_rgba(255,106,0,0.35)] hover:-translate-y-0.5 transition-all duration-200"
            >
              Book Free Class
            </button>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <p>© 2026 Rodrigo Pinheiro BJJ Boerne. All rights reserved.</p>
          <p>By Novo Dash</p>
        </div>
      </div>
    </footer>
  )
}
