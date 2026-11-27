import { useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import SplitWords from './motion/SplitWords'

function Img({ src, alt = '', className = '' }: { src: string; alt?: string; className?: string }) {
  const [bad, setBad] = useState(false)
  if (bad) return <div aria-hidden={alt === ''} className={`bg-lilac ${/aspect-/.test(className) ? '' : 'aspect-square'} ${className}`} />
  return <img src={src} alt={alt} className={className} onError={() => setBad(true)} />
}

export default function HomeCTA() {
  return (
    <section className="border-b-3 border-ink bg-ink px-4 py-16 sm:px-6 md:py-20">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden">
        <Img src="/contact/sparkle.webp" alt="" className="pointer-events-none absolute -left-2 top-0 w-10 sm:w-12 md:w-24" />
        <Img src="/hero/heart.webp" alt="" className="pointer-events-none absolute -right-2 bottom-0 w-10 sm:w-12 md:w-24" />
        <Img src="/about/gift-box.webp" alt="" className="pointer-events-none absolute right-10 top-2 hidden w-14 sm:block md:w-20" />

        <div className="relative px-12 py-12 text-center sm:px-10 md:px-4">
          <SplitWords as="h2" mode="chars" stagger={0.03} className="font-display whitespace-nowrap [font-size:clamp(1.8rem,8.5vw,2.25rem)] sm:text-4xl uppercase text-gold md:text-7xl">FIND YOUR LOOK.</SplitWords>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/shop" className="nb-btn nb-btn-pink">SHOP NOW</Link>
            <a href="https://wa.me/917904733345" target="_blank" rel="noreferrer" className="nb-btn bg-gold">WHATSAPP US</a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
