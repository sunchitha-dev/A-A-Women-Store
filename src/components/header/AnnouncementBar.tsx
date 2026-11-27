import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const KEY = 'aa-bar-v2'
const MSG = 'NEW KOREAN STOCK ✦ CUSTOM TAILORING ✦ LOCAL DELIVERY + IN-STORE PICKUP ✦ OLD PALLAVARAM CHENNAI ✦ '

function isOpenToday() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date())
  const h = Number(parts.find((p) => p.type === 'hour')?.value ?? 0)
  const m = Number(parts.find((p) => p.type === 'minute')?.value ?? 0)
  const mins = h * 60 + m
  return mins >= 9 * 60 + 30 && mins < 22 * 60
}

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(KEY) === '1' } catch { return false }
  })
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [openToday, setOpenToday] = useState(() => isOpenToday())
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const t = window.setInterval(() => setOpenToday(isOpenToday()), 60_000)
    return () => window.clearInterval(t)
  }, [])

  useEffect(() => {
    const set = () => {
      const h = dismissed ? 0 : 48
      document.documentElement.style.setProperty('--bar-height', `${h}px`)
      document.documentElement.style.setProperty('--aa-bar-h', `${h}px`)
    }
    set()
    return () => {
      document.documentElement.style.setProperty('--bar-height', '0px')
      document.documentElement.style.setProperty('--aa-bar-h', '0px')
    }
  }, [dismissed])

  const dismiss = () => {
    const el = wrapRef.current
    try { localStorage.setItem(KEY, '1') } catch {}
    if (!el || reduced) { setDismissed(true); return }
    gsap.to(el, { height: 0, opacity: 0, duration: 0.24, ease: 'cubic-bezier(0.2,0,0,1)', onComplete: () => setDismissed(true) })
  }

  if (dismissed) return null

  return (
    <div
      ref={wrapRef}
      role="marquee"
      aria-label="Announcements"
      className="relative w-full overflow-hidden bg-ink text-gold border-b-[4px] border-gold"
      style={{ height: 48 }}
    >
      <style>{`
        @keyframes aa-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes aa-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        .aa-marquee-track { display:flex; width:max-content; animation: aa-marquee 24s linear infinite; }
        .aa-marquee-track:hover { animation-play-state: paused; }
        .aa-open-today { animation: aa-pulse 3s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .aa-marquee-track { animation: none; width:100%; } .aa-marquee-copy:not(:first-child){ display:none; } .aa-open-today { animation:none; } }
      `}</style>

      {openToday && (
        <span className="absolute left-0 top-0 bottom-0 z-10 flex items-center bg-ink px-3">
          <span className="aa-open-today nb-sticker bg-pink text-ink !px-2 !py-0.5 !text-[10px] !font-display tracking-wide">OPEN TODAY</span>
        </span>
      )}

      <div className="h-full flex items-center pr-14 pl-3">
        <div className="overflow-hidden w-full">
          <div className="aa-marquee-track">
            <span className="aa-marquee-copy shrink-0 pr-2 font-display uppercase text-[12px] tracking-[0.12em] whitespace-nowrap">{MSG}{MSG}{MSG}{MSG}</span>
            <span className="aa-marquee-copy shrink-0 pr-2 font-display uppercase text-[12px] tracking-[0.12em] whitespace-nowrap" aria-hidden="true">{MSG}{MSG}{MSG}{MSG}</span>
          </div>
        </div>
      </div>

      <span className="absolute right-0 top-0 bottom-0 z-10 flex items-center bg-ink pr-1">
        <button
          type="button"
          aria-label="Dismiss announcement"
          onClick={dismiss}
          className="flex h-11 w-11 items-center justify-center text-gold hover:text-pink transition-colors duration-[120ms] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
          </svg>
        </button>
      </span>
    </div>
  )
}
