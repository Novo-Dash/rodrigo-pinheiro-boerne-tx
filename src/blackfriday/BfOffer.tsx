import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BF } from './offer'
import { Kimono, TagGlyph } from './art'
import { Button } from '@/components/ui'
import './blackfriday.css'

gsap.registerPlugin(ScrollTrigger)

// dias, horas e minutos até o fim da campanha; null depois que acabou
function useCountdown(end: string) {
  const left = () => Math.max(0, new Date(end).getTime() - Date.now())
  const [ms, setMs] = useState(left)
  useEffect(() => {
    const t = setInterval(() => setMs(left()), 30000)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end])
  if (!ms) return null
  const m = Math.floor(ms / 60000)
  return { days: Math.floor(m / 1440), hours: Math.floor((m % 1440) / 60), mins: m % 60 }
}

/* O bloco da oferta: 2ª seção da página, logo depois do hero. O único botão é
   o do formulário (#book, que o kit intercepta). */
export default function BfOffer() {
  const root = useRef<HTMLElement>(null)
  const left = useCountdown(BF.ends)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // entrada: conta a oferta na ordem em que ela se lê
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: { trigger: el, start: 'top 72%', once: true },
        })
        tl.from('.bf-kicker', { scale: 1.35, rotate: -9, autoAlpha: 0, duration: 0.45, ease: 'back.out(2.2)' })
          .from('.bf-h2-line', { yPercent: 105, duration: 0.8, stagger: 0.12 }, '-=0.15')
          .from('.bf-lead, .bf-act', { y: 18, autoAlpha: 0, duration: 0.6, stagger: 0.1 }, '-=0.45')
          .from('.bf-tile:not(.bf-tile--copy)', { y: 36, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.08 }, 0.2)
          .from('.bf-gi-art', { y: -40, rotate: -6, duration: 1, ease: 'back.out(1.3)' }, 0.45)
      })

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // as duas faixas do X deslizam em sentidos opostos com a rolagem
        // (o GSAP lê a rotação do CSS e só soma o x)
        const scrub = { trigger: '.bf-x', start: 'top bottom', end: 'bottom top', scrub: true }
        gsap.fromTo('.bf-x-a', { x: -28 }, { x: 28, ease: 'none', scrollTrigger: scrub })
        gsap.fromTo('.bf-x-b', { x: 28 }, { x: -28, ease: 'none', scrollTrigger: { ...scrub } })
      })
    }, el)
    return () => ctx.revert()
  }, [])


  return (
    <section ref={root} id="black-friday" className="bf-offer" aria-labelledby="bf-offer-title">
      <div className="bf-offer-inner bf-bento">
        {/* o título, a frase, os 3 benefícios e o único botão */}
        <div className="bf-tile bf-tile--copy">
          <p className="bf-kicker bf-belt">
            <span className="bf-kicker-text">
              <TagGlyph />
              {BF.tag} deal
            </span>
            <i className="bf-rank" aria-hidden="true" />
            <i className="bf-tip" aria-hidden="true" />
          </p>
          <h2 id="bf-offer-title" className="bf-h2">
            <span className="bf-h2-mask"><span className="bf-h2-line">{BF.headline[0]}</span></span>
            <span className="bf-h2-mask"><span className="bf-h2-line bf-h2-accent">{BF.headline[1]}</span></span>
          </h2>
          <p className="bf-lead">{BF.lead}</p>
          <ul className="bf-lead bf-list">
            {BF.benefits.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <div className="bf-act">
            {/* o botão da própria página; #book é interceptado pelo kit */}
            <Button as="a" href="#book" size="lg">
              {BF.cta}
            </Button>
            <p className="bf-fine">{BF.fine}</p>
          </div>
        </div>

        {/* a oferta: o gi grátis com 3 meses pagos */}
        <div className="bf-tile bf-tile--gi">
          <p className="bf-tile-label">{BF.perks.gear.label}</p>
          <p className="bf-tile-big">{BF.perks.gear.value}</p>
          <Kimono className="bf-gi-art" />
        </div>

        {/* foto real da academia */}
        <figure className="bf-tile bf-tile--photo">
          <img src={BF.photo.src} alt={BF.photo.alt} width="800" height="1120" loading="lazy" decoding="async" />
          <figcaption>
            <img src="/logo-crest.webp" alt="" width="40" height="40" loading="lazy" />
            {BF.academy}
          </figcaption>
        </figure>

        {/* o adicional PAGO, separado do gi grátis */}
        <div className="bf-tile bf-tile--box">
          <p className="bf-tile-chip">{BF.addon.chip}</p>
          <p className="bf-tile-label">{BF.perks.fee.label}</p>
          <p className="bf-tile-big">{BF.perks.fee.value}</p>
          <ul className="bf-box-items">
            {BF.addon.items.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>

        {/* o prazo, com a contagem */}
        <div className="bf-tile bf-tile--ends">
          <p className="bf-tile-label">{BF.perks.start.label}</p>
          <p className="bf-tile-big">{BF.perks.start.value}</p>
          {left ? (
            <p className="bf-count" aria-label={`Offer ends in ${left.days} days, ${left.hours} hours and ${left.mins} minutes`}>
              {([
                [left.days, 'days'],
                [left.hours, 'hrs'],
                [left.mins, 'min'],
              ] as const).map(([n, u]) => (
                <span key={u}>
                  <b>{String(n).padStart(2, '0')}</b>
                  {u}
                </span>
              ))}
            </p>
          ) : null}
        </div>
      </div>

      {/* o X de faixas pretas que fecha a seção, por cima da emenda com a próxima */}
      <div className="bf-x" aria-hidden="true">
        {['bf-x-b', 'bf-x-a'].map((c) => (
          <div className={`bf-x-tape bf-belt ${c}`} key={c}>
            <i className="bf-rank bf-rank--l" />
            <div className="bf-x-text">
              {[0, 1].map((k) => (
                <span key={k}>Black <em>Friday</em></span>
              ))}
            </div>
            <i className="bf-rank bf-rank--r" />
          </div>
        ))}
      </div>
    </section>
  )
}
