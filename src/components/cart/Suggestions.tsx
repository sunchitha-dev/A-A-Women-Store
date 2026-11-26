import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import catalog from '../../data/catalog.json'
import { products } from '../../data/products'
import { useCart } from '../../store/cart'
import Reveal from '../Reveal'

type Look = { id: string; name: string; code: string }
const LOOKS = catalog as Look[]
const priceMap = Object.fromEntries(products.map((p) => [p.id, p.price]))

function Img({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [bad, setBad] = useState(false)
  if (bad) return <div className={`bg-lilac ${className ?? ''}`} aria-hidden="true" />
  return <img src={src} alt={alt} className={className} onError={() => setBad(true)} loading="lazy" />
}

export default function Suggestions() {
  const items = useCart((s) => s.items)
  const add = useCart((s) => s.add)
  const [reduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const scroller = useRef<HTMLDivElement>(null)
  const paused = useRef(false)
  const scroll = (dir: number) => scroller.current?.scrollBy({ left: dir * 320, behavior: reduced ? 'auto' : 'smooth' })

  const picks = useMemo(() => {
    const inBag = new Set(items.map((i) => i.id))
    return LOOKS.filter((l) => !inBag.has(l.id))
  }, [items])

  useEffect(() => {
    const el = scroller.current
    if (!el || reduced || !picks.length) return
    let raf = 0
    let last = 0
    const step = (t: number) => {
      if (!last) last = t
      const dt = t - last
      last = t
      if (!paused.current && !document.hidden) {
        el.scrollLeft += dt * 0.04
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) el.scrollLeft = 0
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [reduced, picks.length])

  if (!picks.length) return null

  const fly = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reduced) return
    const target = document.querySelector<HTMLElement>('[data-bag-count]')
    if (!target) return
    const r = e.currentTarget.getBoundingClientRect()
    const t = target.getBoundingClientRect()
    const dot = document.createElement('div')
    dot.style.cssText = `position:fixed;left:${r.left + r.width / 2 - 6}px;top:${r.top - 6}px;width:12px;height:12px;background:#FF4D8D;border:2px solid #0A0A0A;z-index:9999;pointer-events:none`
    document.body.appendChild(dot)
    gsap.to(dot, { x: t.left + t.width / 2 - (r.left + r.width / 2), y: t.top + t.height / 2 - r.top, duration: 0.5, ease: 'power2.in', onComplete: () => dot.remove() })
  }

  return (
    <section className="mt-12">
      <Reveal><h2 className="font-display text-3xl uppercase md:text-4xl">ADD A LOOK</h2></Reveal>
      <div className="mt-6 flex items-center gap-3">
        <button type="button" className="nb-btn nb-btn-ink !px-0 !py-0 w-12 h-12 shrink-0" aria-label="Scroll looks left" onClick={() => { paused.current = true; scroll(-1); window.setTimeout(() => { paused.current = false }, 800) }}>←</button>
        <div
          ref={scroller}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory flex-1 min-w-0"
          data-lenis-prevent
          onMouseEnter={() => { paused.current = true }}
          onMouseLeave={() => { paused.current = false }}
          onFocusCapture={() => { paused.current = true }}
          onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) paused.current = false }}
          onPointerDown={() => { paused.current = true }}
          onPointerUp={() => { paused.current = false }}
          onPointerCancel={() => { paused.current = false }}
        >
          {picks.map((l) => (
            <div key={l.id} className="nb-card shrink-0 w-52 bg-cream snap-start overflow-hidden">
              <div className="bg-lilac border-b-[3px] border-ink p-3 aspect-[3/4] flex items-center justify-center">
                <Img src={`/products/${l.id}.webp`} alt={l.name} className="max-h-full w-full object-contain" />
              </div>
              <div className="p-3 space-y-1">
                <p className="font-display text-sm uppercase leading-tight">{l.name}</p>
                <p className="font-mono text-[10px] uppercase">{l.code}</p>
                <p className="font-mono text-sm font-bold">₹{priceMap[l.id] ?? 0}</p>
                <button type="button" className="nb-btn w-full !py-2 !px-3 text-xs mt-2" onClick={(e) => { fly(e); add(l.id, 'M') }}>ADD</button>
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="nb-btn nb-btn-ink !px-0 !py-0 w-12 h-12 shrink-0" aria-label="Scroll looks right" onClick={() => { paused.current = true; scroll(1); window.setTimeout(() => { paused.current = false }, 800) }}>→</button>
      </div>
    </section>
  )
}
