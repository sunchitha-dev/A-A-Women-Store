import Reveal from '../Reveal'

const WA = 'https://wa.me/917904733345'
const CHIPS = [
  { label: 'KOREAN DROP', msg: 'Hi A&A, I want to see your Korean drop.' },
  { label: 'ETHNIC FIT', msg: 'Hi A&A, I want to see ethnic styles.' },
  { label: 'CUSTOM TAILORING', msg: 'Hi A&A, I want to book custom tailoring.' },
]

export default function HomeWhatsAppDesk() {
  return (
    <section className="relative overflow-hidden bg-pink border-b-[4px] border-ink">
      <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 py-14 md:py-20 pr-20 md:pr-32">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/70 mb-3">WHATSAPP STYLE DESK</p>
        <h2 className="font-display uppercase leading-[0.9] text-ink [font-size:clamp(2.8rem,8vw,7rem)]">NEED A LOOK?</h2>
        <p className="mt-5 font-accent italic text-[clamp(1.2rem,2vw,1.8rem)] text-ink/80 max-w-2xl">Tell us what you want. We’ll help you pick from store stock or book tailoring.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {CHIPS.map((c) => (
            <a key={c.label} href={`${WA}?text=${encodeURIComponent(c.msg)}`} target="_blank" rel="noreferrer" className="nb-btn bg-cream text-ink !px-4 !py-3 text-[12px]">
              {c.label}
            </a>
          ))}
        </div>
      </Reveal>
      <img src="/contact/phone.webp" alt="" aria-hidden="true" className="pointer-events-none absolute right-3 bottom-3 w-12 opacity-70 md:right-10 md:bottom-8 md:w-20 md:opacity-100" />
      <img src="/contact/heart.webp" alt="" aria-hidden="true" className="pointer-events-none absolute right-16 top-4 w-8 opacity-60 md:right-28 md:top-8 md:w-12 md:opacity-100" />
    </section>
  )
}
