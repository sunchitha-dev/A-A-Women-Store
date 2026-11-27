import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CATS = [
  { label: 'KURTIS', count: 3, slug: 'kurti' },
  { label: 'JEANS', count: 2, slug: 'jeans' },
  { label: 'PARTY WEAR', count: 1, slug: 'party' },
  { label: 'Y2K', count: 1, slug: 'y2k' },
]

export default function CategoryTunnel() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([])
  const nav = useNavigate()

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const tiles = tileRefs.current.filter(Boolean) as HTMLButtonElement[]
    if (reduced) {
      gsap.set(tiles, { opacity: 1, x: 0 })
      if (window.innerWidth >= 768) { track.style.overflowX = 'auto'; track.style.scrollSnapType = 'x mandatory' }
      return
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        '(min-width: 768px)': () => {
          const getX = () => -(track.scrollWidth - window.innerWidth)
          gsap.to(track, {
            x: getX,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              pin: true,
              scrub: 1,
              start: 'top top',
              end: () => '+=' + (track.scrollWidth - window.innerWidth),
              invalidateOnRefresh: true,
            },
          })
          gsap.fromTo(tiles, { x: 80, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.15, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: section, start: 'top 80%', once: true } })
        },
        '(max-width: 767px)': () => {
          gsap.set(track, { clearProps: 'transform' })
          gsap.fromTo(tiles, { x: 80, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.15, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: section, start: 'top 85%', once: true } })
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  const dragged = useRef(false)
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    if (window.matchMedia('(max-width: 767px)').matches) return
    let down = false, startX = 0, startY = 0
    const onDown = (e: PointerEvent) => { down = true; dragged.current = false; startX = e.clientX; startY = window.scrollY; track.setPointerCapture(e.pointerId) }
    const onMove = (e: PointerEvent) => {
      if (!down) return
      const dx = e.clientX - startX
      if (Math.abs(dx) > 6) dragged.current = true
      window.scrollTo({ top: startY - dx, behavior: 'auto' })
    }
    const onUp = () => { down = false; window.setTimeout(() => { dragged.current = false }, 0) }
    track.addEventListener('pointerdown', onDown)
    track.addEventListener('pointermove', onMove)
    track.addEventListener('pointerup', onUp)
    track.addEventListener('pointercancel', onUp)
    return () => { track.removeEventListener('pointerdown', onDown); track.removeEventListener('pointermove', onMove); track.removeEventListener('pointerup', onUp); track.removeEventListener('pointercancel', onUp) }
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-cream border-b-[4px] border-ink overflow-hidden">
      <div className="md:h-screen">
        <div
          ref={trackRef}
          data-lenis-prevent
          className="flex h-full md:h-screen overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing md:cursor-grab"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {CATS.map((c, i) => (
            <button
              key={c.slug}
              ref={(el) => { tileRefs.current[i] = el }}
              type="button"
              onClick={() => { if (dragged.current) return; nav(`/shop?category=${c.slug}`) }}
              className="group relative shrink-0 w-[85vw] min-w-[320px] md:w-[70vw] md:min-w-[320px] h-[100svh] md:h-screen snap-start border-r-[3px] border-ink bg-cream flex flex-col justify-center px-8 sm:px-12 md:px-20 text-left focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink"
            >
              <span className="nb-chip font-mono text-[11px] uppercase tracking-[0.15em] text-ink bg-gold border-[3px] border-ink px-3 py-1 w-fit mb-6 shadow-nb-sm">{c.count} {c.count === 1 ? 'PIECE' : 'PIECES'}</span>
              <span className="font-display uppercase text-ink leading-[0.88] [font-size:clamp(3rem,8vw,7rem)] [overflow-wrap:anywhere]">{c.label}</span>
              <span className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-ink/60 group-hover:text-pink transition-colors duration-[120ms]">EXPLORE →</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
