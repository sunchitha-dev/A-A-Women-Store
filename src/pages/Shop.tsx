import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { products, type Product } from '../data/products'
import ProductCard from '../components/shop/ProductCard'
import ShopToolbar, { type Cat, type Sort } from '../components/shop/ShopToolbar'
import SplitWords from '../components/motion/SplitWords'
import Reveal from '../components/Reveal'
import { getLenis } from '../lib/lenis'
import { useScrollVelocity } from '../lib/motion'
import ShopCTA from '../components/shop/ShopCTA'

gsap.registerPlugin(ScrollTrigger)

const GRID: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
}

function readCols(v: string | null) {
  const n = Number(v)
  return n === 1 || n === 2 || n === 3 || n === 4 ? n : 3
}

function readCat(v: string | null): Cat {
  return v === 'kurti' || v === 'jeans' || v === 'party' || v === 'y2k' ? v : 'all'
}

function readSort(v: string | null): Sort {
  return v === 'price-asc' || v === 'price-desc' || v === 'name-asc' ? v : 'recommended'
}

function filtered(cat: Cat, sort: Sort) {
  let out: Product[] = cat === 'all' ? [...products] : products.filter((p) => p.collection === cat)
  if (sort === 'price-asc') out.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') out.sort((a, b) => b.price - a.price)
  if (sort === 'name-asc') out.sort((a, b) => a.name.localeCompare(b.name))
  return out
}

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const gridRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const liveRef = useRef<HTMLParagraphElement>(null)
  const velRef = useScrollVelocity()
  const ctxRef = useRef<gsap.Context | null>(null)
  const transitionRef = useRef(0)
  const jumpRef = useRef(false)
  const animatingRef = useRef(false)

  const cols = readCols(params.get('cols'))
  const cat = readCat(params.get('cat'))
  const sort = readSort(params.get('sort'))

  const list = useMemo(() => filtered(cat, sort), [cat, sort])
  const [displayed, setDisplayed] = useState<Product[]>(() => filtered(readCat(new URLSearchParams(window.location.search).get('cat')), readSort(new URLSearchParams(window.location.search).get('sort'))))
  const latestList = useRef(list)
  const lastCols = useRef(cols)
  useEffect(() => { latestList.current = list }, [list])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const killBatch = useCallback(() => {
    ctxRef.current?.revert()
    ctxRef.current = null
  }, [])

  const buildBatch = useCallback(() => {
    const grid = gridRef.current
    if (!grid || reduced) return
    killBatch()
    const cards = Array.from(grid.children) as HTMLElement[]
    if (!cards.length) return
    const mobile = window.innerWidth < 768
    const y = mobile ? 30 : 70
    const baseDur = mobile ? 0.6 : 0.85
    const baseStagger = mobile ? 0.06 : 0.09
    const batchMax = mobile ? 2 : cols
    const ctx = gsap.context(() => {
      gsap.set(cards, { autoAlpha: 0, y, rotate: (i: number) => (mobile ? 0 : (i % 2 ? 2 : -2)), scale: 0.96 })
      cards.forEach((card) => {
        const imgs = card.querySelectorAll<HTMLElement>('[data-card-img]')
        const sticker = card.querySelector<HTMLElement>('[data-card-sticker]')
        const price = card.querySelector<HTMLElement>('[data-card-price]')
        if (imgs.length) gsap.set(imgs, { scale: 1.12 })
        if (sticker) gsap.set(sticker, { scale: 0 })
        if (price) gsap.set(price, { x: -12, autoAlpha: 0 })
      })

      const innerIn = (batch: HTMLElement[]) => {
        batch.forEach((card) => {
          const imgs = card.querySelectorAll<HTMLElement>('[data-card-img]')
          const sticker = card.querySelector<HTMLElement>('[data-card-sticker]')
          const price = card.querySelector<HTMLElement>('[data-card-price]')
          if (imgs.length) gsap.to(imgs, { scale: 1, duration: 0.9, ease: 'power4.out', overwrite: true })
          if (sticker) gsap.to(sticker, { scale: 1, duration: 0.4, ease: 'back.out(1.7)', delay: 0.3, overwrite: true })
          if (price) gsap.to(price, { x: 0, autoAlpha: 1, duration: 0.5, ease: 'power4.out', overwrite: true })
        })
      }
      const innerReset = (batch: HTMLElement[]) => {
        batch.forEach((card) => {
          const imgs = card.querySelectorAll<HTMLElement>('[data-card-img]')
          const sticker = card.querySelector<HTMLElement>('[data-card-sticker]')
          const price = card.querySelector<HTMLElement>('[data-card-price]')
          if (imgs.length) gsap.set(imgs, { scale: 1.12 })
          if (sticker) gsap.set(sticker, { scale: 0 })
          if (price) gsap.set(price, { x: -12, autoAlpha: 0 })
        })
      }

      ScrollTrigger.batch(cards, {
        start: 'top 92%',
        end: 'bottom top',
        interval: 0.1,
        batchMax,
        onEnter: (batch) => {
          const fastNow = Math.abs(velRef.current) > 1200
          const d = fastNow ? baseDur / 2 : baseDur
          const s = fastNow ? baseStagger / 2 : baseStagger
          gsap.fromTo(batch, { autoAlpha: 0, y, rotate: (i: number) => (mobile ? 0 : (i % 2 ? 2 : -2)), scale: 0.96 }, { autoAlpha: 1, y: 0, rotate: 0, scale: 1, duration: d, ease: 'power4.out', stagger: { each: s, from: 'start' }, overwrite: true })
          innerIn(batch as HTMLElement[])
        },
        onLeave: (batch) => {
          gsap.set(batch, { autoAlpha: 0, y: mobile ? -30 : -70, scale: 0.96 })
          innerReset(batch as HTMLElement[])
        },
        onLeaveBack: (batch) => {
          gsap.to(batch, {
            autoAlpha: 0, y: mobile ? 30 : 50, rotate: (i: number) => (mobile ? 0 : (i % 2 ? 2 : -2)), scale: 0.96,
            duration: 0.35, ease: 'power2.in', stagger: { each: 0.04, from: 'end' }, overwrite: true,
          })
          innerReset(batch as HTMLElement[])
        },
        onEnterBack: (batch) => {
          const fastNow = Math.abs(velRef.current) > 1200
          const d = fastNow ? baseDur / 2 : baseDur
          const s = fastNow ? baseStagger / 2 : baseStagger
          gsap.fromTo(batch, { autoAlpha: 0, y: mobile ? -30 : -70, rotate: (i: number) => (mobile ? 0 : (i % 2 ? -2 : 2)), scale: 0.96 }, { autoAlpha: 1, y: 0, rotate: 0, scale: 1, duration: d, ease: 'power4.out', stagger: { each: s, from: 'end' }, overwrite: true })
          innerIn(batch as HTMLElement[])
        },
      })
    }, grid)
    ctxRef.current = ctx
  }, [cols, killBatch, reduced, velRef])

  useLayoutEffect(() => {
    if (reduced) return
    const grid = gridRef.current
    if (!grid) return
    const cards = Array.from(grid.children) as HTMLElement[]
    if (!cards.length) return
    const mobile = window.innerWidth < 768
    gsap.set(cards, { autoAlpha: 0, y: mobile ? 30 : 70, rotate: (i: number) => (mobile ? 0 : (i % 2 ? 2 : -2)), scale: 0.96 })
    cards.forEach((card) => {
      const imgs = card.querySelectorAll<HTMLElement>('[data-card-img]')
      const sticker = card.querySelector<HTMLElement>('[data-card-sticker]')
      const price = card.querySelector<HTMLElement>('[data-card-price]')
      if (imgs.length) gsap.set(imgs, { scale: 1.12 })
      if (sticker) gsap.set(sticker, { scale: 0 })
      if (price) gsap.set(price, { x: -12, autoAlpha: 0 })
    })
  }, [displayed, reduced])

  useEffect(() => {
    if (reduced) return
    const id = requestAnimationFrame(() => {
      buildBatch()
      ScrollTrigger.refresh()
    })
    return () => cancelAnimationFrame(id)
  }, [displayed, buildBatch, reduced])

  useEffect(() => () => killBatch(), [killBatch])

  useEffect(() => {
    if (reduced) return
    const t = setTimeout(() => ScrollTrigger.refresh(), 50)
    return () => clearTimeout(t)
  }, [cols, reduced])

  const scrollToGrid = useCallback((immediate: boolean) => {
    const el = sectionRef.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 140
    const already = Math.abs(window.scrollY - top) < 40
    const lenis = getLenis()
    if (reduced || immediate || already) {
      if (lenis) lenis.scrollTo(already ? window.scrollY : top, { immediate: true })
      else window.scrollTo({ top: already ? window.scrollY : top, behavior: 'auto' })
      return
    }
    if (lenis) lenis.scrollTo(top, { duration: 0.9 })
    else window.scrollTo({ top, behavior: 'smooth' })
  }, [reduced])

  useEffect(() => {
    const same = lastCols.current === cols && displayed.length === list.length && displayed.every((p, i) => p.id === list[i]?.id)
    if (same) { jumpRef.current = false; return }
    if (reduced || !gridRef.current || jumpRef.current) {
      jumpRef.current = false
      animatingRef.current = false
      const grid = gridRef.current
      if (grid) gsap.killTweensOf(Array.from(grid.children))
      killBatch()
      lastCols.current = cols
      setDisplayed([...list])
      if (liveRef.current) liveRef.current.textContent = `${list.length} looks shown`
      scrollToGrid(reduced)
      return
    }
    const id = ++transitionRef.current
    animatingRef.current = true
    const grid = gridRef.current
    const cards = Array.from(grid.children) as HTMLElement[]
    gsap.killTweensOf(cards)
    killBatch()
    if (!cards.length) {
      animatingRef.current = false
      lastCols.current = cols
      setDisplayed([...list])
      if (liveRef.current) liveRef.current.textContent = `${list.length} looks shown`
      requestAnimationFrame(() => scrollToGrid(false))
      return
    }
    gsap.to(cards, {
      autoAlpha: 0, y: -30, duration: 0.25, stagger: 0.03, ease: 'power2.in', overwrite: true,
      onComplete: () => {
        if (transitionRef.current !== id) return
        animatingRef.current = false
        lastCols.current = cols
        setDisplayed([...latestList.current])
        if (liveRef.current) liveRef.current.textContent = `${latestList.current.length} looks shown`
        requestAnimationFrame(() => scrollToGrid(false))
      },
    })
  }, [list, displayed, cols, killBatch, reduced, scrollToGrid])

  const set = (patch: Record<string, string>) => {
    if (animatingRef.current) {
      jumpRef.current = true
      transitionRef.current++
      const grid = gridRef.current
      if (grid) gsap.killTweensOf(Array.from(grid.children))
      killBatch()
    }
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([k, v]) => {
      if ((k === 'cat' && v === 'all') || (k === 'sort' && v === 'recommended') || (k === 'cols' && v === '3')) next.delete(k)
      else next.set(k, v)
    })
    setParams(next, { replace: true })
  }

  const reset = () => {
    if (animatingRef.current) jumpRef.current = true
    transitionRef.current++
    const grid = gridRef.current
    if (grid) gsap.killTweensOf(Array.from(grid.children))
    killBatch()
    setParams({}, { replace: true })
  }

  return (
    <div className="bg-cream">
      <div className="mx-auto max-w-6xl px-4 pb-4 pt-10 sm:px-6">
        <SplitWords as="h1" className="font-display text-6xl uppercase md:text-7xl">Shop</SplitWords>
        <Reveal>
          <p className="mt-2 font-mono text-sm uppercase">{displayed.length} LOOKS</p>
        </Reveal>
      </div>

      <ShopToolbar
        cols={cols}
        cat={cat}
        sort={sort}
        onCols={(n) => set({ cols: String(n) })}
        onCat={(c) => set({ cat: c })}
        onSort={(s) => set({ sort: s })}
      />

      <div ref={sectionRef} className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p ref={liveRef} className="sr-only" aria-live="polite" aria-atomic="true" />
        {displayed.length === 0 ? (
          <Reveal>
            <div className="nb-card mx-auto max-w-md p-10 text-center">
              <p className="font-display text-3xl uppercase">NO LOOKS FOUND</p>
              <button type="button" className="nb-btn mt-6" onClick={reset}>
                RESET
              </button>
            </div>
          </Reveal>
        ) : (
          <div ref={gridRef} className={`grid gap-6 ${cols === 1 ? 'grid-cols-1' : 'grid-cols-2'} ${GRID[cols] ?? ''}`}>
            {displayed.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
      <ShopCTA />
    </div>
  )
}
