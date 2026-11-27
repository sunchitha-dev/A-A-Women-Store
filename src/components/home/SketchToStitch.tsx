import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  { n: '1. YOU CHOOSE', sub: 'Pick your style from shop' },
  { n: '2. WE MEASURE', sub: 'We come to your door or visit us' },
  { n: '3. WE STITCH', sub: 'Ready in 7–10 days' },
  { n: '4. YOU WEAR', sub: 'Perfect fit, guaranteed' },
]

export default function SketchToStitch() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const pathRefs = useRef<SVGPathElement[][]>([[], [], [], []])
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const [flipped, setFlipped] = useState(false)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true })
    const section = sectionRef.current
    const pin = pinRef.current
    if (!section || !pin) return
    const paths = pathRefs.current
    const steps = stepRefs.current.filter(Boolean) as HTMLDivElement[]
    const mobile = window.innerWidth < 768

    if (reduced) {
      paths.flat().forEach((p) => gsap.set(p, { strokeDashoffset: 0 }))
      gsap.set(steps, { opacity: 1, y: 0 })
      return
    }

    paths.flat().forEach((p) => gsap.set(p, { strokeDasharray: 1, strokeDashoffset: 1 }))
    gsap.set(steps, { opacity: 0, y: 30 })

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: pin,
          scrub: 1,
          start: 'top top',
          end: () => '+=' + window.innerHeight * (mobile ? 4 : 5),
          invalidateOnRefresh: true,
        },
      })
      paths.forEach((group, i) => {
        const at = i
        if (group.length) tl.to(group, { strokeDashoffset: 0, ease: 'none', duration: 1 }, at)
        if (steps[i]) tl.to(steps[i], { opacity: 1, y: 0, ease: 'none', duration: 0.6 }, at)
      })
    }, section)

    return () => ctx.revert()
  }, [reduced])

  const setPath = (group: number, i: number) => (el: SVGPathElement | null) => { if (el) pathRefs.current[group][i] = el }

  return (
    <>
      <section ref={sectionRef} className="bg-ink">
        <div ref={pinRef} className="min-h-screen md:min-h-screen flex items-center px-4 sm:px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-6xl grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="flex justify-center md:justify-start">
              <div className="w-full max-w-[260px] md:max-w-[300px] [perspective:1000px]" onClick={() => !reduced && setFlipped((f) => !f)} onMouseEnter={() => !reduced && setFlipped(true)} onMouseLeave={() => !reduced && setFlipped(false)}>
                <div className="relative w-full transition-transform duration-[600ms] [transform-style:preserve-3d]" style={{ transform: reduced ? 'rotateY(180deg)' : flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                  <div className="bg-[#FFF6E0] border-[3px] border-ink shadow-[6px_6px_0_#D4AF55] [backface-visibility:hidden]">
                    <svg viewBox="0 0 300 400" className="w-full h-auto block" aria-label="Kurti sketch">
                      <rect x="0" y="0" width="300" height="400" fill="#FFF6E0" />
                      {/* collar */}
                      <path ref={setPath(0,0)} pathLength="1" strokeDasharray="1" strokeDashoffset="1" d="M130 60 L150 95 L170 60" stroke="#0A0A0A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      <path ref={setPath(0,1)} pathLength="1" strokeDasharray="1" strokeDashoffset="1" d="M115 65 Q150 55 185 65" stroke="#0A0A0A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      {/* sleeves */}
                      <path ref={setPath(1,0)} pathLength="1" strokeDasharray="1" strokeDashoffset="1" d="M115 65 L70 110 L85 140" stroke="#0A0A0A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      <path ref={setPath(1,1)} pathLength="1" strokeDasharray="1" strokeDashoffset="1" d="M185 65 L230 110 L215 140" stroke="#0A0A0A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      <path ref={setPath(1,2)} pathLength="1" strokeDasharray="1" strokeDashoffset="1" d="M85 140 L105 130" stroke="#0A0A0A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      <path ref={setPath(1,3)} pathLength="1" strokeDasharray="1" strokeDashoffset="1" d="M215 140 L195 130" stroke="#0A0A0A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      {/* body */}
                      <path ref={setPath(2,0)} pathLength="1" strokeDasharray="1" strokeDashoffset="1" d="M105 130 L95 220 L105 340" stroke="#0A0A0A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      <path ref={setPath(2,1)} pathLength="1" strokeDasharray="1" strokeDashoffset="1" d="M195 130 L205 220 L195 340" stroke="#0A0A0A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      <path ref={setPath(2,2)} pathLength="1" strokeDasharray="1" strokeDashoffset="1" d="M95 220 Q150 235 205 220" stroke="#0A0A0A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                      {/* hem */}
                      <path ref={setPath(3,0)} pathLength="1" strokeDasharray="1" strokeDashoffset="1" d="M105 340 Q150 355 195 340" stroke="#0A0A0A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-[#FFF6E0] border-[3px] border-ink shadow-[6px_6px_0_#D4AF55] [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col">
                    <img src="/products/kurti_01.webp" alt="Kurti" className="w-full flex-1 min-h-0 object-cover block" />
                    <div className="p-3 border-t-[3px] border-ink bg-[#FFF6E0]">
                      <Link to="/tailoring" className="nb-btn bg-pink text-ink w-full justify-center !py-2 text-[11px]" onClick={(e) => e.stopPropagation()}>Book Tailoring</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8 md:space-y-10 text-right">
              {STEPS.map((s, i) => (
                <div key={s.n} ref={(el) => { stepRefs.current[i] = el }}>
                  <p className="font-display uppercase text-cream leading-none [font-size:clamp(1.5rem,3vw,2.5rem)]">{s.n}</p>
                  <p className="font-mono text-gold text-[0.85rem] mt-2 uppercase tracking-[0.08em]">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="bg-cream border-t-[3px] border-ink px-4 sm:px-6 py-10 md:py-14 text-center">
        <p className="font-display uppercase text-ink [font-size:clamp(1.8rem,4vw,3.5rem)] leading-[0.95]">READY FOR YOUR PERFECT FIT?</p>
        <Link to="/tailoring" className="nb-btn bg-pink text-ink mt-6 inline-block">Book Tailoring</Link>
      </div>
    </>
  )
}
