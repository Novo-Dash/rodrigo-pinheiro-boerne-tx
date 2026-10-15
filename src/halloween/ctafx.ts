import { gsap } from 'gsap'

/* ---------------------------------------------------------------------------
   Efeito tematico no CTA, sem tocar no botao: a camada desenha duas abas em
   pilula que saem de tras do botao (um vetor de Halloween em cima, a
   esquerda; uma frase embaixo, a direita), como adesivos. O que esconde a
   parte "atras do botao" e uma MASCARA com a forma exata do botao (raio
   computado; os botoes deste cliente sao retos, raio 0). Vale para o CTA do
   hero e os CTAs pelo corpo da pagina; o botao do header fica de fora. O
   botao so recebe pointerenter/leave; o clique segue igual.

   Previas: no desktop, uma vez, no CTA do hero (o hover faz o resto). No
   celular, onde nao ha hover, ciclo em TODOS os CTAs visiveis, e some
   enquanto a tela rola. Com prefers-reduced-motion, hover sem animar e sem previa.

   E o detalhe da navbar: um motivo ancorado ao lado do botao do header (ou
   do hamburguer no celular), no lado com mais folga.
   --------------------------------------------------------------------------- */
const PAD_X = 40
const PAD_Y = 64
const TUCK = 12
const TAB_TOP_H = 44
const PEEK_SHOW = 2000
const PEEK_GAP = 900

export type FxConditions = { motion?: boolean; small?: boolean; hover?: boolean }

/* Os CTAs deste cliente sao <button> com "Book"/"Trial" no texto (nao ha #book). */
const isTrigger = (el: Element) => {
  if (el.closest('.nd') || el.closest('.hw') || el.closest('header')) return false
  if (el.matches('a[href="#book"], a[href="#start"]')) return true
  return el.tagName === 'BUTTON' && /book|trial/i.test(el.textContent || '')
}

export function mountCtaFx(root: HTMLElement, c: FxConditions) {
  const fx = root.querySelector<HTMLElement>('[data-hw-fx]')
  const top = fx?.querySelector<HTMLElement>('[data-hw-fx-top]')
  const bot = fx?.querySelector<HTMLElement>('[data-hw-fx-bot]')
  const mask = fx?.querySelector<HTMLElement>('[data-hw-fx-mask]')
  if (!fx || !top || !bot || !mask) return () => {}
  const motion = c.motion !== false
  const k = motion ? 1 : 0
  const tl = gsap.timeline({ paused: true, defaults: { duration: 0.4 * k, ease: 'back.out(2.2)' } })
    .to(fx, { opacity: 1, duration: 0.12 * k, ease: 'none' }, 0)
    .fromTo(top, { yPercent: 80, opacity: 0, filter: 'blur(2px)' }, { yPercent: 0, opacity: 1, filter: 'blur(0px)' }, 0)
    .fromTo(bot, { yPercent: -80, opacity: 0, filter: 'blur(2px)' }, { yPercent: 0, opacity: 1, filter: 'blur(0px)' }, 0.05 * k)

  let cur: HTMLElement | null = null
  let hovering = false
  let maskKey = ''
  const fit = () => {
    if (!cur) return
    const r = cur.getBoundingClientRect()
    /* raio 0 e valido (botao reto): `|| 14` arredondava o furo e a aba aparecia no canto */
    const br = parseFloat(getComputedStyle(cur).borderTopLeftRadius)
    const R = Math.min(Number.isNaN(br) ? 14 : br, r.height / 2, r.width / 2)
    fx.style.left = `${r.left}px`
    fx.style.top = `${r.top}px`
    fx.style.width = `${r.width}px`
    fx.style.height = `${r.height}px`
    fx.classList.toggle('hw-fx--low', r.top < 96)
    /* botao colado no pe da tela (barra fixa do celular): a aba de baixo sairia
       da tela, entao a frase sobe para a aba de cima */
    fx.classList.toggle('hw-fx--floor', r.bottom > window.innerHeight - 44)
    const key = `${r.width}|${r.height}|${R}`
    if (key === maskKey) return
    maskKey = key
    const W = r.width + 2 * PAD_X
    const H = r.height + 2 * PAD_Y
    const x = PAD_X; const y = PAD_Y; const w = r.width; const hh = r.height
    const hole = `M${x + R} ${y}H${x + w - R}A${R} ${R} 0 0 1 ${x + w} ${y + R}V${y + hh - R}A${R} ${R} 0 0 1 ${x + w - R} ${y + hh}H${x + R}A${R} ${R} 0 0 1 ${x} ${y + hh - R}V${y + R}A${R} ${R} 0 0 1 ${x + R} ${y}Z`
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${H}' viewBox='0 0 ${W} ${H}'><path fill='#000' fill-rule='evenodd' d='M0 0H${W}V${H}H0Z${hole}'/></svg>`
    const url = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`
    mask.style.setProperty('-webkit-mask-image', url)
    mask.style.maskImage = url
    top.style.left = `${PAD_X + Math.max(6, R - 6)}px`
    top.style.top = `${PAD_Y + TUCK - TAB_TOP_H}px`
    bot.style.right = `${PAD_X + Math.max(6, R - 6)}px`
    bot.style.top = `${PAD_Y + hh - TUCK}px`
  }
  const follow = () => { if (cur) fit() }
  gsap.ticker.add(follow)
  /* celular: a camada fixa nao acompanha o botao durante a inercia; rolou,
     a gaveta se recolhe na hora e o ciclo so volta quando a rolagem para */
  let scrolling = 0
  const onScroll = () => {
    if (c.hover) return
    if (cur) { tl.pause(0); gsap.set(fx, { opacity: 0 }); cur = null }
    window.clearTimeout(scrolling)
    scrolling = window.setTimeout(() => { scrolling = 0 }, 160)
  }
  const show = (el: HTMLElement) => { cur = el; fit(); tl.play() }
  const hide = () => { tl.reverse() }
  const press = () => { gsap.to(fx, { scale: 0.96, duration: 0.14 * k, transformOrigin: '50% 50%' }) }
  const release = () => { gsap.to(fx, { scale: 1, duration: 0.32 * k, ease: 'back.out(2)' }) }

  const ctas = Array.from(document.querySelectorAll<HTMLElement>('a[href="#book"], a[href="#start"], button')).filter(isTrigger)
  const onEnter = (e: PointerEvent) => { hovering = true; show(e.currentTarget as HTMLElement) }
  const onLeave = () => { hovering = false; hide() }
  if (c.hover) {
    ctas.forEach((el) => {
      el.addEventListener('pointerenter', onEnter, { passive: true })
      el.addEventListener('pointerleave', onLeave, { passive: true })
      el.addEventListener('pointerdown', press, { passive: true })
      el.addEventListener('pointerup', release, { passive: true })
      el.addEventListener('pointercancel', release, { passive: true })
    })
  }
  window.addEventListener('scroll', onScroll, { passive: true, capture: true })

  let io: IntersectionObserver | null = null
  let late: MutationObserver | null = null
  let wait = 0
  let hold = 0
  if (motion) {
    const hero = ctas.find((el) => el.getBoundingClientRect().width > 8)
    const inView = new Set<Element>()
    const uncovered = (el: Element) => {
      const r = el.getBoundingClientRect()
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
      return !!hit && (hit === el || el.contains(hit))
    }
    let last: Element | null = null
    const loop = (ms: number) => { wait = window.setTimeout(tick, ms) }
    const tick = () => {
      const pool = Array.from(inView).filter(uncovered) as HTMLElement[]
      const el = pool.find((e) => e !== last) || pool[0]
      if (scrolling) { loop(200); return }
      if (!el || hovering) { loop(500); return }
      last = el
      show(el)
      hold = window.setTimeout(() => {
        if (cur === el && !hovering) hide()
        if (!c.hover) loop(PEEK_GAP)
      }, PEEK_SHOW)
    }
    io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting && en.intersectionRatio >= 0.6) inView.add(en.target); else inView.delete(en.target) })
    }, { threshold: [0, 0.6] })
    ;(c.hover ? [hero] : ctas).forEach((el) => { if (el && io) io.observe(el) })
    /* a barra fixa do celular (StickyCTABar) so monta depois de 600px de rolagem:
       observar CTAs que entram no DOM depois */
    late = new MutationObserver(() => {
      if (c.hover || !io) return
      document.querySelectorAll<HTMLElement>('button').forEach((el) => {
        if (!ctas.includes(el) && isTrigger(el)) { ctas.push(el); io?.observe(el) }
      })
    })
    late.observe(document.body, { childList: true, subtree: true })
    loop(1700)
  }

  return () => {
    window.removeEventListener('scroll', onScroll, { capture: true })
    window.clearTimeout(wait)
    window.clearTimeout(scrolling)
    window.clearTimeout(hold)
    if (io) io.disconnect()
    if (late) late.disconnect()
    ctas.forEach((el) => {
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointerleave', onLeave)
      el.removeEventListener('pointerdown', press)
      el.removeEventListener('pointerup', release)
      el.removeEventListener('pointercancel', release)
    })
    gsap.ticker.remove(follow)
    tl.kill()
  }
}

/* Detalhe da navbar: ancora o motivo ao lado do botao do header (ou do
   hamburguer no celular), no lado com mais folga. */
export function mountNav(root: HTMLElement, opts: { anchor: 'top' | 'center' | 'bottom'; width: number; height: number }) {
  const motif = root.querySelector<HTMLElement>('[data-hw-nav]')
  const header = document.querySelector('header')
  if (!motif || !header) return () => {}
  const place = () => {
    /* a barra do header (sem o menu do celular aberto, que fica abaixo dela) */
    const bar = header.firstElementChild ?? header
    const hb = bar.getBoundingClientRect().bottom
    const items = Array.from(bar.querySelectorAll('a, button'))
      .map((el) => el.getBoundingClientRect())
      .filter((r) => r.width > 8 && r.height > 8 && r.top >= 0 && r.top < hb)
    if (!items.length) { motif.style.opacity = '0'; return }
    const cta = items.reduce((a, b) => (b.left > a.left ? b : a))
    const leftNeighbor = items.filter((r) => r !== cta && r.right <= cta.left + 1).reduce((m, r) => Math.max(m, r.right), 0)
    const rightNeighbor = items.filter((r) => r !== cta && r.left >= cta.right - 1).reduce((m, r) => Math.min(m, r.left), window.innerWidth)
    const gapL = cta.left - leftNeighbor
    const gapR = rightNeighbor - cta.right
    const need = opts.width + 20
    let x: number
    if (gapR >= need) x = cta.right + 10
    else if (gapL >= need) x = cta.left - 10 - opts.width
    else { motif.style.opacity = '0'; return }
    const y = opts.anchor === 'top' ? 2
      : opts.anchor === 'center' ? cta.top + (cta.height - opts.height) / 2
      : Math.max(2, hb - opts.height - 2)
    motif.style.opacity = ''
    motif.style.left = `${Math.round(x)}px`
    motif.style.top = `${Math.round(y)}px`
  }
  place()
  let t = 0
  const onResize = () => { window.clearTimeout(t); t = window.setTimeout(place, 80) }
  window.addEventListener('resize', onResize)
  const ro = new ResizeObserver(onResize)
  ro.observe(header)
  return () => { window.removeEventListener('resize', onResize); ro.disconnect(); window.clearTimeout(t) }
}
