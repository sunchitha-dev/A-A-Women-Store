import { Link } from 'react-router-dom'
import Reveal from '../Reveal'

const ROWS = [
  { word: 'IMPORTED KOREAN', sub: 'Fresh drops, picked for A&A.', cta: 'SHOP KOREAN', href: '/shop?cat=korean', bg: 'bg-cream', text: 'text-ink', icon: '/hero/starburst.webp', iconCls: 'right-4 top-4 w-10 md:right-10 md:top-6 md:w-16' },
  { word: 'CUSTOM FIT', sub: 'Stitched to your measurements, in store.', cta: 'BOOK TAILORING', href: '/tailoring', bg: 'bg-gold', text: 'text-ink', icon: '/tailor/scissors.webp', iconCls: 'right-4 bottom-4 w-10 md:right-10 md:bottom-6 md:w-14 rotate-12' },
  { word: 'OLD PALLAVARAM', sub: 'Come see the collection in Chennai.', cta: 'VISIT STORE', href: '/contact', bg: 'bg-ink', text: 'text-cream', icon: '/about/pin.webp', iconCls: 'right-4 top-4 w-8 md:right-10 md:top-6 md:w-12' },
]

export default function HomeStatements() {
  return (
    <section className="border-b-[4px] border-ink">
      {ROWS.map((r) => (
        <Reveal key={r.word} className={`relative overflow-hidden border-b-[4px] last:border-b-0 border-ink ${r.bg} ${r.text}`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 md:py-14 pr-16 md:pr-28">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-70 mb-3">{r.sub}</p>
            <h2 className="font-display uppercase leading-[0.9] [font-size:clamp(2.6rem,8vw,7rem)]">{r.word}</h2>
            <Link to={r.href} className={`inline-block mt-6 font-display text-sm uppercase tracking-[0.12em] border-b-[3px] ${r.text === 'text-cream' ? 'border-gold text-gold hover:text-cream hover:border-cream' : 'border-ink text-ink hover:text-pink hover:border-pink'} transition-colors duration-[120ms]`}>
              {r.cta} →
            </Link>
          </div>
          <img src={r.icon} alt="" aria-hidden="true" className={`pointer-events-none absolute ${r.iconCls} opacity-80 md:opacity-100`} />
        </Reveal>
      ))}
    </section>
  )
}
