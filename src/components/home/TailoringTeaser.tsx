import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function TailoringTeaser() {
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const left = leftRef.current
    const right = rightRef.current
    if (!section || !left || !right) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { gsap.set([left, right], { opacity: 1, x: 0 }); return }

    const ctx = gsap.context(() => {
      gsap.fromTo(left, { x: -120, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 80%', once: true } })
      gsap.fromTo(right, { x: 120, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 80%', once: true } })
    }, section)
    return () => ctx.revert()
  }, [])

  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <section ref={sectionRef} className="grid md:grid-cols-2 min-h-screen border-b-[4px] border-ink overflow-hidden">
      <div ref={rightRef} className="bg-ink h-[50vh] md:h-auto md:min-h-screen border-b-[3px] md:border-b-0 md:border-l-[3px] border-ink md:order-2">
        <img src="/tailor/stitch.jpg" alt="Tailoring at A&A" className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div ref={leftRef} className="bg-cream flex flex-col items-center justify-center text-center px-6 py-16 md:py-24 md:order-1 min-h-[50vh] md:min-h-screen">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-6">TAILORING</p>
        <h2
          className="font-display uppercase text-ink leading-[0.9] [font-size:clamp(2.5rem,6vw,5rem)] max-w-[10ch]"
          style={{ animation: reduced ? 'none' : 'aa-spin 20s linear infinite' }}
        >
          STITCH YOUR STORY
        </h2>
        <Link to="/tailoring" className="nb-btn bg-pink text-ink mt-10">Book Tailoring</Link>
      </div>
      <style>{`@keyframes aa-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@media (prefers-reduced-motion: reduce){.aa-spin-none{animation:none!important}}`}</style>
    </section>
  )
}
