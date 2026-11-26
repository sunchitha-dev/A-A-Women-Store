import { useLayoutEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../../lib/motion'

gsap.registerPlugin(ScrollTrigger)

type Props = { speed?: number; children: ReactNode; className?: string }

export default function Parallax({ speed = 0.2, children, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || window.matchMedia('(max-width: 767px)').matches) return
    const range = speed * 100
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { yPercent: -range }, {
        yPercent: range,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }, el)
    return () => ctx.revert()
  }, [speed])

  return <div ref={ref} className={className}>{children}</div>
}