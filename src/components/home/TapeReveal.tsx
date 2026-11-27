import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PHOTOS = ['/tailor/dressform.webp', '/tailor/sewing-machine.webp', '/tailor/stitch.jpg']
const ROTS = [-4, 1, -2]
const XPOS = [25, 50, 75]

export default function TapeReveal() {
  const sectionRef = useRef<HTMLElement>(null)
  const tapeRef = useRef<HTMLDivElement>(null)
  const polaroidsRef = useRef<(HTMLDivElement | null)[]>([])
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const btnRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const tape = tapeRef.current
    const headline = headlineRef.current
    const btn = btnRef.current
    if (!section || !tape) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.innerWidth < 768
    const dropFrom = mobile ? '-50vh' : '-120vh'
    const polaroids = polaroidsRef.current.filter(Boolean) as HTMLDivElement[]
    const chars = headline ? Array.from(headline.querySelectorAll<HTMLElement>('[data-char]')) : []

    if (reduced) {
      gsap.set(tape, { scaleX: 1 })
      gsap.set(polaroids, { y: 0, opacity: 1 })
      gsap.set(chars, { yPercent: 0, opacity: 1 })
      if (btn) gsap.set(btn, { scale: 1, opacity: 1 })
      return
    }

    gsap.set(tape, { scaleX: 0, transformOrigin: 'left center' })
    gsap.set(polaroids, { y: dropFrom, opacity: 0 })
    gsap.set(chars, { yPercent: 110, opacity: 0 })
    if (btn) gsap.set(btn, { scale: 2, opacity: 0 })

    const fired = [false, false, false]
    let headlineFired = false
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1.5,
        onUpdate: (self) => {
          const p = self.progress
          gsap.set(tape, { scaleX: p })
          XPOS.forEach((x, i) => {
            if (!fired[i] && p >= x / 100) {
              fired[i] = true
              const el = polaroidsRef.current[i]
              if (el) gsap.to(el, { y: 0, opacity: 1, duration: 0.8, ease: 'bounce.out', overwrite: 'auto' })
            }
          })
          if (!headlineFired && p >= 0.9) {
            headlineFired = true
            if (chars.length) gsap.to(chars, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.025, overwrite: 'auto' })
            if (btn) gsap.to(btn, { scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.2, overwrite: 'auto' })
          }
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  const headline = 'YOUR MEASUREMENTS. YOUR FIT. YOUR STORY.'

  return (
    <section ref={sectionRef} className="relative h-screen bg-cream border-b-[4px] border-ink overflow-hidden">
      <div ref={tapeRef} className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[40px] md:h-[60px] z-10">
        <svg className="w-full h-full block" viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden>
          <rect x="0" y="0" width="1200" height="60" fill="#FFF6E0" stroke="#0A0A0A" strokeWidth="2" />
          {Array.from({ length: 61 }).map((_, i) => {
            const x = i * 20
            const major = i % 5 === 0
            return <g key={i}><line x1={x} y1={0} x2={x} y2={major ? 28 : 16} stroke={major ? '#D4AF55' : '#0A0A0A'} strokeWidth={major ? 3 : 1.5} />{major && <text x={x + 3} y={48} fontFamily="DM Mono, monospace" fontSize="14" fill="#0A0A0A">{i / 5}</text>}</g>
          })}
        </svg>
      </div>

      {PHOTOS.map((src, i) => (
        <div key={src} className="absolute top-1/2 z-20 w-[100px] sm:w-[120px] md:w-[170px] lg:w-[200px] -translate-x-1/2 -translate-y-1/2" style={{ left: `${XPOS[i]}%` }}>
          <div ref={(el) => { polaroidsRef.current[i] = el }}>
            <div style={{ transform: `rotate(${ROTS[i]}deg)` }} className="bg-white p-[8px] md:p-[12px] pb-[22px] md:pb-[32px] border-[3px] border-ink shadow-nb">
              <img src={src} alt="" className="w-full aspect-[4/5] object-cover block" loading="lazy" />
            </div>
          </div>
        </div>
      ))}

      <div className="absolute inset-x-0 bottom-[8%] md:bottom-[10%] z-30 px-4 text-center">
        <h2 ref={headlineRef} className="font-display uppercase text-ink leading-[0.95] [font-size:clamp(1.5rem,6vw,2.5rem)] md:[font-size:clamp(2rem,5vw,4rem)] max-w-5xl mx-auto" aria-label={headline}>
          {headline.split('').map((ch, i) => ch === ' ' ? <span key={i} aria-hidden> </span> : (
            <span key={i} aria-hidden style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
              <span data-char style={{ display: 'inline-block' }}>{ch}</span>
            </span>
          ))}
        </h2>
        <Link ref={btnRef} to="/tailoring" className="nb-btn bg-pink text-ink mt-6 md:mt-8 inline-block">Book Tailoring</Link>
      </div>
    </section>
  )
}
