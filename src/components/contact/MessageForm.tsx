import { useEffect, useRef, useState, type FormEvent } from 'react'
import gsap from 'gsap'
import { contactConfig } from '../../data/contactConfig'
import SplitWords from '../motion/SplitWords'

function Img({ src, alt = '', className = '' }: { src: string; alt?: string; className?: string }) {
  const [bad, setBad] = useState(false)
  if (bad) return <div aria-hidden={alt === ''} className={`bg-lilac ${/aspect-/.test(className) ? '' : 'aspect-square'} ${className}`} />
  return <img src={src} alt={alt} className={className} onError={() => setBad(true)} />
}

type Particle = { x: number; y: number; vx: number; vy: number; rot: number; vr: number; size: number; alpha: number; color: string; delay: number; life: number }

const mixColors = ['#0A0A0A', '#FF4D8D', '#D4AF55']

function clamp01(n: number) { return Math.max(0, Math.min(1, n)) }

function flightPos(t: number, sx: number, sy: number, ex: number, ey: number) {
  const bx = sx + (ex - sx) * t
  const by = sy + (ey - sy) * t
  // wind-up: small dip down-left early
  const wu = Math.sin(Math.PI * clamp01(t / 0.18))
  const wx = -35 * wu * (1 - clamp01((t - 0.12) / 0.08))
  const wy = 30 * wu * (1 - clamp01((t - 0.12) / 0.08))
  // loop-de-loop around t=0.2..0.52, radius 90
  const lt = clamp01((t - 0.2) / 0.32)
  const ang = -Math.PI / 2 + lt * Math.PI * 2
  const loopOn = t >= 0.2 && t <= 0.52 ? 1 : 0
  const lx = loopOn * 90 * (Math.cos(ang))
  const ly = loopOn * 90 * (Math.sin(ang) + 1)
  // wavy S after loop
  const st = clamp01((t - 0.45) / 0.55)
  const sx2 = 55 * Math.sin(st * Math.PI * 2.2) * st
  const sy2 = -30 * Math.sin(st * Math.PI * 1.4) * st
  return { x: bx + wx + lx + sx2, y: by + wy + ly + sy2 }
}

export default function MessageForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [topic, setTopic] = useState('')
  const [message, setMessage] = useState('')
  const [visitDate, setVisitDate] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [typing, setTyping] = useState(false)
  const [sent, setSent] = useState(false)
  const [reduced, setReduced] = useState(false)
  const typingTimer = useRef<number | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const animating = useRef(false)
  const cleanups = useRef<(() => void)[]>([])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => () => { cleanups.current.forEach((fn) => fn()); cleanups.current = [] }, [])

  const showDate = topic === 'Visit the store' || topic === 'Tailoring'

  const onType = () => {
    setTyping(true)
    if (typingTimer.current) window.clearTimeout(typingTimer.current)
    typingTimer.current = window.setTimeout(() => setTyping(false), 1000)
  }

  const previewText = () => {
    const lines = [`Hi A & A Women Store! I'm ${name || '...'}.`]
    if (topic) lines.push(`Topic: ${topic}`)
    if (message) lines.push(message)
    if (showDate && visitDate) lines.push(`Visit date: ${visitDate}`)
    if (phone) lines.push(`Phone: ${phone}`)
    return lines.join('\n')
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Name is required.'
    const cleanPhone = phone.replace(/\s/g, '')
    if (!/^\d{10}$/.test(cleanPhone)) e.phone = 'Enter a 10-digit phone number.'
    if (!topic) e.topic = 'Pick a topic.'
    if (!message.trim()) e.message = 'Message is required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const openWA = (url: string) => {
    window.open(url, '_blank', 'noopener')
  }

  const dissolve = (plane: HTMLImageElement, url: string) => {
    const run = () => {
      const rect = plane.getBoundingClientRect()
      const size = 120
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const canvas = document.createElement('canvas')
      canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999'
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      const ctx = canvas.getContext('2d')
      if (!ctx) { plane.remove(); setSent(true); openWA(url); animating.current = false; return }
      ctx.scale(dpr, dpr)
      document.body.appendChild(canvas)

      const off = document.createElement('canvas')
      off.width = size; off.height = size
      const octx = off.getContext('2d')
      if (!octx) { canvas.remove(); plane.remove(); setSent(true); openWA(url); animating.current = false; return }
      octx.drawImage(plane, 0, 0, size, size)
    const data = octx.getImageData(0, 0, size, size).data
    const particles: Particle[] = []
    const step = 6
    for (let y = 0; y < size && particles.length < 700; y += step) {
      for (let x = 0; x < size && particles.length < 700; x += step) {
        const i = (y * size + x) * 4
        const a = data[i + 3]
        if (a < 20) continue
        let color = `rgba(${data[i]},${data[i + 1]},${data[i + 2]},${(a / 255).toFixed(2)})`
        if (Math.random() < 0.15) color = mixColors[Math.floor(Math.random() * mixColors.length)]
        particles.push({
          x: rect.left + x, y: rect.top + y,
          vx: 40 + Math.random() * 120, vy: -30 - Math.random() * 80,
          rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 8,
          size: step, alpha: 1, color,
          delay: (x / size) * 0.25, life: 0.55 + Math.random() * 0.25,
        })
      }
    }
    plane.style.opacity = '0'

    let start: number | null = null
    let raf = 0
    const tick = (ts: number) => {
      if (start == null) start = ts
      const elapsed = (ts - start) / 1000
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      let alive = false
      for (const p of particles) {
        const t = elapsed - p.delay
        if (t < 0) { alive = true; ctx.save(); ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color; ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size); ctx.restore(); continue }
        const k = t / p.life
        if (k >= 1) continue
        alive = true
        const px = p.x + p.vx * t
        const py = p.y + p.vy * t + 120 * t * t
        const s = p.size * (1 - k)
        const rot = p.rot + p.vr * t
        ctx.save()
        ctx.globalAlpha = 1 - k
        ctx.fillStyle = p.color
        ctx.translate(px, py)
        ctx.rotate(rot)
        ctx.fillRect(-s / 2, -s / 2, s, s)
        ctx.restore()
      }
      if (alive) { raf = requestAnimationFrame(tick) }
      else {
        canvas.remove(); plane.remove(); setSent(true)
        const tmr = window.setTimeout(() => { openWA(url); animating.current = false }, 450)
        cleanups.current.push(() => window.clearTimeout(tmr))
      }
    }
    raf = requestAnimationFrame(tick)
    cleanups.current.push(() => { cancelAnimationFrame(raf); canvas.remove(); plane.remove() })
    }
    if (plane.complete && plane.naturalWidth > 0) run()
    else { plane.onload = run; plane.onerror = () => { plane.remove(); setSent(true); openWA(url); animating.current = false } }
  }

  const send = (e: FormEvent) => {
    e.preventDefault()
    if (animating.current) return
    if (!validate()) return
    const text = previewText()
    const url = `https://wa.me/${contactConfig.whatsapp}?text=${encodeURIComponent(text)}`
    if (reduced) { setSent(true); openWA(url); return }

    const btn = btnRef.current
    if (!btn) { openWA(url); return }
    animating.current = true
    const b = btn.getBoundingClientRect()
    const sx = b.left + b.width / 2 - 60
    const sy = b.top - 20
    const ex = window.innerWidth - 140
    const ey = 80

    const img = document.createElement('img')
    img.src = '/contact/paper-plane.webp'
    img.alt = ''
    img.style.cssText = `position:fixed;left:0;top:0;width:120px;height:120px;z-index:9999;pointer-events:none;will-change:transform;transform:translate(${sx}px,${sy}px)`
    document.body.appendChild(img)

    const obj = { t: 0 }
    const tw = gsap.to(obj, {
      t: 1,
      duration: 1.6,
      ease: 'power1.inOut',
      onUpdate: () => {
        const t = obj.t
        const p = flightPos(t, sx, sy, ex, ey)
        const p2 = flightPos(Math.min(1, t + 0.01), sx, sy, ex, ey)
        const ang = Math.atan2(p2.y - p.y, p2.x - p.x) * 180 / Math.PI
        const scale = 1 - 0.2 * clamp01((t - 0.75) / 0.25)
        img.style.transform = `translate(${p.x}px,${p.y}px) rotate(${ang}deg) scale(${scale})`
      },
      onComplete: () => dissolve(img, url),
    })
    cleanups.current.push(() => { tw.kill(); img.remove() })
  }

  const err = (k: string) => errors[k] ? <p className="mt-1 font-mono text-sm text-pink" role="status">{errors[k]}</p> : null
  const bubble = previewText().split('\n')

  return (
    <section id="message" className="border-b-3 border-ink bg-cream px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-widest text-ink">Message</p>
        <SplitWords as="h2" className="mt-2 font-display text-4xl uppercase text-ink md:text-6xl">Send A Message</SplitWords>

        <div className="mt-10 grid gap-8 md:grid-cols-[1fr_360px]">
          <form onSubmit={send} className="space-y-6" noValidate>
            <div className="nb-card bg-white p-6 md:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block font-mono text-xs uppercase text-ink">Name</span>
                  <input className="nb-input w-full" value={name} onChange={(e) => { setName(e.target.value); onType() }} aria-invalid={!!errors.name} />
                  {err('name')}
                </label>
                <label className="block">
                  <span className="mb-1 block font-mono text-xs uppercase text-ink">Phone (10 digits)</span>
                  <input className="nb-input w-full" value={phone} inputMode="tel" onChange={(e) => { setPhone(e.target.value.replace(/\s/g, '')); onType() }} aria-invalid={!!errors.phone} />
                  {err('phone')}
                </label>
              </div>

              <fieldset className="mt-6">
                <legend className="mb-2 font-mono text-xs uppercase text-ink">Topic</legend>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Topic">
                  {contactConfig.topics.map((t) => (
                    <button
                      key={t}
                      type="button"
                      role="radio"
                      aria-checked={topic === t}
                      className={`nb-chip min-h-[48px] px-4 ${topic === t ? 'bg-ink text-cream' : ''}`}
                      data-active={topic === t}
                      onClick={() => { setTopic(t); onType() }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {err('topic')}
              </fieldset>

              <label className="mt-6 block">
                <span className="mb-1 block font-mono text-xs uppercase text-ink">Message</span>
                <textarea
                  className="nb-input min-h-32 w-full"
                  value={message}
                  maxLength={500}
                  onChange={(e) => { setMessage(e.target.value); onType() }}
                  aria-invalid={!!errors.message}
                />
                <div className="mt-1 flex justify-between font-mono text-xs text-ink">
                  <span>{err('message')}</span>
                  <span>{message.length}/500</span>
                </div>
              </label>

              {showDate && (
                <label className="mt-6 block">
                  <span className="mb-1 block font-mono text-xs uppercase text-ink">Preferred Visit Date</span>
                  <input type="date" className="nb-input w-full sm:w-auto" value={visitDate} onChange={(e) => { setVisitDate(e.target.value); onType() }} />
                </label>
              )}
            </div>

            <div aria-live="polite" className="sr-only">
              {Object.values(errors).filter(Boolean).join('. ')}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button ref={btnRef} type="submit" className="nb-btn nb-btn-pink">SEND ON WHATSAPP</button>
              {sent && <span className="nb-sticker" style={{ background: '#D4AF55', transform: 'rotate(-2deg)' }}>✓ SENT</span>}
            </div>
          </form>

          <div ref={previewRef} className="relative md:sticky md:top-24 md:self-start">
            <Img src="/contact/envelope.webp" alt="" className="pointer-events-none absolute -right-2 -top-8 z-10 w-12 md:w-14" />
            <Img src="/contact/paper-plane.webp" alt="" className="pointer-events-none absolute -right-3 -bottom-4 z-10 w-14 md:w-16" />
            <div className="border-[4px] border-ink bg-lilac shadow-[8px_8px_0_#0A0A0A]">
              <div className="flex items-center gap-2 border-b-[4px] border-ink bg-cream px-3 py-2">
                <span className="h-3 w-3 rounded-full border-2 border-ink bg-pink" />
                <span className="font-mono text-xs uppercase text-ink">CHAT PREVIEW</span>
              </div>
              <div className="p-4">
                <div className="max-w-[95%] border-[3px] border-ink bg-gold p-4 shadow-[4px_4px_0_#0A0A0A]">
                  {bubble.map((line, i) => (
                    <p key={i} className="font-body text-sm leading-relaxed text-ink">{line}</p>
                  ))}
                </div>
                {typing && (
                  <div className="mt-3 flex gap-1" aria-hidden="true">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="h-2 w-2 rounded-full bg-ink motion-safe:animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
