import { useState } from 'react'
import Reveal from '../Reveal'
import { getVisitStatus } from '../../lib/openNow'
import { contactConfig } from '../../data/contactConfig'

const ADDRESS = 'No.108, PV Vaithiyalingam Road (Opposite IOB), Malliga Nagar, Krishnapuram, Old Pallavaram, Chennai 600117'
const DIR = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS)}`
const WA = 'https://wa.me/917904733345'

export default function HomeVisit() {
  const [status] = useState(() => getVisitStatus(new Date(), contactConfig.hours))

  return (
    <section className="bg-cream border-b-[4px] border-ink px-4 sm:px-6 py-16 md:py-24 overflow-hidden" style={{ backgroundImage: 'linear-gradient(rgba(10,10,10,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.06) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex items-center gap-3 mb-10">
            <h2 className="font-display uppercase text-ink [font-size:clamp(2rem,5vw,3rem)] leading-none">COME SAY HI.</h2>
            <img src="/about/pin.webp" alt="" aria-hidden="true" className="w-[36px] [animation:aa-bounce_1.8s_ease-in-out_infinite] motion-reduce:[animation:none]" />
          </div>
        </Reveal>

        <Reveal stagger=":scope > div" className="grid md:grid-cols-2 gap-6">
          <div className="nb-card bg-white p-6 md:p-8">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="font-display text-[24px] uppercase text-ink">FIND US</h3>
              <span className={`nb-sticker ${status.open ? 'bg-pink text-ink' : 'bg-ink text-cream'}`}>{status.label}</span>
            </div>
            <p className="font-body text-[15px] text-ink/80 leading-relaxed">{ADDRESS}</p>
            <div className="mt-4 font-mono text-[12px] text-ink/70 space-y-1">
              <p>Mon-Fri 9:30-21:00</p>
              <p>Sat-Sun 9:30-22:00</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={DIR} target="_blank" rel="noreferrer" className="nb-btn bg-gold text-ink">GET DIRECTIONS</a>
              <a href="tel:+917904733345" className="nb-btn bg-cream text-ink">CALL</a>
            </div>
          </div>

          <div className="nb-card bg-lilac p-6 md:p-8 relative overflow-hidden">
            <h3 className="font-display text-[24px] uppercase text-ink mb-4">CONTACT US</h3>
            <p className="font-display text-[28px] text-ink">+91 79047 33345</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={WA} target="_blank" rel="noreferrer" className="nb-btn nb-btn-pink">WHATSAPP US</a>
            </div>
            <a href="https://instagram.com/aandawomenstore" target="_blank" rel="noreferrer" className="inline-block mt-4 font-mono text-sm text-ink underline underline-offset-4 hover:text-pink">INSTAGRAM @aandawomenstore</a>
            <img src="/contact/phone.webp" alt="" aria-hidden="true" className="absolute bottom-4 right-20 w-[60px] pointer-events-none [animation:aa-float-a_4.5s_ease-in-out_infinite] motion-reduce:[animation:none]" />
            <img src="/contact/bell.webp" alt="" aria-hidden="true" className="absolute top-4 right-4 w-[40px] pointer-events-none [animation:aa-float-a_5s_ease-in-out_infinite_0.6s] motion-reduce:[animation:none]" />
          </div>
        </Reveal>
      </div>
      <style>{`@keyframes aa-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} } @keyframes aa-float-a { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }`}</style>
    </section>
  )
}
