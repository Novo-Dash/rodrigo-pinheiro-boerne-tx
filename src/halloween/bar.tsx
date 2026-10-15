import { gsap } from 'gsap'

/* ---------------------------------------------------------------------------
   Versao SO NAVBAR (porte da variacao B "cipo e aboboras" da Alliance,
   15/10/2026; o time padronizou a roupagem na navbar e no botao).
   - um cipo irregular (duas ondulacoes somadas) corre pela borda de baixo da
     barra, com folhas de tamanho e angulo variados e gavinhas enroladas, e
     cresce na entrada;
   - aboboras entalhadas penduradas no cipo (3 expressoes, tamanhos e cabos
     variados) caem quicando e balancam;
   - uma aranha desce do cipo.
   Toda cor vem de custom property (halloween.css), nunca de atributo fill solto.
   Centralizadas por margin (o GSAP grava `translate: none` em quem anima).
   Cada abobora tem dois niveis: o span balanca (vida) e o svg leva a entrada.
   --------------------------------------------------------------------------- */
/* ruido deterministico por indice: o mesmo desenho a cada carga */
const h = (i: number, k = 1) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x) }

function vine(width: number, small: boolean) {
  const W1 = small ? 96 : 140
  const W2 = small ? 41 : 57
  const A1 = small ? 2.8 : 4.2
  const A2 = small ? 1.1 : 1.7
  const n = (v: number) => v.toFixed(1)
  /* duas ondulacoes somadas: o cipo nunca repete o mesmo gomo */
  const y = (x: number) => 6 + A1 * Math.sin((2 * Math.PI * x) / W1) + A2 * Math.sin((2 * Math.PI * x) / W2 + 1.3)
  let d = `M-10 ${n(y(-10))}`
  for (let x = -6; x <= width + 10; x += 4) d += `L${n(x)} ${n(y(x))}`
  const leaves: { x: number; y: number; up: boolean; k: number; rot: number }[] = []
  const curls: { x: number; y: number; flip: boolean }[] = []
  let i = 0
  for (let x = W1 * 0.2; x < width; x += (W1 / 2.6) * (0.75 + h(i) * 0.5), i += 1) {
    leaves.push({ x, y: y(x), up: i % 2 === 0, k: 0.75 + h(i, 2) * 0.55, rot: (h(i, 3) - 0.5) * 30 })
    if (i % 3 === 1) curls.push({ x: x + 8, y: y(x + 8), flip: h(i, 4) > 0.5 })
  }
  return { d, leaves, curls, y }
}

export function MiniPumpkin({ size, face = 0 }: { size: number | string; face?: number }) {
  return (
    <svg viewBox="0 0 40 36" width={size} focusable="false" className="hw-mp">
      <path d="M19 6c0-3 1-5 4-6 1 0 1 1 0 2-2 1-2 2-2 4z" className="hw-c-stem" strokeWidth="1.2" />
      <ellipse cx="9" cy="21" rx="8" ry="12" className="hw-c-side" strokeWidth="1.6" />
      <ellipse cx="31" cy="21" rx="8" ry="12" className="hw-c-side" strokeWidth="1.6" />
      <ellipse cx="14" cy="20.5" rx="8.5" ry="13" className="hw-c-pk" strokeWidth="1.6" />
      <ellipse cx="26" cy="20.5" rx="8.5" ry="13" className="hw-c-pk" strokeWidth="1.6" />
      <ellipse cx="20" cy="20" rx="8.5" ry="14" className="hw-c-pkhi" strokeWidth="1.6" />
      <ellipse cx="15" cy="12.5" rx="3.2" ry="1.6" className="hw-c-shine" transform="rotate(-25 15 12.5)" />
      <g className="hw-c-cut" strokeWidth="0.7" strokeLinejoin="round" data-hw-face>
        {face === 0 && <><path d="M11 17l5 1-2 4zM29 17l-5 1 2 4z" /><path d="M11 24q9 7 18 0l-2 .5-1.5 2.5-2-2-2 2.5-2-2.5-2 2-1.5-2.5z" /></>}
        {face === 1 && <><circle cx="14" cy="18.5" r="2.2" /><circle cx="26" cy="18.5" r="2.2" /><ellipse cx="20" cy="26" rx="3" ry="3.6" /></>}
        {face === 2 && <><path d="M10 16.5l6 3-5 2zM30 16.5l-6 3 5 2z" /><path d="M12 24h16l-2.2 3.4-2-2-1.8 2.6-2-2.6-1.8 2.6-2-2.6-2 2z" /></>}
      </g>
    </svg>
  )
}

/* abobora sem contorno das abas do CTA (mesmo desenho da referencia) */
export function TabPumpkin() {
  return (
    <svg viewBox="0 0 120 112" fill="none" focusable="false">
      <path d="M58 24c-1-8 2-14 7-17 2-1 4 1 3 3-3 3-4 7-4 14z" className="hw-f-stem" />
      <ellipse cx="30" cy="64" rx="18" ry="35" className="hw-f-side" />
      <ellipse cx="90" cy="64" rx="18" ry="35" className="hw-f-side" />
      <ellipse cx="43" cy="63" rx="21" ry="38" className="hw-f-pk" />
      <ellipse cx="77" cy="63" rx="21" ry="38" className="hw-f-pk" />
      <ellipse cx="60" cy="62" rx="22" ry="40" className="hw-f-pkhi" />
      <path d="M36 54l13-15 8 15zM84 54l-13-15-8 15z" className="hw-f-cut" />
      <path d="M60 60l-6 9h12z" className="hw-f-cut" />
      <path d="M30 74q30 30 60 0l-7 0-5 8-6-8h-6l-6 9-6-9h-6l-5 8-5-8z" className="hw-f-cut" />
    </svg>
  )
}

export function VineBar({ width }: { width: number }) {
  const small = width < 768
  const v = vine(width, small)
  const step = small ? 78 : 150
  const pumpkins: { x: number; i: number }[] = []
  for (let x = step * 0.55, i = 0; x < width - 10; x += step, i += 1) pumpkins.push({ x, i })
  return (
    <div className="hw-bar">
      <svg className="hw-vine" width={width} height="20" viewBox={`0 0 ${width} 20`} fill="none" focusable="false">
        <path d={v.d} className="hw-s-ink" strokeWidth="4.2" strokeLinecap="round" pathLength="1" data-hw-vine />
        <path d={v.d} className="hw-s-vine" strokeWidth="2.6" strokeLinecap="round" pathLength="1" data-hw-vine />
        <path d={v.d} className="hw-s-vinehi" strokeOpacity="0.8" strokeWidth="0.9" strokeLinecap="round" pathLength="1" data-hw-vine transform="translate(0 -0.8)" />
        {v.curls.map((c, i) => (
          <path key={`t${i}`} d={`M${c.x.toFixed(1)} ${c.y.toFixed(1)}q${c.flip ? -3 : 3} 6 0 10q-4 3-5.5-1q-1-3.5 2.5-3q2 .5 1.2 2.2`} className="hw-s-leaf" strokeWidth="1.2" strokeLinecap="round" fill="none" data-hw-leaf />
        ))}
        {v.leaves.map((l, i) => (
          <g key={i} transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${((l.up ? -35 : 145) + l.rot).toFixed(1)}) scale(${l.k.toFixed(2)})`}>
            <g data-hw-leaf>
              <path d="M0 0q5-8 15-5-3 9-15 5z" className={i % 3 ? 'hw-c-leaf' : 'hw-c-leaf2'} strokeWidth="1.1" strokeLinejoin="round" />
              <path d="M1 0q6-2.5 12-4" className="hw-s-ink" strokeOpacity="0.45" strokeWidth="0.7" fill="none" />
            </g>
          </g>
        ))}
      </svg>
      {pumpkins.map((p) => {
        const size = (small ? [20, 16, 18, 15] : [28, 22, 25, 20, 26])[p.i % (small ? 4 : 5)]
        const hang = Math.round((small ? 5 : 7) + h(p.i, 5) * (small ? 7 : 11))
        return (
          <span key={p.i} className="hw-pk" style={{ left: `${p.x.toFixed(1)}px`, marginLeft: `${-size / 2}px`, top: `calc(100% + ${(v.y(p.x) + 1).toFixed(1)}px)` }} data-hw-pk>
            <span className="hw-pk-in" data-hw-pk-in>
              <svg width="2" height={hang} className="hw-pk-stem" focusable="false"><line x1="1" y1="0" x2="1" y2={hang} className="hw-s-vine" strokeWidth="1.6" /></svg>
              <MiniPumpkin size={size} face={p.i % 3} />
            </span>
          </span>
        )
      })}
      <span className="hw-dangle" data-hw-dangle>
        <svg viewBox="0 0 40 90" fill="none" focusable="false">
          <line x1="20" y1="0" x2="20" y2="56" className="hw-s-web" strokeWidth="1.1" />
          <g className="hw-s-web" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 62L8 56 3 50M16 65L6 64 1 63M16 69L7 73 3 80M17 72L11 78 8 86M24 62l8-6 5-6M24 65l10-1 5-1M24 69l9 4 4 7M23 72l6 6 3 8" />
          </g>
          <ellipse cx="20" cy="71" rx="7" ry="9" className="hw-c-spider" strokeWidth="0.9" /><ellipse cx="20" cy="60" rx="4.8" ry="4.4" className="hw-c-spider" strokeWidth="0.9" />
          <circle cx="18.3" cy="59" r="0.9" className="hw-f-eye" /><circle cx="21.7" cy="59" r="0.9" className="hw-f-eye" />
        </svg>
      </span>
    </div>
  )
}

/* Entrada e vida. Quem chama ja garantiu prefers-reduced-motion: no-preference. */
export function startBar(root: HTMLElement) {
  const q = gsap.utils.selector(root)
  const pks = q('[data-hw-pk]')
  const pkIn = q('[data-hw-pk-in]')
  const dangle = q('[data-hw-dangle]')
  const ambient: gsap.core.Tween[] = []

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.addLabel('grow', 0.15)
    .fromTo(q('[data-hw-vine]'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut' }, 'grow')
    .from(q('[data-hw-leaf]'), { scale: 0, transformOrigin: '0% 50%', duration: 0.5, ease: 'back.out(2.5)', stagger: 0.04 }, 'grow+=0.5')
    .addLabel('drop', 'grow+=0.8')
    .from(pkIn, { y: -34, opacity: 0, duration: 1, ease: 'bounce.out', stagger: { each: 0.07, from: 'center' } }, 'drop')
    .from(dangle, { y: -70, opacity: 0, duration: 1.1, ease: 'bounce.out' }, 'drop+=0.4')
    /* o detalhe da navbar aparece por ultimo (era o unico papel do scene.js nesta versao) */
    .from(q('[data-hw-nav]'), { y: -10, opacity: 0, duration: 0.7 }, 1.3)
    .add(() => {
      ambient.push(gsap.fromTo(pks, { rotation: -6 }, { rotation: 6, transformOrigin: '50% 0%', duration: 1.6, ease: 'sine.inOut', stagger: { each: 0.12, repeat: -1, yoyo: true } }))
      ambient.push(gsap.to(q('[data-hw-face]'), { opacity: 'random(0.7, 1)', duration: 'random(0.25, 0.7)', repeat: -1, repeatRefresh: true, ease: 'none' }))
      ambient.push(gsap.fromTo(dangle, { y: -4 }, { y: 8, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }))
    })

  return () => {
    tl.kill()
    ambient.forEach((a) => a.kill())
  }
}
