import { ACADEMY_ADDRESS } from './schedule'

// Left column of the booking layout (modal shell and /book page): logo,
// headline and supporting info. Decorative/informative only — never a form.
export function BrandPanel() {
  return (
    <div className="flex h-full flex-col bg-[var(--color-text)] px-7 py-8 text-white md:px-8 md:py-10">
      <img src="/logo.webp" alt="Rodrigo Pinheiro BJJ Boerne" className="h-14 w-14 object-contain" />

      <div className="mt-6 hidden md:block">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
          First class on us
        </p>
        <h3 className="mt-2 text-2xl font-bold leading-snug">
          Train with World Champion coaches
        </h3>
        <ul className="mt-6 grid gap-3 text-sm text-white/80">
          <BulletItem>Free trial class. No commitment</BulletItem>
          <BulletItem>Kids, adults &amp; women&apos;s programs</BulletItem>
          <BulletItem>Beginners welcome, no experience needed</BulletItem>
        </ul>
        <div className="mt-8 border-t border-white/15 pt-5 text-sm text-white/60">
          <p>{ACADEMY_ADDRESS.street}</p>
          <p>{ACADEMY_ADDRESS.city}</p>
        </div>
      </div>

      {/* Compact header on mobile: logo + title only */}
      <h3 className="mt-3 text-lg font-bold md:hidden">Reserve Your Free Class</h3>
    </div>
  )
}

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M3 8.5l3.5 3.5L13 5" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {children}
    </li>
  )
}
