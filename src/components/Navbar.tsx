import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { navConfig } from '../data/navConfig'
import MegaMenu from './header/MegaMenu'
import MobileDrawer from './header/MobileDrawer'
import SearchOverlay from './header/SearchOverlay'
import MiniCart from './header/MiniCart'
import { useCartCount } from '../store/cart'
import { startLenis, stopLenis } from '../lib/lenis'

function SearchIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" strokeLinecap="square" /></svg>
}
function CartIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 8h12l1 12H5L6 8Z" /><path d="M9 10V7a3 3 0 0 1 6 0v3" strokeLinecap="square" /></svg>
}
function Chevron({ open }: { open: boolean }) {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform var(--dur-base) var(--ease-out)' }}><path d="M6 9l6 6 6-6" strokeLinecap="square" /></svg>
}

export default function Navbar() {
  const { pathname, search } = useLocation()
  const count = useCartCount()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchOrigin, setSearchOrigin] = useState<{ x: number; y: number }>()
  const [cartOpen, setCartOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [badgeBump, setBadgeBump] = useState(false)
  const [prevLoc, setPrevLoc] = useState(pathname + search)
  const headerRef = useRef<HTMLElement>(null)
  const lastY = useRef(0)
  const prevCount = useRef(count)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (count !== prevCount.current) {
      prevCount.current = count
      setBadgeBump(true)
      const t = window.setTimeout(() => setBadgeBump(false), 320)
      return () => window.clearTimeout(t)
    }
  }, [count])

  useEffect(() => {
    if (reduced) return
    const sentinel = document.createElement('div')
    sentinel.style.cssText = 'position:absolute;top:80px;left:0;width:1px;height:1px;pointer-events:none;'
    document.body.appendChild(sentinel)
    const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting), { threshold: 0 })
    io.observe(sentinel)
    return () => { io.disconnect(); sentinel.remove() }
  }, [reduced])

  useEffect(() => {
    if (reduced) return
    lastY.current = window.scrollY
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        const delta = y - lastY.current
        if (Math.abs(delta) < 10) return
        if (y > 180 && delta > 0) setHidden(true)
        else if (delta < 0) setHidden(false)
        lastY.current = y
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll) }
  }, [reduced])

  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const apply = () => {
      const desktop = window.matchMedia('(min-width: 1024px)').matches
      if (reduced || !desktop) { gsap.set(el, { y: 0 }); return }
      gsap.to(el, { y: hidden ? '-100%' : '0%', duration: hidden ? 0.48 : 0.24, ease: 'cubic-bezier(0.2,0,0,1)', overwrite: 'auto' })
    }
    apply()
    window.addEventListener('resize', apply)
    return () => window.removeEventListener('resize', apply)
  }, [hidden, reduced])

  useEffect(() => {
    if (mobileOpen) stopLenis(); else startLenis()
  }, [mobileOpen])

  useEffect(() => {
    const onOpen = () => setMegaOpen(true)
    const onClose = () => setMegaOpen(false)
    window.addEventListener('aa:mega-open', onOpen)
    window.addEventListener('aa:mega-close', onClose)
    return () => { window.removeEventListener('aa:mega-open', onOpen); window.removeEventListener('aa:mega-close', onClose) }
  }, [])

  const loc = pathname + search
  if (loc !== prevLoc) {
    setPrevLoc(loc)
    setMobileOpen(false)
    setMegaOpen(false)
  }

  const onSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    setSearchOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
    setSearchOpen(true)
  }

  const state1 = !reduced && scrolled

  return (
    <>
      <div aria-hidden="true" className="hidden lg:block" style={{ height: 'calc(var(--bar-height, 48px) + 80px)' }} />
      <header
        ref={headerRef}
        id="site-header"
        aria-label="Site header"
        className="relative lg:fixed lg:left-0 lg:right-0 z-50 bg-cream text-ink border-b-[3px] border-ink lg:top-[var(--bar-height,48px)] h-[72px] lg:h-[80px]"
      >
        <div aria-hidden="true" className="pointer-events-none absolute left-0 right-0 top-full h-[6px] bg-ink" style={{ opacity: state1 ? 1 : 0, transition: 'opacity var(--dur-base) var(--ease-out)' }} />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-[60] nb-btn bg-gold text-ink">Skip to main content</a>
        <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-4 sm:px-6">
          <button
            type="button"
            className="lg:hidden flex h-11 w-11 items-center justify-center text-ink focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink focus-visible:outline-offset-2"
            aria-expanded={mobileOpen}
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <span className="relative block w-[22px] h-[14px]" aria-hidden="true">
              <span className="absolute left-0 top-0 h-[2px] w-full bg-ink transition-all duration-[240ms]" style={{ transform: mobileOpen ? 'translateY(6px) rotate(45deg)' : 'none', transitionTimingFunction: 'var(--ease-out)' }} />
              <span className="absolute left-0 top-[6px] h-[2px] w-full bg-ink transition-all duration-[240ms]" style={{ opacity: mobileOpen ? 0 : 1, transitionTimingFunction: 'var(--ease-out)' }} />
              <span className="absolute left-0 top-[12px] h-[2px] w-full bg-ink transition-all duration-[240ms]" style={{ transform: mobileOpen ? 'translateY(-6px) rotate(-45deg)' : 'none', transitionTimingFunction: 'var(--ease-out)' }} />
            </span>
          </button>

          <Link to="/" aria-label="A & A Women Store home" className="group relative flex items-center leading-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink focus-visible:outline-offset-2 active:scale-[0.97] transition-transform duration-[120ms]">
            <img src="/logo.png" alt="A & A Women Store" className="h-11 lg:h-[60px] w-auto block" />
            <span className="absolute left-0 -bottom-1 h-[3px] w-full bg-ink origin-left scale-x-0 transition-transform duration-[240ms] group-hover:scale-x-100" style={{ transitionTimingFunction: 'var(--ease-out)' }} aria-hidden="true" />
          </Link>

          <nav className="hidden lg:flex items-center gap-2" aria-label="Main">
            {navConfig.routes.map((r) => {
              const active = r.href === '/shop'
                ? pathname.startsWith('/shop') || pathname.startsWith('/product')
                : r.href === '/'
                  ? pathname === '/'
                  : r.href.startsWith('/shop?')
                    ? pathname === '/shop' && search.includes(r.href.split('?')[1] ?? '')
                    : pathname.startsWith(r.href)
              return (
                <NavLink
                  key={r.label}
                  to={r.href}
                  data-mega-trigger={r.hasMega ? 'shop' : undefined}
                  className={`group relative inline-flex items-center gap-1 px-3 py-1 font-display text-[12px] uppercase tracking-[0.1em] border-[3px] transition-[background-color,color] duration-[120ms] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink focus-visible:outline-offset-2 ${active ? 'bg-pink text-cream border-ink' : 'text-ink border-transparent'}`}
                  onMouseEnter={r.hasMega ? () => window.dispatchEvent(new CustomEvent('aa:mega-open')) : () => window.dispatchEvent(new CustomEvent('aa:mega-close'))}
                  onFocus={r.hasMega ? () => window.dispatchEvent(new CustomEvent('aa:mega-open')) : undefined}
                >
                  {!active && <span className="absolute left-0 bottom-0 h-[3px] w-full bg-pink origin-left scale-x-0 transition-transform duration-[240ms] [transition-timing-function:var(--ease-out)] group-hover:scale-x-100 pointer-events-none" aria-hidden="true" />}
                  <span className="relative">{r.label}{r.hasMega && <span className="ml-1 inline-flex align-middle"><Chevron open={megaOpen} /></span>}</span>
                </NavLink>
              )
            })}
          </nav>

          <div className="flex items-center gap-1">
            <button type="button" aria-label="Search" onClick={onSearch} className="group relative flex h-11 w-11 items-center justify-center text-ink hover:text-gold transition-colors duration-[120ms] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink focus-visible:outline-offset-2">
              <span className="absolute inset-1 rounded-full bg-ink scale-0 transition-transform duration-[240ms] [transition-timing-function:var(--ease-bounce)] group-hover:scale-100" aria-hidden="true" />
              <span className="relative"><SearchIcon /></span>
            </button>
            <button type="button" aria-label={`Cart, ${count} items`} onClick={() => setCartOpen(true)} className="group relative flex h-11 w-11 items-center justify-center text-ink hover:text-gold transition-colors duration-[120ms] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink focus-visible:outline-offset-2">
              <span className="absolute inset-1 rounded-full bg-ink scale-0 transition-transform duration-[240ms] [transition-timing-function:var(--ease-bounce)] group-hover:scale-100" aria-hidden="true" />
              <span className="relative"><CartIcon /></span>
              {count > 0 && (
                <span aria-live="polite" className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center bg-pink px-1 font-mono text-[10px] leading-none text-ink border border-ink" style={{ transform: badgeBump ? 'scale(1.3)' : 'scale(1)', transition: 'transform 320ms var(--ease-bounce)' }}>{count}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <style>{`@keyframes aa-star-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @media (prefers-reduced-motion: reduce) { .aa-star-spin, [style*="aa-star-spin"] { animation: none !important; } }`}</style>

      <MegaMenu />
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} origin={searchOrigin} />
      <MiniCart open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
