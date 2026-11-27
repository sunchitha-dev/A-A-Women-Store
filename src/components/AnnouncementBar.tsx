import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { navConfig } from '../data/navConfig'

const MSGS = navConfig.announcements
const KEY = 'aa-bar-dismissed'

function Arrow({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      {dir === 'left'
        ? <path d="M12 4L6 10L12 16" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="square" />
        : <path d="M8 4L14 10L8 16" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="square" />}
    </svg>
  )
}

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(KEY) === '1' } catch { return false }
  })
  const [idx, setIdx] = useState(0)
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const wrapRef = useRef<HTMLDivElement>(null)
  const msgRef = useRef<HTMLParagraphElement>(null)
  const timerRef = useRef<number | null>(null)
  const pausedRef = useRef(false)
  const idxRef = useRef(0)

  useEffect(() => { idxRef.current = idx }, [idx])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const fadeTo = useCallback((next: number) => {
    const el = msgRef.current
    if (!el || reduced) { setIdx(next); return }
    gsap.to(el, {
      opacity: 0, duration: 0.15, ease: 'power2.out',
      onComplete: () => {
        setIdx(next)
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: 'power2.out' })
      },
    })
  }, [reduced])

  const go = useCallback((dir: 1 | -1) => {
    const next = (idxRef.current + dir + MSGS.length) % MSGS.length
    fadeTo(next)
  }, [fadeTo])

  const goTo = useCallback((i: number) => {
    if (i === idxRef.current) return
    fadeTo(i)
  }, [fadeTo])

  useEffect(() => {
    if (dismissed || reduced) return
    const tick = () => { if (!pausedRef.current) go(1) }
    timerRef.current = window.setInterval(tick, 4000)
    return () => { if (timerRef.current) window.clearInterval(timerRef.current) }
  }, [dismissed, reduced, go])

  const dismiss = () => {
    const el = wrapRef.current
    try { localStorage.setItem(KEY, '1') } catch {}
    if (!el || reduced) { setDismissed(true); return }
    gsap.to(el, { height: 0, duration: 0.3, ease: 'power2.inOut', onComplete: () => setDismissed(true) })
  }

  useEffect(() => {
    const set = () => {
      const h = dismissed ? 0 : (wrapRef.current?.offsetHeight ?? 44)
      document.documentElement.style.setProperty('--aa-bar-h', `${h}px`)
    }
    set()
    window.addEventListener('resize', set)
    return () => { window.removeEventListener('resize', set); document.documentElement.style.setProperty('--aa-bar-h', '0px') }
  }, [dismissed])

  if (dismissed) return null

  return (
    <div
      ref={wrapRef}
      className="w-full overflow-hidden bg-gold border-b-[3px] border-ink text-ink"
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
    >
      <div className="mx-auto flex h-[44px] max-w-[1400px] items-center gap-2 px-2 sm:px-4">
        <button type="button" className="flex h-[44px] w-[44px] shrink-0 items-center justify-center focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink focus-visible:outline-offset-[-3px]" aria-label="Previous announcement" onClick={() => go(-1)}>
          <Arrow dir="left" />
        </button>

        <div className="flex min-w-0 flex-1 flex-col items-center justify-center">
          <p ref={msgRef} className="truncate max-w-full text-center font-display text-[12px] uppercase tracking-[0.1em] text-ink">
            {MSGS[reduced ? 0 : idx]}
          </p>
          <div className="mt-0.5 flex gap-1.5" aria-label="Announcement position">
            {MSGS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to announcement ${i + 1}`}
                className={`h-2.5 w-2.5 rounded-full border-2 ${i === (reduced ? 0 : idx) ? 'bg-gold border-ink' : 'bg-transparent border-cream'} focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>

        <button type="button" className="flex h-[44px] w-[44px] shrink-0 items-center justify-center focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink focus-visible:outline-offset-[-3px]" aria-label="Next announcement" onClick={() => go(1)}>
          <Arrow dir="right" />
        </button>

        <button type="button" className="flex h-[44px] w-[44px] shrink-0 items-center justify-center font-mono text-xl leading-none text-ink focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink focus-visible:outline-offset-[-3px]" aria-label="Dismiss announcements" onClick={dismiss}>
          ×
        </button>
      </div>
    </div>
  )
}
