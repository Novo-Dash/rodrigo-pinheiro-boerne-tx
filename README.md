# Rodrigo Pinheiro BJJ Boerne — Landing Page

Stack: React 19 + Vite + Tailwind 4 + TypeScript + GSAP  
Sistema: BLACK-BELT-UX v5.0  
Referência: Sanctum BJJ (sanctum-self.vercel.app)

---

## Setup

```bash
npm install
npm run dev
```

## Deploy (Vercel)

```bash
vercel --prod
```

## Variáveis de ambiente obrigatórias (.env)

```
GHL_WEBHOOK_URL=         # Webhook GoHighLevel
VITE_META_PIXEL_ID=      # Meta Pixel ID
VITE_GTM_ID=             # Google Tag Manager ID
VITE_GOOGLE_MAPS_KEY=    # Google Maps API Key (opcional)
```

---

## Arquitetura

```
src/
├── components/
│   ├── layout/       → Navbar, Footer
│   ├── sections/     → Hero, OurClasses, Testimonials, HowToStart,
│   │                   OurSchedule, OurInstructors, MoreOfUs, About,
│   │                   FAQ, Location, FinalCTA, StickyCTABar, BookingModal
│   └── ui/           → Button, Section, SectionHeader, Badge, ImagePlaceholder
├── data/             → programs, testimonials, faq, schedule
├── hooks/            → useModal, useUTMs, useScrollDepth
├── types/            → index.ts, globals.d.ts
└── lib/              → utils.ts (cn)
api/
└── submit-lead.ts    → Proxy serverless → GHL webhook
```
