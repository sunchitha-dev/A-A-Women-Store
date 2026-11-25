import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { aboutConfig } from '../../data/aboutConfig'
import { getLenis } from '../../lib/lenis'

const FLOATERS = [
  { src: '/about/price-tag.webp', cls: 'left-[2%] top-[8%] w-[72px] md:w-[96px]', speed: -30 },
  { src: '/about/pin.webp', cls: 'right-[8%] top-[4%] w-[56px] md:w-[72px]', speed: -55 },
  { src: '/about/bags.webp', cls: 'left-[0%] bottom-[14%] w-[80px] md:w-[110px]', speed: -20, mobile: true },
  { src: '/about/gift-box.webp', cls: 'right-[2%] bottom-[18%] w-[64px] md:w-[88px]', speed: -45, mobile: true },
  { src: '/hero/handbag.webp', cls: 'right-[18%] top-[12%] w-[60px] md:w-[84px]', speed: -35 },
  { src: '/hero/starburst.webp', cls: 'left-[14%] bottom-[6%] w-[52px] md:w-[68px]', speed: -60, mobile: true },
]

function Img({ src, alt = '', className = '', style, ariaHidden }: { src: string; alt?: string; className?: string; style?: React.CSSProperties; ariaHidden?: boolean }) {
  const [bad, setBad] = useState(false)
  if (bad) return <div aria-hidden={ariaHidden} className={`bg-lilac ${/aspect-/.test(className) ? '' : 'aspect-square'} ${className}`} style={style} />
  return <img src={src} alt={alt} aria-hidden={ariaHidden} className={className} style={style} onError={() => setBad(true)} />
}

export default function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const wordsRef = useRef<HTMLSpanElement[]>([])
  const polaroidRef = useRef<HTMLDivElement>(null)
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
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const total = rect.height + window.innerHeight
        const p = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / total))
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
    const polaroid = polaroidRef.current
    const ctx = gsap.context(() => {
      if (words.length) {
        gsap.fromTo(words, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', clearProps: 'transform' })
      }
      if (polaroid) {
        gsap.fromTo(polaroid, { y: -80, opacity: 0, rotate: -6 }, { y: 0, opacity: 1, rotate: 3, duration: 0.9, delay: 0.25, ease: 'bounce.out', clearProps: 'transform' })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [reduced])

  const visit = () => {
    const lenis = getLenis()
    const target = document.getElementById('visit')
    if (lenis && target) lenis.scrollTo(target, { offset: -80 })
    else if (target) target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }

  const headline = ['A', '&', 'A', 'WOMEN', 'STORE']
  let wi = 0

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden border-b-3 border-ink bg-cream"
      style={{
        backgroundImage: 'linear-gradient(rgba(10,10,10,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.12) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
      aria-label="About A and A Women Store"
    >
      <div className="mx-auto grid min-h-[100svh] max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-24">
        <div className="relative z-10">
          <h1 className="font-display uppercase leading-[0.92] [font-size:clamp(3rem,9vw,9rem)]">
            <span className="block text-ink">
              {headline.slice(0, 3).map((w) => {
                const i = wi++
                return (
                  <span key={i} ref={(el) => { if (el) wordsRef.current[i] = el }} className="mr-[0.25em] inline-block">
                    {w}
                  </span>
                )
              })}
            </span>
            <span className="block text-pink [-webkit-text-stroke:3px_#0A0A0A] [paint-order:stroke_fill] [text-shadow:6px_6px_0_#0A0A0A]">
              {headline.slice(3).map((w) => {
                const i = wi++
                return (
                  <span key={i} ref={(el) => { if (el) wordsRef.current[i] = el }} className="mr-[0.25em] inline-block">
                    {w}
                  </span>
                )
              })}
            </span>
          </h1>

          <p className="mt-5 font-serif text-[28px] italic leading-tight text-ink">{aboutConfig.tagline}</p>

          <div className="nb-card mt-6 max-w-xl bg-white p-5">
            <p className="font-body text-base leading-relaxed text-ink md:text-lg">{aboutConfig.positioning}</p>
          </div>

          <div className="mt-7 flex flex-wrap gap-4">
            <button type="button" className="nb-btn bg-gold" onClick={visit}>VISIT THE STORE</button>
            <a href={`https://wa.me/${aboutConfig.whatsapp}`} target="_blank" rel="noreferrer" className="nb-btn nb-btn-pink">WHATSAPP US</a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[520px] md:justify-self-end">
          <div aria-hidden="true" className="absolute -bottom-4 -right-4 h-[88%] w-[88%] bg-pink border-3 border-ink" />
          <div
            ref={polaroidRef}
            className="relative border-[4px] border-ink bg-white p-3 pb-0 shadow-[10px_10px_0_#0A0A0A]"
            style={{ transform: reduced ? 'rotate(3deg)' : undefined }}
          >
            <div className="bg-lilac">
              <Img src="/about/store-front.webp" alt="A and A Women Store front" className="block aspect-[4/5] w-full object-cover" />
            </div>
            <div className="px-1 py-4 text-center">
              <p className="font-mono text-sm uppercase tracking-[0.2em] text-ink">OLD PALLAVARAM</p>
            </div>
          </div>

          {FLOATERS.map((f) => (
            <Img
              key={f.src}
              src={f.src}
              alt=""
              ariaHidden
              className={`pointer-events-none absolute z-10 h-auto ${f.cls} ${!f.mobile ? 'hidden md:block' : ''}`}
              style={reduced ? undefined : { transform: `translateY(${(progress - 0.5) * f.speed}px)` }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
