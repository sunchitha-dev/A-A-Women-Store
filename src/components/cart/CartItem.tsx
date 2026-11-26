import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import type { CartItem as Item } from '../../store/cart'
import { useCart } from '../../store/cart'
import { products } from '../../data/products'

const BG = ['bg-gold', 'bg-pink', 'bg-lilac', 'bg-cream']
const SIZES = ['S', 'M', 'L', 'XL']
const BURST = ['#FF4D8D', '#D4AF55', '#0A0A0A']

type Props = {
  item: Item
  index: number
  onRemove: (item: Item, index: number) => void
}

function findProduct(id: string) { return products.find((p) => p.id === id) }

export default function CartItem({ item, index, onRemove }: Props) {
  const { setQty, setSize } = useCart()
  const cardRef = useRef<HTMLLIElement>(null)
  const totalRef = useRef<HTMLSpanElement>(null)
  const prevTotal = useRef<number | null>(null)
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const p = findProduct(item.id)
  const name = item.name ?? p?.name ?? item.id
  const code = item.code ?? p?.code ?? item.id
  const price = item.price ?? p?.price ?? 0
  const img = item.image ?? p?.image ?? `/tryon/${item.id}.webp`
  const total = price * item.qty

  useLayoutEffect(() => {
    const el = cardRef.current
    if (!el || reduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power4.out', delay: index * 0.08, clearProps: 'transform' })
    }, el)
    return () => ctx.revert()
  }, [index, reduced])

  useEffect(() => {
    const el = totalRef.current
    if (!el) return
    if (prevTotal.current === null) { el.textContent = `₹${total}`; prevTotal.current = total; return }
    if (prevTotal.current === total) return
    if (reduced) { el.textContent = `₹${total}`; prevTotal.current = total; return }
    const obj = { v: prevTotal.current }
    const tw = gsap.to(obj, {
      v: total, duration: 0.4, ease: 'power2.out',
      onUpdate: () => { if (el) el.textContent = `₹${Math.round(obj.v)}` },
    })
    prevTotal.current = total
    return () => { tw.kill() }
  }, [total, reduced])

  const burstAndRemove = () => {
    const el = cardRef.current
    if (!el || reduced) { onRemove(item, index); return }
    const rect = el.getBoundingClientRect()
    const host = document.createElement('div')
    host.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999'
    document.body.appendChild(host)
    const pieces = Array.from({ length: 24 }, () => {
      const s = document.createElement('div')
      const size = 8 + Math.random() * 10
      s.style.cssText = `position:absolute;width:${size}px;height:${size}px;background:${BURST[Math.floor(Math.random() * BURST.length)]};border:2px solid #0A0A0A;left:${rect.left + rect.width / 2}px;top:${rect.top + rect.height / 2}px`
      host.appendChild(s)
      return s
    })
    gsap.to(el, { x: 40, autoAlpha: 0, duration: 0.2, ease: 'power2.in' })
    gsap.to(pieces, {
      x: () => (Math.random() - 0.5) * 260,
      y: () => (Math.random() - 0.5) * 220,
      rotation: () => (Math.random() - 0.5) * 360,
      autoAlpha: 0,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => { host.remove() },
    })
    window.setTimeout(() => onRemove(item, index), 220)
  }

  return (
    <li ref={cardRef} className={`nb-card flex gap-4 p-4 ${BG[index % BG.length]}`} style={{ borderWidth: 4 }}>
      <div className="relative shrink-0 w-28 sm:w-32">
        <div className="relative border-[3px] border-ink bg-lilac p-2 aspect-[3/4] flex items-end justify-center overflow-hidden">
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[70%] h-4 bg-gold border-2 border-ink rounded-[50%]" aria-hidden="true" />
          <img
            src={img}
            alt={name}
            className="relative z-10 max-h-full w-full object-contain"
            style={{ filter: 'drop-shadow(6px 6px 0 #0A0A0A)' }}
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `/tryon/${item.id}.webp` }}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-display text-lg uppercase leading-tight sm:text-xl">{name}</p>
            <p className="font-mono text-xs uppercase">{code}</p>
          </div>
          <button type="button" className="nb-btn nb-btn-ink !px-3 !py-2 text-sm shrink-0" aria-label={`Remove ${name}`} onClick={burstAndRemove}>X</button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={`Size for ${name}`}>
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              data-active={item.size === s}
              aria-pressed={item.size === s}
              className="nb-chip font-mono text-xs px-3 py-2 min-w-[48px]"
              onClick={() => setSize(item.id, item.size, s)}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
          <div className="flex items-center gap-2">
            <button type="button" className="nb-chip w-12 h-12 font-mono text-lg" aria-label={`Decrease qty ${name}`} onClick={() => setQty(item.id, item.size, item.qty - 1)}>−</button>
            <span className="font-mono text-base w-6 text-center">{item.qty}</span>
            <button type="button" className="nb-chip w-12 h-12 font-mono text-lg" aria-label={`Increase qty ${name}`} onClick={() => setQty(item.id, item.size, item.qty + 1)}>+</button>
          </div>
          <span ref={totalRef} className="ml-auto font-mono text-base font-bold">₹{total}</span>
        </div>
      </div>
    </li>
  )
}
