import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { contactConfig } from '../../data/contactConfig'

const FLOATERS = [
  { src: '/contact/bubble-gold.webp', cls: 'left-[-2%] top-[2%] w-[72px] md:w-[96px]', speed: -28, mobile: true },
  { src: '/contact/envelope.webp', cls: 'right-[2%] top-[10%] w-[64px] md:w-[88px]', speed: -48, mobile: true },
  { src: '/contact/megaphone.webp', cls: 'left-[4%] bottom-[10%] w-[68px] md:w-[92px]', speed: -22, mobile: true },
  { src: '/contact/bell.webp', cls: 'right-[10%] bottom-[6%] w-[56px] md:w-[76px]', speed: -55, mobile: false },
  { src: '/contact/sparkle.webp', cls: 'left-[42%] top-[-2%] w-[44px] md:w-[60px]', speed: -38, mobile: false },
  { src: '/hero/starburst.webp', cls: 'right-[0%] bottom-[28%] w-[52px] md:w-[72px]', speed: -62, mobile: true },
]

function Img({ src, alt = '', className = '', style }: { src: string; alt?: string; className?: string; style?: React.CSSProperties }) {
  const [bad, setBad] = useState(false)
  if (bad) return <div aria-hidden={alt === ''} className={`bg-lilac ${/aspect-/.test(className) ? '' : 'aspect-square'} ${className}`} style={style} />
  return <img src={src} alt={alt} className={className} style={style} onError={() => setBad(true)} draggable={false} />
}

function Badge({ speedRef, reduced }: { speedRef: React.MutableRefObject<number>; reduced: boolean }) {
  const gRef = useRef<SVGGElement>(null)
  useEffect(() => {
    if (reduced) return
    let raf = 0
    let angle = 0
    let last = performance.now()
    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000)
      last = t
      const extra = Math.min(360, Math.abs(speedRef.current) * 240)
      angle = (angle + (18 + extra) * dt) % 360
      if (gRef.current) gRef.current.setAttribute('transform', `rotate(${angle} 80 80)`)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced, speedRef])

  return (
    <div className="absolute -right-2 -bottom-8 z-20 h-[110px] w-[110px] md:-right-6 md:-bottom-10 md:h-[160px] md:w-[160px]" aria-hidden="true">
      <div className="relative h-full w-full rounded-full border-[4px] border-ink bg-gold shadow-[6px_6px_0_#0A0A0A]">
        <svg viewBox="0 0 160 160" className="absolute inset-0 h-full w-full">
          <defs>
            <path id="contactCircle" d="M80,80 m-58,0 a58,58 0 1,1 116,0 a58,58 0 1,1 -116,0" />
          </defs>
          <g ref={gRef}>
            <text fontSize="14.5" fontFamily="DM Mono, monospace" fill="#0A0A0A" letterSpacing="2">
              <textPath href="#contactCircle">CONTACT US ✦ CONTACT US ✦ </textPath>
            </text>
          </g>
        </svg>
        <svg viewBox="0 0 24 24" className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 md:h-14 md:w-14" fill="none" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 2L11 13" />
          <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="#FFF6E0" />
        </svg>
      </div>
    </div>
  )
}

export default function ContactHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const wordsRef = useRef<HTMLSpanElement[]>([])
  const floatRefs = useRef<HTMLDivElement[]>([])
  const speedRef = useRef(0)
  const [progress, setProgress] = useState(0)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (reduced) return
    let raf = 0
    let lastY = window.scrollY
    let lastT = performance.now()
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const total = rect.height + window.innerHeight
        const p = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / total))
        setProgress(p)
        const now = performance.now()
        const dy = window.scrollY - lastY
        const dt = Math.max(0.016, (now - lastT) / 1000)
        const v = dy / dt / 1200
        speedRef.current += (v - speedRef.current) * 0.2
        lastY = window.scrollY
        lastT = now
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
    const floats = floatRefs.current.filter(Boolean)
    const ctx = gsap.context(() => {
      if (words.length) {
        gsap.fromTo(words, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', clearProps: 'transform' })
      }
      if (floats.length) {
        gsap.fromTo(floats, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.55, stagger: 0.15, delay: 0.2, ease: 'back.out(1.7)', clearProps: 'opacity' })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [reduced])

  const lines = [['SAY'], ['HELLO.']]

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden border-b-3 border-ink bg-cream"
      style={{
        backgroundImage: 'linear-gradient(rgba(10,10,10,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.12) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
      aria-label="Contact A and A Women Store"
    >
      <style>{`@keyframes contactFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}`}</style>
      <div className="mx-auto grid min-h-[100svh] max-w-6xl items-center gap-20 px-4 py-20 sm:px-6 md:grid-cols-2 md:gap-10 md:py-24">
        <div className="relative z-10">
          <h1 className="font-display uppercase leading-[0.88] [font-size:clamp(3.5rem,11vw,11rem)]">
            <span className="block text-ink">
              {lines[0].map((w, j) => {
                const i = j
                return <span key={i} ref={(el) => { if (el) wordsRef.current[i] = el }} className="inline-block">{w}</span>
              })}
            </span>
            <span className="block text-pink [-webkit-text-stroke:3px_#0A0A0A] [paint-order:stroke_fill] [text-shadow:6px_6px_0_#0A0A0A]">
              {lines[1].map((w, j) => {
                const i = lines[0].length + j
                return <span key={i} ref={(el) => { if (el) wordsRef.current[i] = el }} className="inline-block">{w}</span>
              })}
            </span>
          </h1>

          <p className="mt-5 max-w-xl font-serif text-[28px] italic leading-tight text-ink">Orders, questions, fittings. Message us on WhatsApp.</p>

          <div className="mt-7 flex flex-wrap gap-4">
            <a href={`https://wa.me/${contactConfig.whatsapp}`} target="_blank" rel="noopener noreferrer" className="nb-btn nb-btn-pink">WHATSAPP US</a>
            <a href={`tel:${contactConfig.phoneTel}`} className="nb-btn bg-gold">CALL NOW</a>
          </div>
        </div>

        <div className="relative mx-auto mt-4 w-full max-w-[560px] md:mt-0 md:justify-self-end">
          <div className="relative mx-auto w-[min(78vw,420px)]" style={{ transform: 'rotate(-6deg)' }}>
            <div style={reduced ? undefined : { animation: 'contactFloat 3s ease-in-out infinite' }}>
              <Img src="/contact/phone.webp" alt="Phone" className="block w-full h-auto" />
              <Img src="/contact/bubble-pink.webp" alt="" className="absolute left-[18%] top-[18%] w-[45%] h-auto" />
            </div>
          </div>

          {FLOATERS.map((f, i) => (
            <div
              key={f.src}
              className={`pointer-events-none absolute z-10 ${f.cls} ${!f.mobile ? 'hidden md:block' : ''}`}
              style={reduced ? undefined : { transform: `translateY(${(progress - 0.5) * f.speed}px)` }}
            >
              <div ref={(el) => { if (el) floatRefs.current[i] = el }}>
                <Img src={f.src} alt="" className="block h-auto w-full" />
              </div>
            </div>
          ))}

          <Badge speedRef={speedRef} reduced={reduced} />
        </div>
      </div>
    </section>
  )
}
