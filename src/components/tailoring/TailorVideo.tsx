import { useEffect, useRef, useState } from 'react'
import Reveal from '../Reveal'

export default function TailorVideo() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reduced, setReduced] = useState(false)
  const [parallax, setParallax] = useState(0)

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
      if (!el) return
      const r = el.getBoundingClientRect()
      const p = (window.innerHeight - r.top) / (window.innerHeight + r.height)
      setParallax(Math.min(1, Math.max(0, p)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [reduced])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (reduced) { video.pause(); return }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.35 },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [reduced])

  const chalkY = reduced ? 0 : (parallax - 0.5) * -24
  const buttonsY = reduced ? 0 : (parallax - 0.5) * 20

  return (
    <section ref={sectionRef} className="border-b-3 border-ink bg-lilac px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-14">
        <div className="relative mx-auto w-full max-w-[720px]">
          <div
            aria-hidden="true"
            className="absolute inset-0 translate-x-3 translate-y-3 bg-pink"
            style={{ transform: 'translate(12px,12px) rotate(-2deg)' }}
          />
          <div className="relative rotate-[-2deg] border-[4px] border-ink bg-cream shadow-[10px_10px_0_#0A0A0A]">
            <div className="flex items-center gap-2 border-b-[4px] border-ink bg-cream px-3 py-2">
              <span className="h-3 w-3 rounded-full border-2 border-ink bg-pink" />
              <span className="h-3 w-3 rounded-full border-2 border-ink bg-gold" />
              <span className="h-3 w-3 rounded-full border-2 border-ink bg-ink" />
              <span className="ml-3 font-mono text-xs uppercase tracking-widest text-ink">INSIDE THE STUDIO</span>
            </div>
            <div className="relative overflow-hidden">
              <video
                ref={videoRef}
                src="/tailor/stitch.mp4"
                poster="/tailor/stitch.jpg"
                muted
                loop
                playsInline
                preload="metadata"
                className="block aspect-video w-full object-cover"
                style={{ filter: 'contrast(1.1) saturate(1.2)' }}
              />
            </div>
            <img
              src="/tailor/chalk.webp"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -left-6 -top-8 w-20 md:w-24"
              style={{ transform: `translateY(${chalkY}px) rotate(-12deg)` }}
            />
            <img
              src="/tailor/buttons.webp"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-6 -right-5 w-20 md:w-24"
              style={{ transform: `translateY(${buttonsY}px) rotate(8deg)` }}
            />
          </div>
        </div>

        <div>
          <span className="nb-sticker inline-block" style={{ background: '#D4AF55', transform: 'rotate(-3deg)' }}>
            STUDIO CLIP
          </span>
          <Reveal>
            <h2 className="mt-5 font-display text-4xl uppercase leading-[0.95] text-ink md:text-6xl">
              MEASURED TWICE. <span className="text-pink">CUT ONCE.</span>
            </h2>
          </Reveal>
          <p className="mt-5 max-w-md font-accent text-2xl italic text-ink md:text-3xl">
            Every outfit starts with your measurements.
          </p>
        </div>
      </div>
    </section>
  )
}