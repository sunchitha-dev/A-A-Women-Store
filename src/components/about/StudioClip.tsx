import { useEffect, useRef, useState } from 'react'
import Reveal from '../Reveal'

function Img({ src, alt = '', className = '' }: { src: string; alt?: string; className?: string }) {
  const [bad, setBad] = useState(false)
  if (bad) return <div aria-hidden={alt === ''} className={`bg-lilac ${/aspect-/.test(className) ? '' : 'aspect-square'} ${className}`} />
  return <img src={src} alt={alt} className={className} onError={() => setBad(true)} />
}

export default function StudioClip() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const v = videoRef.current
    const el = wrapRef.current
    if (!v || !el || reduced) {
      v?.pause()
      return
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {})
      else v.pause()
    }, { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  return (
    <section className="border-b-3 border-ink bg-cream px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display text-4xl uppercase text-ink md:text-6xl">Inside The Store</h2>
        </Reveal>

        <div className="mt-10 grid items-center gap-10 md:grid-cols-[minmax(0,560px)_1fr]">
          <Reveal className="relative mx-auto w-full max-w-[560px]">
            <div aria-hidden="true" className="absolute -bottom-4 -left-4 h-[90%] w-[90%] bg-pink border-[4px] border-ink" />
            <div className="relative border-[4px] border-ink bg-white shadow-[10px_10px_0_#0A0A0A] md:-rotate-[2deg]">
              <div className="flex items-center gap-2 border-b-[4px] border-ink bg-cream px-3 py-2">
                <span className="h-3 w-3 rounded-full border-2 border-ink bg-pink" />
                <span className="h-3 w-3 rounded-full border-2 border-ink bg-gold" />
                <span className="h-3 w-3 rounded-full border-2 border-ink bg-ink" />
                <span className="ml-2 font-mono text-xs uppercase text-ink">THE RACK</span>
              </div>
              <div ref={wrapRef}>
                <video
                  ref={videoRef}
                  src="/about/rail.mp4"
                  poster="/about/rail.jpg"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="block aspect-[15/8] w-full max-w-[560px] object-cover bg-lilac"
                />
              </div>
            </div>
          </Reveal>

          <Reveal className="relative mx-auto w-full max-w-[420px]">
            <Img src="/about/stamp-card.webp" alt="" className="pointer-events-none absolute -left-6 -top-6 z-10 w-16 md:w-20" />
            <Img src="/about/bags.webp" alt="" className="pointer-events-none absolute -bottom-4 -right-2 z-10 w-20 md:w-24" />
            <div className="relative border-[4px] border-ink bg-white p-3 pb-0 shadow-[10px_10px_0_#0A0A0A] rotate-[3deg]">
              <Img src="/about/store-inside.webp" alt="Inside A and A Women Store" className="block aspect-square w-full object-cover" />
              <div className="px-1 py-4 text-center">
                <p className="font-mono text-sm uppercase tracking-[0.2em] text-ink">INSIDE THE STORE</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
