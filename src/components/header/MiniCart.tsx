import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useCart, useCartCount } from '../../store/cart'
import { products } from '../../data/products'
import { startLenis, stopLenis } from '../../lib/lenis'
import { useFocusTrap } from '../../lib/useFocusTrap'
import { useLockBodyScroll } from '../../lib/useLockBodyScroll'

type Props = { open: boolean; onClose: () => void }
const WA = '917904733345'
const priceMap = Object.fromEntries(products.map((p) => [p.id, p.price]))

export default function MiniCart({ open, onClose }: Props) {
  const { items, setQty, remove } = useCart()
  const count = useCartCount()
  const ref = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [rendered, setRendered] = useState(false)
  const [announce, setAnnounce] = useState('')
  const [removing, setRemoving] = useState<Record<string, boolean>>({})
  const subtotal = items.reduce((s, i) => s + (i.price ?? priceMap[i.id] ?? 0) * i.qty, 0)
  const [displayTotal, setDisplayTotal] = useState(subtotal)
  const prevCount = useRef(count)
  const totalObj = useRef({ v: subtotal })
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const shownTotal = reduced ? subtotal : displayTotal

  useFocusTrap(ref, open)
  useLockBodyScroll(open)

  if (open && !rendered) setRendered(true)
  if (!open && rendered && reduced) setRendered(false)

  useEffect(() => {
    if (count > prevCount.current) setAnnounce('1 item added')
    prevCount.current = count
    const t = window.setTimeout(() => setAnnounce(''), 1200)
    return () => window.clearTimeout(t)
  }, [count])

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
    const el = ref.current
    if (!el) return
    if (open) {
      if (reduced) { gsap.set(el, { x: 0 }); return }
      gsap.fromTo(el, { x: '100%' }, { x: '0%', duration: 0.48, ease: 'cubic-bezier(0.2,0,0,1)', overwrite: 'auto' })
      const rows = listRef.current?.querySelectorAll<HTMLElement>('[data-cart-row]')
      if (rows?.length) gsap.fromTo(rows, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.24, stagger: 0.05, delay: 0.2, ease: 'power2.out', overwrite: 'auto' })
    } else if (rendered) {
      if (reduced) return
      gsap.to(el, { x: '100%', duration: 0.24, ease: 'cubic-bezier(0.2,0,0,1)', overwrite: 'auto', onComplete: () => setRendered(false) })
    }
  }, [open, rendered, reduced])

  useEffect(() => {
    if (reduced) { totalObj.current.v = subtotal; return }
    gsap.to(totalObj.current, { v: subtotal, duration: 0.3, ease: 'power2.out', overwrite: 'auto', onUpdate: () => setDisplayTotal(Math.round(totalObj.current.v)) })
  }, [subtotal, reduced])

  const onRemove = (id: string, size?: string) => {
    const k = `${id}::${size ?? ''}`
    if (removing[k]) return
    if (reduced) { remove(id, size); return }
    const row = listRef.current?.querySelector<HTMLElement>(`[data-cart-key="${CSS.escape(k)}"]`)
    setRemoving((m) => ({ ...m, [k]: true }))
    if (!row) { remove(id, size); return }
    gsap.to(row, { height: 0, opacity: 0, duration: 0.24, ease: 'power2.inOut', onComplete: () => { remove(id, size); setRemoving((m) => { const n = { ...m }; delete n[k]; return n }) } })
  }

  if (!open && !rendered) return null

  const waText = encodeURIComponent(
    `Hi! I'd like to order from A & A Women Store:\n${items
      .map((i) => {
        const p = products.find((x) => x.id === i.id)
        const name = i.name ?? p?.name ?? i.id
        return `- ${name}${i.size ? `, size ${i.size}` : ''}, qty ${i.qty}`
      })
      .join('\n')}\nTotal: ₹${subtotal}`
  )

  return (
    <div className="fixed inset-0 z-[200]" aria-hidden={!open}>
      <div className="sr-only" aria-live="polite">{announce}</div>
      <button type="button" className="absolute inset-0 bg-ink/25" style={{ zIndex: 199 }} aria-label="Close bag" onClick={onClose} />
      <aside
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        className={`absolute right-0 top-0 flex h-full w-full sm:w-96 max-w-full flex-col bg-cream border-l-[4px] border-ink ${open ? '' : 'pointer-events-none'}`}
        style={{ boxShadow: '-10px 0 0 0 #0A0A0A', transform: 'translateX(100%)', zIndex: 200 }}
      >
        <div className="flex items-center justify-between border-b-[3px] border-ink px-4 py-4">
          <div className="flex items-baseline gap-2">
            <h2 className="font-display text-2xl uppercase text-ink">YOUR BAG</h2>
            <span className="font-mono text-xs text-ink/70">({count})</span>
          </div>
          <button type="button" onClick={onClose} aria-label="Close bag" className="flex h-11 w-11 items-center justify-center text-ink hover:text-pink transition-colors duration-[120ms] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="square" /></svg>
          </button>
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4" data-lenis-prevent>
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="nb-sticker bg-pink text-ink text-lg rotate-[-4deg]">EMPTY BAG</span>
              <img src="/hero/handbag.webp" alt="" aria-hidden="true" className="my-6 w-[90px] [animation:aa-float-y_4s_ease-in-out_infinite] motion-reduce:[animation:none]" />
              <p className="font-accent italic text-[24px] text-ink">Nothing here yet.</p>
              <Link to="/shop" onClick={onClose} className="nb-btn bg-gold mt-6">SHOP NOW</Link>
              <style>{`@keyframes aa-float-y { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }`}</style>
            </div>
          ) : (
            <ul className="space-y-0">
              {items.map((i) => {
                const p = products.find((x) => x.id === i.id)
                const name = i.name ?? p?.name ?? i.id
                const code = i.code ?? p?.code ?? i.id
                const img = i.image ?? p?.image ?? ''
                const price = i.price ?? p?.price ?? priceMap[i.id] ?? 0
                const k = `${i.id}::${i.size ?? ''}`
                return (
                  <li key={k} data-cart-row data-cart-key={k} className="flex gap-3 border-b-2 border-ink/20 py-4 overflow-hidden">
                    <img src={img} alt={name} className="h-16 w-12 object-contain border-[3px] border-ink bg-white p-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-[14px] text-ink leading-tight">{name}</p>
                      <p className="font-mono text-[11px] text-ink/60 uppercase">{code}</p>
                      {i.size && <span className="nb-chip !text-[11px] !px-2 !py-0.5 mt-1 inline-block">{i.size}</span>}
                      <div className="mt-2 flex items-center gap-2">
                        <button type="button" aria-label={`Decrease ${name}`} onClick={() => setQty(i.id, i.size, i.qty - 1)} className="flex h-8 w-8 items-center justify-center border-2 border-ink font-mono text-sm active:scale-[0.94] transition-transform duration-[120ms]">−</button>
                        <span className="font-mono text-sm w-6 text-center">{i.qty}</span>
                        <button type="button" aria-label={`Increase ${name}`} onClick={() => setQty(i.id, i.size, i.qty + 1)} className="flex h-8 w-8 items-center justify-center border-2 border-ink font-mono text-sm active:scale-[0.94] transition-transform duration-[120ms]">+</button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between shrink-0">
                      <button type="button" aria-label={`Remove ${name}`} onClick={() => onRemove(i.id, i.size)} className="font-mono text-xs text-ink/60 hover:text-pink">×</button>
                      <p className="font-mono text-sm text-ink">₹{price}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t-[3px] border-ink bg-cream px-4 py-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[12px] uppercase text-ink">TOTAL</span>
              <span className="font-display text-[20px] text-ink">₹{shownTotal}</span>
            </div>
            <p className="font-mono text-[11px] text-ink/60">Local delivery available</p>
            <a href={`https://wa.me/${WA}?text=${waText}`} target="_blank" rel="noreferrer" className="nb-btn nb-btn-pink w-full justify-center">ORDER ON WHATSAPP</a>
          </div>
        )}
      </aside>
    </div>
  )
}
