import { ACADEMY_ADDRESS } from './schedule'

// Left column of the booking layout (modal shell and /book page): logo,
// headline and supporting info. Decorative/informative only — never a form.
export function BrandPanel() {
  return (
    <div className="flex h-full flex-col bg-[var(--color-text)] px-7 py-8 text-white md:px-8 md:py-10">
      <img src="/logo.webp" alt="Rodrigo Pinheiro BJJ Boerne" className="h-14 w-14 object-contain" />

      <div className="mt-6 hidden md:block">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
          Back to School
        </p>
        <h3 className="mt-2 text-2xl font-bold leading-snug">
          Book your child&apos;s free trial class
        </h3>
        <ul className="mt-6 grid gap-3 text-sm text-white/80">
          <BulletItem>Free trial class, no commitment</BulletItem>
          <BulletItem>Beginner-friendly, no experience needed</BulletItem>
          <BulletItem>Email and SMS confirmation with all the details</BulletItem>
        </ul>
        <div className="mt-8 border-t border-white/15 pt-5 text-sm text-white/60">
          <p>{ACADEMY_ADDRESS.street}</p>
          <p>{ACADEMY_ADDRESS.city}</p>
        </div>
      </div>

      {/* Compact header on mobile: logo + campaign label. The form below
          already carries the "Reserve Your Free Class" heading, so repeating it
          here would print the same line twice on a phone. */}
      <p className="mt-3 text-xs font-semibold tracking-widest text-[var(--color-accent)] uppercase md:hidden">
        Back to School
      </p>
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
