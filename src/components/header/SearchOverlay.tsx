import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { startLenis, stopLenis } from '../../lib/lenis'
import { useFocusTrap } from '../../lib/useFocusTrap'
import { useLockBodyScroll } from '../../lib/useLockBodyScroll'

type Props = { open: boolean; onClose: () => void; origin?: { x: number; y: number } }

const TRENDING = ['Korean', 'Western', 'Kurti', 'Jeans', 'Party', 'Tailoring']
const KEY = 'aa-searches'

function readRecent(): string[] {
  try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').slice(0, 6) : [] } catch { return [] }
}
function writeRecent(items: string[]) { localStorage.setItem(KEY, JSON.stringify(items.slice(0, 6))) }

export default function SearchOverlay({ open, onClose, origin }: Props) {
  const nav = useNavigate()
  const panelRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [rendered, setRendered] = useState(false)
  const [q, setQ] = useState('')
  const [recent, setRecent] = useState<string[]>(() => readRecent())
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [prevOpen, setPrevOpen] = useState(false)

  useFocusTrap(panelRef, open)
  useLockBodyScroll(open)

  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) { setRendered(true); setRecent(readRecent()) }
  }

  useEffect(() => {
    if (open) { stopLenis(); return () => startLenis() }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    const x = origin?.x ?? window.innerWidth / 2
    const y = origin?.y ?? 0
    if (open) {
      if (reduced) { gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.2, overwrite: 'auto' }); return }
      gsap.fromTo(el, { clipPath: `circle(0% at ${x}px ${y}px)` }, { clipPath: `circle(150% at ${x}px ${y}px)`, duration: 0.48, ease: 'cubic-bezier(0.2,0,0,1)', overwrite: 'auto' })
      window.setTimeout(() => inputRef.current?.focus(), 100)
    } else if (rendered) {
      if (reduced) { gsap.to(el, { opacity: 0, duration: 0.2, onComplete: () => setRendered(false) }); return }
      gsap.to(el, { clipPath: `circle(0% at ${x}px ${y}px)`, duration: 0.35, ease: 'cubic-bezier(0.2,0,0,1)', overwrite: 'auto', onComplete: () => setRendered(false) })
    }
  }, [open, rendered, reduced, origin])

  const submit = (val: string) => {
    const v = val.trim()
    if (!v) return
    const next = [v, ...readRecent().filter((r) => r.toLowerCase() !== v.toLowerCase())].slice(0, 6)
    writeRecent(next)
    setRecent(next)
    onClose()
    nav(`/shop?q=${encodeURIComponent(v)}`)
  }

  const removeRecent = (r: string) => {
    const next = recent.filter((x) => x !== r)
    setRecent(next)
    writeRecent(next)
  }

  if (!rendered) return null

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      className="fixed inset-0 z-[200] bg-cream text-ink overflow-y-auto"
      style={reduced ? { opacity: 0 } : { clipPath: `circle(0% at ${origin?.x ?? window.innerWidth / 2}px ${origin?.y ?? 0}px)` }}
    >
      <div className="absolute inset-0 bg-[url(/ui/search-bg.webp)] bg-center bg-cover opacity-10 pointer-events-none" aria-hidden="true" />

      <div className="relative border-b-[4px] border-ink px-6 py-5 flex items-center gap-4 bg-cream">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="shrink-0"><circle cx="11" cy="11" r="6.5" /><path d="M16 16L21 21" strokeLinecap="square" /></svg>
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') submit(q) }}
          placeholder="SEARCH STYLES..."
          className="w-full bg-transparent border-none outline-none font-display uppercase text-ink placeholder:text-ink placeholder:opacity-100 focus:placeholder:opacity-40 placeholder:transition-opacity placeholder:duration-[120ms] [font-size:clamp(1.8rem,5vw,3.5rem)]"
          aria-label="Search styles"
        />
        <button type="button" aria-label="Close search" onClick={onClose} className="shrink-0 flex h-11 w-11 items-center justify-center text-ink hover:text-pink transition-colors duration-[120ms] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="square" /></svg>
        </button>
      </div>

      <div className="relative px-6 py-8 max-w-5xl mx-auto">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold mb-3">TRENDING</p>
        <div className="flex flex-wrap gap-3">
          {TRENDING.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { onClose(); nav(`/shop?cat=${t.toLowerCase()}`) }}
              className="border-[3px] border-ink bg-cream px-3 py-2 font-body text-sm text-ink transition-all duration-[120ms] [transition-timing-function:var(--ease-bounce)] hover:-translate-y-0.5 hover:bg-gold focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink"
            >
              {t}
            </button>
          ))}
        </div>

        {recent.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold">RECENT</p>
              <button type="button" onClick={() => { setRecent([]); writeRecent([]) }} className="font-mono text-[11px] uppercase text-ink/60 hover:text-pink">CLEAR ALL</button>
            </div>
            <div className="flex flex-wrap gap-3">
              {recent.map((r) => (
                <span key={r} className="inline-flex items-center border-[3px] border-ink bg-cream px-3 py-2 font-body text-sm">
                  <button type="button" onClick={() => submit(r)} className="hover:text-pink">{r}</button>
                  <button type="button" aria-label={`Remove ${r}`} onClick={() => removeRecent(r)} className="ml-2 text-ink/60 hover:text-pink">×</button>
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
