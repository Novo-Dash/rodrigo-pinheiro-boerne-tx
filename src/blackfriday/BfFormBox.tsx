import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { BF } from './offer'
import { TagGlyph } from './art'
import './blackfriday.css'

/* Box de Black Friday dentro do formulário do kit (Lucas, 03/11). O kit
   (src/nd) não se edita: quando o modal abre, um container nosso entra no
   painel da esquerda, antes do rodapé, e o box é desenhado nele por portal.
   Ao fechar, o kit remove o painel e o container vai junto. Não é botão. */
export default function BfFormBox() {
  const [host, setHost] = useState<HTMLElement | null>(null)

  useEffect(() => {
    let raf = 0
    const sync = () => {
      raf = 0
      const panel = document.querySelector('.nd-overlay .nd-panel')
      if (panel && !panel.querySelector('[data-bf-box]')) {
        const el = document.createElement('div')
        el.setAttribute('data-bf-box', '')
        panel.insertBefore(el, panel.querySelector('.nd-panel-foot'))
        setHost(el)
      } else if (!panel) setHost(null)
    }
    const mo = new MutationObserver(() => {
      if (!raf) raf = requestAnimationFrame(sync)
    })
    mo.observe(document.body, { childList: true, subtree: true })
    sync()
    return () => {
      mo.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!host) return null
  return createPortal(
    <div className="bf-fbox" role="note" aria-label="Black Friday offer">
      <div className="bf-fbox-full">
      {/* a faixa amarrada no alto do box: Black Friday bordado, nó à direita e as pontas caindo */}
      <div className="bf-fbox-strap bf-belt" aria-hidden="true">
        <span className="bf-fbox-word">
          <TagGlyph /> Black <em>Friday</em>
        </span>
      </div>
      <div className="bf-fbox-knot" aria-hidden="true">
        <span className="bf-fbox-tail bf-fbox-tail--a bf-belt">
          <i className="bf-rank" />
        </span>
        <span className="bf-fbox-tail bf-fbox-tail--b bf-belt" />
        <span className="bf-fbox-nub bf-belt" />
      </div>
      <p className="bf-sr">Black Friday</p>
      <p className="bf-fbox-title">
        {BF.headline[0]} <span>{BF.headline[1]}</span>
      </p>
      {/* valores em negrito: os trechos com $ ou % da linha do offer */}
      <p className="bf-fbox-value">
        {BF.box.line.split(/(\$[\d,.]+|\d+%)/).map((s, i) => (i % 2 ? <b key={i}>{s}</b> : s))}
      </p>
      <p className="bf-fbox-chip">Ends {BF.perks.start.value}</p>
      </div>
      {/* celular: só a tira de faixa com a oferta curta */}
      <p className="bf-fbox-slim bf-belt">
        <i className="bf-rank" />
        <span>
          Black <em>Friday</em> · {BF.box.slim}
        </span>
      </p>
    </div>,
    host,
  )
}
