import { useEffect, useMemo, useState } from 'react'
import { aboutConfig } from '../../data/aboutConfig'
import { getVisitStatus } from '../../lib/openNow'
import Reveal from '../Reveal'
import SplitWords from '../motion/SplitWords'

function Img({ src, alt = '', className = '' }: { src: string; alt?: string; className?: string }) {
  const [bad, setBad] = useState(false)
  if (bad) return <div aria-hidden={alt === ''} className={`bg-lilac ${className}`} />
  return <img src={src} alt={alt} className={className} onError={() => setBad(true)} />
}

export default function VisitUs() {
  const { address, landmark, phone, whatsapp, payments, delivery, hours } = aboutConfig
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(id)
  }, [])
  const status = useMemo(() => getVisitStatus(now, hours), [now, hours])
  const mapQ = encodeURIComponent(address)
  const mapSrc = `https://www.google.com/maps?q=${mapQ}&output=embed`
  const dirSrc = `https://www.google.com/maps/search/?api=1&query=${mapQ}`

  return (
    <section id="visit" className="border-b-3 border-ink bg-cream px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SplitWords as="h2" className="font-display text-4xl uppercase text-ink md:text-6xl">Visit Us</SplitWords>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <Reveal className="space-y-6" stagger=".nb-card" staggerEach={0.12}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="nb-card relative flex-1 bg-white p-6">
                <Img src="/about/pin.webp" alt="" className="absolute -top-5 right-6 w-10 motion-safe:animate-[bounce_2.4s_ease-in-out_infinite] motion-reduce:animate-none md:w-12" />
                <p className="font-mono text-xs uppercase tracking-widest text-ink">Address</p>
                <p className="mt-2 font-body text-lg text-ink">{address}</p>
                {landmark ? <p className="mt-1 font-mono text-sm text-ink">{landmark}</p> : null}
                <p className="mt-4 font-body text-lg text-ink">
                  <a href={`tel:${phone.replace(/\s/g, '')}`} className="underline decoration-ink underline-offset-2">{phone}</a>
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {payments.map((p) => <span key={p} className="nb-chip">{p}</span>)}
                </div>
                <p className="mt-4 font-body text-base text-ink">{delivery}</p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={dirSrc} target="_blank" rel="noreferrer" className="nb-btn bg-gold">GET DIRECTIONS</a>
                  <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="nb-btn nb-btn-pink">WHATSAPP</a>
                </div>
              </div>
              <Img src="/about/shopfront.webp" alt="" className="w-[140px] shrink-0 self-center sm:self-start md:w-[160px]" />
            </div>

            <div className="nb-card bg-white p-6">
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-mono text-xs uppercase tracking-widest text-ink">Hours</p>
                <span className="nb-sticker" style={{ background: status.open ? '#FF4D8D' : '#0A0A0A', color: status.open ? '#0A0A0A' : '#FFF6E0', transform: 'rotate(-2deg)' }}>
                  {status.label}
                </span>
                <span className="font-mono text-sm text-ink">{status.detail}</span>
              </div>
              <table className="mt-4 w-full font-mono text-sm text-ink">
                <tbody>
                  <tr className="border-t-2 border-ink">
                    <td className="py-2 pr-4 uppercase">Mon - Fri</td>
                    <td className="py-2">{hours.monFri}</td>
                  </tr>
                  <tr className="border-t-2 border-ink">
                    <td className="py-2 pr-4 uppercase">Sat - Sun</td>
                    <td className="py-2">{hours.satSun}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal className="relative">
            <div className="border-[4px] border-ink bg-white shadow-[10px_10px_0_#0A0A0A] md:rotate-[1deg]">
              <div className="flex items-center gap-2 border-b-[4px] border-ink bg-cream px-3 py-2">
                <span className="h-3 w-3 rounded-full border-2 border-ink bg-pink" />
                <span className="h-3 w-3 rounded-full border-2 border-ink bg-gold" />
                <span className="h-3 w-3 rounded-full border-2 border-ink bg-lilac" />
                <span className="ml-2 font-mono text-xs text-ink">MAP</span>
              </div>
              <iframe
                title="A and A Women Store map"
                src={mapSrc}
                loading="lazy"
                className="h-[360px] w-full border-0 md:h-full md:min-h-[520px]"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
