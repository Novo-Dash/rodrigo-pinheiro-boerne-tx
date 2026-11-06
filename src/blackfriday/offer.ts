/* Oferta de Black Friday desta LP. É o único arquivo que muda de cliente para
   cliente. RP Boerne: kimono grátis pagando 3 meses de Jiu-Jitsu, e a Essential
   Box de $210 como adicional, até 02/12. Nada de travessão. */
export const BF = {
  academy: 'Relentless BJJ Squad',
  tag: 'Black Friday',
  headline: ['Free Gi', 'with 3 Months'],
  lead: 'From now until Dec 2, you pay for 3 months of Jiu-Jitsu and get a free gi, and you can also add the $210 Essential Box.',
  benefits: ['Free gi with 3 months', 'Essential Box for $210', '2 shirts, gi, rash guard'],
  perks: {
    fee: { label: 'Essential Box', value: '$210', note: '2 shirts, gi, rash guard' },
    gear: { label: 'With 3 months', value: 'Free gi' },
    start: { label: 'Offer ends', value: 'Dec 2' },
  },
  ticker: ['Black Friday', 'A free gi with 3 paid months', 'Until Dec 2', 'Essential Box for $210'],
  hero: 'A free gi with 3 paid months',
  // box do formulário (painel esquerdo): linha de valores e a tira do celular
  box: { line: 'Add the $210 Essential Box', slim: 'Free gi with 3 months' },
  // o bento: o gi grátis e a Essential Box em blocos SEPARADOS (a caixa é adicional
  // pago; RP HQ 05/11: o cliente reclamou quando o plano curto parecia levar o kit)
  addon: { chip: 'Optional add-on', items: ['2 shirts', 'Gi', 'Rash guard'] },
  photo: { src: '/Advanced.webp', alt: 'Two Relentless BJJ Squad athletes in their gis, smiling with their medals' },
  // fim da campanha: 02/12 23:59 em Boerne (CST, UTC-6)
  ends: '2026-12-02T23:59:59-06:00',
  cta: 'Claim your spot',
  fine: 'Offer valid until Dec 2.',
}
