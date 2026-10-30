import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BF } from './offer'
import { Kimono, TagGlyph } from './art'
import { Button } from '@/components/ui'
import './blackfriday.css'

gsap.registerPlugin(ScrollTrigger)

/* O bloco da oferta: 2ª seção da página, logo depois do hero. O único botão é
   o do formulário (#book, que o kit intercepta). */
export default function BfOffer() {
  const root = useRef<HTMLElement>(null)

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
          .from('.bf-disk', { scale: 0.55, autoAlpha: 0, duration: 0.9, ease: 'expo.out' }, 0.1)
          .from('.bf-shirt', { y: -60, rotate: -7, autoAlpha: 0, duration: 1, ease: 'back.out(1.3)' }, 0.25)
          .from('.bf-price', { rotate: 38, autoAlpha: 0, duration: 1.3, ease: 'elastic.out(1, 0.45)' }, 0.75)
          .from('.bf-cal', { x: -40, rotate: -20, autoAlpha: 0, duration: 0.8, ease: 'back.out(1.6)' }, 0.85)
          .from('.bf-sticker', { scale: 1.8, autoAlpha: 0, duration: 0.4, ease: 'back.out(2.5)' }, 1.15)
          // depois de pousar, a etiqueta fica balançando no fio, devagar. Criado
          // só aqui: um tween relativo montado antes leria o ângulo de partida.
          .add(() => {
            gsap.fromTo('.bf-price', { rotate: 9 }, { rotate: 13, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 })
          })

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
      <div className="bf-offer-inner">
        <div className="bf-head">
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
        </div>

        <div className="bf-art" aria-hidden="true">
          <div className="bf-disk" />
          <Kimono className="bf-shirt" />
          <span className="bf-sticker-pos">
            <span className="bf-sticker">
              <span>{BF.perks.gear.label}</span>
              <strong>{BF.perks.gear.value}</strong>
            </span>
          </span>
          <div className="bf-price">
            <span className="bf-price-string" />
            <div className="bf-price-card">
              <span className="bf-price-hole" />
              <span className="bf-price-label">{BF.perks.fee.label}</span>
              <span className="bf-price-value">{BF.perks.fee.value}</span>
              <span className="bf-price-note">{BF.perks.fee.note}</span>
            </div>
          </div>
          <div className="bf-cal">
            <span className="bf-cal-rings"><i /><i /></span>
            <span className="bf-cal-label">{BF.perks.start.label}</span>
            <span className="bf-cal-value">{BF.perks.start.value}</span>
          </div>
        </div>

        <div className="bf-act">
          {/* a oferta inteira em texto para leitor de tela: a arte acima é aria-hidden */}
          <p className="bf-sr">
            {BF.perks.fee.label}: {BF.perks.fee.value}. {BF.perks.gear.label}: {BF.perks.gear.value}.{' '}
            {BF.perks.start.label}: {BF.perks.start.value}.
          </p>
          {/* o botão da própria página; #book é interceptado pelo kit */}
          <Button as="a" href="#book" size="lg">
            {BF.cta}
          </Button>
          <p className="bf-fine">{BF.fine}</p>
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
