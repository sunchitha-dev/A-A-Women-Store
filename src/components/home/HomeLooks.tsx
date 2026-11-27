import { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Reveal from '../Reveal'

const LOOKS = [
  { id: 'kurti_01', name: 'Kurti 01' },
  { id: 'kurti_04', name: 'Kurti 04' },
  { id: 'kurti_06', name: 'Kurti 06' },
  { id: 'jeans_01', name: 'Jeans 01' },
  { id: 'jeans_02', name: 'Jeans 02' },
  { id: 'party_11', name: 'Party 11' },
  { id: 'y2k_06', name: 'Y2K 06' },
]

export default function HomeLooks() {
  const railRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])
  const nav = useNavigate()

  const updateScale = useCallback(() => {
    const rail = railRef.current
    if (!rail) return
    const center = rail.scrollLeft + rail.clientWidth / 2
    cardRefs.current.forEach((card) => {
      if (!card) return
      const c = card.offsetLeft + card.offsetWidth / 2
      const dist = Math.abs(center - c)
      const near = dist < card.offsetWidth * 0.6
      card.style.transform = near ? 'scale(1.04)' : 'scale(1)'
      card.style.boxShadow = near ? '8px 8px 0 0 #0A0A0A' : '4px 4px 0 0 #0A0A0A'
    })
  }, [])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    let raf = 0
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(updateScale) }
    updateScale()
    rail.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { cancelAnimationFrame(raf); rail.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [updateScale])

  const scrollBy = (dir: number) => {
    const rail = railRef.current
    const card = cardRefs.current.find(Boolean)
    if (!rail || !card) return
    rail.scrollBy({ left: dir * (card.offsetWidth + 24), behavior: 'smooth' })
  }

  return (
    <section className="bg-lilac border-b-[4px] border-ink py-16 md:py-24 overflow-hidden" style={{ backgroundImage: 'linear-gradient(rgba(10,10,10,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <span className="nb-sticker bg-pink text-ink rotate-[3deg] mb-3 inline-block">STYLE PREVIEW</span>
              <h2 className="font-display uppercase text-ink [font-size:clamp(2rem,5vw,3.5rem)] leading-none">FEATURED LOOKS</h2>
            </div>
            <div className="hidden md:flex gap-2">
              <button type="button" aria-label="Scroll left" onClick={() => scrollBy(-1)} className="nb-btn bg-cream !px-4 !py-2">←</button>
              <button type="button" aria-label="Scroll right" onClick={() => scrollBy(1)} className="nb-btn bg-cream !px-4 !py-2">→</button>
            </div>
          </div>
        </Reveal>
      </div>

      <div ref={railRef} data-lenis-prevent data-lenis-prevent-wheel className="flex gap-6 overflow-x-auto px-4 sm:px-6 pb-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ WebkitOverflowScrolling: 'touch' }}>
        {LOOKS.map((l, i) => (
          <button
            key={l.id}
            ref={(el) => { cardRefs.current[i] = el }}
            type="button"
            onClick={() => nav(`/shop?look=${l.id}`)}
            className="snap-start shrink-0 text-left bg-white border-[3px] border-ink shadow-nb transition-[transform,box-shadow] duration-[240ms] [transition-timing-function:var(--ease-out)] [width:clamp(220px,35vw,300px)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink"
          >
            <img src={`/tryon/${l.id}.webp`} alt={l.name} className="w-full aspect-[2/3] object-contain bg-white" loading="lazy" />
            <div className="border-t-[3px] border-ink p-3">
              <span className="nb-sticker bg-pink text-ink !text-[10px] mb-2 inline-block">STYLE PREVIEW</span>
              <p className="font-mono text-[11px] uppercase text-ink">{l.id.replace('_', ' ')} — {l.name}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
