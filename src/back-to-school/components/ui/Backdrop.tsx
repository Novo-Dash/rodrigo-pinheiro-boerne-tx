/**
 * Section backdrops.
 *
 * These are not decorative lines scattered to make the page "feel designed".
 * Each variant is a grid the page actually uses: the typographic column grid
 * the content sits on, the ruled baseline the quotes sit on, the mat squares
 * the classes happen on. They stay under 8% contrast and every one of them
 * fades out before it reaches the section edges, so nothing competes with copy.
 *
 * Implemented as CSS gradients on one absolutely-positioned, pointer-events-none
 * layer: no extra DOM per line, no repaint cost while scrolling.
 */

type Variant = 'graph' | 'dots' | 'ruled' | 'mat' | 'blueprint'

const INK = 'rgb(23 20 15 / 0.055)'
const INK_SOFT = 'rgb(23 20 15 / 0.03)'
const ORANGE = 'rgb(255 106 0 / 0.09)'
const LIGHT = 'rgb(242 239 233 / 0.07)'

const LAYERS: Record<Variant, React.CSSProperties> = {
  /** Graph paper: a fine 8px weave with a heavier 40px module over it. */
  graph: {
    backgroundImage: `
      linear-gradient(to right, ${INK_SOFT} 1px, transparent 1px),
      linear-gradient(to bottom, ${INK_SOFT} 1px, transparent 1px),
      linear-gradient(to right, ${INK} 1px, transparent 1px),
      linear-gradient(to bottom, ${INK} 1px, transparent 1px)
    `,
    backgroundSize: '8px 8px, 8px 8px, 40px 40px, 40px 40px',
  },

  /** Dot grid: the lightest of the set, for chapters carrying a photograph. */
  dots: {
    backgroundImage: `radial-gradient(${INK} 1px, transparent 1px)`,
    backgroundSize: '22px 22px',
  },

  /** Ruled paper: horizontal baselines, for the chapters made of text. */
  ruled: {
    backgroundImage: `linear-gradient(to bottom, ${INK} 1px, transparent 1px)`,
    backgroundSize: '100% 34px',
  },

  /** Mat: the big squares of a tatami floor, in a single tone. Not a
   *  chessboard, which alternates fills and belongs to another academy. */
  mat: {
    backgroundImage: `
      linear-gradient(to right, ${ORANGE} 1px, transparent 1px),
      linear-gradient(to bottom, ${ORANGE} 1px, transparent 1px)
    `,
    backgroundSize: '104px 104px, 104px 104px',
  },

  /** The dark counterpart, for the ink chapter. */
  blueprint: {
    backgroundImage: `
      linear-gradient(to right, ${LIGHT} 1px, transparent 1px),
      linear-gradient(to bottom, ${LIGHT} 1px, transparent 1px)
    `,
    backgroundSize: '56px 56px, 56px 56px',
  },
}

/** Where the grid dissolves. Keeps the mesh off the section's own edges. */
const FADES = {
  edges: 'radial-gradient(ellipse 90% 78% at 50% 50%, #000 35%, transparent 100%)',
  top: 'linear-gradient(to bottom, #000 0%, #000 45%, transparent 92%)',
  bottom: 'linear-gradient(to top, #000 0%, #000 50%, transparent 95%)',
} as const

export function Backdrop({
  variant,
  fade = 'edges',
  className = '',
}: {
  variant: Variant
  fade?: keyof typeof FADES
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        ...LAYERS[variant],
        maskImage: FADES[fade],
        WebkitMaskImage: FADES[fade],
      }}
    />
  )
}

/**
 * The page's actual 12-column grid, drawn. Unlike the gradient variants above
 * this one is anchored to the same container as the content, so the lines fall
 * exactly on the column boundaries the sections are laid out against.
 */
export function GridColumns({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 flex justify-center ${className}`}
      style={{
        maskImage: FADES.edges,
        WebkitMaskImage: FADES.edges,
      }}
    >
      <div className="grid w-full max-w-[1240px] grid-cols-4 px-5 md:px-8 lg:grid-cols-12">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className={`border-l border-[rgb(23_20_15_/_0.05)] ${
              i === 11 ? 'border-r' : ''
            } ${i >= 4 ? 'hidden lg:block' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}
