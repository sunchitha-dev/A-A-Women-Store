import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null
let ticker: ((time: number) => void) | null = null
let locks = 0

export function getLenis() {
  return lenis
}

export function initLenis() {
  if (lenis) return lenis
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  lenis = new Lenis({
    duration: 1.1,
    easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
  })
  lenis.on('scroll', ScrollTrigger.update)
  ticker = (time: number) => {
    lenis?.raf(time * 1000)
  }
  gsap.ticker.add(ticker)
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function destroyLenis() {
  if (ticker) {
    gsap.ticker.remove(ticker)
    ticker = null
  }
  locks = 0
  if (!lenis) return
  lenis.destroy()
  lenis = null
}

export function stopLenis() {
  locks += 1
  lenis?.stop()
}

export function startLenis() {
  locks = Math.max(0, locks - 1)
  if (locks === 0) lenis?.start()
}