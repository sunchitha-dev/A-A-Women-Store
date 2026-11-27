import { useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import SplitWords from './motion/SplitWords'
import { trustBoxes } from '../data/trustConfig'

const BG: Record<string, string> = {
  pink: 'bg-pink',
  lilac: 'bg-lilac',
  gold: 'bg-gold',
  cream: 'bg-cream',
}

export default function TrustedBy() {
  const [openKey, setOpenKey] = useState<string | null>(null)

  return (
    <section className="border-b-3 border-ink bg-cream px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center gap-4">
          <SplitWords as="h2" className="font-display text-4xl uppercase md:text-6xl">TRUSTED BY CUSTOMERS</SplitWords>
          <Reveal><span className="nb-sticker bg-gold" style={{ transform: 'rotate(-4deg)' }}>5.0 RATED</span></Reveal>
        </div>

        <Reveal stagger="> div" className="mt-10 grid gap-6 md:grid-cols-4 md:items-start">
          {trustBoxes.map((box) => {
            const open = openKey === box.key
            const showCta = !box.link.startsWith('TODO')
            const cta = showCta ? (
              box.link.startsWith('/') ? (
                <Link to={box.link} className="nb-btn nb-btn-ink inline-block mt-4 text-sm">
                  {box.cta}
                </Link>
              ) : (
                <a href={box.link} target="_blank" rel="noreferrer" className="nb-btn nb-btn-ink inline-block mt-4 text-sm">
                  {box.cta}
                </a>
              )
            ) : null

            return (
              <div
                key={box.key}
                className={`nb-card min-h-[260px] md:min-h-[340px] p-0 cursor-pointer transition-[transform,box-shadow] duration-200 [transition-timing-function:cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none ${BG[box.bg]} ${open ? '-translate-y-1 shadow-nb-lg' : ''}`}
                onClick={() => setOpenKey(open ? null : box.key)}
                onMouseLeave={() => setOpenKey((k) => (k === box.key ? null : k))}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                    setOpenKey((k) => (k === box.key ? null : k))
                  }
                }}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  className="w-full p-5 text-left focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink focus-visible:outline-offset-[-3px]"
                  onClick={(e) => { e.stopPropagation(); setOpenKey(open ? null : box.key) }}
                  onMouseEnter={() => setOpenKey(box.key)}
                  onFocus={() => setOpenKey(box.key)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') { e.preventDefault(); setOpenKey(null); e.currentTarget.blur() }
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-mono text-xs uppercase tracking-widest text-ink">{box.title}</p>
                    <span
                      aria-hidden="true"
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-3 border-ink font-mono text-lg leading-none transition-transform duration-200 [transition-timing-function:cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none ${open ? 'bg-ink text-cream' : 'bg-cream text-ink'}`}
                      style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
                    >
                      +
                    </span>
                  </div>
                  <p className="mt-4 font-display text-3xl uppercase leading-none text-ink [overflow-wrap:anywhere] md:text-4xl">{box.big}</p>
                  <p className="mt-3 font-mono text-xs uppercase text-ink">{box.small}</p>

                  <div
                    className="grid transition-[grid-template-rows] duration-200 [transition-timing-function:cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none"
                    style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <p className="pt-4 font-body text-base text-ink">{box.detail}</p>
                    </div>
                  </div>
                </button>
                <div
                  className="grid px-5 transition-[grid-template-rows] duration-200 [transition-timing-function:cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none"
                  style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="overflow-hidden">
                    <div className="pb-5">{cta}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}