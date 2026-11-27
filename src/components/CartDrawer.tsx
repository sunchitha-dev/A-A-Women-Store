import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useCart } from '../store/cart'
import { products } from '../data/products'
import Reveal from './Reveal'

const WA = '917904733345'
const priceMap = Object.fromEntries(products.map((p) => [p.id, p.price]))

function findProduct(id: string) {
  return products.find((p) => p.id === id)
}

export default function CartDrawer() {
  const { items, drawerOpen, closeDrawer, setQty, remove } = useCart()
  const panelRef = useRef<HTMLElement>(null)
  const [reduced, setReduced] = useState(false)
  const subtotal = items.reduce((s, i) => s + (i.price ?? priceMap[i.id] ?? 0) * i.qty, 0)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!drawerOpen || reduced || !panelRef.current) return
    gsap.fromTo(panelRef.current, { x: '100%' }, { x: 0, duration: 0.25, ease: 'power2.out' })
  }, [drawerOpen, reduced])

  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [drawerOpen, closeDrawer])

  if (!drawerOpen) return null

  const waText = encodeURIComponent(
    `Hi! I'd like to order from A & A Women Store:\n${items
      .map((i) => {
        const p = findProduct(i.id)
        const name = i.name ?? p?.name ?? i.id
        const code = i.code ?? p?.code ?? i.id
        return `- ${name} (${code})${i.size ? `, size ${i.size}` : ''}${i.details ? `, ${i.details}` : ''}, qty ${i.qty}`
      })
      .join('\n')}\nTotal: ₹${subtotal}`,
  )

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        className="absolute inset-0 bg-transparent"
        aria-label="Close cart drawer"
        onClick={closeDrawer}
      />
      <aside
        ref={panelRef}
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l-4 border-ink bg-cream shadow-[-10px_0_0_0_#0A0A0A]"
        role="dialog"
        aria-modal="true"
        aria-label="Cart"
      >
        <div className="flex items-center justify-between border-b-3 border-ink px-4 py-4">
          <Reveal><h2 className="font-display text-2xl uppercase">Your Cart</h2></Reveal>
          <button type="button" className="nb-btn px-3 py-1 text-sm" onClick={closeDrawer} aria-label="Close cart">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4" data-lenis-prevent>
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center px-2">
              <div className="nb-card bg-lilac p-4 mb-6 rotate-[-2deg]">
                <img src="/about/bags.webp" alt="" aria-hidden="true" className="w-28 h-28 object-contain mx-auto" onError={(e) => { e.currentTarget.style.display = 'none' }} />
              </div>
              <p className="font-display text-3xl uppercase leading-tight">YOUR BAG<br />IS EMPTY</p>
              <p className="mt-3 font-mono text-xs uppercase tracking-widest text-ink/70">Time to fill it with something cute.</p>
              <Link to="/shop" className="nb-btn bg-gold mt-6" onClick={closeDrawer}>SHOP LOOKS</Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((i) => {
                const p = findProduct(i.id)
                const name = i.name ?? p?.name ?? i.id
                const code = i.code ?? p?.code ?? i.id
                const img = i.image ?? p?.image ?? ''
                const price = i.price ?? p?.price ?? 0
                const k = `${i.id}::${i.size ?? ''}`
                return (
                  <li key={k} className="flex gap-3 border-b-3 border-ink pb-4">
                    <img
                      src={img}
                      alt={name}
                      className="h-20 w-16 border-3 border-ink object-contain bg-white"
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        if (p) e.currentTarget.src = p.altImage
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-display text-sm uppercase leading-tight">{name}</p>
                      <p className="font-mono text-xs uppercase">{code}</p>
                      {i.size && <p className="font-mono text-xs uppercase">Size {i.size}</p>}
                      {i.details && <p className="font-mono text-[10px] uppercase">{i.details}</p>}
                      <p className="font-mono text-xs">₹{price}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button type="button" className="nb-chip px-2 py-0.5 font-mono" aria-label={`Decrease qty ${name}`} onClick={() => setQty(i.id, i.size, i.qty - 1)}>−</button>
                        <span className="font-mono text-sm">{i.qty}</span>
                        <button type="button" className="nb-chip px-2 py-0.5 font-mono" aria-label={`Increase qty ${name}`} onClick={() => setQty(i.id, i.size, i.qty + 1)}>+</button>
                        <button type="button" className="ml-auto font-mono text-xs uppercase underline" onClick={() => remove(i.id, i.size)}>Remove</button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t-3 border-ink p-4 space-y-3">
            <div className="flex items-center justify-between font-mono text-sm uppercase">
              <span>Subtotal</span>
              <span className="font-bold">₹{subtotal}</span>
            </div>
            <Link to="/cart" className="nb-btn nb-btn-ink block text-center" onClick={closeDrawer}>
              VIEW CART
            </Link>
            <a
              href={`https://wa.me/${WA}?text=${waText}`}
              target="_blank"
              rel="noreferrer"
              className="nb-btn block text-center"
            >
              ORDER ON WHATSAPP
            </a>
          </div>
        )}
      </aside>
    </div>
  )
}
