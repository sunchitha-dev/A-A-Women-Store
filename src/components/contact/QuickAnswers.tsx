import { useEffect, useRef, useState } from 'react'
import { contactConfig } from '../../data/contactConfig'
import Reveal from '../Reveal'
import SplitWords from '../motion/SplitWords'

function Img({ src, alt = '', className = '' }: { src: string; alt?: string; className?: string }) {
  const [bad, setBad] = useState(false)
  if (bad) return <div aria-hidden={alt === ''} className={`bg-lilac ${/aspect-/.test(className) ? '' : 'aspect-square'} ${className}`} />
  return <img src={src} alt={alt} className={className} onError={() => setBad(true)} />
}

export default function QuickAnswers() {
  const [open, setOpen] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [videoOk, setVideoOk] = useState(true)
  const [reduced, setReduced] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

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
    if (!v || !el || reduced || !videoOk) {
      v?.pause()
      return
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {})
      else v.pause()
    }, { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [reduced, videoOk])

  const toggle = (i: number) => setOpen(open === i ? null : i)

  return (
    <section className="border-b-3 border-ink bg-cream px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SplitWords as="h2" className="font-display text-4xl uppercase text-ink md:text-6xl">QUICK ANSWERS</SplitWords>

        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_minmax(0,560px)] md:items-start">
          <Reveal stagger=":scope > div" duration={1.4} staggerEach={0.25} className="space-y-4">
            {contactConfig.faqs.map((faq, i) => {
              const isOpen = open === i
              const shown = isOpen || hovered === i
              const id = `faq-${i}`
              const panel = `faq-panel-${i}`
              return (
                <div key={faq.q} className="nb-card bg-white cursor-pointer" onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} onClick={() => toggle(i)}>
                  <button
                    id={id}
                    type="button"
                    className="flex w-full items-center justify-between gap-4 p-5 text-left focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-pink"
                    aria-expanded={isOpen}
                    aria-controls={panel}
                    onClick={(e) => { e.stopPropagation(); toggle(i) }}
                  >
                    <span className="font-display text-lg uppercase text-ink md:text-xl">{faq.q}</span>
                    <span className={`shrink-0 font-mono text-2xl leading-none text-ink transition-transform duration-200 ${shown ? 'rotate-45' : ''}`} aria-hidden="true">+</span>
                  </button>
                  <div
                    id={panel}
                    role="region"
                    aria-labelledby={id}
                    className={`grid transition-[grid-template-rows] duration-200 ease-out ${shown ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t-[3px] border-ink px-5 py-4 font-body text-base leading-relaxed text-ink">
                        <p>{faq.a}</p>
                        {faq.a === 'ASK ON WHATSAPP' && (
                          <a href={`https://wa.me/${contactConfig.whatsapp}`} target="_blank" rel="noopener noreferrer" className="nb-btn nb-btn-pink mt-4 inline-flex min-h-[48px] items-center">WHATSAPP</a>
                        )}
                        {'link' in faq && faq.link && (
                          <a href={faq.link} className="nb-btn mt-4 inline-flex min-h-[48px] items-center bg-gold">TAILORING</a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </Reveal>

          <Reveal className="relative mx-auto w-full max-w-[560px]">
            <Img src="/contact/heart.webp" alt="" className="pointer-events-none absolute -left-4 -top-5 z-10 w-12 md:w-14" />
            <Img src="/contact/smile-dot.webp" alt="" className="pointer-events-none absolute -bottom-4 -right-2 z-10 w-10 md:w-12" />
            {videoOk && (
              <div ref={wrapRef} className="relative border-[4px] border-ink bg-white shadow-[10px_10px_0_#0A0A0A] -rotate-[2deg]">
                <div className="flex items-center gap-2 border-b-[4px] border-ink bg-cream px-3 py-2">
                  <span className="h-3 w-3 rounded-full border-2 border-ink bg-pink" />
                  <span className="h-3 w-3 rounded-full border-2 border-ink bg-gold" />
                  <span className="h-3 w-3 rounded-full border-2 border-ink bg-ink" />
                  <span className="ml-2 font-mono text-xs uppercase text-ink">TYPING...</span>
                </div>
                <video
                  ref={videoRef}
                  src="/contact/typing.mp4"
                  poster="/contact/typing.jpg"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="block aspect-video w-full max-w-[560px] object-cover bg-lilac"
                  onError={() => setVideoOk(false)}
                />
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
