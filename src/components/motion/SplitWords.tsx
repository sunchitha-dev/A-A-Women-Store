import { useLayoutEffect, useRef, type ElementType } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EASE, DURATION, prefersReducedMotion } from '../../lib/motion'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  as?: ElementType
  className?: string
  children: string
  stagger?: number
  start?: string
  mode?: 'words' | 'chars'
}

export default function SplitWords({ as: Tag = 'h2', className = '', children, stagger = 0.06, start = 'top 85%', mode = 'words' }: Props) {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const inners = Array.from(el.querySelectorAll<HTMLElement>('[data-split-inner]'))
    if (!inners.length) return
    const s = window.matchMedia('(max-width: 767px)').matches ? Math.min(stagger, 0.04) : stagger

    const ctx = gsap.context(() => {
      gsap.set(inners, { yPercent: 110 })
      const run = () => {
        ScrollTrigger.refresh()
        gsap.to(inners, {
          yPercent: 0,
          duration: DURATION,
          ease: EASE,
          stagger: s,
          scrollTrigger: { trigger: el, start, once: true },
        })
      }
      document.fonts.ready.then(run)
    }, el)

    return () => ctx.revert()
  }, [children, stagger, start, mode])

  if (prefersReducedMotion()) {
    return <Tag className={className}>{children}</Tag>
  }

  const parts = mode === 'chars' ? Array.from(children) : children.split(/(\s+)/)

  return (
    <Tag ref={ref as never} className={className} aria-label={children}>
      {parts.map((part, i) => {
        if (mode !== 'chars' && /^\s+$/.test(part)) return <span key={i} aria-hidden="true"> </span>
        if (mode === 'chars' && part === ' ') return <span key={i} aria-hidden="true"> </span>
        return (
          <span key={i} aria-hidden="true" style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
            <span data-split-inner style={{ display: 'inline-block', willChange: 'transform' }}>{part}</span>
          </span>
        )
      })}
    </Tag>
  )
}