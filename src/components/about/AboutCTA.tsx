import { useState } from 'react'
import { aboutConfig } from '../../data/aboutConfig'
import Reveal from '../Reveal'

function Img({ src, alt = '', className = '' }: { src: string; alt?: string; className?: string }) {
  const [bad, setBad] = useState(false)
  if (bad) return <div aria-hidden={alt === ''} className={`bg-lilac ${/aspect-/.test(className) ? '' : 'aspect-square'} ${className}`} />
  return <img src={src} alt={alt} className={className} onError={() => setBad(true)} />
}

export default function AboutCTA() {
  const mapQ = encodeURIComponent(aboutConfig.address)
  return (
    <section className="border-b-3 border-ink bg-ink px-4 py-16 sm:px-6 md:py-20">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden">
        <Img src="/about/gift-box.webp" alt="" className="pointer-events-none absolute -left-2 bottom-0 w-20 md:w-28" />
        <Img src="/about/bags.webp" alt="" className="pointer-events-none absolute -right-2 top-0 w-20 md:w-28" />
        <Img src="/about/hanger-gold.webp" alt="" className="pointer-events-none absolute left-1/2 top-0 w-10 -translate-x-1/2 md:w-14" />

        <div className="relative px-4 py-8 text-center md:py-10">
          <h2 className="font-display text-4xl uppercase text-gold md:text-7xl">COME SAY HI.</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href={`https://wa.me/${aboutConfig.whatsapp}`} target="_blank" rel="noreferrer" className="nb-btn nb-btn-pink">WHATSAPP US</a>
            <a href={`https://www.google.com/maps/search/?api=1&query=${mapQ}`} target="_blank" rel="noreferrer" className="nb-btn bg-gold">DIRECTIONS</a>
            <a href="https://instagram.com/aandawomenstore" target="_blank" rel="noreferrer" className="nb-btn bg-cream">INSTAGRAM</a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
