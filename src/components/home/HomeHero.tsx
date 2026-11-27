import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'

const WA = 'https://wa.me/917904733345'
const SLIDES = [
  { bg: '#FF4D8D', fg: '#FFF6E0', stroke: '#0A0A0A', word1: 'NEW', word2: 'KOREAN', sub: 'Fresh imported Korean looks, just in.', cta: 'SHOP KOREAN', href: '/shop?cat=korean', count: '01' },
  { bg: '#D4AF55', fg: '#0A0A0A', stroke: '#FFF6E0', word1: 'CUSTOM', word2: 'FITTING', sub: 'Blouses, kurtis, anarkalis — stitched to you.', cta: 'BOOK TAILORING', href: '/tailoring', count: '02' },
  { bg: '#C9B6FF', fg: '#0A0A0A', stroke: '#FFF6E0', word1: 'FRESH', word2: 'LOOKS', sub: 'Western, ethnic, lounge and accessories.', cta: 'SHOP ALL', href: '/shop', count: '03' },
  { bg: '#0A0A0A', fg: '#D4AF55', stroke: '#FF4D8D', word1: 'BOLD', word2: 'STYLE', sub: 'Statement fits for every mood.', cta: 'EXPLORE', href: '/shop', count: '04' },
]


function MarqueeRow({ text, dir, fg, stroke, outline }: { text: string; dir: 1 | -1; fg: string; stroke: string; outline?: boolean }) {
  const word = text.split('')
  const unit = (
    <>
      <span className="inline-flex">
        {word.map((ch, i) => (
          <b key={i} className="inline-block [animation:aa-wave_2.6s_ease-in-out_infinite] motion-reduce:[animation:none]" style={{ animationDelay: `${i * 0.09}s` }}>{ch}</b>
        ))}
      </span>
      <span className="inline-block mx-[0.25em]">✦</span>
    </>
  )
  return (
    <div className="overflow-hidden whitespace-nowrap leading-[0.82] select-none pointer-events-none" aria-hidden="true">
      <div className={`flex w-max ${dir === 1 ? '[animation:aa-marq-r_22s_linear_infinite]' : '[animation:aa-marq-l_26s_linear_infinite]'} motion-reduce:[animation:none]`}>
        {[0, 1].map((k) => (
          <span key={k} className="shrink-0 pr-6 font-display uppercase [font-size:clamp(4.8rem,14vw,13rem)]" style={outline ? { color: 'transparent', WebkitTextStroke: `3px ${fg}`, paintOrder: 'stroke fill', backgroundImage: `linear-gradient(105deg, transparent 38%, ${fg} 50%, transparent 62%)`, backgroundSize: '220% 100%', WebkitBackgroundClip: 'text', backgroundClip: 'text', animation: 'aa-sheen 3s ease-in-out infinite' } : { color: fg, WebkitTextStroke: `3px ${stroke}`, paintOrder: 'stroke fill' }}>
            {Array.from({ length: 10 }).map((_, j) => <span key={j}>{unit}</span>)}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function HomeHero() {
  const [idx, setIdx] = useState(0)
  const [animating, setAnimating] = useState(false)
  const rootRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const wipeRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const timer = useRef<number | null>(null)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const go = useCallback((next: number) => {
    if (animating || next === idx) return
    setIdx(next)
    setAnimating(true)
  }, [animating, idx])
  const next = useCallback(() => go((idx + 1) % SLIDES.length), [go, idx])
  const back = useCallback(() => go((idx - 1 + SLIDES.length) % SLIDES.length), [go, idx])

  useEffect(() => {
    if (reduced) return
    timer.current = window.setInterval(() => setIdx((i) => { setAnimating(true); return (i + 1) % SLIDES.length }), 4800)
    return () => { if (timer.current) window.clearInterval(timer.current) }
  }, [reduced])

  useEffect(() => {
    const bg = bgRef.current, wipe = wipeRef.current, content = contentRef.current
    if (!bg) return
    const s = SLIDES[idx]

    if (reduced) {
      gsap.set(bg, { backgroundColor: s.bg })
      if (wipe) gsap.set(wipe, { opacity: 0 })
      gsap.set(content, { opacity: 1, y: 0 })
      return
    }

    if (wipe) {
      gsap.set(wipe, { backgroundColor: s.bg, opacity: 1, clipPath: 'circle(0% at 70% 50%)' })
      gsap.to(wipe, { clipPath: 'circle(140% at 70% 50%)', duration: 0.7, ease: 'power3.inOut', onComplete: () => { gsap.set(bg, { backgroundColor: s.bg }); gsap.set(wipe, { opacity: 0 }) } })
    } else {
      gsap.to(bg, { backgroundColor: s.bg, duration: 0.5, ease: 'power2.inOut' })
    }

    const root = rootRef.current
    if (root) {
      const items = root.querySelectorAll<HTMLElement>('[data-h]')
      gsap.fromTo(items, { y: 60, opacity: 0, clipPath: 'inset(0 0 100% 0)' }, { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'power4.out', stagger: 0.08, overwrite: 'auto' })
    }



    const done = window.setTimeout(() => setAnimating(false), 800)
    return () => window.clearTimeout(done)
  }, [idx, reduced])



  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'ArrowRight') next(); if (e.key === 'ArrowLeft') back() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, back])

  const s = SLIDES[idx]

  return (
    <section ref={rootRef} className="relative min-h-[100svh] overflow-hidden border-b-[4px] border-ink" aria-roledescription="carousel" aria-label="Featured">
      <div ref={bgRef} className="absolute inset-0" style={{ backgroundColor: SLIDES[0].bg }} />
      <div ref={wipeRef} className="absolute inset-0 opacity-0 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.1]" aria-hidden="true" style={{ backgroundImage: 'linear-gradient(#0A0A0A 1px, transparent 1px), linear-gradient(90deg, #0A0A0A 1px, transparent 1px)', backgroundSize: '44px 44px' }} />


      <div className="relative z-10 min-h-[100svh] flex flex-col justify-center px-4 sm:px-6 lg:px-10 pt-24 pb-24 md:pb-20">
        <div className="flex items-center justify-between mb-4 max-w-[1400px] w-full mx-auto">
          <span className="font-mono text-xs uppercase tracking-widest text-ink border-[3px] border-ink bg-cream px-3 py-1 shadow-nb-sm">{s.count} / 0{SLIDES.length}</span>
          <div className="flex gap-2">
            <button type="button" aria-label="Previous slide" onClick={back} className="w-11 h-11 border-[3px] border-ink bg-cream text-ink font-display text-lg shadow-nb-sm hover:bg-ink hover:text-cream transition-colors duration-[120ms]">←</button>
            <button type="button" aria-label="Next slide" onClick={next} className="w-11 h-11 border-[3px] border-ink bg-cream text-ink font-display text-lg shadow-nb-sm hover:bg-ink hover:text-cream transition-colors duration-[120ms]">→</button>
          </div>
        </div>

        <div className="relative w-full max-w-[1400px] mx-auto">
          <div data-h><span className="nb-sticker bg-ink text-cream mb-5 inline-block rotate-[-2deg]">A &amp; A WOMEN STORE</span></div>
        </div>

        <div className="relative w-full">
          <div ref={contentRef} className="relative z-20">
            <div data-h className="w-full overflow-hidden">
              <MarqueeRow text={s.word1} dir={1} fg={s.fg} stroke={s.stroke} />
            </div>
            <div data-h className="w-full overflow-hidden -mt-2 md:-mt-4">
              <MarqueeRow text={s.word2} dir={-1} fg={s.fg} stroke={s.stroke} outline />
            </div>
          </div>
        </div>

        <div className="relative z-20 w-full max-w-[1400px] mx-auto">
          <div data-h><p className="mt-6 font-accent italic text-[clamp(1.3rem,2.8vw,2.2rem)] text-ink max-w-xl leading-snug">{s.sub}</p></div>
          <div data-h className="mt-8 flex flex-wrap gap-4">
            <Link to={s.href} className="nb-btn bg-ink text-cream border-ink hover:bg-cream hover:text-ink">{s.cta}</Link>
            <a href={WA} target="_blank" rel="noreferrer" className="nb-btn bg-cream text-ink">WHATSAPP US</a>
          </div>
        </div>


      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t-[4px] border-ink bg-ink text-cream py-2 overflow-hidden z-20">
        <div className="flex w-max [animation:aa-marq-r_20s_linear_infinite] motion-reduce:[animation:none]">
          {[0, 1].map((k) => <span key={k} className="shrink-0 pr-4 font-mono text-[11px] uppercase tracking-[0.2em] whitespace-nowrap">OLD PALLAVARAM CHENNAI ✦ IMPORTED KOREAN WEAR ✦ CUSTOM TAILORING ✦ NEW ARRIVALS ✦ A &amp; A WOMEN STORE ✦ </span>)}
        </div>
      </div>

      <div className="absolute right-4 bottom-16 md:right-10 md:bottom-20 z-20 hidden sm:block" aria-hidden="true">
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-[3px] border-ink bg-cream flex items-center justify-center shadow-nb [animation:spin_12s_linear_infinite] motion-reduce:[animation:none]">
          <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full">
            <defs><path id="aa-badge" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" /></defs>
            <text fontSize="11" fontFamily="monospace" letterSpacing="2" fill="#0A0A0A"><textPath href="#aa-badge">NEW DROP ✦ A &amp; A STORE ✦ NEW DROP ✦ </textPath></text>
          </svg>
          <span className="font-display text-lg text-ink">★</span>
        </div>
      </div>

      <style>{`@keyframes aa-marq-r{from{transform:translateX(0)}to{transform:translateX(-50%)}} @keyframes aa-marq-l{from{transform:translateX(-50%)}to{transform:translateX(0)}} @keyframes aa-wave{0%,55%,100%{transform:translateY(0)}25%{transform:translateY(-0.07em)}} @keyframes aa-sheen{0%{background-position:100% 0}55%,100%{background-position:0% 0}} @keyframes aa-orbit{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} @keyframes aa-drift{0%,100%{transform:translate(0,0) rotate(var(--r))}25%{transform:translate(10px,-14px) rotate(calc(var(--r) + 2deg))}50%{transform:translate(-8px,-22px) rotate(calc(var(--r) - 1.5deg))}75%{transform:translate(12px,-8px) rotate(calc(var(--r) + 1deg))}}`}</style>
    </section>
  )
}
