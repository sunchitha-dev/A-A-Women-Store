import { useEffect, type RefObject } from 'react'

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active) return
    const el = ref.current
    if (!el) return
    const prev = document.activeElement as HTMLElement | null
    const focusFirst = () => {
      const nodes = el.querySelectorAll<HTMLElement>(FOCUSABLE)
      ;(nodes[0] ?? el).focus()
    }
    const t = window.setTimeout(focusFirst, 0)
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const nodes = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (!nodes.length) { e.preventDefault(); return }
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first || document.activeElement === el) { e.preventDefault(); last.focus() }
      } else if (document.activeElement === last) {
        e.preventDefault(); first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => { window.clearTimeout(t); document.removeEventListener('keydown', onKey); prev?.focus() }
  }, [ref, active])
}
