import { useEffect, useRef } from 'react'
import { getLenis } from './lenis'

export const EASE = 'power4.out'
export const DURATION = 0.8

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
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