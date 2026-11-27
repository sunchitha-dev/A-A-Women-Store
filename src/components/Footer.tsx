import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { contactConfig } from '../data/contactConfig'
import Reveal from './Reveal'

const year = new Date().getFullYear()
const messages: Record<string, string> = {
  '/': 'New looks. Bold moves.',
  '/shop': 'Pick it. Bag it. Wear it.',
  '/cart': 'Almost yours.',
  '/tailoring': 'Stitched to fit you.',
  '/about': 'Come say hi.',
  '/contact': "Let's talk style.",
}

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg className="mt-0.5 h-4 w-4 shrink-0 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden="true">
      {children}
    </svg>
  )
}

export default function Footer() {
  const { pathname } = useLocation()
  const msg = messages[pathname] ?? "Drop in. Try it. Take it home."
  return (
    <footer className="border-t-3 border-ink bg-ink text-gold">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <Reveal>
          <img src="/logo.png" alt="A & A Women Store" className="h-20 w-20 border-3 border-gold object-cover" width={80} height={80} />
          <p className="mt-3 font-display text-xl uppercase text-cream">{msg}</p>
          <p className="mt-2 font-body text-sm text-gold">Women's fashion, Old Pallavaram.</p>
        </Reveal>

        <Reveal>
          <h3 className="font-display uppercase text-sm text-cream">Visit</h3>
          <div className="mt-3 flex gap-2 font-body text-sm leading-relaxed">
            <Icon><path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></Icon>
            <address className="not-italic">
              No. 108, PV Vaithiyalingam Road<br />(Opp. IOB), Malliga Nagar,<br />Krishnapuram, Old Pallavaram,<br />Chennai 600117
            </address>
          </div>
          <h3 className="mt-6 font-display uppercase text-sm text-cream">Hours</h3>
          <ul className="mt-3 space-y-1 font-mono text-xs uppercase text-cream">
            {[`Mon – Fri: ${contactConfig.hours.monFri.replace('-', ' – ')}`, `Sat – Sun: ${contactConfig.hours.satSun.replace('-', ' – ')}`].map((h) => (
              <li key={h} className="flex gap-2"><Icon><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Icon><span>{h}</span></li>
            ))}
          </ul>
        </Reveal>

        <Reveal>
          <h3 className="font-display uppercase text-sm text-cream">Contact</h3>
          <div className="mt-3 space-y-2 font-body text-sm">
            <a href={`tel:${contactConfig.phoneTel}`} className="flex gap-2 hover:text-cream hover:underline">
              <Icon><path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.1 5.2 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.7c.1.9.4 1.7.7 2.5a2 2 0 0 1-.5 2.1L9 10.9a16 16 0 0 0 4.1 4.1l1.6-1.2a2 2 0 0 1 2.1-.5c.8.3 1.6.6 2.5.7A2 2 0 0 1 22 16.9z" /></Icon>
              <span>{contactConfig.phoneDisplay}</span>
            </a>
            <a href={`https://wa.me/${contactConfig.whatsapp}`} target="_blank" rel="noreferrer" className="flex gap-2 hover:text-cream hover:underline">
              <Icon><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z" /></Icon>
              <span>WhatsApp</span>
            </a>
            <a href={`https://instagram.com/${contactConfig.instagram}`} target="_blank" rel="noreferrer" className="flex gap-2 hover:text-cream hover:underline">
              <Icon><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></Icon>
              <span>@{contactConfig.instagram}</span>
            </a>
          </div>
        </Reveal>

        <Reveal>
          <h3 className="font-display uppercase text-sm text-cream">Payments</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {['Cash', 'Cards', 'UPI'].map((p) => (
              <li key={p} className="border-3 border-gold px-2 py-1 font-mono text-xs uppercase">{p}</li>
            ))}
          </ul>
          <nav className="mt-6 flex flex-col gap-2 font-body text-sm" aria-label="Footer">
            <Link to="/shop" className="hover:text-cream hover:underline">Shop</Link>
            <Link to="/tailoring" className="hover:text-cream hover:underline">Tailoring</Link>
            <Link to="/contact" className="hover:text-cream hover:underline">Contact</Link>
          </nav>
        </Reveal>
      </div>

      <Reveal>
        <div className="border-t-3 border-gold px-6 py-4 text-center font-mono text-xs">
          © {year} A &amp; A Women Store — Old Pallavaram, Chennai
        </div>
      </Reveal>
    </footer>
  )
}
