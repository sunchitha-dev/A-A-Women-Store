import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import catalog from '../data/catalog.json'
import { useCart } from '../store/cart'
import Reveal from './Reveal'
import SplitWords from './motion/SplitWords'

type Look = { id: string; name: string; code: string }

const LOOKS = catalog as Look[]
const IDS = LOOKS.map((l) => l.id)
const WA = '917904733345'

function productImg(id: string) {
  return `/products/${id}.webp`
}

export default function FeaturedLooks() {
  const [selected, setSelected] = useState('kurti_01')
  const [displayed, setDisplayed] = useState('kurti_01')
  const [reduced, setReduced] = useState(false)
  const wipeRef = useRef<HTMLDivElement>(null)
  const busy = useRef(false)
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([])
  const add = useCart((s) => s.add)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    IDS.forEach((id) => {
      const a = new Image()
      a.src = `/tryon/${id}.webp`
      const b = new Image()
      b.src = productImg(id)
    })
  }, [])

  const select = useCallback(
    (id: string) => {
      if (id === selected || busy.current) return
      setSelected(id)
      if (reduced || !wipeRef.current) {
        setDisplayed(id)
        return
      }
      busy.current = true
      const wipe = wipeRef.current
      gsap.killTweensOf(wipe)
      gsap
        .timeline({
          onComplete: () => {
            busy.current = false
          },
        })
        .set(wipe, { xPercent: -101, display: 'block' })
        .to(wipe, {
          xPercent: 0,
          duration: 0.2,
          ease: 'power2.inOut',
          onComplete: () => setDisplayed(id),
        })
        .to(wipe, { xPercent: 101, duration: 0.2, ease: 'power2.inOut' })
        .set(wipe, { display: 'none' })
    },
    [reduced, selected],
  )

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowDown' && e.key !== 'ArrowLeft' && e.key !== 'ArrowUp')
      return
    e.preventDefault()
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1
    const next = (i + dir + LOOKS.length) % LOOKS.length
    btnRefs.current[next]?.focus()
    select(LOOKS[next].id)
  }

  const current = LOOKS.find((l) => l.id === selected) ?? LOOKS[0]
  const waText = encodeURIComponent(`Hi! I'd like to order ${current.name} (${current.code}) from A & A Women Store.`)

  return (
    <section className="border-b-3 border-ink bg-cream px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest">Featured Looks</p>
        </Reveal>
        <SplitWords as="h2" className="mt-2 font-display text-4xl uppercase md:text-5xl">Pick Your Look</SplitWords>

        <div className="mt-10 grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <div className="border-4 border-ink bg-white shadow-[10px_10px_0_0_#0A0A0A]">
              <div className="flex items-center gap-2 border-b-4 border-ink bg-white px-3 py-2">
                <span className="size-3 rounded-full border-2 border-ink bg-pink" />
                <span className="size-3 rounded-full border-2 border-ink bg-gold" />
                <span className="size-3 rounded-full border-2 border-ink bg-ink" />
                <span className="ml-3 font-mono text-[10px] uppercase md:text-xs">STYLE PREVIEW</span>
              </div>

              <div className="relative overflow-hidden bg-lilac">
                <div className="relative mx-auto flex h-[420px] max-w-[90vw] items-end justify-center sm:h-[480px]">
                  <div className="absolute bottom-6 left-1/2 h-8 w-[68%] -translate-x-1/2 border-3 border-ink bg-gold shadow-[6px_6px_0_0_#0A0A0A]" style={{ borderRadius: '50%' }} />
                  <img
                    src={`/tryon/${displayed}.webp`}
                    alt={`${current.name} style preview`}
                    className="relative z-10 h-[88%] w-auto object-contain"
                    style={{ filter: 'drop-shadow(6px 6px 0 #0A0A0A)' }}
                  />
                  <div
                    ref={wipeRef}
                    className="absolute inset-0 z-20 hidden bg-gold"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <p className="font-display text-2xl uppercase">{current.name}</p>
              <p className="mt-1 font-mono text-sm uppercase">{current.code}</p>
              <p className="mt-2 font-mono text-xs uppercase">
                STYLE PREVIEW: fit and fabric may vary
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" className="nb-btn bg-gold" onClick={() => add(current.id)}>
                  Add to Cart
                </button>
                <a
                  href={`https://wa.me/${WA}?text=${waText}`}
                  target="_blank"
                  rel="noreferrer"
                  className="nb-btn nb-btn-ink"
                >
                  Order on WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div>
            <Reveal className="grid grid-cols-2 gap-4 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:overflow-x-auto max-md:pb-2" stagger="> button" data-lenis-prevent-wheel>
              {LOOKS.map((look, i) => {
                const active = look.id === selected
                return (
                  <button
                    key={look.id}
                    ref={(el) => {
                      btnRefs.current[i] = el
                    }}
                    type="button"
                    onClick={() => select(look.id)}
                    onKeyDown={(e) => onKey(e, i)}
                    aria-label={`Select ${look.name} ${look.code}`}
                    aria-pressed={active}
                    className={`nb-card p-0 text-left overflow-hidden max-md:w-44 max-md:shrink-0 max-md:snap-start focus:outline-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink focus-visible:outline-offset-2 ${
                      active ? 'bg-pink shadow-[10px_10px_0_0_#0A0A0A]' : 'bg-white'
                    }`}
                  >
                    <div className="aspect-[3/4] border-b-3 border-ink bg-cream">
                      <img
                        src={productImg(look.id)}
                        alt={look.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = `/tryon/${look.id}.webp`
                        }}
                      />
                    </div>
                    <div className="p-3">
                      <p className="font-display text-sm uppercase leading-tight">{look.name}</p>
                      <p className="mt-1 font-mono text-[11px] uppercase">{look.code}</p>
                    </div>
                  </button>
                )
              })}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
