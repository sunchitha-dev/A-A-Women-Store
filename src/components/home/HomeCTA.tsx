import { useState } from 'react'
import { Link } from 'react-router-dom'
import { contactConfig } from '../../data/contactConfig'
import Reveal from '../Reveal'
import SplitWords from '../motion/SplitWords'

function Img({ src, alt = '', className = '' }: { src: string; alt?: string; className?: string }) {
  const [bad, setBad] = useState(false)
  if (bad) return <div aria-hidden={alt === ''} className={`bg-lilac ${/aspect-/.test(className) ? '' : 'aspect-square'} ${className}`} />
  return <img src={src} alt={alt} className={className} onError={() => setBad(true)} />
}

export default function HomeCTA() {
  const mapQ = encodeURIComponent(contactConfig.address)
  return (
    <section className="border-b-3 border-ink bg-ink px-4 py-16 sm:px-6 md:py-20">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden">
        <Img src="/about/gift-box.webp" alt="" className="pointer-events-none absolute -left-2 bottom-0 w-10 sm:w-14 md:w-28" />
        <Img src="/about/bags.webp" alt="" className="pointer-events-none absolute -right-2 top-0 w-10 sm:w-14 md:w-28" />
        <Img src="/about/hanger-gold.webp" alt="" className="pointer-events-none absolute left-2 top-2 w-7 sm:left-1/2 sm:top-0 sm:w-8 sm:-translate-x-1/2 md:w-14" />

        <div className="relative px-12 py-12 text-center sm:px-10 md:px-4">
          <SplitWords as="h2" mode="chars" stagger={0.03} className="font-display whitespace-nowrap [font-size:clamp(1.8rem,8vw,2.25rem)] sm:text-4xl uppercase text-gold md:text-7xl">STEP IN STYLE.</SplitWords>
          <p className="font-body text-cream/80 text-base mt-5 max-w-2xl mx-auto">Visit us in Old Pallavaram, Chennai — or shop online.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/shop" className="nb-btn bg-gold text-ink">SHOP NOW</Link>
            <a href={`https://wa.me/${contactConfig.whatsapp}?text=${encodeURIComponent('Hi, I want to visit the store')}`} target="_blank" rel="noreferrer" className="nb-btn nb-btn-pink">WHATSAPP US</a>
            <a href={`https://www.google.com/maps/search/?api=1&query=${mapQ}`} target="_blank" rel="noreferrer" className="nb-btn bg-cream text-ink">DIRECTIONS</a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
