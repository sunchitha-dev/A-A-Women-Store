import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from './CartDrawer'
import { destroyLenis, getLenis, initLenis, startLenis, stopLenis } from '../lib/lenis'
import { useCart } from '../store/cart'

export default function Shell() {
  const { pathname, hash } = useLocation()
  const drawerOpen = useCart((s) => s.drawerOpen)
  const progressRef = useRef<HTMLDivElement>(null)
  const [showTop, setShowTop] = useState(false)
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    initLenis()
    return () => destroyLenis()
  }, [])

  useEffect(() => {
    const lenis = getLenis()
    if (hash) {
      const target = document.querySelector(hash)
      if (target) lenis?.scrollTo(target, { offset: -72 })
      return
    }
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [pathname, hash])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const href = a.getAttribute('href')
      if (!href || href === '#') return
      const target = document.querySelector(href)
      if (!target) return
      e.preventDefault()
      const lenis = getLenis()
      if (lenis) lenis.scrollTo(target, { offset: -72 })
      else target.scrollIntoView()
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  useEffect(() => {
    if (drawerOpen) stopLenis()
    else startLenis()
  }, [drawerOpen])

  useEffect(() => {
    // keep Lenis from scrolling page behind overlays; mobile menu/nav modal handled by their own stop/start if present
    const mark = () => document.querySelectorAll<HTMLElement>('.fixed.inset-0.z-50').forEach((el) => el.setAttribute('data-lenis-prevent', ''))
    mark()
    const mo = new MutationObserver(mark)
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, [])

  useEffect(() => {
    if (reduced) return
    const lenis = getLenis()
    const bar = progressRef.current
    const nav = document.querySelector<HTMLElement>('header.sticky')
    let lastY = window.scrollY
    let navHidden = false
    let vel = 0
    let raf = 0

    const setNav = (hide: boolean) => {
      if (!nav || navHidden === hide) return
      navHidden = hide
      nav.style.transition = 'transform 0.3s'
      nav.style.transform = hide ? 'translateY(-100%)' : 'translateY(0)'
    }

    const applyMarquee = (v: number) => {
      const skew = Math.max(-3, Math.min(3, v * -0.003))
      const rate = Math.max(0.2, Math.min(6, 1 + Math.abs(v) * 0.0015))
      const dir = v < 0 ? -1 : 1
      document.querySelectorAll<HTMLElement>('.nb-marquee-track').forEach((el) => {
        el.style.transform = `skewX(${skew}deg)`
        el.getAnimations().forEach((a) => { a.playbackRate = rate * dir })
      })
    }

    const decay = () => {
      vel *= 0.9
      if (Math.abs(vel) < 0.1) {
        vel = 0
        applyMarquee(0)
        raf = 0
        return
      }
      applyMarquee(vel)
      raf = requestAnimationFrame(decay)
    }

    const onScroll = (e: { scroll: number; progress: number; velocity: number }) => {
      if (bar) bar.style.transform = `scaleX(${e.progress})`
      const y = e.scroll
      const menuOpen = !!document.querySelector('.fixed.inset-0.z-50.bg-cream.flex.flex-col')
      if (menuOpen || y < 40) setNav(false)
      else if (y > lastY + 4) setNav(true)
      else if (y < lastY - 4) setNav(false)
      lastY = y
      setShowTop(y > window.innerHeight)
      vel = e.velocity
      applyMarquee(vel)
      if (!raf) raf = requestAnimationFrame(decay)
    }

    if (lenis) lenis.on('scroll', onScroll)
    else {
      const onWin = () => onScroll({ scroll: window.scrollY, progress: Math.min(1, window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)), velocity: window.scrollY - lastY })
      window.addEventListener('scroll', onWin, { passive: true })
      return () => {
        window.removeEventListener('scroll', onWin)
        if (raf) cancelAnimationFrame(raf)
        if (nav) { nav.style.transform = ''; nav.style.transition = '' }
      }
    }

    return () => {
      lenis.off('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
      if (nav) { nav.style.transform = ''; nav.style.transition = '' }
      document.querySelectorAll<HTMLElement>('.nb-marquee-track').forEach((el) => {
        el.style.transform = ''
        el.getAnimations().forEach((a) => { a.playbackRate = 1 })
      })
    }
  }, [reduced])

  return (
    <div className="flex min-h-screen flex-col">
      {!reduced && <div ref={progressRef} aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 box-content h-[4px] bg-pink border-b-[3px] border-ink origin-left pointer-events-none" style={{ transform: 'scaleX(0)' }} />}
      {!reduced && <div aria-hidden="true" className="fixed top-0 left-0 right-0 z-[41] border-b-[3px] border-ink pointer-events-none" />}
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      {!reduced && showTop && (
        <button
          type="button"
          className="nb-btn fixed bottom-6 right-6 z-40 !px-0 !py-0 w-12 h-12 bg-pink"
          aria-label="Back to top"
          onClick={() => { const l = getLenis(); if (l) l.scrollTo(0, { duration: 1.6 }); else window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        >
          ↑
        </button>
      )}
    </div>
  )
}