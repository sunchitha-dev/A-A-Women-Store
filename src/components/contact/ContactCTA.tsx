import { useState } from 'react'
import { contactConfig } from '../../data/contactConfig'
import Reveal from '../Reveal'
import SplitWords from '../motion/SplitWords'

function Img({ src, alt = '', className = '' }: { src: string; alt?: string; className?: string }) {
  const [bad, setBad] = useState(false)
  if (bad) return <div aria-hidden={alt === ''} className={`bg-lilac ${/aspect-/.test(className) ? '' : 'aspect-square'} ${className}`} />
  return <img src={src} alt={alt} className={className} onError={() => setBad(true)} />
}

export default function ContactCTA() {
  return (
    <section className="border-b-3 border-ink bg-ink px-4 py-16 sm:px-6 md:py-20">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden">
        <Img src="/about/gift-box.webp" alt="" className="pointer-events-none absolute -left-2 bottom-0 hidden w-20 sm:block md:w-28" />
        <Img src="/about/bags.webp" alt="" className="pointer-events-none absolute -right-2 top-0 w-20 md:w-28" />
        <Img src="/about/stamp-card.webp" alt="" className="pointer-events-none absolute right-8 bottom-2 hidden w-14 sm:block md:w-20" />
        <Img src="/contact/bow.webp" alt="" className="pointer-events-none absolute left-8 top-2 w-10 md:w-14" />

        <div className="relative px-4 py-8 text-center md:py-10">
          <SplitWords as="h2" mode="chars" stagger={0.03} className="font-display text-4xl uppercase text-gold md:text-7xl">TALK TO US.</SplitWords>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
            <a href={`https://wa.me/${contactConfig.whatsapp}`} target="_blank" rel="noopener noreferrer" className="nb-btn nb-btn-pink min-h-[48px] w-full justify-center sm:w-auto">WHATSAPP</a>
            <a href={`tel:${contactConfig.phoneTel}`} className="nb-btn min-h-[48px] w-full justify-center bg-gold sm:w-auto">CALL</a>
            <a href={`https://instagram.com/${contactConfig.instagram}`} target="_blank" rel="noopener noreferrer" className="nb-btn min-h-[48px] w-full justify-center bg-cream sm:w-auto">INSTAGRAM</a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
