import { useEffect } from 'react'
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

  useEffect(() => {
    initLenis()
    return () => destroyLenis()
  }, [])

  useEffect(() => {
    const lenis = getLenis()
    if (hash) {
      const target = document.querySelector(hash)
      if (target) lenis?.scrollTo(target, { offset: -80 })
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
      if (lenis) lenis.scrollTo(target, { offset: -80 })
      else target.scrollIntoView()
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  useEffect(() => {
    if (drawerOpen) stopLenis()
    else startLenis()
  }, [drawerOpen])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}