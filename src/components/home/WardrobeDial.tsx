import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import catalog from '../../data/catalog.json'
import Reveal from '../Reveal'
import SplitWords from '../motion/SplitWords'

type Cat = { label: string; slug: string; bg: string; ids: string[] }
const CATS: Cat[] = [
  { label: 'KURTIS', slug: 'kurti', bg: '#FFF6E0', ids: ['kurti_01', 'kurti_04', 'kurti_06'] },
  { label: 'JEANS', slug: 'jeans', bg: '#C9B6FF', ids: ['jeans_01', 'jeans_02'] },
  { label: 'PARTY WEAR', slug: 'party', bg: '#FF4D8D', ids: ['party_11'] },
  { label: 'Y2K', slug: 'y2k', bg: '#D4AF55', ids: ['y2k_06'] },
]
const LOOKS = catalog as { id: string; name: string; code: string }[]
const byId = (id: string) => LOOKS.find((l) => l.id === id)
const norm = (i: number) => ((i % 4) + 4) % 4

export default function WardrobeDial() {
  const [active, setActive] = useState(0)
  const [reduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const activeRef = useRef(0)
  const sectionRef = useRef<HTMLElement>(null)
  const dialRef = useRef<HTMLDivElement>(null)
  const fanRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; startIdx: number; acc: number; moved: boolean } | null>(null)
  const pauseRef = useRef(false)
  const nav = useNavigate()
  useEffect(() => { activeRef.current = active }, [active])

  useEffect(() => {
    const section = sectionRef.current
    const dial = dialRef.current
    if (!section || !dial) return
    gsap.to(section, { backgroundColor: CATS[active].bg, duration: reduced ? 0 : 0.4, overwrite: 'auto' })
    gsap.to(dial, { rotation: active * 90, duration: reduced ? 0 : 0.4, ease: 'power2.out', overwrite: 'auto' })
  }, [active, reduced])

  useEffect(() => {
    const fan = fanRef.current
    if (!fan) return
    const cards = Array.from(fan.querySelectorAll<HTMLElement>('[data-fan]'))
    if (reduced) { gsap.set(cards, { opacity: 1, x: 0, rotation: (i) => [-6, 0, 6][i] ?? 0 }); return }
    gsap.fromTo(cards, { x: 200, opacity: 0, rotation: 0 }, { x: 0, opacity: 1, rotation: (i) => [-6, 0, 6][i] ?? 0, stagger: 0.1, duration: 0.45, ease: 'power3.out', overwrite: true })
  }, [active, reduced])

  const changeTo = useCallback((next: number) => {
    const prev = activeRef.current
    const n = norm(next)
    if (n === prev) return
    if (!reduced) {
      const fan = fanRef.current
      const cards = fan ? Array.from(fan.querySelectorAll<HTMLElement>('[data-fan]')) : []
      if (cards.length) {
        gsap.to(cards, { x: -200, opacity: 0, stagger: 0.05, duration: 0.25, ease: 'power2.in', overwrite: true, onComplete: () => setActive(n) })
        return
      }
    }
    setActive(n)
  }, [reduced])

  useEffect(() => {
    if (reduced) return
    const t = window.setInterval(() => {
      if (pauseRef.current) return
      const cur = activeRef.current
      let next = Math.floor(Math.random() * 4)
      if (next === cur) next = (cur + 1) % 4
      changeTo(next)
    }, 2400)
    return () => window.clearInterval(t)
  }, [reduced, changeTo])

  const onDown = (e: React.PointerEvent) => {
    if (reduced) return
    pauseRef.current = true
    drag.current = { x: e.clientX, startIdx: activeRef.current, acc: 0, moved: false }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) >= 60) {
      const steps = Math.trunc(dx / 60)
      d.x += steps * 60
      d.acc += steps
      d.moved = true
      const next = norm(d.startIdx + d.acc)
      if (next !== activeRef.current) { activeRef.current = next; setActive(next) }
    }
  }
  const onUp = () => { drag.current = null; pauseRef.current = false }

  const mobile = typeof window !== 'undefined' && window.innerWidth < 768
  const ids = CATS[active].ids.slice(0, mobile ? 2 : 3)
  const fanItems = ids.map((id) => byId(id)).filter(Boolean) as { id: string; name: string; code: string }[]

  return (
    <section ref={sectionRef} className="min-h-screen md:min-h-0 border-b-[4px] border-ink px-4 sm:px-6 py-16 md:py-16 lg:py-20 overflow-hidden flex flex-col items-center justify-center" style={{ backgroundColor: CATS[0].bg }} onMouseEnter={() => { pauseRef.current = true }} onMouseLeave={() => { if (!drag.current) pauseRef.current = false }}>
      <Reveal className="w-full max-w-6xl mb-8 md:mb-10 text-center md:text-left">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-3">WARDROBE DIAL</p>
        <SplitWords as="h2" mode="chars" stagger={0.03} className="font-display uppercase text-ink [font-size:clamp(2.4rem,6vw,5rem)] leading-[0.9]">PICK YOUR VIBE</SplitWords>
      </Reveal>
      <div className="relative flex items-center justify-center w-full max-w-6xl gap-8 md:gap-12 lg:gap-16 flex-col lg:flex-row">
        <div className="relative shrink-0" style={{ width: 'min(76vw, 520px)', height: 'min(76vw, 520px)', minWidth: 280, minHeight: 280 }}>
          <button type="button" className="hidden md:inline-flex absolute left-1/2 -top-2 md:-top-4 -translate-x-1/2 nb-chip !px-3 !py-2 font-display uppercase text-sm text-cream bg-ink border-[3px] border-ink" onClick={() => active === 0 ? nav('/shop?category=kurti') : changeTo(0)}>KURTIS</button>
          <button type="button" className="hidden md:inline-flex absolute top-1/2 -right-2 md:-right-6 -translate-y-1/2 nb-chip !px-3 !py-2 font-display uppercase text-sm text-cream bg-ink border-[3px] border-ink" onClick={() => active === 1 ? nav('/shop?category=jeans') : changeTo(1)}>JEANS</button>
          <button type="button" className="hidden md:inline-flex absolute left-1/2 -bottom-2 md:-bottom-4 -translate-x-1/2 nb-chip !px-3 !py-2 font-display uppercase text-sm text-cream bg-ink border-[3px] border-ink whitespace-nowrap" onClick={() => active === 2 ? nav('/shop?category=party') : changeTo(2)}>PARTY WEAR</button>
          <button type="button" className="hidden md:inline-flex absolute top-1/2 -left-2 md:-left-4 -translate-y-1/2 nb-chip !px-3 !py-2 font-display uppercase text-sm text-cream bg-ink border-[3px] border-ink" onClick={() => active === 3 ? nav('/shop?category=y2k') : changeTo(3)}>Y2K</button>

          <div
            ref={dialRef}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-ink bg-cream flex items-center justify-center select-none"
            style={{ width: 'min(62vw, 390px)', height: 'min(62vw, 390px)', minWidth: 220, minHeight: 220, touchAction: 'none' }}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" aria-hidden>
              {Array.from({ length: 24 }).map((_, i) => {
                const a = (i * 15 * Math.PI) / 180
                const r1 = 46, r2 = i % 2 === 0 ? 41 : 43.5
                return <line key={i} x1={50 + Math.cos(a) * r1} y1={50 + Math.sin(a) * r1} x2={50 + Math.cos(a) * r2} y2={50 + Math.sin(a) * r2} stroke="#D4AF55" strokeWidth={i % 6 === 0 ? 1.8 : 1} />
              })}
              <circle cx="50" cy="50" r="32" fill="none" stroke="#0A0A0A" strokeWidth="0.8" />
            </svg>
            <div className="relative text-center px-6">
              <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-ink">SPIN TO EXPLORE</p>
              <p className="font-display text-xl md:text-2xl uppercase text-ink mt-2">{CATS[active].label}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 w-full max-w-[340px] md:hidden">
          {CATS.map((c, i) => (
            <button key={c.slug} type="button" onClick={() => active === i ? nav(`/shop?category=${c.slug}`) : changeTo(i)} className={`nb-chip !px-3 !py-2 font-display uppercase text-[11px] border-[3px] border-ink ${active === i ? 'bg-ink text-cream' : 'bg-cream text-ink'}`}>{c.label}</button>
          ))}
        </div>

        <div className="relative w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[500px]">
          <div className="nb-card bg-cream border-[3px] border-ink p-3 md:p-4 shadow-nb" onClick={() => nav(`/shop?category=${CATS[active].slug}`)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') nav(`/shop?category=${CATS[active].slug}`) }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/60 mb-3">{CATS[active].label} / A&A</p>
            <div ref={fanRef} className="relative h-[320px] sm:h-[360px] md:h-[440px]">
              {fanItems.map((look, i) => {
                const rot = [-6, 0, 6][i] ?? 0
                return (
                <div key={`${active}-${look.id}`} className="absolute left-1/2 top-0 w-[72%] sm:w-[68%] -translate-x-1/2">
                  <div data-fan className="border-[3px] border-ink bg-white shadow-nb-sm" style={{ transformOrigin: 'bottom center', transform: `rotate(${rot}deg)` }}>
                    <img src={`/tryon/${look.id}.webp`} alt={look.name} className="w-full aspect-[3/4] object-cover block" loading="lazy" />
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink px-2 py-1.5 border-t-[3px] border-ink">{look.code}</p>
                  </div>
                </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
