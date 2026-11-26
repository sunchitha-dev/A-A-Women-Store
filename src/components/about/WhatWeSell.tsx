import { useState } from 'react'
import { Link } from 'react-router-dom'
import { aboutConfig } from '../../data/aboutConfig'
import Reveal from '../Reveal'
import SplitWords from '../motion/SplitWords'
import Parallax from '../motion/Parallax'

const BGS = ['bg-pink', 'bg-lilac', 'bg-gold', 'bg-cream', 'bg-white', 'bg-pink']

function Img({ src, alt = '', className = '' }: { src: string; alt?: string; className?: string }) {
  const [bad, setBad] = useState(false)
  if (bad) return <div aria-hidden={alt === ''} className={`bg-lilac aspect-square ${className}`} />
  return <img src={src} alt={alt} className={className} onError={() => setBad(true)} />
}

export default function WhatWeSell() {
  const cats = aboutConfig.categories
  const text = cats.map((c) => c.name).join(' ✦ ') + ' ✦ '
  const items = Array.from({ length: 8 }, () => text)

  return (
    <section className="border-b-3 border-ink bg-cream">
      <div className="nb-marquee [&:hover_.nb-marquee-track]:[animation-play-state:paused]" aria-label="Categories">
        <div className="nb-marquee-track">
          {items.concat(items).map((t, i) => (
            <span key={i} className="px-6 py-3 font-display text-xl uppercase text-ink md:text-2xl">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center gap-4">
            <SplitWords as="h2" className="font-display text-4xl uppercase text-ink md:text-6xl">WHAT WE SELL</SplitWords>
            <Parallax speed={0.12} className="w-16 md:w-20">
              <Img src="/about/rail.webp" alt="" className="w-full -rotate-[4deg]" />
            </Parallax>
          </div>

          <Reveal stagger=":scope > a" className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cats.map((c, i) => {
              const to = c.link ?? `/shop?cat=${c.slug}`
              const num = String(i + 1).padStart(2, '0')
              return (
                <Link
                  key={c.slug}
                  to={to}
                  className={`nb-card group block p-6 text-ink transition-all duration-150 hover:translate-x-0 hover:-translate-y-1 hover:shadow-nb-lg focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink focus-visible:outline-offset-2 ${BGS[i] ?? 'bg-white'}`}
                >
                  <p className="font-display text-6xl leading-none text-ink md:text-7xl">{num}</p>
                  <h3 className="mt-3 font-display text-2xl uppercase text-ink md:text-3xl">{c.name}</h3>
                  <p className="mt-2 font-body text-base leading-relaxed text-ink">{c.line}</p>
                  <Img
                    src={c.prop}
                    alt=""
                    className="mt-5 ml-auto block w-20 object-contain transition-transform duration-200 group-hover:-translate-y-2 group-hover:rotate-3 group-hover:scale-110 group-focus-visible:-translate-y-2 group-focus-visible:rotate-3 group-focus-visible:scale-110 md:w-28"
                  />
                </Link>
              )
            })}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
