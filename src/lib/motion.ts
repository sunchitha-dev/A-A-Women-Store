import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLenis } from './lenis'

gsap.registerPlugin(ScrollTrigger)

export const EASE = 'power4.out'
export const DURATION = 1.1

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function revealY(targets: string | Element | Element[], options?: { delay?: number; stagger?: number }) {
  if (prefersReducedMotion()) return
  const trigger = Array.isArray(targets) ? targets[0] : targets
  gsap.fromTo(targets, { y: 60, opacity: 0 }, {
    y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
    stagger: options?.stagger ?? 0.1, delay: options?.delay ?? 0,
    scrollTrigger: { trigger: trigger as Element, start: 'top 88%', once: true },
  })
}

export function revealX(targets: string | Element | Element[], direction: 'left' | 'right' = 'left') {
  if (prefersReducedMotion()) return
  const x = direction === 'left' ? -60 : 60
  const trigger = Array.isArray(targets) ? targets[0] : targets
  gsap.fromTo(targets, { x, opacity: 0 }, {
    x: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
    scrollTrigger: { trigger: trigger as Element, start: 'top 88%', once: true },
  })
}

export function useLenis() {
  return getLenis()
}

export function useScrollVelocity() {
  const vel = useRef(0)
  useEffect(() => {
    const lenis = getLenis()
    if (!lenis) return
    const onScroll = (e: { velocity: number }) => { vel.current = e.velocity }
    lenis.on('scroll', onScroll)
    return () => { lenis.off('scroll', onScroll) }
  }, [])
  return vel
}