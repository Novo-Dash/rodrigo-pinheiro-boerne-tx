/* Oferta de Black Friday desta LP. É o único arquivo que muda de cliente para
   cliente. RP Boerne: kimono grátis pagando 3 meses de Jiu-Jitsu, e a Essential
   Box de $210 como adicional, até 02/12. Nada de travessão. */
export const BF = {
  academy: 'RPBJJ Boerne',
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
  cta: 'Claim your spot',
  fine: 'Offer valid until Dec 2.',
}
