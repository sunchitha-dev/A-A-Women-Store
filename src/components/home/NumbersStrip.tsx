import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Reveal from '../Reveal'
import SplitWords from '../motion/SplitWords'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { value: 10, suffix: '+', label: 'Years Open' },
  { value: 1000, suffix: '+', label: 'Happy Customers' },
  { value: 5000, suffix: '+', label: 'Outfits Stitched' },
]

export default function NumbersStrip() {
  const sectionRef = useRef<HTMLElement>(null)
  const numRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const nums = numRefs.current.filter(Boolean) as HTMLSpanElement[]
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      nums.forEach((el, i) => { el.textContent = `${STATS[i].value}${STATS[i].suffix}` })
      return
    }

    nums.forEach((el, i) => { el.textContent = `0${STATS[i].suffix}` })

    const cleanups: (() => void)[] = []
    const ctx = gsap.context(() => {
      STATS.forEach((stat, i) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            const el = numRefs.current[i]
            if (!el) return
            const delay = i * 200
            let start: number | null = null
            const duration = 1500
            const tick = (time: number) => {
              const ms = time * 1000
              if (start === null) start = ms + delay
              if (ms < start) return
              const p = Math.min((ms - start) / duration, 1)
              const eased = 1 - Math.pow(1 - p, 3)
              el.textContent = `${Math.round(eased * stat.value)}${stat.suffix}`
              if (p >= 1) gsap.ticker.remove(tick)
            }
            gsap.ticker.add(tick)
            cleanups.push(() => gsap.ticker.remove(tick))
          },
        })
      })
    }, section)

    return () => { cleanups.forEach((fn) => fn()); ctx.revert() }
  }, [])

  return (
    <section ref={sectionRef} className="bg-lilac border-b-[4px] border-ink px-4 sm:px-6 py-14 md:py-20">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-10 md:mb-14 text-center">
          <span className="nb-chip bg-gold text-ink inline-block">BY THE NUMBERS</span>
          <SplitWords as="h2" mode="chars" stagger={0.03} className="font-display uppercase text-ink [font-size:clamp(2rem,6vw,4.5rem)] leading-[0.95] mt-5">THE STATS SPEAK.</SplitWords>
        </Reveal>
        <Reveal className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6" stagger="> div" staggerEach={0.12}>
          {STATS.map((stat, i) => (
            <div key={stat.label} className="flex-1 border-[3px] border-ink bg-cream px-4 py-6 md:py-8 text-center shadow-nb">
              <p className="font-display text-ink leading-none [font-size:clamp(2.5rem,10vw,4rem)] sm:[font-size:clamp(2rem,7vw,4rem)] md:[font-size:clamp(3rem,8vw,6rem)]">
                <span ref={(el) => { numRefs.current[i] = el }}>{stat.value}{stat.suffix}</span>
              </p>
              <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.14em] md:tracking-[0.18em] text-ink/70 mt-3">{stat.label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
