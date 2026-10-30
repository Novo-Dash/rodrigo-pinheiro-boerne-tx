import { BF } from './offer'
import { TagGlyph } from './art'

/* O hero é vídeo de fundo sem card, então as pontas de faixa da V1 não têm onde
   colar: no lugar delas, um pedaço de faixa preta acima do H1 (como na Greenville). */
export default function BfHeroTip() {
  return (
    <p className="bf-kicker bf-belt bf-hero-tip">
      <span className="bf-kicker-text">
        <TagGlyph />
        Black <em>Friday</em>
        <span className="bf-hero-tip-more">
          <span className="bf-hero-tip-sep" aria-hidden="true" />
          {BF.hero}
        </span>
      </span>
      <i className="bf-rank" aria-hidden="true" />
      <i className="bf-tip" aria-hidden="true" />
    </p>
  )
}
