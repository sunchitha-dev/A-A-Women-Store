import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import catalog from '../../data/catalog.json'

const LOOKS = ['kurti_01', 'kurti_04', 'kurti_06', 'jeans_01', 'jeans_02', 'party_11', 'y2k_06']
const LOOKUP = Object.fromEntries((catalog as { id: string; name: string; code: string }[]).map((c) => [c.id, c]))

function Img({ src, alt = '', className = '', style, ariaHidden }: { src: string; alt?: string; className?: string; style?: React.CSSProperties; ariaHidden?: boolean }) {
  const [bad, setBad] = useState(false)
  if (bad) return <div aria-hidden={ariaHidden ?? alt === ''} className={`bg-lilac ${/aspect-/.test(className) ? '' : 'aspect-square'} ${className}`} style={style} />
  return <img src={src} alt={alt} aria-hidden={ariaHidden} className={className} style={style} onError={() => setBad(true)} draggable={false} />
}

export default function TheRail() {
  const nav = useNavigate()
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [progress, setProgress] = useState(0)
  const progressRef = useRef(0)
  const [reduced, setReduced] = useState(false)
  const [desktop, setDesktop] = useState(false)
  const [maxTx, setMaxTx] = useState(0)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (reduced) return
    const onScroll = () => {
      const el = sectionRef.current
      const track = trackRef.current
      if (!el) return
      const isDesktop = window.innerWidth >= 768
      setDesktop(isDesktop)
      if (!isDesktop) { setProgress(0); setMaxTx(0); return }
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0
      progressRef.current = p
      setProgress(p)
      if (track) setMaxTx(Math.max(0, track.scrollWidth - window.innerWidth + 48))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [reduced])

  // sway + center scale
  useEffect(() => {
    if (reduced) return
    let raf = 0
    let lastP = progressRef.current
    let lastT = performance.now()
    let vel = 0
    let lastSl: number | null = null
    const angles = LOOKS.map(() => 0)
    const vels = LOOKS.map(() => 0)

    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - lastT) / 1000)
      lastT = t
      let v = 0
      const row = rowRef.current
      const isDesk = window.innerWidth >= 768
      if (isDesk) {
        const p = progressRef.current
        const dp = p - lastP
        v = dp / Math.max(dt, 0.001)
        lastP = p
      } else if (row) {
        const sl = row.scrollLeft
        const prev = lastSl ?? sl
        v = (sl - prev) / Math.max(dt, 0.001) / 500
        lastSl = sl
      }
      vel += (v - vel) * 0.15
      const target = Math.max(-6, Math.min(6, -vel * 120))

      const cx = window.innerWidth / 2
      for (let i = 0; i < LOOKS.length; i++) {
        const k = 18
        const d = 7
        const a = angles[i]
        const av = vels[i]
        const acc = (target - a) * k - av * d
        vels[i] = av + acc * dt
        angles[i] = a + vels[i] * dt
        const card = cardRefs.current[i]
        if (card) {
          card.style.transform = `rotate(${angles[i]}deg)`
          const r = card.getBoundingClientRect()
          const mid = r.left + r.width / 2
          const dist = Math.abs(mid - cx)
          const near = Math.max(0, 1 - dist / (window.innerWidth * 0.35))
          card.style.scale = `${1 + near * 0.05}`
          const shadow = 6 + near * 6
          card.style.boxShadow = `${shadow}px ${shadow}px 0 #0A0A0A`
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  const tx = reduced || !desktop ? 0 : -progress * maxTx

  return (
    <section
      ref={sectionRef}
      className="border-b-3 border-ink bg-lilac md:h-[300vh]"
      style={{
        backgroundImage: 'linear-gradient(rgba(10,10,10,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.12) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
      aria-label="The Rail"
    >
      <div className={reduced ? '' : 'md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:overflow-hidden'}>
        <div className="px-4 pt-10 sm:px-6 md:px-10">
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="font-display text-4xl uppercase text-ink md:text-6xl">THE RAIL</h2>
            <span className="nb-sticker" style={{ background: '#D4AF55', transform: 'rotate(-4deg)' }}>FRESH LOOKS</span>
          </div>
        </div>

        <div className="relative mt-8 px-4 sm:px-6 md:px-10">
          {/* decorations */}
          <Img src="/about/hanger-gold.webp" alt="" className="pointer-events-none absolute -top-2 left-2 z-10 hidden w-14 md:block" ariaHidden />
          <Img src="/about/rail.webp" alt="" className="pointer-events-none absolute -top-4 left-16 z-10 hidden w-20 md:block" ariaHidden />

          {/* rail bar */}
          <div className="relative h-5 border-[4px] border-ink bg-pink shadow-[6px_6px_0_#0A0A0A]">
            <div className="absolute -left-1 -top-3 h-10 w-3 border-[4px] border-ink bg-ink" />
            <div className="absolute -right-1 -top-3 h-10 w-3 border-[4px] border-ink bg-ink" />
          </div>
        </div>

        <div
          ref={rowRef}
          data-lenis-prevent-wheel
          className="mt-0 overflow-x-auto pb-8 md:overflow-visible"
          style={{ scrollSnapType: desktop ? undefined : 'x mandatory' }}
        >
          <div
            ref={trackRef}
            className="flex gap-6 px-4 pt-0 sm:px-6 md:gap-8 md:px-10"
            style={desktop && !reduced ? { transform: `translate3d(${tx}px,0,0)`, willChange: 'transform' } : undefined}
          >
            {LOOKS.map((id, i) => {
              const item = LOOKUP[id]
              const label = item ? `${item.code} — ${item.name}` : id
              return (
                <div key={id} className="flex shrink-0 flex-col items-center" style={{ scrollSnapAlign: desktop ? undefined : 'center' }}>
                  {/* hook + string */}
                  <div className="flex flex-col items-center">
                    <div className="h-5 w-8 rounded-b-full border-[3px] border-t-0 border-gold bg-gold/20" />
                    <div className="h-8 w-[3px] bg-ink" />
                  </div>
                  <div
                    ref={(el) => { cardRefs.current[i] = el }}
                    className="origin-top"
                    style={{ transform: 'rotate(0deg)', transition: reduced ? 'none' : undefined }}
                  >
                    <button
                      type="button"
                      onClick={() => nav(`/shop?look=${id}`)}
                      className="nb-card block w-[260px] bg-cream p-3 text-left sm:w-[280px] md:w-[320px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink focus-visible:outline-offset-2"
                    >
                      <div className="bg-white border-[3px] border-ink p-2">
                        <Img src={`/tryon/${id}.webp`} alt={item?.name ?? id} className="h-[42vh] w-full object-contain md:h-[60vh]" />
                      </div>
                      <p className="mt-3 font-mono text-xs uppercase tracking-wide text-ink">{label}</p>
                      <span className="nb-sticker mt-2 inline-block text-[10px]" style={{ background: '#FF4D8D', transform: 'rotate(-2deg)', padding: '0.2rem 0.5rem' }}>
                        STYLE PREVIEW
                      </span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
