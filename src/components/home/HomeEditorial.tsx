import { Link } from 'react-router-dom'
import Reveal from '../Reveal'

const LOOKS = [
  { kicker: 'THE A&A EDIT', title: 'KOREAN DROP', copy: 'Fresh imported silhouettes. Easy, bold, ready to wear.', cta: 'SHOP KOREAN', href: '/shop?cat=korean', img: '/tryon/party_11.webp', bg: 'bg-lilac', reverse: false, icon: '/hero/starburst.webp', iconCls: 'left-4 top-4 w-8 md:left-8 md:top-8 md:w-12' },
  { kicker: 'THE A&A EDIT', title: 'WEEKEND WESTERN', copy: 'Denim, co-ords, and everyday layers with attitude.', cta: 'SHOP WESTERN', href: '/shop?cat=western', img: '/tryon/jeans_01.webp', bg: 'bg-cream', reverse: true, icon: '/hero/sunglasses.webp', iconCls: 'right-4 top-4 w-10 md:right-8 md:top-8 md:w-14' },
]

export default function HomeEditorial() {
  return (
    <section className="border-b-[4px] border-ink">
      {LOOKS.map((l) => (
        <Reveal key={l.title} className={`relative overflow-hidden border-b-[4px] last:border-b-0 border-ink ${l.bg}`}>
          <div className={`mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-20 grid md:grid-cols-2 gap-8 md:gap-12 items-center ${l.reverse ? 'md:[&>*:first-child]:order-2' : ''}`}>
            <div className="relative pr-14 md:pr-0">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 mb-3">{l.kicker}</p>
              <h2 className="font-display uppercase leading-[0.9] text-ink [font-size:clamp(2.8rem,7vw,6rem)]">{l.title}</h2>
              <p className="mt-5 font-accent italic text-[clamp(1.2rem,2vw,1.8rem)] text-ink/75 max-w-lg">{l.copy}</p>
              <Link to={l.href} className="inline-block mt-7 font-display text-sm uppercase tracking-[0.12em] border-b-[3px] border-ink text-ink hover:text-pink hover:border-pink transition-colors duration-[120ms]">
                {l.cta} →
              </Link>
              <img src={l.icon} alt="" aria-hidden="true" className={`pointer-events-none absolute ${l.iconCls} opacity-70 md:opacity-100`} />
            </div>
            <div className="relative max-w-md mx-auto md:ml-auto">
              <img src={l.img} alt={l.title} className="block w-full aspect-[3/4] object-cover border-[3px] border-ink" loading="lazy" />
            </div>
          </div>
        </Reveal>
      ))}
    </section>
  )
}
