import { useEffect, useRef, useState } from 'react'
import catalog from '../../data/catalog.json'
import { aboutConfig } from '../../data/aboutConfig'
import { contactConfig } from '../../data/contactConfig'
import { getVisitStatus } from '../../lib/openNow'
import Reveal from '../Reveal'
import SplitWords from '../motion/SplitWords'

type Look = { id: string; name: string; code: string }
const LOOKS = catalog as Look[]
const BGS = ['bg-gold', 'bg-pink', 'bg-lilac', 'bg-cream']
const DAYS = ['TODAY', 'TOMORROW', 'THIS WEEKEND', 'NOT SURE'] as const
const STORE_KEY = 'aa-swipe-loved'

function Img({ src, alt = '', className = '' }: { src: string; alt?: string; className?: string }) {
  const [bad, setBad] = useState(false)
  if (bad) return <div aria-hidden={alt === ''} className={`bg-lilac ${className}`} />
  return <img src={src} alt={alt} className={className} onError={() => setBad(true)} draggable={false} />
}

function loadLoved(): number[] {
  try { const v = sessionStorage.getItem(STORE_KEY); if (!v) return []; const a = JSON.parse(v); return Array.isArray(a) ? a.filter((n) => Number.isInteger(n) && n >= 0 && n < LOOKS.length) : [] } catch { return [] }
}
function saveLoved(ids: number[]) { try { sessionStorage.setItem(STORE_KEY, JSON.stringify(ids)) } catch { /* ignore */ } }

export default function SwipeLooks() {
  const [index, setIndex] = useState(0)
  const [loved, setLoved] = useState<number[]>(loadLoved)
  const [skipped, setSkipped] = useState<number[]>([])
  const [phase, setPhase] = useState<'stack' | 'slip'>('stack')
  const [day, setDay] = useState<(typeof DAYS)[number] | ''>('')
  const [announce, setAnnounce] = useState('')
  const [reduced, setReduced] = useState(false)
  const topCardRef = useRef<HTMLDivElement>(null)
  const stampRRef = useRef<HTMLSpanElement>(null)
  const stampLRef = useRef<HTMLSpanElement>(null)
  const dragRef = useRef<{ sx: number; sy: number; x: number; y: number; t: number; pid: number } | null>(null)
  const dragPos = useRef({ x: 0, y: 0 })
  const animRef = useRef(0)
  const busyRef = useRef(false)
  const burstRef = useRef<HTMLDivElement>(null)
  const historyRef = useRef<{ i: number; loved: number[]; skipped: number[] }[]>([])

  useEffect(() => {
    LOOKS.forEach((l) => { const img = new Image(); img.src = `/tryon/${l.id}.webp` })
  }, [])

  useEffect(() => {
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(rm.matches)
    sync(); rm.addEventListener('change', sync)
    return () => rm.removeEventListener('change', sync)
  }, [])

  useEffect(() => () => cancelAnimationFrame(animRef.current), [])

  const applyDrag = (x: number, y: number) => {
    dragPos.current = { x, y }
    if (topCardRef.current) topCardRef.current.style.transform = `translate(${x}px,${y}px) rotate(${x * 0.06}deg)`
    if (stampRRef.current) stampRRef.current.style.opacity = String(Math.min(1, Math.max(0, x / 120)))
    if (stampLRef.current) stampLRef.current.style.opacity = String(Math.min(1, Math.max(0, -x / 120)))
  }

  const goPhase2 = () => setPhase('slip')

  const finishSwipe = (dir: 'left' | 'right') => {
    const lookIdx = index
    historyRef.current.push({ i: index, loved: [...loved], skipped: [...skipped] })
    const nextLoved = dir === 'right' ? [...loved, lookIdx] : loved
    const nextSkipped = dir === 'left' ? [...skipped, lookIdx] : skipped
    if (dir === 'right') { setLoved(nextLoved); saveLoved(nextLoved); burst() }
    else setSkipped(nextSkipped)
    setAnnounce(`${dir === 'right' ? 'Loved' : 'Skipped'} ${LOOKS[lookIdx].name}`)
    applyDrag(0, 0)
    const next = index + 1
    if (next >= LOOKS.length) { setIndex(next); window.setTimeout(goPhase2, reduced ? 0 : 250) }
    else setIndex(next)
  }

  const burst = () => {
    if (reduced) return
    const host = burstRef.current
    if (!host) return
    host.innerHTML = ''
    const colors = ['#FF4D8D', '#D4AF55', '#0A0A0A']
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('span')
      const size = 6 + Math.random() * 8
      const a = Math.random() * Math.PI * 2
      const d = 40 + Math.random() * 80
      p.style.cssText = `position:absolute;left:50%;top:40%;width:${size}px;height:${size}px;background:${colors[i % 3]};pointer-events:none;`
      host.appendChild(p)
      const t0 = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / 500)
        const e = 1 - Math.pow(1 - t, 3)
        p.style.transform = `translate(${Math.cos(a) * d * e - size / 2}px,${Math.sin(a) * d * e - size / 2}px) rotate(${t * 180}deg)`
        p.style.opacity = String(1 - t)
        if (t < 1) requestAnimationFrame(tick)
        else p.remove()
      }
      requestAnimationFrame(tick)
    }
    if (navigator.vibrate) navigator.vibrate(10)
  }

  const springBack = () => {
    if (reduced) { applyDrag(0, 0); busyRef.current = false; return }
    busyRef.current = true
    const start = { ...dragPos.current }
    const t0 = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / 320)
      const e = 1 - Math.pow(1 - t, 3)
      applyDrag(start.x * (1 - e), start.y * (1 - e))
      if (t < 1) animRef.current = requestAnimationFrame(tick)
      else busyRef.current = false
    }
    animRef.current = requestAnimationFrame(tick)
  }

  const flyOff = (dir: 'left' | 'right') => {
    if (reduced) { busyRef.current = false; finishSwipe(dir); return }
    busyRef.current = true
    const start = { ...dragPos.current }
    const toX = dir === 'right' ? 700 : -700
    const t0 = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / 320)
      const e = 1 - Math.pow(1 - t, 3)
      applyDrag(start.x + (toX - start.x) * e, start.y + t * 40)
      if (t < 1) animRef.current = requestAnimationFrame(tick)
      else { busyRef.current = false; finishSwipe(dir) }
    }
    animRef.current = requestAnimationFrame(tick)
  }

  const onDown = (e: React.PointerEvent) => {
    if (busyRef.current || index >= LOOKS.length || phase !== 'stack') return
    cancelAnimationFrame(animRef.current)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    dragRef.current = { sx: e.clientX, sy: e.clientY, x: dragPos.current.x, y: dragPos.current.y, t: performance.now(), pid: e.pointerId }
  }
  const onMove = (e: React.PointerEvent) => {
    const d = dragRef.current
    if (!d || d.pid !== e.pointerId) return
    applyDrag(d.x + e.clientX - d.sx, d.y + e.clientY - d.sy)
  }
  const onUp = (e: React.PointerEvent) => {
    const d = dragRef.current
    if (!d || d.pid !== e.pointerId) return
    dragRef.current = null
    const dx = dragPos.current.x
    const dt = Math.max(1, performance.now() - d.t)
    const vx = Math.abs(dx) / dt
    if (Math.abs(dx) > 120 || vx > 0.8) flyOff(dx > 0 ? 'right' : 'left')
    else springBack()
  }

  const doLove = () => { if (busyRef.current || phase !== 'stack' || index >= LOOKS.length || dragRef.current) return; cancelAnimationFrame(animRef.current); flyOff('right') }
  const doSkip = () => { if (busyRef.current || phase !== 'stack' || index >= LOOKS.length || dragRef.current) return; cancelAnimationFrame(animRef.current); flyOff('left') }
  const doBack = () => {
    const prev = historyRef.current.pop()
    if (!prev) return
    cancelAnimationFrame(animRef.current)
    setIndex(prev.i); setLoved(prev.loved); setSkipped(prev.skipped); saveLoved(prev.loved)
    applyDrag(0, 0); setPhase('stack'); setAnnounce(`Back to ${LOOKS[prev.i].name}`)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase !== 'stack') return
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'ArrowRight') { e.preventDefault(); doLove() }
      if (e.key === 'ArrowLeft') { e.preventDefault(); doSkip() }
      if (e.key === 'Backspace') { e.preventDefault(); doBack() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const reset = () => { cancelAnimationFrame(animRef.current); setIndex(0); setLoved([]); setSkipped([]); historyRef.current = []; setPhase('stack'); setDay(''); saveLoved([]); applyDrag(0, 0) }

  const lovedLooks = loved.map((i) => LOOKS[i]).filter(Boolean)
  const [visit] = useState(() => getVisitStatus(new Date(), aboutConfig.hours))
  const waMsg = (() => {
    let m = "Hi A & A Women Store! I'd like to visit and try these looks:"
    lovedLooks.forEach((l, i) => { m += `\n${i + 1}. ${l.name} (${l.code})` })
    if (day) m += `\nWhen I plan to come: ${day}.`
    m += '\nPlease let me know if they are available.'
    return m
  })()
  const wa = `https://wa.me/${contactConfig.whatsapp}?text=${encodeURIComponent(waMsg)}`

  const card = (i: number, top: boolean) => {
    const l = LOOKS[i]
    const offset = i - index
    const rot = offset === 0 ? 0 : offset % 2 ? 2 : -2
    const y = offset * 6
    const s = 1 - offset * 0.03
    const style: React.CSSProperties = top
      ? { transform: 'translate(0px,0px) rotate(0deg)', zIndex: 20 }
      : { transform: `translateY(${y}px) rotate(${rot}deg) scale(${s})`, zIndex: 10 - offset }
    return (
      <div
        key={l.id}
        ref={top ? topCardRef : undefined}
        className={`nb-card absolute inset-0 flex flex-col ${BGS[i % 4]} p-3 ${top ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
        style={{ ...style, touchAction: top ? 'pan-y' : undefined }}
        onPointerDown={top ? onDown : undefined}
        onPointerMove={top ? onMove : undefined}
        onPointerUp={top ? onUp : undefined}
        onPointerCancel={top ? onUp : undefined}
      >
        <div className="relative flex-1 border-[3px] border-ink bg-cream/30 p-2">
          <Img src={`/tryon/${l.id}.webp`} alt={l.name} className="h-full w-full object-contain [filter:drop-shadow(6px_6px_0_#0A0A0A)]" />
          {top && <span ref={stampRRef} className="pointer-events-none absolute right-3 top-3 border-[4px] border-pink px-3 py-1 font-display text-2xl text-pink" style={{ opacity: 0, transform: 'rotate(-12deg)' }}>LOVE IT</span>}
          {top && <span ref={stampLRef} className="pointer-events-none absolute left-3 top-3 border-[4px] border-ink px-3 py-1 font-display text-2xl text-ink" style={{ opacity: 0, transform: 'rotate(12deg)' }}>SKIP</span>}
        </div>
        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <p className="font-display text-xl uppercase leading-tight text-ink">{l.name}</p>
            <p className="font-mono text-xs text-ink">{l.code}</p>
          </div>
          <span className="nb-sticker shrink-0 text-[10px]" style={{ background: '#FFF6E0' }}>STYLE PREVIEW</span>
        </div>
      </div>
    )
  }

  return (
    <section id="try" className="border-b-3 border-ink bg-cream px-4 py-16 sm:px-6 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <SplitWords as="h2" className="font-display text-4xl uppercase text-ink md:text-6xl">SWIPE YOUR WARDROBE</SplitWords>
            <Reveal><span className="nb-sticker inline-block" style={{ background: '#D4AF55', transform: 'rotate(-3deg)' }}>FIND YOUR LOOK</span></Reveal>
          </div>
          <Reveal><p className="mt-3 font-serif text-xl italic text-ink md:text-2xl">Love it or skip it. Then come try your picks in store.</p></Reveal>
        </div>

        <p className="sr-only" aria-live="polite">{announce}</p>

        {phase === 'stack' ? (
          <div className="mx-auto mt-10 max-w-[860px]">
            <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-6">
              <button type="button" onClick={doSkip} aria-label="Skip" className="nb-btn nb-btn-ink flex shrink-0 flex-col items-center gap-1 !px-2 !py-3 text-[10px] sm:!px-3 sm:text-xs md:w-28 md:!px-3 md:!py-5 md:text-sm">
                <span className="font-display text-xl md:text-3xl">←</span>
                <span className="font-display uppercase">SKIP</span>
              </button>

              <div className="w-full max-w-[340px] md:max-w-[380px]">
                <div className="relative mx-auto h-[480px] w-full md:h-[520px]">
                  <Img src="/contact/heart.webp" alt="" className="pointer-events-none absolute -left-6 -top-4 w-10 md:w-12" aria-hidden="true" />
                  <Img src="/contact/sparkle.webp" alt="" className="pointer-events-none absolute -right-6 -top-4 w-10 md:w-12" aria-hidden="true" />
                  <div ref={burstRef} className="pointer-events-none absolute inset-0 z-30" />
                  {LOOKS.slice(index, index + 3).reverse().map((_, revI, arr) => {
                    const i = index + (arr.length - 1 - revI)
                    return card(i, i === index)
                  })}
                  {index >= LOOKS.length && <div className="nb-card flex h-full items-center justify-center bg-lilac"><p className="font-display text-2xl uppercase text-ink">All done</p></div>}
                </div>
              </div>

              <button type="button" onClick={doLove} aria-label="Love" className="nb-btn nb-btn-pink flex shrink-0 flex-col items-center gap-1 !px-2 !py-3 text-[10px] sm:!px-3 sm:text-xs md:w-28 md:!px-3 md:!py-5 md:text-sm">
                <span className="font-display text-xl md:text-3xl">→</span>
                <span className="font-display uppercase">LOVE</span>
              </button>
            </div>


            <p className="mt-4 hidden text-center font-mono text-sm text-ink md:block">{String(Math.min(index + 1, LOOKS.length)).padStart(2, '0')} / {String(LOOKS.length).padStart(2, '0')}</p>
            <div className="mt-2 hidden justify-center gap-2 md:flex" aria-hidden="true">
              {LOOKS.map((_, i) => {
                const c = loved.includes(i) ? 'bg-pink' : skipped.includes(i) ? 'bg-ink' : 'bg-cream'
                return <span key={i} className={`h-3 w-3 border-2 border-ink ${c}`} />
              })}
            </div>

            <div className="mt-5 flex justify-center">
              <button type="button" onClick={doBack} aria-label="Back" className="nb-btn bg-white !px-5 !py-3 text-sm">BACK</button>
            </div>
          </div>
        ) : (
          <div className="mx-auto mt-10 max-w-[560px]">
            <div className="border-t-[12px] border-ink bg-ink px-4 pt-1">
              <div className="bg-cream border-x-[3px] border-b-0 border-ink px-5 py-6 shadow-[6px_6px_0_#0A0A0A]" style={{ borderBottom: 'none', backgroundImage: 'linear-gradient(#FFF6E0,#FFF6E0)' }}>
                <div style={reduced ? undefined : { animation: 'slipIn .4s ease, slipSway 3s ease-in-out .4s infinite', transformOrigin: 'top center' }}>
                  <p className="font-mono text-xs uppercase text-ink">A &amp; A WOMEN STORE — YOUR TRY LIST</p>
                  <div className="mt-4 border-t-2 border-dashed border-ink pt-4 space-y-2">
                    {lovedLooks.length === 0 ? <p className="font-mono text-sm text-ink">NOTHING YET</p> : lovedLooks.map((l, i) => (
                      <p key={l.id} className="font-mono text-sm text-ink" style={reduced ? undefined : { animation: `slipLine .15s ease ${i * 0.15}s both` }}>{String(i + 1).padStart(2, '0')} {l.name} ...... {l.code}</p>
                    ))}
                  </div>
                  <div className="mt-4 border-t-2 border-dashed border-ink pt-3 font-mono text-sm text-ink">TOTAL LOOKS: {lovedLooks.length}</div>
                </div>
              </div>
              <div className="h-4 bg-cream border-x-[3px] border-ink" style={{ clipPath: 'polygon(0 0,5% 100%,10% 0,15% 100%,20% 0,25% 100%,30% 0,35% 100%,40% 0,45% 100%,50% 0,55% 100%,60% 0,65% 100%,70% 0,75% 100%,80% 0,85% 100%,90% 0,95% 100%,100% 0)' }} />
            </div>

            {lovedLooks.length === 0 ? (
              <button type="button" className="nb-btn nb-btn-pink mt-6 min-h-[48px] w-full" onClick={reset}>SWIPE AGAIN</button>
            ) : (
              <>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <p className="font-display text-sm uppercase text-ink">WHEN WILL YOU COME?</p>
                  <span className={`nb-sticker text-[10px] ${visit.open ? 'bg-pink' : 'bg-ink text-cream'}`}>{visit.open ? 'OPEN NOW' : 'CLOSED'}</span>
                  <span className="font-mono text-xs text-ink">{visit.detail}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {DAYS.map((d) => (
                    <button key={d} type="button" aria-pressed={day === d} onClick={() => setDay(day === d ? '' : d)} className={`nb-chip min-h-[44px] px-4 ${day === d ? 'bg-ink text-cream' : ''}`}>{d}</button>
                  ))}
                </div>
                <div className="mt-6 flex flex-col gap-3">
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="nb-btn nb-btn-pink min-h-[48px] text-center">TELL THE SHOP I'M COMING</a>
                  <a href="/shop" className="nb-btn min-h-[48px] bg-gold text-center">SHOP THESE</a>
                  <button type="button" className="nb-btn min-h-[48px] bg-ink text-center text-cream" onClick={reset}>SWIPE AGAIN</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <style>{`@keyframes slipIn{0%{transform:translateY(-20px);opacity:0}100%{transform:translateY(0);opacity:1}}@keyframes slipLine{0%{opacity:0;transform:translateY(-6px)}100%{opacity:1;transform:translateY(0)}}@keyframes slipSway{0%,100%{transform:rotate(0)}50%{transform:rotate(.4deg)}}`}</style>
    </section>
  )
}
