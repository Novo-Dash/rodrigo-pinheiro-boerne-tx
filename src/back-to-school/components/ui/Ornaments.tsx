/**
 * The page's decorative vocabulary, all of it derived from assets that already
 * belong to the academy. Two marks only, both plain geometry generated in code
 * rather than hand-drawn paths.
 *
 * Deliberately NOT a circular stamp or an arched photo: that is the Ares Back
 * to School motif and it stays theirs.
 */

type SvgProps = React.SVGProps<SVGSVGElement>

/**
 * Sunburst - the ray fan from the middle of the RPBJJ crest, isolated and
 * enlarged. Used as a watermark behind a chapter, never as a badge.
 */
export function Sunburst({
  className = '',
  rays = 24,
  spread = 360,
  rotate = 0,
  ...rest
}: SvgProps & { rays?: number; spread?: number; rotate?: number }) {
  const step = spread / rays
  const gap = step * 0.42

  return (
    <svg
      viewBox="-100 -100 200 200"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <g transform={`rotate(${rotate})`}>
        {Array.from({ length: rays }, (_, i) => {
          const a0 = ((i * step - spread / 2) * Math.PI) / 180
          const a1 = a0 + ((step - gap) * Math.PI) / 180
          const r = 100
          return (
            <path
              key={i}
              d={`M0 0 L${Math.cos(a0) * r} ${Math.sin(a0) * r} L${Math.cos(a1) * r} ${
                Math.sin(a1) * r
              } Z`}
              fill="currentColor"
            />
          )
        })}
      </g>
    </svg>
  )
}

/**
 * Grade stripes - the degree stripes taped onto a jiu-jitsu belt. Four short
 * parallel bars, which is what a child earns before the next belt, and what
 * this page is ultimately selling to a parent.
 */
export function GradeStripes({
  className = '',
  count = 4,
  ...rest
}: SvgProps & { count?: number }) {
  const gap = 9
  const w = count * gap

  return (
    <svg
      viewBox={`0 0 ${w} 22`}
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {Array.from({ length: count }, (_, i) => (
        <rect key={i} x={i * gap} y="0" width="4" height="22" fill="currentColor" />
      ))}
    </svg>
  )
}

/**
 * Crop marks - the trim marks on a printer's proof. The page is built as a
 * prospectus, and these are what the corners of a prospectus carry.
 */
export function CropMarks({ className = '', ...rest }: SvgProps) {
  return (
    <svg viewBox="0 0 26 26" className={className} aria-hidden="true" focusable="false" {...rest}>
      <path
        d="M0 8 H10 M8 0 V10"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/**
 * Ruler ticks - a hairline with measured marks on it. The prospectus language
 * of the page, and a quiet nod to a school ruler without drawing a notebook.
 */
export function RulerTicks({
  className = '',
  count = 28,
  tall = 4,
  ...rest
}: SvgProps & { count?: number; tall?: number }) {
  const w = 400
  const step = w / count

  return (
    <svg
      viewBox={`0 0 ${w} 12`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <line x1="0" y1="11.5" x2={w} y2="11.5" stroke="currentColor" strokeWidth="1" />
      {Array.from({ length: count + 1 }, (_, i) => {
        const long = i % tall === 0
        return (
          <line
            key={i}
            x1={i * step}
            y1={long ? 3 : 7}
            x2={i * step}
            y2="11.5"
            stroke="currentColor"
            strokeWidth="1"
          />
        )
      })}
    </svg>
  )
}
