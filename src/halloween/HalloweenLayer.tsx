import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

import { MiniPumpkin, TabPumpkin, VineBar, startBar } from './bar'
import { mountCtaFx, mountNav, type FxConditions } from './ctafx'
import './halloween.css'

/* ===========================================================================
   Halloween: camada tematica provisoria (variacao B, "CIPO E ABOBORAS",
   portada da Alliance Greenville em 15/10/2026). Versao SO NAVBAR: a navbar
   (que ja e fixa neste cliente) veste o tema e os botoes de agendar ganham o
   hover. Sobreposta a pagina, inerte ao ponteiro e fora da arvore de
   acessibilidade. Nenhum componente, token ou estilo da pagina e tocado.
   Para desligar: tirar o <HalloweenLayer /> da LandingPage e esta pasta.
   =========================================================================== */

/* 'halloween' = laranja de abobora e preto classicos + marca do cliente;
   'client' = so a paleta do cliente (ver halloween.css) */
const PALETTE: 'halloween' | 'client' = 'halloween'

type Viewport = { w: number; h: number }
const viewport = (): Viewport => ({ w: window.innerWidth, h: window.innerHeight })

export default function HalloweenLayer() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [vp, setVp] = useState<Viewport>(() => (typeof window === 'undefined' ? { w: 1440, h: 900 } : viewport()))

  useEffect(() => {
    let t = 0
    /* so a LARGURA remonta a camada: no celular a barra de endereco muda a altura
       a cada rolagem, e remontar replayava a entrada */
    const onResize = () => { window.clearTimeout(t); t = window.setTimeout(() => setVp((v) => (v.w === window.innerWidth ? v : viewport())), 120) }
    window.addEventListener('resize', onResize)
    return () => { window.clearTimeout(t); window.removeEventListener('resize', onResize) }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    /* ---- 1. Sair da frente do modal do kit (.nd-overlay, z-index 1000, trava o
       scroll do body ao abrir): enquanto ele estiver aberto, a decoracao se apaga. */
    let raf = 0
    const hw = root.querySelector<HTMLElement>('.hw')
    const sync = () => {
      raf = 0
      const blocked = document.querySelector('.nd-overlay') !== null || document.body.style.overflow === 'hidden'
      root.dataset.hwHidden = String(blocked)
      if (hw) hw.dataset.hwHidden = String(blocked)
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(sync) }
    sync()
    const nodes = new MutationObserver(schedule)
    nodes.observe(document.body, { childList: true, subtree: true })
    const lock = new MutationObserver(schedule)
    lock.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] })

    /* ---- 2. Movimento ----------------------------------------------------- */
    const mm = gsap.matchMedia()
    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        small: '(max-width: 767px)',
        hover: '(hover: hover)',
      },
      (self) => {
        const c = self.conditions as FxConditions
        const stopFx = mountCtaFx(root, c)
        const stopNav = mountNav(root, { anchor: 'center', width: c.small ? 24 : 30, height: c.small ? 22 : 27 })
        if (!c.motion) return () => { stopFx(); stopNav() }
        const stopBar = startBar(root)
        return () => { stopBar(); stopFx(); stopNav() }
      },
    )

    return () => {
      if (raf) cancelAnimationFrame(raf)
      nodes.disconnect()
      lock.disconnect()
      mm.revert()
    }
  }, [vp])

  return (
    <div ref={rootRef} style={{ display: 'contents' }} data-hw-hidden="false">
      <div className="hw" aria-hidden="true" data-hw-hidden="false" data-hw-palette={PALETTE}>
        <VineBar width={vp.w} />

        {/* detalhe da navbar: abobora pequena ao lado do botao */}
        <span className="hw-nav hw-nav--pk" data-hw-nav><MiniPumpkin size="100%" /></span>

        {/* hover no CTA: duas abas em pilula atras do botao; a mascara tem a forma do botao */}
        <div className="hw-fx" data-hw-fx>
          <div className="hw-fx-mask" data-hw-fx-mask>
            <div className="hw-fx-tab hw-fx-tab--top" data-hw-fx-top><TabPumpkin /><span>Boo! Trick or treat</span></div>
            <div className="hw-fx-tab hw-fx-tab--bot" data-hw-fx-bot><TabPumpkin /><span>Boo! Trick or treat</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
