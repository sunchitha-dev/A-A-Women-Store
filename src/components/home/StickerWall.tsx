import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import catalog from '../../data/catalog.json'
import Reveal from '../Reveal'
import SplitWords from '../motion/SplitWords'

gsap.registerPlugin(ScrollTrigger)

const IDS = ['party_11', 'y2k_06', 'kurti_01', 'kurti_04', 'jeans_01', 'jeans_02', 'kurti_06']
const LOOKS = IDS.map((id) => (catalog as { id: string; name: string; code: string }[]).find((c) => c.id === id)).filter(Boolean) as { id: string; name: string; code: string }[]

function seeded(i: number, salt: number) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return x - Math.floor(x)
}

function fromEdge(i: number) {
  const edge = Math.floor(seeded(i, 1) * 4)
  if (edge === 0) return { x: -200, y: 0 }
  if (edge === 1) return { x: 200, y: 0 }
  if (edge === 2) return { x: 0, y: -200 }
  return { x: 0, y: 200 }
}

export default function StickerWall() {
  const sectionRef = useRef<HTMLElement>(null)
  const wrapRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const wraps = wrapRefs.current.filter(Boolean) as HTMLDivElement[]
    if (!wraps.length) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { gsap.set(wraps, { opacity: 1, x: 0, y: 0 }); return }

    const ctx = gsap.context(() => {
      ScrollTrigger.batch(wraps, {
        start: 'top 92%',
        once: true,
        onEnter: (batch) => {
          (batch as HTMLDivElement[]).forEach((el, j) => {
            const i = Number(el.dataset.i || 0)
            const from = fromEdge(i)
            gsap.fromTo(el, { x: from.x, y: from.y, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: j * 0.08, overwrite: true })
          })
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <section ref={sectionRef} className="bg-gold border-b-[4px] border-ink px-4 sm:px-6 py-16 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70 mb-3">THE WALL</p>
          <SplitWords as="h2" mode="chars" stagger={0.03} className="font-display uppercase text-ink [font-size:clamp(2.4rem,6vw,5rem)] leading-[0.9] mb-10 md:mb-14">STICKER MOOD</SplitWords>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {LOOKS.map((look, i) => {
            const rot = seeded(i, 2) * 12 - 6
            const tx = seeded(i, 3) * 60 - 30
            const ty = seeded(i, 4) * 40 - 20
            return (
              <div key={look.id} ref={(el) => { wrapRefs.current[i] = el }} data-i={i} className="will-change-transform">
                <div
                  className="nb-sticker !p-0 !bg-white !font-body !text-base !normal-case !inline-block w-full"
                  style={{
                    transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg)`,
                    boxShadow: '4px 4px 0 #0A0A0A',
                    transition: reduced ? undefined : 'transform 0.15s ease, box-shadow 0.15s ease',
                  }}
                  onMouseEnter={reduced ? undefined : (e) => { const el = e.currentTarget; el.style.transform = `translate(${tx}px, ${ty - 8}px) rotate(0deg) scale(1.05)`; el.style.boxShadow = '8px 8px 0 #0A0A0A'; el.style.zIndex = '10' }}
                  onMouseLeave={reduced ? undefined : (e) => { const el = e.currentTarget; el.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg)`; el.style.boxShadow = '4px 4px 0 #0A0A0A'; el.style.zIndex = '' }}
                >
                  <img src={`/tryon/${look.id}.webp`} alt={look.name} className="w-full aspect-[3/4] object-cover block border-b-[3px] border-ink" loading="lazy" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink px-2 py-2">{look.code}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
