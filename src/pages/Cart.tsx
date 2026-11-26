import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCart, type CartItem as Item } from '../store/cart'
import { products } from '../data/products'
import { aboutConfig } from '../data/aboutConfig'
import SplitWords from '../components/motion/SplitWords'
import Parallax from '../components/motion/Parallax'
import CartItemCard from '../components/cart/CartItem'
import Receipt from '../components/cart/Receipt'
import EmptyBag from '../components/cart/EmptyBag'
import Suggestions from '../components/cart/Suggestions'
import { startLenis, stopLenis } from '../lib/lenis'

gsap.registerPlugin(ScrollTrigger)

// TODO: prices are placeholders from catalog; show as given until shop confirms
const priceMap = Object.fromEntries(products.map((p) => [p.id, p.price]))

type Toast = { item: Item; index: number }

export default function Cart() {
  const items = useCart((s) => s.items)
  const [toast, setToast] = useState<Toast | null>(null)
  const [sheet, setSheet] = useState(false)
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

  useEffect(() => {
    if (!sheet) return
    stopLenis()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSheet(false) }
    document.addEventListener('keydown', onKey)
    return () => { startLenis(); document.removeEventListener('keydown', onKey) }
  }, [sheet])

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
      <div className="bg-cream min-h-[60vh]">
        <EmptyBag />
        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6"><Suggestions /></div>
      </div>
    )
  }

  return (
    <div className="bg-cream" style={{ backgroundImage: 'linear-gradient(rgba(10,10,10,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.08) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
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
            <Suggestions />
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto overflow-x-hidden overscroll-contain" data-lenis-prevent>
              <Receipt items={items} subtotal={subtotal} />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t-[3px] border-ink bg-cream p-4 flex items-center justify-between gap-4">
        <p className="font-mono text-sm font-bold uppercase">TOTAL Rs.{subtotal.toLocaleString('en-IN')}</p>
        <button type="button" className="nb-btn nb-btn-pink" onClick={() => setSheet(true)}>PLACE ORDER</button>
      </div>
      <div className="lg:hidden h-24" />

      {sheet && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close receipt" onClick={() => setSheet(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto bg-cream border-t-[4px] border-ink p-4 pb-8" data-lenis-prevent>
            <div className="flex justify-between items-center mb-4">
              <p className="font-display text-xl uppercase">Receipt</p>
              <button type="button" className="nb-btn nb-btn-ink !px-3 !py-1" onClick={() => setSheet(false)} aria-label="Close">X</button>
            </div>
            <Receipt items={items} subtotal={subtotal} compact />
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-ink text-cream border-[3px] border-ink px-5 py-3 font-mono text-sm uppercase flex items-center gap-4 shadow-nb">
          <span>REMOVED. <span className="sr-only">{toast.item.name ?? toast.item.id}</span></span>
          <button type="button" className="underline underline-offset-2" onClick={undo}>UNDO</button>
        </div>
      )}
    </div>
  )
}
