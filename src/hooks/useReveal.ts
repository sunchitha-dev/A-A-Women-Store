import { useLayoutEffect, useState, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Opts = {
  delay?: number
  y?: number
  stagger?: string
  once?: boolean
  duration?: number
  staggerEach?: number
}

export function useReveal(ref: RefObject<HTMLElement | null>, { delay = 0, y = 40, stagger, once = true, duration = 1.1, staggerEach = 0.14 }: Opts = {}) {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useLayoutEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const sel = stagger?.startsWith('>') ? `:scope ${stagger}` : stagger
    const targets = sel ? Array.from(el.querySelectorAll<HTMLElement>(sel)) : [el]
    const shadows = targets.map((t) => {
      if (!t.classList.contains('nb-card')) return ''
      const s = getComputedStyle(t).boxShadow
      return s && s !== 'none' ? s : '6px 6px 0 0 #0A0A0A'
    })
    const ctx = gsap.context(() => {
      targets.forEach((t, i) => {
        if (shadows[i]) gsap.set(t, { boxShadow: '0 0 0 0 #0A0A0A' })
      })
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          ease: 'power3.out',
          delay,
          stagger: stagger
            ? {
                each: staggerEach,
                onStart(this: gsap.core.Tween) {
                  const t = (this.targets()[0] as HTMLElement)
                  const i = targets.indexOf(t)
                  if (i >= 0 && shadows[i]) {
                    gsap.to(t, { boxShadow: shadows[i], duration: 0.4, ease: 'power3.out', overwrite: 'auto' })
                  }
                },
              }
            : 0,
          clearProps: 'transform,boxShadow',
          scrollTrigger: { trigger: el, start: 'top 92%', once, invalidateOnRefresh: true },
          onStart: stagger
            ? undefined
            : () => {
                const t = targets[0]
                if (shadows[0]) gsap.to(t, { boxShadow: shadows[0], duration: 0.4, ease: 'power3.out', overwrite: 'auto' })
              },
        },
      )
    }, el)
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh())
    const t = setTimeout(() => ScrollTrigger.refresh(), 250)
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      targets.forEach((target, i) => {
        if (getComputedStyle(target).opacity !== '0') return
        gsap.to(target, { opacity: 1, y: 0, duration, ease: 'power3.out', delay: delay + i * staggerEach, overwrite: 'auto', clearProps: 'transform,boxShadow' })
        if (shadows[i]) gsap.to(target, { boxShadow: shadows[i], duration: 0.4, ease: 'power3.out', delay: delay + i * staggerEach, overwrite: 'auto' })
      })
      io.disconnect()
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' })
    io.observe(el)
    return () => { cancelAnimationFrame(raf); clearTimeout(t); io.disconnect(); ctx.revert() }
  }, [ref, delay, y, stagger, once, duration, staggerEach, reduced])

  return reduced
}