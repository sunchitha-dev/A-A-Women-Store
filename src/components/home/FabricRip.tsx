import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Reveal from '../Reveal'
import SplitWords from '../motion/SplitWords'

gsap.registerPlugin(ScrollTrigger)

const L_JAG = '0,0 48,40 0,80 48,120 0,160 48,200 0,240 48,280 0,320 48,360 0,400 48,440 0,480 48,520 0,560 48,600 0,640 48,680 0,720 48,760 0,800 0,800'
const R_JAG = '48,0 0,40 48,80 0,120 48,160 0,200 48,240 0,280 48,320 0,360 48,400 0,440 48,480 0,520 48,560 0,600 48,640 0,680 48,720 0,760 48,800 48,800'

export default function FabricRip() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const behindRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true })
    const section = sectionRef.current
    const pin = pinRef.current
    const left = leftRef.current
    const right = rightRef.current
    const behind = behindRef.current
    if (!section || !pin || !left || !right || !behind) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { gsap.set(behind, { opacity: 1 }); return }

    const mobile = window.innerWidth < 768
    const ctx = gsap.context(() => {
      const words = Array.from(behind.querySelectorAll<HTMLElement>('[data-rip-word]'))
      gsap.set([left, right], { xPercent: 0 })
      gsap.set(behind, { opacity: 0 })
      gsap.set(words, { yPercent: 110, opacity: 0 })
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, pin, scrub: 1, start: 'top top', end: () => '+=' + window.innerHeight * (mobile ? 1.5 : 2) },
      })
      tl.to([left, right], { xPercent: (i: number) => (i === 0 ? -100 : 100), ease: 'none', duration: 1 }, 0)
      tl.fromTo(behind, { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.2 }, 0.5)
      if (words.length) tl.to(words, { yPercent: 0, opacity: 1, ease: 'power3.out', duration: 0.18, stagger: 0.03 }, 0.52)
    }, section)
    return () => ctx.revert()
  }, [])

  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduced) {
    return (
      <section className="relative bg-ink border-b-[4px] border-ink overflow-hidden">
        <div className="px-4 sm:px-6 pt-16 md:pt-24 pb-8 md:pb-10 text-center">
          <span className="nb-chip bg-gold text-ink inline-block">TAILORING</span>
          <h2 className="font-display uppercase text-cream [font-size:clamp(2.2rem,6vw,4.5rem)] leading-[0.95] mt-5">STITCHED YOUR WAY.</h2>
        </div>
        <div className="h-[70vh]">
          <div className="float-left w-1/2 h-full bg-pink flex flex-col items-center justify-center gap-3 md:gap-4 pl-2 pr-4 md:px-4 text-center">
            <span className="text-[3rem] sm:text-[4rem] md:text-[5rem] leading-none text-ink">✂</span>
            <p className="font-display text-ink [font-size:clamp(1.75rem,7vw,4rem)] leading-none">A &amp; A</p>
            <p className="font-mono text-ink text-[0.6rem] sm:text-[0.7rem] md:text-[0.75rem] tracking-[0.08em] md:tracking-[0.15em] leading-tight">EST. OLD PALLAVARAM</p>
          </div>
          <div className="float-right w-1/2 h-full bg-lilac flex flex-col items-center justify-center gap-3 md:gap-4 pr-2 pl-4 md:px-4 text-center">
            <span className="text-[3rem] sm:text-[4rem] md:text-[5rem] leading-none text-ink">🪡</span>
            <p className="font-display text-ink [font-size:clamp(1.75rem,7vw,4rem)] leading-none">TAILORING</p>
            <p className="font-mono text-ink text-[0.6rem] sm:text-[0.7rem] md:text-[0.75rem] tracking-[0.08em] md:tracking-[0.15em] leading-tight">STITCH BY STITCH</p>
          </div>
        </div>
        <div className="clear-both bg-ink px-4 sm:px-6 py-16 text-center">
          <div className="flex justify-center gap-10 md:gap-16 mb-10">
            {[['✂', 'CUSTOM CUT'], ['📐', 'EXACT FIT'], ['🪡', 'HAND FINISHED']].map(([icon, label]) => (
              <div key={label} className="flex flex-col items-center gap-[0.4rem] md:gap-3">
                <span className="text-[1.5rem] md:text-[3.5rem] text-cream leading-none">{icon}</span>
                <span className="font-mono text-cream text-[0.7rem] md:text-base tracking-[0.1em]">{label}</span>
              </div>
            ))}
          </div>
          <p className="font-display uppercase text-gold [font-size:clamp(2.5rem,6vw,5rem)] leading-[0.9]">MADE FOR</p>
          <p className="font-display uppercase text-cream [font-size:clamp(2.5rem,6vw,5rem)] leading-[0.9]">YOUR BODY</p>
          <p className="font-body text-cream/80 text-base mt-4">Every stitch placed with care.</p>
          <Link to="/tailoring" className="nb-btn bg-pink text-ink mt-8 inline-block">Tailored Just For You</Link>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="relative bg-ink">
      <div className="px-4 sm:px-6 pt-16 md:pt-24 pb-8 md:pb-10 text-center">
        <Reveal>
          <span className="nb-chip bg-gold text-ink">TAILORING</span>
          <SplitWords as="h2" mode="chars" stagger={0.03} className="font-display uppercase text-cream [font-size:clamp(2.2rem,6vw,4.5rem)] leading-[0.95] mt-5">STITCHED YOUR WAY.</SplitWords>
        </Reveal>
      </div>
      <div ref={pinRef} className="relative h-[100svh] overflow-hidden">
        <div className="absolute inset-0 bg-ink flex flex-col items-center justify-center px-4 text-center z-0">
          <div ref={behindRef}>
            <div className="flex justify-center gap-8 sm:gap-10 md:gap-16 mb-10">
              {[['✂', 'CUSTOM CUT'], ['📐', 'EXACT FIT'], ['🪡', 'HAND FINISHED']].map(([icon, label]) => (
                <div key={label} className="flex flex-col items-center gap-[0.4rem] md:gap-3">
                  <span className="text-[1.5rem] md:text-[3.5rem] text-cream leading-none">{icon}</span>
                  <span className="font-mono text-cream text-[0.7rem] md:text-base tracking-[0.1em]">{label}</span>
                </div>
              ))}
            </div>
            <p className="font-display uppercase text-gold [font-size:clamp(2.5rem,6vw,5rem)] leading-[0.9]">
              {'MADE FOR'.split(' ').map((w, i) => (
                <span key={i} className="inline-block overflow-hidden align-top mr-[0.25em]">
                  <span data-rip-word className="inline-block">{w}</span>
                </span>
              ))}
            </p>
            <p className="font-display uppercase text-cream [font-size:clamp(2.5rem,6vw,5rem)] leading-[0.9]">
              {'YOUR BODY'.split(' ').map((w, i) => (
                <span key={i} className="inline-block overflow-hidden align-top mr-[0.25em]">
                  <span data-rip-word className="inline-block">{w}</span>
                </span>
              ))}
            </p>
            <p className="font-body text-cream/80 text-base mt-4">Every stitch placed with care.</p>
            <Link to="/tailoring" className="nb-btn bg-pink text-ink mt-8 inline-block">Tailored Just For You</Link>
          </div>
        </div>

        <div ref={leftRef} className="absolute top-0 left-0 w-1/2 h-full bg-pink z-10 flex flex-col items-center justify-center gap-3 md:gap-4 pl-2 pr-8 sm:pr-10 md:px-4 text-center">
          <span className="text-[3rem] sm:text-[4rem] md:text-[5rem] leading-none text-ink">✂</span>
          <p className="font-display text-ink [font-size:clamp(1.75rem,7vw,4rem)] md:[font-size:clamp(2.5rem,5vw,4rem)] leading-none">A &amp; A</p>
          <p className="font-mono text-ink text-[0.6rem] sm:text-[0.7rem] md:text-[0.75rem] tracking-[0.08em] md:tracking-[0.15em] leading-tight">EST. OLD PALLAVARAM</p>
          <svg className="absolute top-0 right-0 h-full w-[28px] md:w-[48px]" viewBox="0 0 48 800" preserveAspectRatio="none" aria-hidden>
            <polygon points={L_JAG} fill="#FFF6E0" />
          </svg>
        </div>

        <div ref={rightRef} className="absolute top-0 right-0 w-1/2 h-full bg-lilac z-10 flex flex-col items-center justify-center gap-3 md:gap-4 pr-2 pl-8 sm:pl-10 md:px-4 text-center">
          <span className="text-[3rem] sm:text-[4rem] md:text-[5rem] leading-none text-ink">🪡</span>
          <p className="font-display text-ink [font-size:clamp(1.75rem,7vw,4rem)] md:[font-size:clamp(2.5rem,5vw,4rem)] leading-none">TAILORING</p>
          <p className="font-mono text-ink text-[0.6rem] sm:text-[0.7rem] md:text-[0.75rem] tracking-[0.08em] md:tracking-[0.15em] leading-tight">STITCH BY STITCH</p>
          <svg className="absolute top-0 left-0 h-full w-[28px] md:w-[48px]" viewBox="0 0 48 800" preserveAspectRatio="none" aria-hidden>
            <polygon points={R_JAG} fill="#FFF6E0" />
          </svg>
        </div>
      </div>
    </section>
  )
}
