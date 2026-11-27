import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { navConfig } from '../../data/navConfig'

function getTrigger(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-mega-trigger="shop"]')
}

const FLOATS = [
  { src: '/tryon/kurti_01.webp', rot: -4, delay: 0, cls: 'left-[8%] top-[6%] w-[42%]' },
  { src: '/tryon/jeans_01.webp', rot: 0, delay: 1.5, cls: 'left-[30%] top-[18%] w-[44%] z-10' },
  { src: '/tryon/party_11.webp', rot: 3, delay: 2.8, cls: 'left-[52%] top-[4%] w-[40%]' },
]

export default function MegaMenu() {
  const { pathname, search } = useLocation()
  const [open, setOpen] = useState(false)
  const [rendered, setRendered] = useState(false)
  const [prevLoc, setPrevLoc] = useState(pathname + search)
  const panelRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const openTimer = useRef<number | null>(null)
  const closeTimer = useRef<number | null>(null)
  const floatTweens = useRef<gsap.core.Tween[]>([])
  const qx = useRef<gsap.QuickToFunc[]>([])
  const qy = useRef<gsap.QuickToFunc[]>([])
  const qix = useRef<gsap.QuickToFunc[]>([])
  const qiy = useRef<gsap.QuickToFunc[]>([])
  const parallaxRefs = useRef<(HTMLDivElement | null)[]>([])
  const floatRefs = useRef<(HTMLDivElement | null)[]>([])
  const imgInnerRefs = useRef<(HTMLImageElement | null)[]>([])
  const rafRef = useRef(0)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const clearTimers = () => {
    if (openTimer.current) { window.clearTimeout(openTimer.current); openTimer.current = null }
    if (closeTimer.current) { window.clearTimeout(closeTimer.current); closeTimer.current = null }
  }

  const openMenu = useCallback(() => {
    if (closeTimer.current) { window.clearTimeout(closeTimer.current); closeTimer.current = null }
    if (openTimer.current || open) return
    openTimer.current = window.setTimeout(() => { openTimer.current = null; setRendered(true); setOpen(true) }, 120)
  }, [open])

  const closeMenu = useCallback((focusBack = false) => {
    if (openTimer.current) { window.clearTimeout(openTimer.current); openTimer.current = null }
    if (closeTimer.current) return
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null
      setOpen(false)
      if (focusBack) getTrigger()?.focus()
    }, 200)
  }, [])

  const closeNow = useCallback((focusBack = false) => {
    clearTimers()
    setOpen(false)
    if (focusBack) getTrigger()?.focus()
  }, [])

  // route change close
  const loc = pathname + search
  if (loc !== prevLoc) { setPrevLoc(loc); setOpen(false); setRendered(false) }
  useEffect(() => { clearTimers() }, [loc])

  // events from Navbar
  useEffect(() => {
    const onOpen = () => openMenu()
    const onCloseEv = () => closeMenu(false)
    window.addEventListener('aa:mega-open', onOpen)
    window.addEventListener('aa:mega-close', onCloseEv)
    return () => { window.removeEventListener('aa:mega-open', onOpen); window.removeEventListener('aa:mega-close', onCloseEv) }
  }, [openMenu, closeMenu])

  // trigger keyboard toggle
  useEffect(() => {
    const t = getTrigger()
    if (!t) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (open) closeNow(true); else openMenu() }
    }
    t.addEventListener('keydown', onKey)
    return () => t.removeEventListener('keydown', onKey)
  }, [open, openMenu, closeNow])

  // outside click + esc
  useEffect(() => {
    if (!rendered) return
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (panelRef.current?.contains(t) || getTrigger()?.contains(t)) return
      closeNow(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); closeNow(true) } }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [rendered, closeNow])

  // setup quickTo
  useEffect(() => {
    const noop = (() => {}) as unknown as gsap.QuickToFunc
    qx.current = parallaxRefs.current.map((el) => el ? gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' }) : noop)
    qy.current = parallaxRefs.current.map((el) => el ? gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' }) : noop)
    qix.current = imgInnerRefs.current.map((el) => el ? gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' }) : noop)
    qiy.current = imgInnerRefs.current.map((el) => el ? gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' }) : noop)
  }, [rendered])

  // animate open/close
  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    const content = contentRef.current
    const heads = content ? Array.from(content.querySelectorAll<HTMLElement>('[data-mega-head]')) : []
    const links = content ? Array.from(content.querySelectorAll<HTMLElement>('[data-mega-link]')) : []
    const floats = floatRefs.current.filter(Boolean) as HTMLDivElement[]

    const killFloats = () => { floatTweens.current.forEach((t) => t.kill()); floatTweens.current = [] }

    if (open) {
      if (reduced) {
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power1.out', overwrite: 'auto' })
        gsap.set(el, { clipPath: 'inset(0 0 0% 0)' })
        gsap.set([...heads, ...links, ...floats], { opacity: 1, y: 0, scale: 1, clipPath: 'inset(0 0 0% 0)' })
        return
      }
      gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)', opacity: 1 }, { clipPath: 'inset(0 0 0% 0)', duration: 0.35, ease: 'cubic-bezier(0.2,0,0,1)', overwrite: 'auto' })
      gsap.fromTo(heads, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.24, ease: 'power2.out', stagger: 0.03, delay: 0.08, overwrite: 'auto' })
      gsap.fromTo(links, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.24, ease: 'power2.out', stagger: 0.025, delay: 0.1, overwrite: 'auto' })
      floats.forEach((img, i) => {
        gsap.fromTo(img, { clipPath: 'inset(0 0 100% 0)', scale: 1.08 }, { clipPath: 'inset(0 0 0% 0)', scale: 1, duration: 0.58, ease: 'cubic-bezier(0.2,0,0,1)', delay: 0.06 + i * 0.09, overwrite: 'auto' })
      })
      killFloats()
      floats.forEach((img, i) => {
        const tw = gsap.to(img, { y: -7, scale: 1.012, duration: 5 + i * 0.4, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: (FLOATS[i]?.delay ?? 0) + 0.7 })
        floatTweens.current.push(tw)
      })
    } else if (rendered) {
      killFloats()
      floats.forEach((img) => gsap.set(img, { clearProps: 'willChange' }))
      if (reduced) { gsap.to(el, { opacity: 0, duration: 0.2, onComplete: () => setRendered(false) }); return }
      gsap.to(el, { opacity: 0, duration: 0.24, ease: 'cubic-bezier(0.2,0,0,1)', overwrite: 'auto', onComplete: () => { gsap.set(el, { opacity: 1, clipPath: 'inset(0 0 100% 0)' }); setRendered(false) } })
    }
    return () => { killFloats() }
  }, [open, rendered, reduced])

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      qx.current.forEach((q) => q(-px * 16))
      qy.current.forEach((q) => q(-py * 10))
      qix.current.forEach((q) => q(px * 6))
      qiy.current.forEach((q) => q(py * 6))
    })
  }
  const onLeave = () => {
    cancelAnimationFrame(rafRef.current)
    qx.current.forEach((q) => q(0))
    qy.current.forEach((q) => q(0))
    qix.current.forEach((q) => q(0))
    qiy.current.forEach((q) => q(0))
  }

  const onPanelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    const active = document.activeElement as HTMLElement | null
    const col = active?.closest<HTMLElement>('[data-mega-col]')
    if (!col) return
    const links = Array.from(col.querySelectorAll<HTMLElement>('a[href]'))
    const i = links.indexOf(active as HTMLElement)
    if (i < 0) return
    e.preventDefault()
    const next = e.key === 'ArrowDown' ? (i + 1) % links.length : (i - 1 + links.length) % links.length
    links[next]?.focus()
  }

  if (!rendered) return null

  const header = document.getElementById('site-header')
  const top = header ? header.offsetTop + header.offsetHeight : 72
  const { columns, featured } = navConfig.megaMenu

  return (
    <div
      ref={panelRef}
      className="fixed left-0 right-0 z-40 hidden lg:block bg-cream border-t-[4px] border-b-[4px] border-ink"
      style={{ top, boxShadow: '0 10px 0 0 #0A0A0A', clipPath: 'inset(0 0 100% 0)' }}
      role="menu"
      aria-label="Shop menu"
      onMouseEnter={() => { if (closeTimer.current) { window.clearTimeout(closeTimer.current); closeTimer.current = null } }}
      onMouseLeave={() => closeMenu(false)}
      onKeyDown={onPanelKeyDown}
    >
      <div ref={contentRef} className="mx-auto max-w-7xl px-8 py-8 grid grid-cols-5 gap-8" onMouseMove={onMove} onMouseLeave={onLeave}>
        {columns.map((col) => (
          <div key={col.heading} data-mega-col>
            <p data-mega-head className="mb-3 border-b-[3px] border-ink pb-2 font-display text-[11px] uppercase tracking-[0.15em] text-gold">{col.heading}</p>
            <ul>
              {col.links.map((l) => (
                <li key={l.label + l.href} className="border-b border-ink/15">
                  <Link
                    data-mega-link
                    to={l.href}
                    onClick={() => closeNow(false)}
                    className="group flex w-full items-center justify-between px-3 py-2 font-body text-[14px] text-ink transition-colors duration-[120ms] hover:bg-ink hover:text-cream focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink"
                  >
                    <span>{l.label}</span>
                    <span className="translate-x-0 opacity-0 transition-all duration-[120ms] group-hover:translate-x-1 group-hover:opacity-100 group-focus-visible:translate-x-1 group-focus-visible:opacity-100" aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="relative bg-lilac border-[3px] border-ink p-5 shadow-nb flex flex-col min-h-[320px] overflow-visible">
          <img src="/about/bags.webp" alt="" aria-hidden="true" className="pointer-events-none absolute -top-3 -right-2 w-[60px] rotate-[10deg]" />
          <div className="relative h-[210px] mb-4">
            {FLOATS.map((f, i) => (
              <div
                key={f.src}
                ref={(el) => { parallaxRefs.current[i] = el }}
                className={`absolute will-change-transform ${f.cls}`}
              >
                <div ref={(el) => { floatRefs.current[i] = el }} data-float-wrap className="nb-card group bg-white p-1.5 shadow-nb-sm transition-shadow duration-[480ms] hover:[box-shadow:0_18px_40px_-24px_rgba(0,0,0,0.3)]" style={{ transform: `rotate(${f.rot}deg)` }}>
                  <div className="overflow-hidden relative">
                    <img
                      ref={(el) => { imgInnerRefs.current[i] = el }}
                      src={f.src}
                      alt=""
                      aria-hidden="true"
                      className="block w-full h-[140px] object-cover transition-transform duration-[480ms] [transition-timing-function:var(--ease-out)] group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-x-0 bottom-0 overflow-hidden">
                      <div className="translate-y-full bg-cream/95 px-2 py-1 font-mono text-[10px] uppercase text-ink transition-transform duration-[240ms] [transition-timing-function:var(--ease-out)] group-hover:translate-y-0">{f.src.split('/').pop()?.replace('.webp', '')}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p data-mega-head className="font-display text-[18px] uppercase text-ink">{featured.heading}</p>
          <p className="mt-1 font-accent italic text-[16px] text-ink">{featured.line}</p>
          <Link to={featured.ctaHref} onClick={() => closeNow(false)} className="nb-btn bg-gold mt-4 w-full justify-center text-center">{featured.ctaLabel}</Link>
        </div>
      </div>
    </div>
  )
}
