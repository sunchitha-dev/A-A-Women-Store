import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { navConfig } from '../../data/navConfig'
import { contactConfig } from '../../data/contactConfig'
import { getVisitStatus } from '../../lib/openNow'
import { startLenis, stopLenis } from '../../lib/lenis'
import { useFocusTrap } from '../../lib/useFocusTrap'
import { useLockBodyScroll } from '../../lib/useLockBodyScroll'

type Props = { open: boolean; onClose: () => void }

function CloseIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="square" /></svg>
}
function Arrow() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 6l6 6-6 6" strokeLinecap="square" /></svg>
}
function Back() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 6l-6 6 6 6" strokeLinecap="square" /></svg>
}

export default function MobileDrawer({ open, onClose }: Props) {
  const { pathname, search } = useLocation()
  const nav = useNavigate()
  const [rendered, setRendered] = useState(false)
  const [sub, setSub] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLAnchorElement | HTMLButtonElement | null)[]>([])
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [status] = useState(() => getVisitStatus(new Date(), contactConfig.hours))
  const [prevLoc, setPrevLoc] = useState(pathname + search)

  useFocusTrap(rootRef, open)
  useLockBodyScroll(open)

  if (open && !rendered) setRendered(true)
  if (!open && rendered && reduced) { setRendered(false); if (sub) setSub(false) }

  const loc = pathname + search
  if (open && loc !== prevLoc) { setPrevLoc(loc); onClose() }
  if (!open && loc !== prevLoc) setPrevLoc(loc)

  useEffect(() => {
    if (open) stopLenis()
    else startLenis()
    return () => { startLenis() }
  }, [open])



  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { if (sub) setSub(false); else onClose() } }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, sub, onClose])

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const items = itemRefs.current.filter(Boolean)
    if (open) {
      if (reduced) { gsap.set(panel, { x: 0 }); gsap.set(items, { opacity: 1, y: 0 }); return }
      gsap.fromTo(panel, { x: '-100%' }, { x: '0%', duration: 0.48, ease: 'cubic-bezier(0.2,0,0,1)', overwrite: 'auto' })
      gsap.fromTo(items, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.07, delay: 0.45, overwrite: 'auto' })
    } else if (rendered) {
      if (reduced) return
      gsap.to(panel, { x: '-100%', duration: 0.24, ease: 'cubic-bezier(0.2,0,0,1)', overwrite: 'auto', onComplete: () => { setRendered(false); setSub(false) } })
    }
  }, [open, rendered, reduced])

  useEffect(() => {
    const el = subRef.current
    if (!el) return
    if (sub) {
      if (reduced) { gsap.set(el, { x: 0 }); return }
      gsap.fromTo(el, { x: '100%' }, { x: '0%', duration: 0.24, ease: 'cubic-bezier(0.2,0,0,1)', overwrite: 'auto' })
    } else {
      if (reduced) { gsap.set(el, { x: '100%' }); return }
      gsap.to(el, { x: '100%', duration: 0.24, ease: 'cubic-bezier(0.2,0,0,1)', overwrite: 'auto' })
    }
  }, [sub, reduced])

  if (!rendered) return null

  const go = (href: string) => { onClose(); nav(href) }

  return (
    <div ref={rootRef} className="lg:hidden fixed inset-0 z-[300]" aria-hidden={!open}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
        className="absolute inset-0 bg-ink text-cream overflow-y-auto overscroll-contain"
        style={{ transform: 'translateX(-100%)' }}
        data-lenis-prevent
      >
        <div className="flex items-center justify-between px-6 h-[72px] border-b-2 border-cream/25">
          <Link to="/" onClick={onClose} aria-label="A & A Women Store home" className="inline-flex items-center focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink">
            <img src="/logo.png" alt="A & A Women Store" className="h-10 w-auto block" />
          </Link>
          <button type="button" aria-label="Close menu" onClick={onClose} className="flex h-11 w-11 items-center justify-center text-cream focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink">
            <CloseIcon />
          </button>
        </div>

        <nav className="px-6 pt-2 pb-[180px]" aria-label="Mobile">
          {navConfig.routes.map((r, i) => {
            const active = r.href === '/shop'
              ? pathname.startsWith('/shop') || pathname.startsWith('/product')
              : r.href === '/'
                ? pathname === '/'
                : r.href.startsWith('/shop?')
                  ? pathname === '/shop' && search.includes(r.href.split('?')[1] ?? '')
                  : pathname.startsWith(r.href)
            const cls = `flex w-full items-center justify-between border-b border-cream/20 py-4 font-display uppercase text-cream ${active ? 'text-gold' : ''}`
            const style = { fontSize: 'clamp(2.2rem,7vw,3.2rem)', lineHeight: 1.05 } as const
            if (r.hasMega) {
              return (
                <button key={r.label} ref={(el) => { itemRefs.current[i] = el }} type="button" className={cls} style={style} onClick={() => setSub(true)}>
                  <span>{r.label}</span><Arrow />
                </button>
              )
            }
            return (
              <Link key={r.label} ref={(el) => { itemRefs.current[i] = el }} to={r.href} className={cls} style={style} onClick={onClose}>
                {r.label}
              </Link>
            )
          })}
        </nav>

        <div className="fixed bottom-0 left-0 right-0 z-[302] bg-ink border-t-2 border-cream/25 px-6 py-4">
          <div className="flex items-center gap-2 mb-2">
            <span className={`font-mono text-[11px] uppercase tracking-wide ${status.open ? 'text-gold' : 'text-pink'}`}>{status.label}</span>
            <span className="font-mono text-[11px] text-cream/50">{status.detail}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[12px] text-cream mb-1.5">
            <a href={`tel:${contactConfig.phoneTel}`} className="hover:text-gold transition-colors">{contactConfig.phoneDisplay}</a>
            <span className="text-cream/30" aria-hidden="true">|</span>
            <a href={`https://wa.me/${contactConfig.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">WHATSAPP</a>
            <span className="text-cream/30" aria-hidden="true">|</span>
            <a href={`https://instagram.com/${contactConfig.instagram}`} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">INSTAGRAM</a>
          </div>
          <p className="font-mono text-[11px] text-cream/50">MON-FRI {contactConfig.hours.monFri} <span className="text-cream/30">|</span> SAT-SUN {contactConfig.hours.satSun}</p>
          <p className="font-mono text-[10px] text-cream/35 mt-1 leading-relaxed">{contactConfig.address}</p>
        </div>

        <div
          ref={subRef}
          className="fixed inset-0 z-[301] bg-ink text-cream overflow-y-auto overscroll-contain"
          style={{ transform: 'translateX(100%)' }}
          aria-hidden={!sub}
          data-lenis-prevent
        >
          <div className="flex items-center gap-3 px-6 h-[72px] border-b-2 border-cream/25">
            <button type="button" onClick={() => setSub(false)} className="flex items-center gap-2 h-11 font-display text-[14px] uppercase text-cream focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink">
              <Back /> BACK
            </button>
            <span className="ml-auto font-display text-lg uppercase text-gold">SHOP</span>
          </div>
          <div className="px-6 py-6 pb-[260px] space-y-8">
            {navConfig.megaMenu.columns.map((col) => (
              <div key={col.heading}>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-gold mb-3">{col.heading}</p>
                <div className="space-y-1">
                  {col.links.map((l) => (
                    <button key={l.label + l.href} type="button" onClick={() => go(l.href)} className="block w-full text-left font-display text-[1.3rem] uppercase text-cream py-1 hover:text-gold focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink">
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
