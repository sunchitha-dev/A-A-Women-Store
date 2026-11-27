import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import catalog from '../../data/catalog.json'
import Reveal from '../Reveal'
import SplitWords from '../motion/SplitWords'

const WA = '917904733345'
const DESCS: Record<string, string[]> = {
  kurti_01: ['Soft florals, sharp attitude.', 'Made for brunches that turn into plans.', 'Easy drape, zero effort.', 'Pairs sweet with a little bite.', 'Wear it like you meant it.'],
  kurti_04: ['Embroidery that whispers, not shouts.', 'Elegant, but never boring.', 'Built for compliments and chai.', 'A little tradition, a lot of poise.', 'Graceful, with main-character energy.'],
  kurti_06: ['Prints with personality.', 'Casual, but make it polished.', 'For days you want easy and iconic.', 'Comfort that still looks curated.', 'Low fuss, high charm.'],
  jeans_01: ['Classic denim, confident mood.', 'Fits clean, walks bold.', 'Your everyday power move.', 'Dressed up or down, never dull.', 'Simple cut, serious presence.'],
  jeans_02: ['High waist, higher standards.', 'Snatches the silhouette, keeps it classy.', 'Built for strut-worthy days.', 'Effortless edge, polished finish.', 'Denim that knows its worth.'],
  party_11: ['Made for entrances, not excuses.', 'A little shimmer, a lot of confidence.', 'Classy sparkle, sassy soul.', 'For nights that deserve drama.', 'Wear it. Own it. Repeat.'],
  y2k_06: ['Throwback, but sharper.', 'Playful cut, polished confidence.', 'Street sass with a luxe wink.', 'Nostalgia, upgraded.', 'Cute face, killer fit.'],
}

type Look = { id: string; name: string; code: string; desc: string[] }
const LOOKS: Look[] = (catalog as { id: string; name: string; code: string }[]).map((l) => ({ ...l, desc: DESCS[l.id] ?? ['A&A pick.', 'Styled with intent.', 'Wear it your way.', 'Ask us on WhatsApp.', 'Made to stand out.'] }))

function waHref(name: string) {
  return `https://wa.me/${WA}?text=${encodeURIComponent(`Hi, I want to know more about ${name}`)}`
}

function place(i: number, total: number) {
  const p = Math.min(i, 3)
  return { x: p * 10, y: -p * 14, rotate: p * 3, scale: 1 - p * 0.04, z: total - i, opacity: i < 4 ? 1 : 0 }
}

export default function StackCards() {
  const [order, setOrder] = useState(() => LOOKS.map((_, i) => i))
  const [auto, setAuto] = useState(true)
  const [hovered, setHovered] = useState(false)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const drag = useRef<{ id: number; startX: number; startY: number; x: number; y: number; moved: boolean } | null>(null)
  const orderRef = useRef(order)
  useEffect(() => { orderRef.current = order }, [order])
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const layoutCards = useCallback((immediate = false) => {
    const o = orderRef.current
    o.forEach((lookIdx, pos) => {
      const el = cardRefs.current[lookIdx]
      if (!el) return
      const t = place(pos, LOOKS.length)
      gsap.to(el, { x: t.x, y: t.y, rotate: t.rotate, scale: t.scale, opacity: t.opacity, duration: immediate || reduced ? 0 : 0.45, ease: 'power3.out', overwrite: 'auto' })
      el.style.zIndex = String(t.z)
    })
  }, [reduced])

  useEffect(() => { layoutCards(true) }, [layoutCards])
  useEffect(() => { layoutCards(false) }, [order, layoutCards])

  const sendToBack = useCallback(() => {
    const o = orderRef.current
    if (o.length < 2) return
    setOrder([...o.slice(1), o[0]])
  }, [])

  useEffect(() => {
    if (reduced || !auto || hovered) return
    const t = window.setInterval(sendToBack, 2800)
    return () => window.clearInterval(t)
  }, [auto, hovered, reduced, sendToBack])

  const onDown = (e: React.PointerEvent, lookIdx: number) => {
    if (orderRef.current[0] !== lookIdx) return
    const el = cardRefs.current[lookIdx]
    if (!el) return
    drag.current = { id: e.pointerId, startX: e.clientX, startY: e.clientY, x: gsap.getProperty(el, 'x') as number, y: gsap.getProperty(el, 'y') as number, moved: false }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onMove = (e: React.PointerEvent, lookIdx: number) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId || orderRef.current[0] !== lookIdx) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    if (!d.moved && Math.hypot(dx, dy) < 6) return
    d.moved = true
    const el = cardRefs.current[lookIdx]
    if (!el) return
    gsap.set(el, { x: d.x + dx, y: d.y + dy, rotate: dx * 0.05 })
  }
  const onUp = (e: React.PointerEvent, _lookIdx: number) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    drag.current = null
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    if (d.moved && (Math.hypot(dx, dy) > 90 || Math.abs(dx) > 70)) sendToBack()
    else layoutCards(false)
  }

  const top = LOOKS[order[0]]
  const activeDesc = top?.desc ?? []

  return (
    <section className="bg-cream border-b-[4px] border-ink px-4 sm:px-6 py-16 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl grid md:grid-cols-[minmax(0,520px)_1fr] gap-8 md:gap-12 items-center">
        <div>
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-3">FEATURED LOOKS</p>
            <SplitWords as="h2" mode="chars" stagger={0.03} className="font-display uppercase text-ink [font-size:clamp(2.4rem,6vw,5rem)] leading-[0.9] mb-10 md:mb-12">THE STACK</SplitWords>
          </Reveal>
          <Reveal className="relative mx-auto md:mx-0 w-full max-w-[340px] sm:max-w-[400px] aspect-[3/4] mt-2 md:mt-4" y={40} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            {LOOKS.map((look, lookIdx) => (
              <div
                key={look.id}
                ref={(el) => { cardRefs.current[lookIdx] = el }}
                className="absolute inset-0 bg-white border-[3px] border-ink p-2 sm:p-3 will-change-transform select-none touch-none"
                style={{ boxShadow: '8px 8px 0 0 #D4AF55', opacity: 0 }}
                onPointerDown={(e) => onDown(e, lookIdx)}
                onPointerMove={(e) => onMove(e, lookIdx)}
                onPointerUp={(e) => onUp(e, lookIdx)}
                onPointerCancel={(e) => onUp(e, lookIdx)}
              >
                <div className="h-full flex flex-col min-h-0">
                  <img src={`/tryon/${look.id}.webp`} alt={look.name} className="w-full flex-1 min-h-0 object-cover border-[3px] border-ink pointer-events-none" draggable={false} />
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50">{look.code}</p>
                      <p className="font-display uppercase text-xl text-ink leading-none mt-1">{look.name}</p>
                    </div>
                    <a href={waHref(look.name)} target="_blank" rel="noreferrer" className="nb-btn nb-btn-pink !px-3 !py-2 text-[11px] shrink-0" onPointerDown={(e) => e.stopPropagation()}>WHATSAPP</a>
                  </div>
                </div>
              </div>
            ))}
          </Reveal>
          <div className="mt-6 flex items-center gap-3 max-w-[400px]">
            <button type="button" aria-label="Previous card" onClick={() => { const o = orderRef.current; setOrder([o[o.length - 1], ...o.slice(0, -1)]) }} className="nb-btn bg-cream !px-4 !py-2">←</button>
            <button type="button" aria-label="Next card" onClick={sendToBack} className="nb-btn bg-cream !px-4 !py-2">→</button>
            <button type="button" aria-label={auto ? 'Pause auto stack' : 'Play auto stack'} onClick={() => setAuto((a) => !a)} className={`nb-btn !px-4 !py-2 text-[11px] ${auto ? 'bg-pink text-ink' : 'bg-cream text-ink'}`}>{auto ? 'AUTO ON' : 'AUTO OFF'}</button>
          </div>
        </div>

        <div className="md:pl-4" aria-live="polite">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-pink mb-3">{top?.code} / A&A PICK</p>
          <p key={top?.id + '-t'} className="font-display uppercase text-[clamp(2rem,4vw,3.5rem)] text-ink leading-[0.95] mb-5 [animation:aa-fade_240ms_ease-out]">{top?.name}</p>
          <div key={top?.id + '-d'} className="space-y-2 max-w-xl [animation:aa-fade_320ms_ease-out]">
            {activeDesc.map((line) => <p key={line} className="font-body text-base lg:text-lg text-ink/80 leading-relaxed">{line}</p>)}
          </div>
        </div>
      </div>
      <style>{`@keyframes aa-fade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </section>
  )
}
