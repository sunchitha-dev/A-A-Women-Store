import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import { products } from '../data/products'
import ProductCard from '../components/shop/ProductCard'
import ShopToolbar, { type Cat, type Sort } from '../components/shop/ShopToolbar'

const GRID: Record<number, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
}

function readCols(v: string | null) {
  const n = Number(v)
  return n === 2 || n === 3 || n === 4 ? n : 3
}

function readCat(v: string | null): Cat {
  return v === 'kurti' || v === 'jeans' || v === 'party' || v === 'y2k' ? v : 'all'
}

function readSort(v: string | null): Sort {
  return v === 'price-asc' || v === 'price-desc' || v === 'name-asc' ? v : 'recommended'
}

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const [reduced, setReduced] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const first = useRef(true)

  const cols = readCols(params.get('cols'))
  const cat = readCat(params.get('cat'))
  const sort = readSort(params.get('sort'))

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const list = useMemo(() => {
    let out = cat === 'all' ? [...products] : products.filter((p) => p.collection === cat)
    if (sort === 'price-asc') out.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') out.sort((a, b) => b.price - a.price)
    if (sort === 'name-asc') out.sort((a, b) => a.name.localeCompare(b.name))
    return out
  }, [cat, sort])

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (reduced || !gridRef.current) return
    const cards = gridRef.current.children
    gsap.killTweensOf(cards)
    gsap.fromTo(
      cards,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.05, duration: 0.25, ease: 'power2.out', clearProps: 'transform' },
    )
  }, [cat, sort, reduced])

  const set = (patch: Record<string, string>) => {
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([k, v]) => {
      if ((k === 'cat' && v === 'all') || (k === 'sort' && v === 'recommended') || (k === 'cols' && v === '3')) next.delete(k)
      else next.set(k, v)
    })
    setParams(next, { replace: true })
  }

  const reset = () => setParams({}, { replace: true })

  return (
    <div className="bg-cream">
      <div className="mx-auto max-w-6xl px-4 pb-4 pt-10 sm:px-6">
        <h1 className="font-display text-6xl uppercase md:text-7xl">Shop</h1>
        <p className="mt-2 font-mono text-sm uppercase">{list.length} LOOKS</p>
      </div>

      <ShopToolbar
        cols={cols}
        cat={cat}
        sort={sort}
        onCols={(n) => set({ cols: String(n) })}
        onCat={(c) => set({ cat: c })}
        onSort={(s) => set({ sort: s })}
      />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {list.length === 0 ? (
          <div className="nb-card mx-auto max-w-md p-10 text-center">
            <p className="font-display text-3xl uppercase">NO LOOKS FOUND</p>
            <button type="button" className="nb-btn mt-6" onClick={reset}>
              RESET
            </button>
          </div>
        ) : (
          <div ref={gridRef} className={`grid grid-cols-2 gap-6 ${GRID[cols]}`}>
            {list.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
