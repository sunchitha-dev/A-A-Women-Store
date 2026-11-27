import { useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../Reveal'
import SplitWords from '../motion/SplitWords'

function Img({ src, alt = '', className = '' }: { src: string; alt?: string; className?: string }) {
  const [bad, setBad] = useState(false)
  if (bad) return <div aria-hidden={alt === ''} className={`bg-lilac ${/aspect-/.test(className) ? '' : 'aspect-square'} ${className}`} />
  return <img src={src} alt={alt} className={className} onError={() => setBad(true)} />
}

export default function CartCTA() {
  return (
    <section className="border-b-3 border-ink bg-ink px-4 py-16 sm:px-6 md:py-20">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden">
        <Img src="/about/gift-box.webp" alt="" className="pointer-events-none absolute -left-2 bottom-0 w-10 sm:w-14 md:w-28" />
        <Img src="/contact/sparkle.webp" alt="" className="pointer-events-none absolute -right-2 top-0 w-8 sm:w-10 md:w-20" />
        <Img src="/contact/paper-plane.webp" alt="" className="pointer-events-none absolute right-8 bottom-2 hidden w-12 sm:block md:w-16" />

        <div className="relative px-12 py-12 text-center sm:px-10 md:px-4">
          <SplitWords as="h2" mode="chars" stagger={0.03} className="font-display whitespace-nowrap [font-size:clamp(1.8rem,8.5vw,2.25rem)] sm:text-4xl uppercase text-gold md:text-7xl">ALMOST YOURS.</SplitWords>
          <p className="mt-4 font-serif text-xl italic text-cream md:text-2xl">Questions about fit, delivery, or pickup? Ask us.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="https://wa.me/917904733345" target="_blank" rel="noreferrer" className="nb-btn nb-btn-pink">WHATSAPP US</a>
            <Link to="/shop" className="nb-btn bg-gold">KEEP SHOPPING</Link>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
