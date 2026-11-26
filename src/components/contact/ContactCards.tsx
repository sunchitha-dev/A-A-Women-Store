import { useEffect, useRef, useState } from 'react'
import { contactConfig } from '../../data/contactConfig'
import Reveal from '../Reveal'

type Ch = 0 | 1 | 2 | 3 | 4
const CHS: { id: Ch; n: string; name: string; bg: string }[] = [
  { id: 0, n: 'CH 00', name: 'Start', bg: '#0A0A0A' },
  { id: 1, n: 'CH 01', name: 'WhatsApp', bg: '#FF4D8D' },
  { id: 2, n: 'CH 02', name: 'Call', bg: '#D4AF55' },
  { id: 3, n: 'CH 03', name: 'Instagram', bg: '#C9B6FF' },
  { id: 4, n: 'CH 04', name: 'Visit', bg: '#FFF6E0' },
]
const DETENTS = [-135, -67.5, 0, 67.5, 135]
const TICKER = 'A & A WOMEN STORE ✦ OLD PALLAVARAM ✦ IMPORTED. TREND-SETTING. YOURS. ✦ '
const CH_COLORS: Record<Ch, string> = { 0: '#FFF6E0', 1: '#FF4D8D', 2: '#D4AF55', 3: '#C9B6FF', 4: '#FFF6E0' }
const PROPS: Record<number, string> = { 1: '/contact/bubble-pink.webp', 2: '/contact/phone.webp', 3: '/contact/heart.webp', 4: '/about/pin.webp' }

function Img({ src, alt = '', className = '', style }: { src: string; alt?: string; className?: string; style?: React.CSSProperties }) {
  const [bad, setBad] = useState(false)
  if (bad) return <div aria-hidden={alt === ''} className={`bg-lilac ${className}`} style={style} />
  return <img src={src} alt={alt} className={className} style={style} onError={() => setBad(true)} draggable={false} />
}

function rrPoint(t: number, w: number, h: number, r: number) {
  const tw = Math.max(0, w - 2 * r), th = Math.max(0, h - 2 * r)
  const arc = Math.PI * r / 2
  const per = 2 * (tw + th) + 4 * arc
  let d = ((t % 1) + 1) % 1 * per
  const segs = [
    { len: tw, fx: (p: number) => ({ x: r + p, y: 0, a: 0 }) },
    { len: arc, fx: (p: number) => { const ang = -Math.PI / 2 + p / r; return { x: w - r + Math.cos(ang) * r, y: r + Math.sin(ang) * r, a: ang + Math.PI / 2 } } },
    { len: th, fx: (p: number) => ({ x: w, y: r + p, a: Math.PI / 2 }) },
    { len: arc, fx: (p: number) => { const ang = 0 + p / r; return { x: w - r + Math.cos(ang) * r, y: h - r + Math.sin(ang) * r, a: ang + Math.PI / 2 } } },
    { len: tw, fx: (p: number) => ({ x: w - r - p, y: h, a: Math.PI }) },
    { len: arc, fx: (p: number) => { const ang = Math.PI / 2 + p / r; return { x: r + Math.cos(ang) * r, y: h - r + Math.sin(ang) * r, a: ang + Math.PI / 2 } } },
    { len: th, fx: (p: number) => ({ x: 0, y: h - r - p, a: -Math.PI / 2 }) },
    { len: arc, fx: (p: number) => { const ang = Math.PI + p / r; return { x: r + Math.cos(ang) * r, y: r + Math.sin(ang) * r, a: ang + Math.PI / 2 } } },
  ]
  for (const s of segs) { if (d <= s.len) return s.fx(d); d -= s.len }
  return { x: r, y: 0, a: 0 }
}

export default function ContactCards() {
  const [ch, setCh] = useState<Ch>(0)
  const [staticOn, setStaticOn] = useState(false)
  const [pop, setPop] = useState(false)
  const [scan, setScan] = useState(0)
  const [reduced, setReduced] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const knobRef = useRef<HTMLDivElement>(null)
  const antRef = useRef<SVGGElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rAF = useRef(0)
  const staticRAF = useRef(0)
  const timers = useRef<number[]>([])
  const drag = useRef<{ startA: number; startV: number } | null>(null)
  const angle = useRef(DETENTS[0])
  const targetAngle = useRef(DETENTS[0])
  const vel = useRef(0)
  const antVel = useRef(0)
  const antAng = useRef(0)
  const sectionRef = useRef<HTMLElement>(null)
  const tvBodyRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLCanvasElement>(null)
  const planeRef = useRef<HTMLButtonElement>(null)
  const orbitRAF = useRef(0)
  const orbit = useRef({ w: 0, h: 0, pad: 48, t: 0, last: 0, speed: 1 / 18, boost: 0, loop: 0, loopT: 0, visible: true, trail: [] as { x: number; y: number; born: number; c: string }[] })
  const [flash, setFlash] = useState(false)
  const [prevCh, setPrevCh] = useState<Ch>(0)
  const propTimer = useRef(0)
  const reducedRef = useRef(false)

  useEffect(() => {
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mb = window.matchMedia('(max-width: 767px)')
    const sync = () => { setReduced(rm.matches); reducedRef.current = rm.matches; setIsMobile(mb.matches) }
    sync(); rm.addEventListener('change', sync); mb.addEventListener('change', sync)
    return () => { rm.removeEventListener('change', sync); mb.removeEventListener('change', sync) }
  }, [])

  const applyKnob = (a: number) => { angle.current = a; if (knobRef.current) knobRef.current.style.transform = `rotate(${a}deg)` }

  useEffect(() => {
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(0.04, (now - last) / 1000); last = now
      if (!drag.current) {
        const diff = targetAngle.current - angle.current
        vel.current += diff * 18 * dt
        vel.current *= 0.82
        applyKnob(angle.current + vel.current * dt * 60)
      }
      if (!reduced) {
        const settled = Math.abs(antAng.current) < 0.05 && Math.abs(antVel.current) < 0.1
        if (settled) { antAng.current = Math.sin(now / 900) * 1; antVel.current = 0 }
        else { antVel.current += (-antAng.current * 40 - antVel.current * 5) * dt; antAng.current += antVel.current * dt }
        if (antRef.current) antRef.current.setAttribute('transform', `rotate(${antAng.current} 100 60)`)
      }
      rAF.current = requestAnimationFrame(loop)
    }
    rAF.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rAF.current)
  }, [reduced])

  useEffect(() => {
    const o = orbit.current
    const resize = () => {
      const el = tvBodyRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      o.pad = window.innerWidth < 768 ? 32 : 48
      o.w = r.width + o.pad; o.h = r.height + o.pad
      const cvs = trailRef.current
      if (cvs) { const dpr = Math.min(2, window.devicePixelRatio || 1); cvs.width = Math.floor(o.w * dpr); cvs.height = Math.floor(o.h * dpr); cvs.style.width = o.w + 'px'; cvs.style.height = o.h + 'px'; const ctx = cvs.getContext('2d'); if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0) }
    }
    resize()
    const ro = new ResizeObserver(resize)
    if (tvBodyRef.current) ro.observe(tvBodyRef.current)
    const io = new IntersectionObserver((es) => { o.visible = es[0]?.isIntersecting ?? false }, { threshold: 0.05 })
    if (sectionRef.current) io.observe(sectionRef.current)
    const onVis = () => { if (document.hidden) o.visible = false; else { o.visible = true; o.last = performance.now() } }
    document.addEventListener('visibilitychange', onVis)
    let running = true
    const step = (now: number) => {
      if (!running) return
      if (!o.visible || document.hidden) { o.last = 0; orbitRAF.current = requestAnimationFrame(step); return }
      if (!o.last) o.last = now
      const dt = Math.min(0.05, (now - o.last) / 1000)
      o.last = now
      if (!reducedRef.current && o.w > 0) {
        let spd = o.speed
        if (o.boost > 0) { spd = 1 / 1.2; o.boost -= dt; if (o.boost <= 0) o.boost = 0 }
        o.t = (o.t + spd * dt) % 1
        let pt = rrPoint(o.t, o.w, o.h, 28)
        if (o.loop > 0) {
          o.loopT += dt
          const lp = Math.min(1, o.loopT / 0.8)
          const ang = lp * Math.PI * 2
          pt = { x: pt.x + Math.cos(ang - Math.PI / 2) * 40, y: pt.y + Math.sin(ang - Math.PI / 2) * 40, a: pt.a + ang }
          if (lp >= 1) { o.loop = 0; o.loopT = 0 }
        }
        const half = (window.innerWidth < 768 ? 56 : 72) / 2
        const px = pt.x - o.pad / 2 - half, py = pt.y - o.pad / 2 - half
        if (planeRef.current) planeRef.current.style.transform = `translate(${px}px,${py}px) rotate(${pt.a * 180 / Math.PI}deg)`
        const colors = ['#FF4D8D', '#D4AF55', '#0A0A0A']
        o.trail.push({ x: pt.x, y: pt.y, born: now, c: colors[Math.floor(now / 80) % 3] })
        if (o.trail.length > 60) o.trail.shift()
        const cvs = trailRef.current
        const ctx = cvs?.getContext('2d')
        if (ctx && cvs) {
          ctx.clearRect(0, 0, o.w, o.h)
          for (let i = o.trail.length - 1; i >= 0; i--) {
            const tr = o.trail[i]
            const age = (now - tr.born) / 600
            if (age >= 1) { o.trail.splice(i, 1); continue }
            ctx.globalAlpha = 1 - age
            ctx.fillStyle = tr.c
            ctx.fillRect(tr.x - 3, tr.y - 3, 6, 6)
          }
          ctx.globalAlpha = 1
        }
      } else if (reducedRef.current && o.w > 0) {
        const half = (window.innerWidth < 768 ? 56 : 72) / 2
        const pt = { x: o.w / 2, y: 0 }
        if (planeRef.current) planeRef.current.style.transform = `translate(${pt.x - o.pad / 2 - half}px,${pt.y - o.pad / 2 - half}px) rotate(0deg)`
        const ctx = trailRef.current?.getContext('2d')
        if (ctx) ctx.clearRect(0, 0, o.w, o.h)
        o.trail = []
      }
      orbitRAF.current = requestAnimationFrame(step)
    }
    orbitRAF.current = requestAnimationFrame(step)
    return () => { running = false; cancelAnimationFrame(orbitRAF.current); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', onVis) }
  }, [])

  const planeBurst = () => {
    if (reducedRef.current) return
    orbit.current.loop = 1; orbit.current.loopT = 0
    const host = planeRef.current?.parentElement
    if (!host) return
    const o = orbit.current
    const pt = rrPoint(o.t, o.w, o.h, 28)
    for (let i = 0; i < 24; i++) {
      const s = document.createElement('span')
      const size = 6
      const a = (Math.PI * 2 * i) / 24
      const d = 30 + Math.random() * 40
      s.style.cssText = `position:absolute;left:${pt.x - o.pad / 2}px;top:${pt.y - o.pad / 2}px;width:${size}px;height:${size}px;background:${['#FF4D8D','#D4AF55','#0A0A0A'][i % 3]};pointer-events:none;z-index:40`
      host.appendChild(s)
      const t0 = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / 500)
        const e = 1 - Math.pow(1 - t, 3)
        s.style.transform = `translate(${Math.cos(a) * d * e - 3}px,${Math.sin(a) * d * e - 3}px)`
        s.style.opacity = String(1 - t)
        if (t < 1) requestAnimationFrame(tick)
        else s.remove()
      }
      requestAnimationFrame(tick)
    }
  }

  const detentFor = (a: number) => {
    let best = 0, bd = Infinity
    DETENTS.forEach((d, i) => { const dd = Math.abs(d - a); if (dd < bd) { bd = dd; best = i } })
    return best
  }

  const goTo = (next: Ch, shake = true) => {
    if (next === ch) { targetAngle.current = DETENTS[next]; return }
    setPrevCh(ch)
    setCh(next)
    targetAngle.current = DETENTS[next]
    if (shake && !reduced) { antVel.current = 8; }
    cancelAnimationFrame(staticRAF.current); timers.current.forEach(clearTimeout); timers.current = []
    window.clearTimeout(propTimer.current); propTimer.current = window.setTimeout(() => setPrevCh(0), 220)
    if (!reduced) { setFlash(true); timers.current.push(window.setTimeout(() => setFlash(false), 300)); orbit.current.boost = 1.2 }
    if (reduced) { setStaticOn(false); setPop(false); return }
    setStaticOn(true); setPop(false)
    const cvs = canvasRef.current
    if (cvs) {
      const ctx = cvs.getContext('2d')
      if (ctx) {
        const colors = ['#0A0A0A', '#FFFFFF', '#FF4D8D', '#D4AF55']
        const start = performance.now()
        const draw = (now: number) => {
          for (let y = 0; y < 54; y++) for (let x = 0; x < 96; x++) { ctx.fillStyle = colors[Math.floor(Math.random() * 4)]; ctx.fillRect(x, y, 1, 1) }
          if (now - start < 350) staticRAF.current = requestAnimationFrame(draw)
          else { setStaticOn(false); setPop(true); timers.current.push(window.setTimeout(() => setPop(false), 250)) }
        }
        staticRAF.current = requestAnimationFrame(draw)
      }
    } else { timers.current.push(window.setTimeout(() => { setStaticOn(false); setPop(true); timers.current.push(window.setTimeout(() => setPop(false), 250)) }, 350)) }
  }

  useEffect(() => () => { cancelAnimationFrame(staticRAF.current); timers.current.forEach(clearTimeout); window.clearTimeout(propTimer.current) }, [])

  const knobAngleFromEvent = (e: PointerEvent | React.PointerEvent) => {
    const el = knobRef.current?.parentElement
    if (!el) return 0
    const r = el.getBoundingClientRect()
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2
    return Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI
  }

  const onKnobDown = (e: React.PointerEvent) => {
    e.preventDefault()
    knobRef.current?.parentElement?.setPointerCapture(e.pointerId)
    drag.current = { startA: knobAngleFromEvent(e), startV: angle.current }
  }
  const onKnobMove = (e: React.PointerEvent) => {
    if (!drag.current) return
    const a = knobAngleFromEvent(e)
    let delta = a - drag.current.startA
    if (delta > 180) delta -= 360; if (delta < -180) delta += 360
    const next = Math.max(-135, Math.min(135, drag.current.startV + delta))
    const prevDet = detentFor(angle.current)
    applyKnob(next)
    const curDet = detentFor(next)
    if (curDet !== prevDet && !reduced) antVel.current = 3
  }
  const onKnobUp = () => {
    if (!drag.current) return
    drag.current = null
    const det = detentFor(angle.current)
    goTo(det as Ch)
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(Math.min(4, ch + 1) as Ch) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(Math.max(0, ch - 1) as Ch) }
    if (['1','2','3','4'].includes(e.key)) { e.preventDefault(); goTo(Number(e.key) as Ch) }
  }

  const addr = contactConfig.address.split(',').slice(0, 2).join(',').trim() + ', Old Pallavaram, Chennai'
  const mapQ = encodeURIComponent(contactConfig.address)

  const screen = () => {
    if (ch === 0) return (
      <div className="relative flex h-full w-full flex-col overflow-hidden">
        <div className="flex flex-1">
          {['#FF4D8D','#D4AF55','#C9B6FF','#FFF6E0','#0A0A0A','#FFFFFF'].map((c, i) => <div key={i} className="flex-1" style={{ background: c, animation: reduced ? undefined : `tvBars 8s ease-in-out ${i * 0.3}s infinite alternate` }} />)}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="border-[3px] border-ink bg-cream px-4 py-2 font-mono text-sm uppercase text-ink motion-safe:animate-pulse">TUNE IN →</span>
        </div>
      </div>
    )
    const inner = [
      null,
      <div key="1" className="flex h-full flex-col items-start justify-center p-5 md:p-8"><p className="font-display text-2xl uppercase leading-tight text-ink md:text-4xl">Message us your order or question.</p><a href={`https://wa.me/${contactConfig.whatsapp}`} target="_blank" rel="noopener noreferrer" className="nb-btn mt-5 bg-ink text-cream min-h-[48px]">OPEN WHATSAPP</a></div>,
      <div key="2" className="flex h-full flex-col items-start justify-center p-5 md:p-8"><p className="font-mono text-2xl text-ink md:text-5xl">{contactConfig.phoneDisplay}</p><a href={`tel:${contactConfig.phoneTel}`} className="nb-btn mt-5 bg-ink text-cream min-h-[48px]">CALL NOW</a></div>,
      <div key="3" className="flex h-full flex-col items-start justify-center p-5 md:p-8"><p className="font-display text-2xl uppercase text-ink md:text-4xl">@{contactConfig.instagram}</p><p className="mt-2 font-body text-base text-ink md:text-lg">New Korean stock and reels.</p><a href={`https://instagram.com/${contactConfig.instagram}`} target="_blank" rel="noopener noreferrer" className="nb-btn mt-5 bg-ink text-cream min-h-[48px]">FOLLOW</a></div>,
      <div key="4" className="flex h-full flex-col items-start justify-center p-5 md:p-8"><p className="font-display text-xl uppercase leading-tight text-ink md:text-3xl">{addr}</p><a href={`https://www.google.com/maps/search/?api=1&query=${mapQ}`} target="_blank" rel="noopener noreferrer" className="nb-btn mt-5 bg-ink text-cream min-h-[48px]">DIRECTIONS</a></div>,
    ][ch]
    return <div className="relative h-full w-full" style={{ background: CHS[ch].bg }}>{inner}</div>
  }

  return (
    <section className="border-b-3 border-ink bg-cream px-4 py-16 sm:px-6 md:py-24 overflow-hidden">
      <style>{`@keyframes tvPop{0%{transform:scale(.96);opacity:.7}100%{transform:scale(1);opacity:1}}@keyframes tvScan{0%{transform:translateY(-100%)}100%{transform:translateY(1000%)}}@keyframes tvBars{0%{transform:translateY(0)}100%{transform:translateY(-4%)}}@keyframes bulbRun{0%,18%{background:var(--bulb-on,#FFF6E0)}18.1%,100%{background:#0A0A0A}}@keyframes popOut{0%{transform:scale(0) rotate(-10deg);opacity:0}70%{transform:scale(1.08) rotate(7deg);opacity:1}100%{transform:scale(1) rotate(6deg);opacity:1}}@keyframes propWobble{0%,100%{transform:rotate(6deg)}50%{transform:rotate(3deg)}}@keyframes retractOut{0%{transform:scale(1) rotate(6deg);opacity:1}100%{transform:scale(0) rotate(-10deg);opacity:0}}`}</style>
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex flex-wrap items-center gap-4">
          <h2 className="font-display text-4xl uppercase text-ink md:text-6xl">PICK YOUR WAY</h2>
          <span className="nb-sticker" style={{ background: '#D4AF55', transform: 'rotate(-3deg)' }}>TUNE IN</span>
        </Reveal>

        <div className="mx-auto mt-10 max-w-[880px]" style={{ transform: isMobile ? undefined : 'rotate(-1.5deg)' }}>
          <div className="flex justify-center">
            <svg width={isMobile ? 120 : 180} height={isMobile ? 60 : 80} viewBox="0 0 200 80" aria-hidden="true">
              <g ref={antRef}>
                <line x1="100" y1="60" x2="35" y2="10" stroke="#0A0A0A" strokeWidth="6" strokeLinecap="round" />
                <line x1="100" y1="60" x2="165" y2="10" stroke="#0A0A0A" strokeWidth="6" strokeLinecap="round" />
                <circle cx="35" cy="10" r="8" fill="#D4AF55" stroke="#0A0A0A" strokeWidth="3" />
                <circle cx="165" cy="10" r="8" fill="#D4AF55" stroke="#0A0A0A" strokeWidth="3" />
              </g>
              <rect x="85" y="55" width="30" height="25" fill="#0A0A0A" />
            </svg>
          </div>

          <div className="relative mx-auto max-w-[920px] px-6 py-6 md:px-8 md:py-8">
            <div className="pointer-events-none absolute -right-2 -top-4 z-0 md:-right-4 md:-top-8" aria-hidden="true">
              {prevCh >= 1 && prevCh !== ch && !reduced && (
                <Img src={PROPS[prevCh]} alt="" className="absolute right-0 top-0 w-20 md:w-[110px] animate-[retractOut_.2s_ease_forwards]" style={{ transformOrigin: 'bottom left' }} />
              )}
              {ch >= 1 && (
                <Img src={PROPS[ch]} alt="" className={`w-20 md:w-[110px] ${reduced ? '' : 'animate-[popOut_.35s_cubic-bezier(.2,1.4,.6,1),propWobble_2.8s_ease-in-out_.35s_infinite]'}`} style={reduced ? undefined : { transformOrigin: 'bottom left' }} />
              )}
            </div>
            <div ref={tvBodyRef} className="relative border-[4px] border-ink bg-gold shadow-[12px_12px_0_#0A0A0A]" onKeyDown={onKey}>
              <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
                {Array.from({ length: isMobile ? 24 : 44 }, (_, i) => {
                  const n = isMobile ? 24 : 44
                  const t = i / n
                  const p = t * 4
                  let left = '0%', top = '0%'
                  if (p < 1) { left = `${p * 100}%`; top = '0%' }
                  else if (p < 2) { left = '100%'; top = `${(p - 1) * 100}%` }
                  else if (p < 3) { left = `${(3 - p) * 100}%`; top = '100%' }
                  else { left = '0%'; top = `${(4 - p) * 100}%` }
                  const onCol = ch >= 1 ? CH_COLORS[ch] : (i % 4 === 0 ? '#FF4D8D' : '#FFF6E0')
                  const style = { left, top, transform: 'translate(-50%,-50%)', '--bulb-on': onCol, background: flash ? '#FFFFFF' : (reduced ? (i % 4 === 0 ? '#FF4D8D' : '#0A0A0A') : '#0A0A0A'), animation: (reduced || flash) ? undefined : `bulbRun 1.8s step-end infinite`, animationDelay: (reduced || flash) ? undefined : `${-(i / n) * 1.8}s` } as React.CSSProperties
                  return <span key={i} className="absolute h-[10px] w-[10px] border-[2px] border-ink" style={style} />
                })}
              </div>

              <div className="grid md:grid-cols-[1fr_220px]">
                <div className="border-b-[4px] border-ink p-3 md:border-b-0 md:border-r-[4px] md:p-4">
                  <div className="border-[8px] border-ink bg-ink">
                    <div className="relative h-[260px] overflow-hidden bg-cream md:h-[340px]" onMouseEnter={() => { if(!reduced) setScan(s=>s+1) }}>
                      <div className={`absolute inset-0 ${pop && !reduced ? '[animation:tvPop_.25s_ease]' : ''}`}>{screen()}</div>
                      <div className="pointer-events-none absolute left-2 top-2 z-20 border-[2px] border-ink bg-ink px-2 py-0.5 font-mono text-xs text-cream">{CHS[ch].n}</div>
                      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 overflow-hidden border-t-[3px] border-ink bg-ink py-1">
                        <div className="nb-marquee-track [animation-duration:14s]"><span className="px-4 font-mono text-[10px] uppercase text-cream">{TICKER}</span><span className="px-4 font-mono text-[10px] uppercase text-cream">{TICKER}</span></div>
                      </div>
                      {staticOn && <canvas ref={canvasRef} width={96} height={54} className="absolute inset-0 z-30 h-full w-full" style={{ imageRendering: 'pixelated' }} />}
                      {!reduced && scan > 0 && <div key={scan} className="pointer-events-none absolute left-0 right-0 top-0 z-20 h-1 bg-ink/60 [animation:tvScan_.6s_linear]" aria-hidden="true" />}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row items-center justify-around gap-4 bg-cream p-4 md:flex-col md:justify-start md:gap-5">
                  <p className="hidden font-mono text-xs uppercase text-ink md:block">A &amp; A TV</p>
                  <div className="relative h-24 w-24 shrink-0 rounded-full border-[4px] border-ink bg-gold shadow-[4px_4px_0_#0A0A0A] md:h-28 md:w-28"
                    onPointerDown={onKnobDown} onPointerMove={onKnobMove} onPointerUp={onKnobUp} onPointerCancel={onKnobUp}
                    style={{ touchAction: 'none' }}
                  >
                    {[0,1,2,3,4].map((i) => {
                      const a = (DETENTS[i] - 90) * Math.PI / 180
                      const r = 46, x = 50 + Math.cos(a)*r, y = 50 + Math.sin(a)*r
                      return <span key={i} className="absolute font-mono text-[10px] text-ink" style={{ left:`${x}%`, top:`${y}%`, transform:'translate(-50%,-50%)' }}>{i===0?'•':i}</span>
                    })}
                    <div ref={knobRef} role="slider" tabIndex={0} aria-label="Channel knob" aria-valuemin={1} aria-valuemax={4} aria-valuenow={ch===0?1:ch} aria-valuetext={CHS[ch===0?1:ch].name}
                      className="absolute inset-2 rounded-full border-[3px] border-ink bg-cream focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-pink"
                      style={{ transform: `rotate(${DETENTS[0]}deg)` }}
                    >
                      <span className="absolute left-1/2 top-2 h-4 w-1.5 -translate-x-1/2 bg-ink" />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 md:grid-cols-2">
                    {[1,2,3,4].map((n) => (
                      <button key={n} type="button" onClick={() => goTo(n as Ch)} className={`nb-btn min-h-[48px] min-w-[48px] px-3 py-2 text-sm ${ch===n?'bg-ink text-cream':'bg-white'}`}>{n}</button>
                    ))}
                  </div>
                  <div className="hidden w-full space-y-1 md:block" aria-hidden="true">
                    {Array.from({length:6},(_,i)=><div key={i} className="h-1 bg-ink" />)}
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute -inset-4 z-10 md:-inset-6" aria-hidden="true">
                <canvas ref={trailRef} className="absolute left-0 top-0" />
              </div>
              <button ref={planeRef} type="button" aria-label="Paper plane, press for a loop" onClick={planeBurst} className="absolute left-0 top-0 z-30 h-14 w-14 p-0 border-0 bg-transparent focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-pink md:h-[72px] md:w-[72px]" style={{ transform: 'translate(-9999px,-9999px)' }}>
                <Img src="/contact/paper-plane.webp" alt="" className="h-full w-full object-contain" />
              </button>
            </div>
          </div>

          <div className="mx-auto flex max-w-[880px] justify-between px-16">
            <div className="h-6 w-8 border-x-[4px] border-b-[4px] border-ink bg-ink" />
            <div className="h-6 w-8 border-x-[4px] border-b-[4px] border-ink bg-ink" />
          </div>
        </div>
        <p className="sr-only" aria-live="polite">{ch === 0 ? 'Start screen' : `Channel ${ch}: ${CHS[ch].name}`}</p>
      </div>
    </section>
  )
}
