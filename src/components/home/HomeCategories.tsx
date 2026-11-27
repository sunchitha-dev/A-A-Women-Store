import { Link } from 'react-router-dom'
import Reveal from '../Reveal'

const CATS = [
  { n: '01', name: 'KOREAN COLLECTION', line: 'Imported dresses, tops and pants.', prop: '/hero/scarf.webp', bg: 'bg-pink', href: '/shop?cat=korean' },
  { n: '02', name: 'WESTERN AND CASUAL', line: 'Co-ord sets, jeans, jackets and more.', prop: '/hero/sunglasses.webp', bg: 'bg-lilac', href: '/shop?cat=western' },
  { n: '03', name: 'ETHNIC AND FUSION', line: 'Kurtis, anarkalis, sarees and more.', prop: '/tailor/dressform.webp', bg: 'bg-gold', href: '/shop?cat=ethnic' },
  { n: '04', name: 'INNERWEAR AND LOUNGE', line: 'Soft, lightweight everyday wear.', prop: '/hero/hoodie.webp', bg: 'bg-cream', href: '/shop?cat=innerwear' },
  { n: '05', name: 'ACCESSORIES', line: 'Bags, sunglasses, scarves.', prop: '/hero/handbag.webp', bg: 'bg-white', href: '/shop?cat=accessories' },
  { n: '06', name: 'CUSTOM TAILORING', line: 'Stitched to your measurements.', prop: '/tailor/scissors.webp', bg: 'bg-pink', href: '/tailoring' },
]

export default function HomeCategories() {
  return (
    <section className="bg-cream border-b-[4px] border-ink px-4 sm:px-6 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex items-end gap-4 mb-10">
            <div>
              <h2 className="font-display uppercase text-ink [font-size:clamp(2rem,5vw,4rem)] leading-none">SHOP BY CATEGORY</h2>
              <p className="font-accent italic text-[20px] text-ink/50 mt-2">Find your style.</p>
            </div>
            <img src="/hero/starburst.webp" alt="" aria-hidden="true" className="w-10 h-10 mb-2 [animation:spin_20s_linear_infinite] motion-reduce:[animation:none]" />
          </div>
        </Reveal>

        <Reveal stagger=":scope > a" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATS.map((c) => (
            <Link
              key={c.n}
              to={c.href}
              className={`group relative block min-h-[280px] ${c.bg} border-[3px] border-ink shadow-nb p-6 overflow-hidden transition-all duration-[240ms] [transition-timing-function:var(--ease-out)] [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:shadow-nb-lg focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink`}
            >
              <span className="absolute top-4 left-4 font-display text-[80px] leading-none text-ink/10">{c.n}</span>
              <div className="relative z-10 pt-12">
                <h3 className="font-display text-[24px] uppercase text-ink leading-tight">{c.name}</h3>
                <p className="mt-2 font-body text-[14px] text-ink/70 max-w-[75%]">{c.line}</p>
              </div>
              <img src={c.prop} alt="" aria-hidden="true" className="absolute bottom-4 right-4 w-20 h-20 object-contain transition-transform duration-[240ms] [transition-timing-function:var(--ease-out)] [@media(hover:hover)]:group-hover:scale-[1.12] [@media(hover:hover)]:group-hover:rotate-[6deg]" />
              <span className="absolute bottom-4 left-6 font-display text-xl text-ink" aria-hidden="true">→</span>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
