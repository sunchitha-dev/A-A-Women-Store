import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCart, type CartItem as Item } from '../store/cart'
import { products } from '../data/products'
import { aboutConfig } from '../data/aboutConfig'
import SplitWords from '../components/motion/SplitWords'
import Parallax from '../components/motion/Parallax'
import CartItemCard from '../components/cart/CartItem'
import Receipt from '../components/cart/Receipt'
import CartCTA from '../components/cart/CartCTA'


gsap.registerPlugin(ScrollTrigger)

// TODO: prices are placeholders from catalog; show as given until shop confirms
const priceMap = Object.fromEntries(products.map((p) => [p.id, p.price]))

type Toast = { item: Item; index: number }

function OrderNote() {
  const [note, setNote] = useState('')
  const send = () => {
    const text = note.trim()
    if (!text) return
    window.open(`https://wa.me/917904733345?text=${encodeURIComponent(`ORDER NOTE:\n${text}`)}`, '_blank', 'noopener')
  }
  return (
    <section className="mt-12">
      <SplitWords as="h2" className="font-display text-3xl uppercase md:text-4xl">ORDER NOTE</SplitWords>
      <div className="nb-card mt-6 bg-cream p-4 sm:p-6">
        <label htmlFor="order-note" className="font-mono text-xs uppercase tracking-widest text-ink">Add a note for your order</label>
        <textarea
          id="order-note"
          className="nb-input mt-3 min-h-32 w-full resize-y bg-white font-mono text-sm"
          placeholder="Size, fit, delivery, or any request..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className="nb-btn nb-btn-pink" onClick={send} disabled={!note.trim()}>SEND NOTE</button>
        </div>
      </div>
    </section>
  )
}

export default function Cart() {
  const items = useCart((s) => s.items)
  const [toast, setToast] = useState<Toast | null>(null)
  const timerRef = useRef<number | null>(null)
  const count = items.reduce((n, i) => n + i.qty, 0)
  const subtotal = items.reduce((s, i) => s + (i.price ?? priceMap[i.id] ?? 0) * i.qty, 0)
  const prevSub = useRef(subtotal)
  useEffect(() => {
    if (prevSub.current === subtotal) return
    prevSub.current = subtotal
    const live = document.getElementById('cart-live')
    if (live) live.textContent = `Total Rs. ${subtotal.toLocaleString('en-IN')}`
  }, [subtotal])



  useEffect(() => () => { if (timerRef.current) window.clearTimeout(timerRef.current) }, [])

  const marqueeText = useMemo(() => {
    const pay = aboutConfig.payments.map((p) => p.replace(' / NFC mobile payments', ' / UPI')).join(' ✦ ')
    return `PICKUP ✦ LOCAL DELIVERY ✦ ${pay.toUpperCase()} ✦ `
  }, [])

  const onRemove = (item: Item, index: number) => {
    useCart.setState((s) => ({ items: s.items.filter((i) => !(i.id === item.id && i.size === item.size)) }))
    if (timerRef.current) window.clearTimeout(timerRef.current)
    setToast({ item, index })
    const live = document.getElementById('cart-live')
    if (live) live.textContent = `Removed ${item.name ?? item.id}`
    timerRef.current = window.setTimeout(() => setToast(null), 5000)
  }

  const undo = () => {
    if (!toast) return
    if (timerRef.current) window.clearTimeout(timerRef.current)
    useCart.setState((s) => {
      const next = [...s.items]
      const idx = Math.min(toast.index, next.length)
      next.splice(idx, 0, toast.item)
      return { items: next }
    })
    setToast(null)
  }

  if (items.length === 0) {
    return (
      <div className="bg-cream" style={{ backgroundImage: 'linear-gradient(rgba(10,10,10,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.08) 1px, transparent 1px)', backgroundSize: '40px 40px', overflowX: 'clip' }}>
        <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
          <div className="relative">
            <SplitWords as="h1" className="font-display uppercase [font-size:clamp(3rem,9vw,8rem)] leading-[0.9]">YOUR BAG</SplitWords>
            <span data-bag-count className="nb-sticker inline-block mt-4" style={{ background: '#FF4D8D', transform: 'rotate(-4deg)' }}>0 ITEMS</span>
          </div>
        </div>
        <div className="mt-8 nb-marquee bg-gold border-y-[3px] border-ink" aria-label="Store info">
          <div className="nb-marquee-track">
            {Array.from({ length: 8 }).map((_, i) => <span key={i} className="px-6 py-3 font-mono text-xs uppercase text-ink">{marqueeText}</span>)}
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:gap-16 lg:grid-cols-[1fr_360px]">
            <div className="min-w-0" />
            <div className="lg:block">
              <div className="nb-card bg-cream p-8 text-center">
                <img src="/about-media/bags.webp" alt="" aria-hidden="true" className="mx-auto w-28 md:w-36" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                <p className="mt-6 font-display text-3xl uppercase md:text-4xl">YOUR BAG IS EMPTY</p>
                <Link to="/shop" className="nb-btn bg-gold mt-6 inline-flex">SHOP LOOKS</Link>
              </div>
            </div>
          </div>
        </div>
        <CartCTA />
      </div>
    )
  }

  return (
    <div className="bg-cream" style={{ backgroundImage: 'linear-gradient(rgba(10,10,10,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.08) 1px, transparent 1px)', backgroundSize: '40px 40px', overflowX: 'clip' }}>
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <div className="relative">
          <img src="/about-media/gift-box.webp" alt="" aria-hidden="true" className="absolute -top-2 right-16 hidden w-16 md:block" onError={(e) => { e.currentTarget.style.display = 'none' }} />
          <img src="/contact-media/sparkle.webp" alt="" aria-hidden="true" className="absolute top-0 right-0 hidden w-10 md:block" onError={(e) => { e.currentTarget.style.display = 'none' }} />
          <div className="absolute -left-2 top-8 hidden md:block" aria-hidden="true">
            <Parallax speed={0.15}><img src="/contact-media/heart.webp" alt="" className="w-10" onError={(e) => { e.currentTarget.style.display = 'none' }} /></Parallax>
          </div>
          <div className="absolute left-24 -bottom-4 hidden md:block" aria-hidden="true">
            <Parallax speed={0.1}><img src="/contact-media/heart.webp" alt="" className="w-7" onError={(e) => { e.currentTarget.style.display = 'none' }} /></Parallax>
          </div>
          <SplitWords as="h1" className="font-display uppercase [font-size:clamp(3rem,9vw,8rem)] leading-[0.9]">YOUR BAG</SplitWords>
          <span data-bag-count className="nb-sticker inline-block mt-4" style={{ background: '#FF4D8D', transform: 'rotate(-4deg)' }}>{count} {count === 1 ? 'ITEM' : 'ITEMS'}</span>
        </div>
      </div>

      <div className="mt-8 nb-marquee bg-gold border-y-[3px] border-ink" aria-label="Store info">
        <div className="nb-marquee-track">
          {Array.from({ length: 8 }).map((_, i) => <span key={i} className="px-6 py-3 font-mono text-xs uppercase text-ink">{marqueeText}</span>)}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <p id="cart-live" className="sr-only" aria-live="polite" aria-atomic="true" />

        <div className="grid gap-10 lg:gap-16 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0">
            <ul className="space-y-4">
              {items.map((item, i) => (
                <CartItemCard key={`${item.id}::${item.size ?? ''}`} item={item} index={i} onRemove={onRemove} />
              ))}
            </ul>
            <OrderNote />
          </div>

          <div id="receipt" className="lg:block">
            <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:overflow-x-hidden lg:overscroll-contain" data-lenis-prevent>
              <Receipt items={items} subtotal={subtotal} />
            </div>
          </div>
        </div>
      </div>
      <CartCTA />

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t-[3px] border-ink bg-cream p-4 flex items-center justify-between gap-4">
        <p className="font-mono text-sm font-bold uppercase">TOTAL Rs.{subtotal.toLocaleString('en-IN')}</p>
        <button type="button" className="nb-btn nb-btn-pink" onClick={() => document.getElementById('receipt')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>PLACE ORDER</button>
      </div>
      <div className="lg:hidden h-24 bg-ink" />

      {toast && (
        <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-ink text-cream border-[3px] border-ink px-5 py-3 font-mono text-sm uppercase flex items-center gap-4 shadow-nb">
          <span>REMOVED. <span className="sr-only">{toast.item.name ?? toast.item.id}</span></span>
          <button type="button" className="underline underline-offset-2" onClick={undo}>UNDO</button>
        </div>
      )}
    </div>
  )
}
