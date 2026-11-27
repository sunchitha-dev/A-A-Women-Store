import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import gsap from 'gsap'
import type { CartItem } from '../../store/cart'
import { useCart } from '../../store/cart'
import { aboutConfig } from '../../data/aboutConfig'
import { products } from '../../data/products'
import Reveal from '../Reveal'

const WA = '917904733345'
const ZIG = 'polygon(0 0,5% 8px,10% 0,15% 8px,20% 0,25% 8px,30% 0,35% 8px,40% 0,45% 8px,50% 0,55% 8px,60% 0,65% 8px,70% 0,75% 8px,80% 0,85% 8px,90% 0,95% 8px,100% 0,100% calc(100% - 8px),95% 100%,90% calc(100% - 8px),85% 100%,80% calc(100% - 8px),75% 100%,70% calc(100% - 8px),65% 100%,60% calc(100% - 8px),55% 100%,50% calc(100% - 8px),45% 100%,40% calc(100% - 8px),35% 100%,30% calc(100% - 8px),25% 100%,20% calc(100% - 8px),15% 100%,10% calc(100% - 8px),5% 100%,0 calc(100% - 8px))'

function findProduct(id: string) { return products.find((p) => p.id === id) }

type Props = { items: CartItem[]; subtotal: number; compact?: boolean }

export default function Receipt({ items, subtotal }: Props) {
  const clear = useCart((s) => s.clear)
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [now, setNow] = useState(() => new Date())
  const [mode, setMode] = useState<'PICKUP IN STORE' | 'LOCAL DELIVERY'>('PICKUP IN STORE')
  const [pay, setPay] = useState(aboutConfig.payments[0] ?? 'Cash')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [pincode, setPincode] = useState('')
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)
  const [cleared, setCleared] = useState(false)
  const stampRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const totalRef = useRef<HTMLSpanElement>(null)
  const prevSub = useRef(subtotal)
  const prevKeys = useRef<Record<string, number>>({})
  const lineRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const printed = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(id) }, [])

  const lines = useMemo(() => items.map((i, idx) => {
    const p = findProduct(i.id)
    const nm = (i.name ?? p?.name ?? i.id).toUpperCase()
    const price = (i.price ?? p?.price ?? 0) * i.qty
    const k = `${i.id}::${i.size ?? ''}`
    return { k, text: `${String(idx + 1).padStart(2, '0')} ${nm} size ${i.size ?? 'M'} x${i.qty}`, price }
  }), [items])

  useEffect(() => {
    const el = totalRef.current
    if (!el) return
    if (reduced) { el.textContent = `Rs. ${subtotal.toLocaleString('en-IN')}`; prevSub.current = subtotal; return }
    const obj = { v: prevSub.current }
    const tw = gsap.to(obj, { v: subtotal, duration: 0.4, ease: 'power2.out', onUpdate: () => { if (el) el.textContent = `Rs. ${Math.round(obj.v).toLocaleString('en-IN')}` } })
    prevSub.current = subtotal
    return () => { tw.kill() }
  }, [subtotal, reduced])

  useEffect(() => {
    if (reduced) { printed.current = true; return }
    if (printed.current) return
    const els = Object.values(lineRefs.current).filter(Boolean) as HTMLDivElement[]
    if (!els.length) return
    printed.current = true
    gsap.fromTo(els, { y: -12, autoAlpha: 0, clipPath: 'inset(0 0 100% 0)' }, { y: 0, autoAlpha: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.25, stagger: 0.12, ease: 'power2.out' })
  }, [lines, reduced])

  useEffect(() => {
    lines.forEach((l) => {
      const prev = prevKeys.current[l.k]
      if (prev !== undefined && prev !== l.price) {
        const el = lineRefs.current[l.k]
        if (el && !reduced) { gsap.fromTo(el, { backgroundColor: '#D4AF55' }, { backgroundColor: 'transparent', duration: 0.3, clearProps: 'backgroundColor' }) }
      }
      prevKeys.current[l.k] = l.price
    })
  }, [lines, reduced])

  const receiptText = useMemo(() => {
    const head = ['A & A WOMEN STORE', 'OLD PALLAVARAM, CHENNAI', now.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }), '']
    const body = lines.map((l) => `${l.text} ........ Rs. ${l.price.toLocaleString('en-IN')}`)
    const foot = ['', `ITEMS ${items.reduce((n, i) => n + i.qty, 0)}`, `TOTAL Rs. ${subtotal.toLocaleString('en-IN')}`, '', `Name: ${name}`, `Phone: ${phone}`, `Mode: ${mode}`, ...(mode === 'LOCAL DELIVERY' ? [`Address: ${address}`, `Pincode: ${pincode}`] : []), `Payment: ${pay}`, ...(note.trim() ? [`Note: ${note.trim()}`] : [])]
    return [...head, ...body, ...foot].join('\n')
  }, [lines, items, subtotal, now, name, phone, mode, address, pincode, pay, note])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Name required'
    if (!/^\d{10}$/.test(phone.replace(/\s/g, ''))) e.phone = 'Enter 10-digit phone'
    if (mode === 'LOCAL DELIVERY' && !address.trim()) e.address = 'Address required'
    if (mode === 'LOCAL DELIVERY' && !/^\d{6}$/.test(pincode.replace(/\s/g, ''))) e.pincode = 'Enter 6-digit pincode'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const placeOrder = (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    const w = window.open('about:blank', '_blank')
    const url = `https://wa.me/${WA}?text=${encodeURIComponent(receiptText)}`
    const stamp = stampRef.current
    const wrap = wrapRef.current
    if (stamp && !reduced) {
      gsap.fromTo(stamp, { scale: 2.2, rotate: -10, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'power4.out' })
      if (wrap) gsap.fromTo(wrap, { x: -4 }, { x: 0, duration: 0.3, ease: 'elastic.out(1,0.3)', clearProps: 'transform' })
    } else if (stamp) { stamp.style.opacity = '1'; stamp.style.transform = 'scale(1) rotate(-10deg)' }
    setSent(true)
    if (w) w.location.href = url
    else window.location.href = url
  }

  const tryFirst = () => {
    const msg = `Hi! I'd like to try these looks in store:\n${lines.map((l) => `- ${l.text}`).join('\n')}`
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="space-y-6">
      <div ref={wrapRef} className="relative bg-cream border-[3px] border-dashed border-ink font-mono text-sm text-ink p-5 pt-8 pb-8" style={{ clipPath: ZIG }}>
        <div ref={stampRef} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-[4px] border-pink px-4 py-2 font-display text-3xl uppercase text-pink" style={{ opacity: 0, transform: 'scale(2.2) rotate(-10deg)', background: 'rgba(255,246,224,0.9)' }} aria-hidden={!sent}>ORDER SENT</div>
        <p className="font-display text-lg uppercase text-center">A &amp; A WOMEN STORE</p>
        <p className="text-center text-xs uppercase">OLD PALLAVARAM, CHENNAI</p>
        <p className="text-center text-xs mt-1">{now.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
        <div className="mt-4 border-t border-dashed border-ink pt-3 space-y-2">
          {lines.map((l) => (
            <div key={l.k} ref={(el) => { lineRefs.current[l.k] = el }} className="flex justify-between gap-2">
              <span className="uppercase break-words">{l.text}</span>
              <span className="shrink-0">Rs. {l.price.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t border-dashed border-ink pt-3 space-y-1">
          <div className="flex justify-between"><span>ITEMS</span><span>{items.reduce((n, i) => n + i.qty, 0)}</span></div>
          <div className="flex justify-between items-baseline pt-2">
            <span className="font-display text-2xl">TOTAL</span>
            <span ref={totalRef} className="font-display text-3xl">Rs. {subtotal.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <form className="nb-card bg-white p-5 space-y-4" onSubmit={placeOrder} noValidate>
        <div className="flex flex-wrap gap-2">
          {(['PICKUP IN STORE', 'LOCAL DELIVERY'] as const).map((m) => (
            <button key={m} type="button" data-active={mode === m} aria-pressed={mode === m} className="nb-chip font-mono text-xs" onClick={() => setMode(m)}>{m}</button>
          ))}
        </div>
        <label className="block"><span className="mb-1 block font-mono text-xs uppercase">Name *</span><input className="nb-input w-full" value={name} onChange={(e) => setName(e.target.value)} aria-label="Name" />{errors.name && <span className="mt-1 block font-mono text-xs text-pink">{errors.name}</span>}</label>
        <label className="block"><span className="mb-1 block font-mono text-xs uppercase">Phone *</span><input className="nb-input w-full" value={phone} onChange={(e) => setPhone(e.target.value)} aria-label="Phone" inputMode="numeric" />{errors.phone && <span className="mt-1 block font-mono text-xs text-pink">{errors.phone}</span>}</label>
        {mode === 'LOCAL DELIVERY' && (
          <>
            <label className="block"><span className="mb-1 block font-mono text-xs uppercase">Address *</span><input className="nb-input w-full" value={address} onChange={(e) => setAddress(e.target.value)} aria-label="Address" />{errors.address && <span className="mt-1 block font-mono text-xs text-pink">{errors.address}</span>}</label>
            <label className="block"><span className="mb-1 block font-mono text-xs uppercase">Pincode *</span><input className="nb-input w-full" value={pincode} onChange={(e) => setPincode(e.target.value)} aria-label="Pincode" inputMode="numeric" />{errors.pincode && <span className="mt-1 block font-mono text-xs text-pink">{errors.pincode}</span>}</label>
          </>
        )}
        <div><p className="mb-2 font-mono text-xs uppercase">Payment preference</p><div className="flex flex-wrap gap-2">{aboutConfig.payments.map((p) => <button key={p} type="button" data-active={pay === p} aria-pressed={pay === p} className="nb-chip font-mono text-[10px]" onClick={() => setPay(p)}>{p}</button>)}</div></div>
        <label className="block"><Reveal as="span" className="mb-1 block font-mono text-xs uppercase">Order note</Reveal><textarea className="nb-input w-full min-h-24" value={note} onChange={(e) => setNote(e.target.value)} aria-label="Order note" /></label>
        <button type="submit" className="nb-btn nb-btn-pink w-full text-base">PLACE ORDER ON WHATSAPP</button>
        {sent && !cleared && <button type="button" className="nb-btn nb-btn-ink w-full" onClick={() => { clear(); setCleared(true) }}>CLEAR BAG</button>}
        <button type="button" className="w-full text-center font-mono text-xs uppercase underline underline-offset-2" onClick={tryFirst}>Want to try first? Tell the shop</button>
      </form>
    </div>
  )
}
