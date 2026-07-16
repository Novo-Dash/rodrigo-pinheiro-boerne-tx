import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'dark' | 'secondary' | 'ghost' | 'white' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  as?: 'button' | 'a'
  href?: string
}

export function Button({
  variant = 'primary',
  size = 'md',
  as: Tag = 'button',
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-bold rounded-none uppercase tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 cursor-pointer select-none disabled:pointer-events-none disabled:opacity-40'

  const variants = {
    primary:
      'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] shadow-[0_8px_30px_rgba(var(--accent-rgb),0.35)] hover:shadow-[0_12px_40px_rgba(var(--accent-rgb),0.50)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none',
    dark:
      'bg-[var(--color-text)] text-white border-2 border-[var(--color-text)] hover:bg-transparent hover:text-[var(--color-text)] active:scale-[0.97]',
    secondary:
      'border-2 border-[var(--color-text)] text-[var(--color-text)] hover:bg-[var(--color-text)] hover:text-white active:scale-[0.97]',
    ghost:
      'text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)] hover:border-[var(--color-text)] active:scale-[0.97]',
    white:
      'bg-white text-[var(--color-accent)] border-2 border-white hover:bg-transparent hover:text-white active:scale-[0.97]',
    outline:
      'border-2 border-white/60 text-white hover:border-white hover:bg-white/10 active:scale-[0.97]',
  }

  const sizes = {
    sm: 'min-h-[44px] px-5 py-2 text-xs gap-1.5',
    md: 'min-h-[44px] px-6 py-3 text-sm gap-2',
    lg: 'min-h-[52px] px-8 py-3.5 text-sm gap-2',
  }

  if (Tag === 'a') {
    return (
      <a
        href={href}
        className={cn(base, variants[variant], sizes[size], className)}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}
