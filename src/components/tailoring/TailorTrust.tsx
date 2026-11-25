import { useState } from 'react'
import { tailoringConfig } from '../../data/tailoringConfig'
import Reveal from '../Reveal'

const FAQS = [
  { q: 'What is the turnaround time?', a: 'Turnaround depends on the garment and work needed. Share your requirement in store or on WhatsApp for the exact timeline.' },
  { q: 'How is pricing decided?', a: 'Pricing depends on garment type, design, and fabric work. We confirm the price after understanding your requirement.' },
  { q: 'Do you take advance?', a: 'Advance details are shared when your order is confirmed.' },
  { q: 'Do you offer pickup?', a: 'Pickup availability can be confirmed when you book your fitting.' },
]

export default function TailorTrust() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="border-b-3 border-ink bg-cream">
      <div className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-xs uppercase tracking-widest text-ink">The A&A Promise</p>
          <Reveal>
            <h2 className="mt-2 font-display text-4xl uppercase md:text-6xl">Made to Fit. Made to Flaunt.</h2>
          </Reveal>

          <div className="mt-8 flex flex-wrap gap-4">
            <span className="nb-sticker font-display" style={{ background: '#D4AF55', transform: 'rotate(-2deg)' }}>
              CUT SHARP. FIT SHARPER.
            </span>
            <span className="nb-sticker font-display" style={{ background: '#FF4D8D', transform: 'rotate(2deg)' }}>
              YOUR SILHOUETTE, YOUR RULES.
            </span>
          </div>

          {tailoringConfig.reviews.length > 0 && (
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {tailoringConfig.reviews.map((r, i) => (
                <article key={i} className="nb-card bg-white p-5">
                  <p className="font-body text-lg text-ink">"{r.text}"</p>
                  <p className="mt-3 font-mono text-xs uppercase text-ink">{r.name}</p>
                </article>
              ))}
            </div>
          )}

          <div className="mt-12">
            <p className="font-mono text-xs uppercase tracking-widest text-ink">FAQ</p>
            <div className="mt-4 space-y-3">
              {FAQS.map((faq, i) => {
                const isOpen = open === i
                const panelId = `faq-panel-${i}`
                const btnId = `faq-btn-${i}`
                return (
                  <div
                    key={faq.q}
                    className="nb-card bg-white"
                    onMouseEnter={() => setOpen(i)}
                    onMouseLeave={() => setOpen((k) => (k === i ? null : k))}
                    onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen((k) => (k === i ? null : k)) }}
                  >
                    <button
                      id={btnId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : i)}
                      onFocus={() => setOpen(i)}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink focus-visible:outline-offset-[-3px]"
                    >
                      <span className="font-display text-lg uppercase text-ink md:text-xl">{faq.q}</span>
                      <span
                        className="shrink-0 font-mono text-2xl text-ink transition-transform duration-500 [transition-timing-function:cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none"
                        style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </button>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={btnId}
                      className="grid transition-[grid-template-rows] duration-500 [transition-timing-function:cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none"
                      style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                    >
                      <div className="overflow-hidden">
                        <div className="border-t-3 border-ink px-5 py-4">
                          <p className="font-body text-lg text-ink">{faq.a}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden border-t-3 border-ink bg-ink px-4 py-14 sm:px-6">
        <img
          src="/tailor/pincushion.webp"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -left-2 bottom-0 w-20 md:left-6 md:w-28"
        />
        <img
          src="/tailor/scissors.webp"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-2 top-0 w-20 rotate-12 md:right-6 md:w-28"
        />
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
          <Reveal>
            <h2 className="font-display text-4xl uppercase text-gold md:text-6xl">READY TO GET FITTED?</h2>
          </Reveal>
          <button
            type="button"
            className="nb-btn bg-gold"
            onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })}
          >
            BOOK A FITTING
          </button>
        </div>
      </div>
    </section>
  )
}