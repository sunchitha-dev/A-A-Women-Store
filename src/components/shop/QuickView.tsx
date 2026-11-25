import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { getDiscount, type Product } from '../../data/products'
import { useCart } from '../../store/cart'
import { startLenis, stopLenis } from '../../lib/lenis'

type Props = {
  product: Product
  onClose: () => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

const WA = '917904733345'
const VIEW_LABELS = ['Front', 'Side', 'Back']

export default function QuickView({ product, onClose, triggerRef }: Props) {
  const views = [product.image, `/products/${product.id}_side.webp`, `/products/${product.id}_back.webp`]
  const [size, setSize] = useState('')
  const [qty, setQty] = useState(1)
  const [err, setErr] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [view, setView] = useState(0)
  const [displayed, setDisplayed] = useState(0)
  const [ok, setOk] = useState<boolean[]>([true, false, false])
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const wipeRef = useRef<HTMLDivElement>(null)
  const busy = useRef(false)
  const touchX = useRef<number | null>(null)
  const add = useCart((s) => s.add)
  const off = getDiscount(product)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    stopLenis()
    return () => startLenis()
  }, [])

  useEffect(() => {
    views.forEach((src, i) => {
      if (i === 0) return
      const img = new Image()
      img.onload = () => setOk((s) => { const n = [...s]; n[i] = true; return n })
      img.onerror = () => setOk((s) => { const n = [...s]; n[i] = false; return n })
      img.src = src
    })
  }, [product.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const prev = document.body.style.overflow
    const trigger = triggerRef.current
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = prev
      trigger?.focus()
    }
  }, [triggerRef])

  useEffect(() => {
    if (reduced || !panelRef.current) return
    gsap.fromTo(panelRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out' })
  }, [reduced])

  const available = views.map((_, i) => ok[i])
  const count = available.filter(Boolean).length

  const changeView = useCallback((next: number) => {
    if (next === view || busy.current || !available[next]) return
    setView(next)
    if (reduced || !wipeRef.current) { setDisplayed(next); return }
    busy.current = true
    const wipe = wipeRef.current
    gsap.killTweensOf(wipe)
    gsap.timeline({ onComplete: () => { busy.current = false } })
      .set(wipe, { xPercent: -101, display: 'block' })
      .to(wipe, { xPercent: 0, duration: 0.2, ease: 'power2.inOut', onComplete: () => setDisplayed(next) })
      .to(wipe, { xPercent: 101, duration: 0.2, ease: 'power2.inOut' })
      .set(wipe, { display: 'none' })
  }, [available, reduced, view])

  const step = useCallback((dir: 1 | -1) => {
    const idxs = available.map((v, i) => v ? i : -1).filter((i) => i >= 0)
    if (idxs.length < 2) return
    const cur = idxs.indexOf(view)
    const next = idxs[(cur + dir + idxs.length) % idxs.length]
    changeView(next)
  }, [available, changeView, view])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); return }
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); return }
      if (e.key !== 'Tab' || !panelRef.current) return
      const els = panelRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      if (!els.length) return
      const first = els[0]
      const last = els[els.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, step])

  const onAdd = () => {
    if (!size) { setErr(true); return }
    add(product.id, size, qty)
    onClose()
  }

  const waText = encodeURIComponent(`Hi! I'd like to order ${product.name} (${product.code}), size ${size || '—'}, qty ${qty} from A & A Women Store.`)
  const imgSrc = available[displayed] ? views[displayed] : product.altImage

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center md:items-center md:p-4"
      style={{ backgroundColor: 'rgba(10,10,10,0.6)' }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view ${product.name}`}
    >
      <div ref={panelRef} className="max-h-[92vh] w-full overflow-y-auto border-4 border-ink bg-cream shadow-nb-lg md:max-w-[820px]" data-lenis-prevent>
        <div className="flex items-center justify-between border-b-3 border-ink px-4 py-3">
          <p className="font-mono text-xs uppercase">Quick View</p>
          <button ref={closeRef} type="button" className="nb-btn px-3 py-1 text-sm" aria-label="Close quick view" onClick={onClose}>✕</button>
        </div>

        <div className="grid md:grid-cols-2">
          <div
            className="relative flex h-72 items-center justify-center overflow-hidden bg-lilac md:h-full md:min-h-[420px]"
            onTouchStart={(e) => { touchX.current = e.touches[0].clientX }}
            onTouchEnd={(e) => {
              if (touchX.current == null) return
              const dx = e.changedTouches[0].clientX - touchX.current
              touchX.current = null
              if (Math.abs(dx) >= 40) step(dx < 0 ? 1 : -1)
            }}
          >
            <div className="absolute bottom-6 left-1/2 h-8 w-[68%] -translate-x-1/2 border-3 border-ink bg-gold shadow-[6px_6px_0_0_#0A0A0A]" style={{ borderRadius: '50%' }} />
            <img
              src={imgSrc}
              alt={`${product.name} ${VIEW_LABELS[displayed]} view`}
              className="relative z-10 h-[82%] w-auto object-contain"
              style={{ filter: 'drop-shadow(6px 6px 0 #0A0A0A)' }}
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = product.altImage }}
            />
            <div ref={wipeRef} className="absolute inset-0 z-20 hidden bg-gold" aria-hidden="true" />

            {count > 1 && (
              <>
                <button type="button" className="nb-btn absolute left-2 top-[150px] z-30 px-3 py-2 text-sm md:top-[210px]" aria-label="Previous view" onClick={() => step(-1)}>◀</button>
                <button type="button" className="nb-btn absolute right-2 top-[150px] z-30 px-3 py-2 text-sm md:top-[210px]" aria-label="Next view" onClick={() => step(1)}>▶</button>
                <div className="absolute bottom-2 left-1/2 z-30 flex -translate-x-1/2 gap-2">
                  {views.map((_, i) => available[i] && (
                    <button
                      key={VIEW_LABELS[i]}
                      type="button"
                      aria-label={VIEW_LABELS[i]}
                      aria-pressed={view === i}
                      onClick={() => changeView(i)}
                      className={`size-4 border-3 border-ink ${view === i ? 'bg-pink' : 'bg-white'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="space-y-4 p-5 md:p-6">
            <div>
              <h2 className="font-display text-3xl uppercase leading-tight">{product.name}</h2>
              <p className="mt-1 font-mono text-sm uppercase">{product.code}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-2xl font-bold">₹{product.price}</span>
              <span className="font-mono text-base line-through opacity-60">₹{product.mrp}</span>
              <span className="nb-sticker">SAVE {off}%</span>
            </div>
            <div>
              <p className="mb-2 font-mono text-xs uppercase">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button key={s} type="button" data-active={size === s} className="nb-chip focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink focus-visible:outline-offset-2 px-4 py-2 font-mono text-sm" aria-label={`Size ${s}`} aria-pressed={size === s} onClick={() => { setSize(s); setErr(false) }}>{s}</button>
                ))}
              </div>
              {err && <p className="mt-2 font-mono text-sm uppercase text-pink">PICK A SIZE</p>}
            </div>
            <div>
              <p className="mb-2 font-mono text-xs uppercase">Qty</p>
              <div className="inline-flex border-3 border-ink">
                <button type="button" className="nb-chip focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink focus-visible:outline-offset-2 border-0 border-r-3 px-4 py-2 text-lg" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <span className="w-14 bg-white py-2 text-center font-mono text-lg">{qty}</span>
                <button type="button" className="nb-chip focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink focus-visible:outline-offset-2 border-0 border-l-3 px-4 py-2 text-lg" aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)}>+</button>
              </div>
            </div>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button type="button" className="nb-btn flex-1 bg-gold" onClick={onAdd}>ADD TO CART</button>
              <a href={`https://wa.me/${WA}?text=${waText}`} target="_blank" rel="noreferrer" className="nb-btn nb-btn-ink flex-1 text-center">ORDER ON WHATSAPP</a>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
