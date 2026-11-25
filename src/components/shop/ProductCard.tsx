import { useEffect, useRef, useState } from 'react'
import type { Product } from '../../data/products'
import { getDiscount } from '../../data/products'
import { useCart } from '../../store/cart'
import QuickView from './QuickView'

const BG = ['bg-gold', 'bg-pink', 'bg-lilac', 'bg-cream'] as const

type Props = { product: Product; index: number }

export default function ProductCard({ product, index }: Props) {
  const add = useCart((s) => s.add)
  const [open, setOpen] = useState(false)
  const [hover, setHover] = useState(false)
  const [sideOk, setSideOk] = useState(true)
  const [backOk, setBackOk] = useState(true)
  const [hoverView, setHoverView] = useState(0)
  const quickRef = useRef<HTMLButtonElement>(null)
  const off = getDiscount(product)
  const side = `/products/${product.id}_side.webp`
  const back = `/products/${product.id}_back.webp`

  useEffect(() => {
    const s = new Image()
    s.onerror = () => setSideOk(false)
    s.src = side
    const b = new Image()
    b.onerror = () => setBackOk(false)
    b.src = back
  }, [side, back])

  const hViews = [0, sideOk ? 1 : 0, backOk ? 2 : 0].filter((v, i) => i === 0 || v !== 0) as number[]
  useEffect(() => {
    if (!hover || hViews.length < 2) return
    let i = Math.max(0, hViews.indexOf(hoverView))
    const id = setInterval(() => { i = (i + 1) % hViews.length; setHoverView(hViews[i]) }, 900)
    return () => clearInterval(id)
  }, [hover, sideOk, backOk, hoverView]) // eslint-disable-line react-hooks/exhaustive-deps

  const activeView = !hover || !hViews.length ? 0 : hViews.includes(hoverView) ? hoverView : hViews[0]

  return (
    <article className={`nb-card overflow-hidden ${BG[index % BG.length]}`}>
      <div
        className="relative aspect-[3/4] border-b-3 border-ink p-4"
        onMouseEnter={() => { setHover(true); setHoverView(0) }}
        onMouseLeave={() => setHover(false)}
      >
        <span className="nb-sticker absolute left-3 top-3 z-10">SAVE {off}%</span>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-contain transition-opacity duration-100"
          style={{ filter: 'drop-shadow(6px 6px 0 #0A0A0A)', opacity: activeView === 0 ? 1 : 0 }}
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = product.altImage
          }}
        />
        {sideOk && (
          <img
            src={side}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] object-contain transition-opacity duration-100"
            style={{ filter: 'drop-shadow(6px 6px 0 #0A0A0A)', opacity: activeView === 1 ? 1 : 0 }}
          />
        )}
        {backOk && (
          <img
            src={back}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] object-contain transition-opacity duration-100"
            style={{ filter: 'drop-shadow(6px 6px 0 #0A0A0A)', opacity: activeView === 2 ? 1 : 0 }}
          />
        )}
      </div>

      <div className="space-y-2 p-4">
        <h3 className="font-display text-lg uppercase leading-tight">{product.name}</h3>
        <p className="font-mono text-xs uppercase">{product.code}</p>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-base font-bold">₹{product.price}</span>
          <span className="font-mono text-sm line-through opacity-60">₹{product.mrp}</span>
        </div>
        <div className="flex gap-2 pt-1">
          <button
            ref={quickRef}
            type="button"
            className="nb-btn nb-btn-ink flex-1 px-3 py-2 text-xs focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink focus-visible:outline-offset-2"
            aria-label={`Quick view ${product.name}`}
            onClick={() => setOpen(true)}
          >
            QUICK VIEW
          </button>
          <button
            type="button"
            className="nb-btn flex-1 px-3 py-2 text-xs focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink focus-visible:outline-offset-2"
            aria-label={`Add ${product.name} to cart`}
            onClick={() => add(product.id)}
          >
            ADD
          </button>
        </div>
      </div>
      {open && <QuickView product={product} onClose={() => setOpen(false)} triggerRef={quickRef} />}
    </article>
  )
}
