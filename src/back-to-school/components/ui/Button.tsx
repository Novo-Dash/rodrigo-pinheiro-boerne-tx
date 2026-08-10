import type { ButtonHTMLAttributes } from 'react'

/** `secondary` is an alias for `outline`: the ported booking module asks for it
 *  by that name, and there is no second button style on this page. */
type Variant = 'primary' | 'outline' | 'secondary' | 'outlineLight'
type Size = 'sm' | 'md' | 'lg'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  /** Opt into pointer physics. Only the page's primary CTAs use it, and only
   *  where there is a real cursor: on touch the button keeps its plain press. */
  magnetic?: boolean
}

/**
 * The page has exactly one button shape: a square block.
 *
 * Primary is brand orange carrying INK text, not white. White on #ff6a00 is
 * 3.0:1 and only scrapes past AA at display sizes; ink on the same orange is
 * 5.0:1 and passes everywhere, which matters because these labels are long.
 */
const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-[var(--color-orange)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]',
  outline:
    'border border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]',
  secondary:
    'border border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]',
  outlineLight:
    'border border-white/35 text-white hover:bg-white hover:text-[var(--color-ink)]',
}

const SIZES: Record<Size, string> = {
  sm: 'min-h-[44px] px-5 text-[0.75rem]',
  md: 'min-h-[46px] px-6 text-[0.8125rem]',
  lg: 'min-h-[56px] px-8 text-[0.875rem]',
}

export function Button({
  variant = 'primary',
  size = 'lg',
  magnetic = false,
  className = '',
  children,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      {...(magnetic ? { 'data-magnetic': '' } : {})}
      {...rest}
      className={[
        'inline-flex items-center justify-center text-center',
        'font-semibold uppercase tracking-[0.08em] leading-tight',
        'transition-[background-color,color,transform] duration-200',
        'active:translate-y-px',
        'disabled:pointer-events-none disabled:opacity-40',
        VARIANTS[variant],
        SIZES[size],
        className,
      ].join(' ')}
    >
      {children}
    </button>
  )
}
