import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  dark?: boolean
}

export function Badge({ children, className, dark }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em]',
        dark ? 'text-white/50' : 'text-[var(--color-accent-dark)]',
        className
      )}
    >
      <span
        className={cn(
          'block h-px w-10 opacity-40',
          dark ? 'bg-white' : 'bg-[var(--color-accent)]'
        )}
        aria-hidden="true"
      />
      {children}
      <span
        className={cn(
          'block h-px w-10 opacity-40',
          dark ? 'bg-white' : 'bg-[var(--color-accent)]'
        )}
        aria-hidden="true"
      />
    </span>
  )
}
