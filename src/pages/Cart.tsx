import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../store/cart'
import { products } from '../data/products'

const WA = '917904733345'
const priceMap = Object.fromEntries(products.map((p) => [p.id, p.price]))
const CARDS = ['Store pickup', 'Local delivery', 'Custom tailoring', 'Cash / Card / UPI']

function findProduct(id: string) {
  return products.find((p) => p.id === id)
}

export default function Cart() {
  const { items, setQty, remove, clear } = useCart()
  const [note, setNote] = useState('')
  const subtotal = items.reduce((s, i) => s + (i.price ?? priceMap[i.id] ?? 0) * i.qty, 0)

  const waText = encodeURIComponent(
    `Hi! I'd like to place an order from A & A Women Store:\n${items
      .map((i) => {
        const p = findProduct(i.id)
        const name = i.name ?? p?.name ?? i.id
        const code = i.code ?? p?.code ?? i.id
        const price = i.price ?? p?.price ?? 0
        return `- ${name} (${code})${i.size ? `, size ${i.size}` : ''}${i.details ? `, ${i.details}` : ''}, qty ${i.qty} - ₹${price * i.qty}`
      })
      .join('\n')}\nTotal: ₹${subtotal}${note.trim() ? `\nNote: ${note.trim()}` : ''}`,
  )

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="nb-card mx-auto max-w-md p-10 text-center">
          <p className="font-display text-3xl uppercase">YOUR CART IS EMPTY</p>
          <Link to="/shop" className="nb-btn mt-6 inline-block">
            SHOP NOW
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c) => (
            <div key={c} className="nb-card p-5">
              <p className="font-display text-lg uppercase">{c}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-5xl uppercase md:text-6xl">Cart</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <ul className="space-y-4">
          {items.map((i) => {
            const p = findProduct(i.id)
            const name = i.name ?? p?.name ?? i.id
            const code = i.code ?? p?.code ?? i.id
            const img = i.image ?? p?.image ?? ''
            const price = i.price ?? p?.price ?? 0
            const k = `${i.id}::${i.size ?? ''}`
            return (
              <li key={k} className="nb-card flex gap-4 p-4">
                <img
                  src={img}
                  alt={name}
                  className="h-28 w-24 border-3 border-ink bg-white object-contain"
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    if (p) e.currentTarget.src = p.altImage
                  }}
                />
                <div className="flex flex-1 flex-col">
                  <p className="font-display text-xl uppercase leading-tight">{name}</p>
                  <p className="font-mono text-xs uppercase">{code}</p>
                  {i.size && <p className="font-mono text-xs uppercase">Size {i.size}</p>}
                  {i.details && <p className="font-mono text-xs uppercase">{i.details}</p>}
                  <p className="mt-1 font-mono text-sm">₹{price}</p>
                  <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
                    <button type="button" className="nb-chip px-3 py-1 font-mono" aria-label={`Decrease qty ${name}`} onClick={() => setQty(i.id, i.size, i.qty - 1)}>−</button>
                    <span className="font-mono">{i.qty}</span>
                    <button type="button" className="nb-chip px-3 py-1 font-mono" aria-label={`Increase qty ${name}`} onClick={() => setQty(i.id, i.size, i.qty + 1)}>+</button>
                    <button type="button" className="ml-auto font-mono text-xs uppercase underline" onClick={() => remove(i.id, i.size)}>Remove</button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <div className="nb-card h-fit p-5 space-y-4">
          <p className="font-display text-2xl uppercase">Order</p>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase">Order note</span>
            <textarea
              className="nb-input min-h-28 w-full"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any note for the store"
            />
          </label>
          <div className="flex items-center justify-between border-t-3 border-ink pt-4 font-mono uppercase">
            <span>Subtotal</span>
            <span className="text-xl font-bold">₹{subtotal}</span>
          </div>
          <a href={`https://wa.me/${WA}?text=${waText}`} target="_blank" rel="noreferrer" className="nb-btn block text-center">
            PLACE ORDER ON WHATSAPP
          </a>
          <button type="button" className="nb-btn nb-btn-ink w-full" onClick={clear}>
            CLEAR CART
          </button>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((c) => (
          <div key={c} className="nb-card p-5">
            <p className="font-display text-lg uppercase">{c}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
