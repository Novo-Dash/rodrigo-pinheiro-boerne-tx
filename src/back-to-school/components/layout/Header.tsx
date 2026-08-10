import { Button } from '@/back-to-school/components/ui/Button'
import { CTA } from '@/back-to-school/data/content'

interface Props {
  onBookClick: () => void
}

/**
 * Slim masthead: crest, name, CTA. 64px tall, one line at every width. The
 * page has a single conversion action, so the bar carries no nav links to
 * compete with it.
 */
export function Header({ onBookClick }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[var(--color-paper)]/92 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-4 px-5 md:px-8">
        <a href="#top" className="flex items-center gap-3" aria-label="Rodrigo Pinheiro BJJ Boerne">
          <img
            src="/logo.webp"
            alt=""
            width={40}
            height={40}
            className="h-9 w-9 shrink-0 object-contain"
          />
          <span className="hidden leading-tight sm:block">
            <span className="block bts-font-display text-[0.95rem] font-semibold text-[var(--color-ink)]">
              Rodrigo Pinheiro BJJ
            </span>
            <span className="block text-[0.6875rem] tracking-[0.14em] text-[var(--color-ink-mute)] uppercase">
              Boerne, Texas
            </span>
          </span>
        </a>

        <Button size="md" onClick={onBookClick} className="whitespace-nowrap">
          <span className="hidden sm:inline">{CTA.hero}</span>
          <span className="sm:hidden">Free trial class</span>
        </Button>
      </div>
    </header>
  )
}
