/* Vetores próprios da roupagem de Black Friday (variação Faixas). Cores só por
   token (--bf-*), então a mesma peça veste qualquer cliente. */

/* Etiqueta de preço pequena: separador da faixa corrida. */
export function TagGlyph() {
  return (
    <svg className="bf-glyph" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M2.5 11.6V3.5a1 1 0 0 1 1-1h8.1l9.9 9.9-9.1 9.1-9.9-9.9ZM7.6 5.6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
        fill="currentColor"
      />
    </svg>
  )
}

/* Kimono deitado de frente (o gestor pediu: camisa na arte é sempre kimono).
   Jaqueta preta com a faixa branca. A manga
   direita termina no mesmo ponto em que a etiqueta de preço se pendura
   (.bf-price no CSS). Esquerda espelhada à mão (x' = 420 - x). */
const GI =
  'M176 40Q210 50 244 40L312 58Q352 150 380 284L330 314Q306 238 290 170L298 410Q210 419 122 410L130 170Q114 238 90 314L40 284Q68 150 108 58Z'
const SLEEVE_HEM_R = 'M372 270L324 296'
const SLEEVE_HEM_L = 'M48 270L96 296'

export function Kimono({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 420 440" aria-hidden="true">
      <defs>
        <linearGradient id="bf-gi-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#272727" />
          <stop offset="1" stopColor="#0e0e0e" />
        </linearGradient>
        <radialGradient id="bf-gi-sheen" cx="0.42" cy="0.26" r="0.6">
          <stop offset="0" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* sombra de contato no disco */}
      <ellipse cx="210" cy="424" rx="132" ry="12" fill="#000" opacity="0.28" />
      <path d={GI} fill="url(#bf-gi-body)" />
      <path d={GI} fill="url(#bf-gi-sheen)" />

      {/* o V do peito, por dentro da gola */}
      <path d="M176 40Q210 50 244 40L210 132Z" fill="#050505" />

      {/* gola: a de baixo (da direita para a esquerda) e a de cima, com costura */}
      <g strokeLinecap="butt">
        <path d="M250 42L158 250" stroke="#323232" strokeWidth="27" />
        <path d="M250 42L158 250" stroke="#fff" strokeOpacity="0.22" strokeWidth="1.4" strokeDasharray="4 4" fill="none" />
        <path d="M170 42L262 250" stroke="#3a3a3a" strokeWidth="27" />
        <path d="M170 42L262 250" stroke="#fff" strokeOpacity="0.26" strokeWidth="1.4" strokeDasharray="4 4" fill="none" />
      </g>
      {/* borda da aba da frente, abaixo da faixa */}
      <path d="M262 276L240 410" stroke="#3a3a3a" strokeWidth="7" />

      {/* barra das mangas e da jaqueta */}
      <g fill="none" stroke="#fff" strokeOpacity="0.2" strokeWidth="1.4" strokeDasharray="4 4">
        <path d={SLEEVE_HEM_R} />
        <path d={SLEEVE_HEM_L} />
        <path d="M126 398Q210 406 294 398" />
      </g>
      {/* vincos do tecido */}
      <g fill="none" stroke="#fff" strokeOpacity="0.06" strokeWidth="2" strokeLinecap="round">
        <path d="M146 300Q150 350 144 396" />
        <path d="M276 300Q272 350 278 396" />
        <path d="M120 112Q128 180 132 220" />
        <path d="M300 112Q292 180 288 220" />
      </g>

      {/* faixa branca: volta da cintura, nó e as duas pontas com a barra de grau */}
      <path d="M129 252Q210 260 291 252L292 278Q210 286 128 278Z" fill="var(--bf-paper)" />
      <path d="M129 252Q210 260 291 252" fill="none" stroke="#000" strokeOpacity="0.12" strokeWidth="2" />
      <path d="M198 276L214 278L190 352L174 347Z" fill="var(--bf-paper)" />
      <path d="M210 278L226 276L248 347L232 352Z" fill="#ececec" />
      <path d="M181 326L196 331L190 352L174 347Z" fill="var(--bf-ink)" />
      <path d="M236 331L251 326L248 347L232 352Z" fill="var(--bf-ink)" />
      <rect x="195" y="246" width="30" height="36" rx="5" fill="#f2f2f2" />
      <path d="M197 264H223" stroke="#000" strokeOpacity="0.14" strokeWidth="2" />

      {/* contorno para ler no fundo escuro */}
      <path d={GI} fill="none" stroke="#fff" strokeOpacity="0.16" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}
