import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { tailoringConfig } from '../../data/tailoringConfig'
import './TailorHero.css'

const PROPS = [
  { src: '/tailor/scissors.webp', cls: 'tailor-prop-scissors', speed: -40, alt: '' },
  { src: '/tailor/spools.webp', cls: 'tailor-prop-spools', speed: -70, alt: '' },
  { src: '/tailor/pincushion.webp', cls: 'tailor-prop-pincushion', speed: -25, alt: '' },
  { src: '/tailor/chalk.webp', cls: 'tailor-prop-chalk', speed: -55, alt: '' },
]

function Tape({ progress, vertical }: { progress: number; vertical: boolean }) {
  const w = 720
  const h = 72
  const bodyY = 14
  const bodyH = 44
  const ticks = Array.from({ length: 61 }, (_, i) => i)
  const clipId = vertical ? 'tape-clip-v' : 'tape-clip-h'
  if (vertical) {
    const vw = 56
    const vh = 720
    return (
      <svg className="tailor-tape-svg tailor-tape-svg-v" viewBox={`0 0 ${vw} ${vh}`} aria-hidden="true">
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y="0" width={vw} height={vh * progress} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <rect x="6" y="0" width="44" height={vh} fill="#FFD93D" stroke="#0A0A0A" strokeWidth="3" />
          {ticks.map((n) => {
            const y = (n / 60) * (vh - 24) + 12
            const major = n % 10 === 0
            const mid = n % 5 === 0
            const len = major ? 18 : mid ? 12 : 7
            return (
              <g key={n}>
                <line x1="6" y1={y} x2={6 + len} y2={y} stroke="#0A0A0A" strokeWidth={major ? 2.5 : 1.5} />
                {major && (
                  <text x="30" y={y + 4} fontSize="10" fontFamily="DM Mono, monospace" fill="#0A0A0A" textAnchor="middle">
                    {n}
                  </text>
                )}
              </g>
            )
          })}
        </g>
      </svg>
    )
  }
  return (
    <svg className="tailor-tape-svg tailor-tape-svg-h" viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width={w * progress} height={h} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect x="1.5" y={bodyY} width={w - 3} height={bodyH} fill="#FFD93D" stroke="#0A0A0A" strokeWidth="3" />
        {ticks.map((n) => {
          const x = (n / 60) * (w - 24) + 12
          const major = n % 10 === 0
          const mid = n % 5 === 0
          const len = major ? 18 : mid ? 12 : 7
          return (
            <g key={n}>
              <line x1={x} y1={bodyY} x2={x} y2={bodyY + len} stroke="#0A0A0A" strokeWidth={major ? 2.5 : 1.5} />
              {major && (
                <text x={x} y={bodyY + 34} fontSize="11" fontFamily="DM Mono, monospace" fill="#0A0A0A" textAnchor="middle">
                  {n}
                </text>
              )}
            </g>
          )
        })}
      </g>
    </svg>
  )
}

export default function TailorHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const wordsRef = useRef<HTMLSpanElement[]>([])
  const [progress, setProgress] = useState(0)
  const [reduced, setReduced] = useState(false)
  const prog = reduced ? 1 : progress

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (reduced) return
    const mobile = window.matchMedia('(max-width: 768px)').matches
    if (mobile) {
      const obj = { p: 0 }
      const t = gsap.to(obj, { p: 1, duration: 1.6, ease: 'power2.out', onUpdate: () => setProgress(obj.p) })
      return () => { t.kill() }
    }
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const total = rect.height - window.innerHeight
        const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1
        setProgress(p)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reduced])

  useEffect(() => {
    if (reduced) return
    const words = wordsRef.current.filter(Boolean)
    if (!words.length) return
    const ctx = gsap.context(() => {
      gsap.fromTo(words, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', clearProps: 'transform' })
    }, sectionRef)
    return () => ctx.revert()
  }, [reduced])

  const book = () => {
    document.getElementById('book')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }

  const line1 = ['YOUR', 'SIZE.']
  const line2 = ['YOUR', 'STYLE.']
  let wi = 0

  return (
    <section ref={sectionRef} className="tailor-hero" aria-label="Custom tailoring">
      <div className="tailor-hero-sticky">
        <div className="tailor-hero-grid">
          <div className="relative">
            <div className="tailor-tape-wrap md:hidden" aria-hidden="true">
              <Tape progress={prog} vertical />
            </div>
            <p className="nb-sticker inline-block mb-4">Old Pallavaram</p>
            <h1 className="tailor-hero-h1">
              <span className="tailor-hero-line1">
                {line1.map((w) => {
                  const i = wi++
                  return (
                    <span key={i} ref={(el) => { if (el) wordsRef.current[i] = el }} className="mr-[0.25em] inline-block">
                      {w}
                    </span>
                  )
                })}
              </span>
              <span className="tailor-hero-line2">
                {line2.map((w, j) => {
                  const i = wi++
                  return (
                    <span key={i}>
                      <span ref={(el) => { if (el) wordsRef.current[i] = el }} className="mr-[0.25em] inline-block">
                        {w}
                      </span>
                      {j === 0 && <br className="md:hidden" />}
                    </span>
                  )
                })}
              </span>
            </h1>
            <div className="tailor-tape-wrap hidden md:block">
              <Tape progress={prog} vertical={false} />
            </div>
            <p className="tailor-hero-sub">Custom tailoring in Old Pallavaram. Stitched to fit you.</p>
            <div className="tailor-hero-btns">
              <button type="button" className="nb-btn" onClick={book}>BOOK A FITTING</button>
              <a href="https://wa.me/917904733345" target="_blank" rel="noreferrer" className="nb-btn nb-btn-pink">WHATSAPP US</a>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="nb-sticker" style={{ transform: 'rotate(-3deg)' }}>CUSTOM FIT</span>
              <span className="nb-sticker" style={{ transform: 'rotate(2deg)', background: '#D4AF55' }}>ALTERATIONS</span>
              <span className="nb-sticker" style={{ transform: 'rotate(-2deg)', background: '#C9B6FF' }}>{tailoringConfig.services[0].name}</span>
            </div>
          </div>

          <div className="tailor-hero-right" aria-hidden="true">
            <div className="tailor-ellipse" />
            <img src="/tailor/dressform.webp" alt="" className="tailor-dressform" />
            {PROPS.map((p, i) => (
              <img
                key={p.src}
                src={p.src}
                alt={p.alt}
                className={`tailor-prop ${p.cls}${i === 3 ? ' max-md:hidden' : ''}`}
                style={reduced ? undefined : { transform: `translateY(${(prog - 0.5) * p.speed}px)` }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
