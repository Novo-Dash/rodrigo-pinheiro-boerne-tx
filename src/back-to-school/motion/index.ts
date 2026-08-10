import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DUR, EASE, STAGGER } from './tokens'

gsap.registerPlugin(ScrollTrigger)

/**
 * The page's whole motion layer, in one module.
 *
 * Every behaviour below has a job, and the job is written next to it. Nothing
 * loops forever, nothing pins the scroll, nothing moves that a parent reading
 * on a phone would have to wait for.
 *
 *   1. line masks   - headlines rise out of the rule beneath them, which is how
 *                     a printed page gets read: heading first, then the body.
 *   2. rules drawing - the orange hairlines draw left to right, so a chapter
 *                     announces itself before its content arrives.
 *   3. chapter reveals - paces a long single-column read.
 *   4. parallax     - depth on the photographic bands, so the page has a
 *                     foreground and a background rather than one flat plane.
 *   5. magnetic CTAs - physical feedback on the only action the page asks for.
 *   6. ornaments    - the crest sunburst drifts on scroll, tying the decoration
 *                     to the reader's movement instead of animating on its own.
 */

/* ------------------------------------------------------------------ *
 * Word splitter that survives formatting
 * ------------------------------------------------------------------ */

/**
 * Wraps every word in a mask so it can rise from behind its own line box.
 * Unlike a naive `textContent.split(' ')`, this walks child nodes, so the
 * italic emphasis inside a headline keeps its element and its classes.
 */
function splitWords(el: HTMLElement): HTMLElement[] {
  if (el.dataset.split === 'done') {
    return Array.from(el.querySelectorAll<HTMLElement>('.rv-i'))
  }

  const out: HTMLElement[] = []
  const frag = document.createDocumentFragment()

  const emit = (word: string, inherit: string[]) => {
    const outer = document.createElement('span')
    outer.className = 'rv-w'
    const inner = document.createElement('span')
    inner.className = ['rv-i', ...inherit].join(' ')
    inner.textContent = word
    outer.appendChild(inner)
    frag.appendChild(outer)
    frag.appendChild(document.createTextNode(' '))
    out.push(inner)
  }

  const walk = (node: Node, inherit: string[]) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const words = (node.textContent ?? '').split(/\s+/).filter(Boolean)
      words.forEach((w) => emit(w, inherit))
      return
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement
      // The element's own classes (e.g. the italic emphasis) travel down to
      // each of the words it contained.
      const next = [...inherit, ...Array.from(element.classList)]
      element.childNodes.forEach((child) => walk(child, next))
    }
  }

  Array.from(el.childNodes).forEach((child) => walk(child, []))
  el.replaceChildren(frag)
  el.dataset.split = 'done'
  return out
}

/* ------------------------------------------------------------------ *
 * Setup
 * ------------------------------------------------------------------ */

export function initMotion(root: HTMLElement): () => void {
  const mm = gsap.matchMedia()

  mm.add(
    {
      motion: '(prefers-reduced-motion: no-preference)',
      fine: '(hover: hover) and (pointer: fine)',
    },
    (context) => {
      const { motion, fine } = context.conditions as { motion: boolean; fine: boolean }
      if (!motion) return

      // Listener teardown collected here rather than through gsap.context's own
      // `add`: the context callback runs synchronously, so `ctx` is still in
      // its temporal dead zone while the callback body executes.
      const listenerCleanups: Array<() => void> = []

      const ctx = gsap.context(() => {
        /* 1. Headlines --------------------------------------------------- */

        // Hero headline plays on load; it is the first thing on screen and
        // waiting for a scroll would mean waiting for nothing.
        // Both start positions are set here, in the same tick as the reveal of
        // the heading itself, so the un-masked text never shows for a frame.
        const heroHeading = document.querySelector<HTMLElement>('[data-reveal-hero-lines]')
        if (heroHeading) {
          const words = splitWords(heroHeading)
          gsap.set(words, { yPercent: 110 })
          gsap.set(heroHeading, { opacity: 1 })
          gsap.to(words, {
            yPercent: 0,
            duration: DUR.slow,
            ease: EASE.expo,
            stagger: { amount: 0.4 },
            delay: 0.05,
          })
        }

        // Section headlines play when their chapter arrives.
        gsap.utils.toArray<HTMLElement>('[data-reveal-lines]').forEach((heading) => {
          const words = splitWords(heading)
          gsap.set(words, { yPercent: 110 })
          gsap.set(heading, { opacity: 1 })
          gsap.to(words, {
            yPercent: 0,
            duration: DUR.base,
            ease: EASE.expo,
            stagger: { amount: 0.3 },
            scrollTrigger: { trigger: heading, start: 'top 88%', once: true },
          })
        })

        /* 2. Rules drawing ------------------------------------------------ */

        gsap.utils.toArray<HTMLElement>('[data-rule]').forEach((rule) => {
          const onLoad = rule.dataset.rule === 'load'
          gsap.fromTo(
            rule,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: DUR.slow,
              ease: EASE.expo,
              delay: onLoad ? 0.35 : 0,
              ...(onLoad
                ? {}
                : { scrollTrigger: { trigger: rule, start: 'top 92%', once: true } }),
            }
          )
        })

        /* 3. Hero supporting copy, then everything else -------------------- */

        const heroBits = gsap.utils.toArray<HTMLElement>('[data-hero-reveal]')
        if (heroBits.length) {
          gsap.set(heroBits, { opacity: 0, y: 20 })
          gsap.to(heroBits, {
            opacity: 1,
            y: 0,
            duration: DUR.base,
            ease: EASE.out,
            stagger: STAGGER.base,
            delay: 0.3,
          })
        }

        const heroArt = document.querySelector<HTMLElement>('[data-hero-art]')
        if (heroArt) {
          gsap.fromTo(
            heroArt,
            { opacity: 0, y: 34 },
            { opacity: 1, y: 0, duration: DUR.slow, ease: EASE.out, delay: 0.4 }
          )
        }

        // One batched trigger for the whole page rather than one per element.
        const items = gsap.utils.toArray<HTMLElement>('[data-reveal]')
        gsap.set(items, { opacity: 0, y: 26 })
        ScrollTrigger.batch(items, {
          start: 'top 88%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: DUR.base,
              ease: EASE.out,
              stagger: STAGGER.base,
              overwrite: true,
            }),
        })

        /* 4. Parallax ------------------------------------------------------ */

        // The image is pre-scaled in CSS, so drifting it never exposes an edge.
        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
          const depth = parseFloat(el.dataset.parallax || '0.1')
          gsap.fromTo(
            el,
            { yPercent: -depth * 100 },
            {
              yPercent: depth * 100,
              ease: 'none',
              scrollTrigger: {
                trigger: el.parentElement ?? el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          )
        })

        /* 6. Ornaments ------------------------------------------------------ */

        gsap.utils.toArray<HTMLElement>('[data-drift]').forEach((el) => {
          const amount = parseFloat(el.dataset.drift || '40')
          gsap.fromTo(
            el,
            { y: amount, rotate: -6 },
            {
              y: -amount,
              rotate: 6,
              ease: 'none',
              scrollTrigger: {
                trigger: el.parentElement ?? el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          )
        })

        /* 5. Magnetic CTAs -------------------------------------------------- */

        // Pointer physics only where there is a real cursor; on touch the
        // button keeps its plain :active press instead.
        if (fine) {
          gsap.utils.toArray<HTMLElement>('[data-magnetic]').forEach((el) => {
            const strength = 0.28
            const move = (e: PointerEvent) => {
              const r = el.getBoundingClientRect()
              gsap.to(el, {
                x: (e.clientX - (r.left + r.width / 2)) * strength,
                y: (e.clientY - (r.top + r.height / 2)) * strength * 0.6,
                duration: DUR.fast,
                ease: EASE.out,
              })
            }
            const reset = () =>
              gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: EASE.spring })

            el.addEventListener('pointermove', move)
            el.addEventListener('pointerleave', reset)
            // gsap.context reverts the tweens; the listeners are cleaned here.
            listenerCleanups.push(() => {
              el.removeEventListener('pointermove', move)
              el.removeEventListener('pointerleave', reset)
            })
          })
        }
      }, root)

      return () => {
        listenerCleanups.forEach((fn) => fn())
        ctx.revert()
      }
    }
  )

  // Fonts and images change section heights; recompute once they land.
  const refresh = () => ScrollTrigger.refresh()
  document.fonts?.ready.then(refresh).catch(() => {})
  window.addEventListener('load', refresh)

  return () => {
    window.removeEventListener('load', refresh)
    mm.revert()
  }
}

export { DUR, EASE, STAGGER }
