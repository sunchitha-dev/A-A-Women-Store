import { useEffect, useRef, useState } from 'react'
import Reveal from '../Reveal'

const CARDS = [
  { n: '01', title: 'CHOOSE', text: 'Pick a style or bring a reference.', prop: '/tailor/buttons.webp', bg: 'bg-pink' },
  { n: '02', title: 'MEASURE', text: 'We take your measurements in store.', prop: '/tailor/tape.webp', bg: 'bg-lilac' },
  { n: '03', title: 'STITCH', text: 'Cut and stitched for you.', prop: '/tailor/sewing-machine.webp', bg: 'bg-gold' },
  { n: '04', title: 'FIT', text: 'Trial and final touches.', prop: '/tailor/mannequin-mini.webp', bg: 'bg-cream' },
]

export default function TailorProcess() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [reduced, setReduced] = useState(false)
  const [desktop, setDesktop] = useState(false)
  const [maxTx, setMaxTx] = useState(0)
  const [entered, setEntered] = useState<boolean[]>([false, false, false, false])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const els = trackRef.current?.querySelectorAll('[data-card]')
    if (!els?.length) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        const i = Number((e.target as HTMLElement).dataset.card)
        setEntered((s) => (s[i] ? s : s.map((v, j) => (j === i ? true : v))))
      })
    }, { threshold: 0.35 })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
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
      setProgress(p)
      if (track) setMaxTx(Math.max(0, track.scrollWidth - window.innerWidth + 40))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [reduced])

  const tx = reduced || !desktop ? 0 : -progress * maxTx

  return (
    <section
      ref={sectionRef}
      className="border-b-3 border-ink bg-cream md:h-[400vh]"
      aria-label="Tailoring process"
    >
      <div className={reduced ? '' : 'md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:overflow-hidden'}>
        <div className="px-4 py-10 sm:px-6 md:px-10">
          <p className="font-mono text-xs uppercase tracking-widest text-ink">The Process</p>
          <Reveal>
            <h2 className="mt-2 font-display text-4xl uppercase md:text-6xl">How It Works</h2>
          </Reveal>
        </div>

        <div
          ref={trackRef}
          className="flex flex-col gap-6 px-4 pb-12 sm:px-6 md:flex-row md:gap-8 md:px-10 md:pb-0"
          style={desktop && !reduced ? { transform: `translate3d(${tx}px,0,0)` } : undefined}
        >
          {CARDS.map((c, i) => {
            const pop = entered[i] || reduced
            const tilt = reduced ? 0 : (progress * 10 - i * 2.5)
            return (
              <article
                key={c.n}
                data-card={i}
                className={`nb-card relative flex min-h-[360px] w-full shrink-0 flex-col justify-between p-6 md:min-h-[60vh] md:w-[72vw] md:max-w-[720px] ${c.bg}`}
              >
                <div>
                  <p className="font-display text-[clamp(5rem,12vw,10rem)] leading-none text-ink">{c.n}</p>
                  <h3 className="mt-2 font-display text-4xl uppercase text-ink md:text-6xl">{c.title}</h3>
                  <p className="mt-4 max-w-sm font-body text-xl text-ink">{c.text}</p>
                </div>
                <img
                  src={c.prop}
                  alt=""
                  aria-hidden="true"
                  className="absolute bottom-4 right-4 w-28 md:w-40"
                  style={{
                    transform: `scale(${pop ? 1 : 0}) rotate(${tilt}deg)`,
                    transition: reduced ? 'none' : 'transform 500ms cubic-bezier(.2,1.4,.4,1)',
                  }}
                />
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
