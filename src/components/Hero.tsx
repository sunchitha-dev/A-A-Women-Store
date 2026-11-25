import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const FRAME_COUNT = 64
const PIN_TOP = 64 // navbar height the sticky stage parks under
const frameSrc = (i: number) => `/hero/model/m_${String(i + 1).padStart(3, '0')}.webp`

const stage = (p: number, a: number, b: number) => Math.max(0, Math.min(1, (p - a) / (b - a)))
const ease = (t: number) => 1 - Math.pow(1 - t, 3)

const GRID =
  'linear-gradient(rgba(10,10,10,0.12) 1px, transparent 1px), ' +
  'linear-gradient(90deg, rgba(10,10,10,0.12) 1px, transparent 1px)'

type Sticker = { src: string; cls: string; drift: number; rot: number }
const STICKERS: Sticker[] = [
  { src: '/hero/starburst.webp', cls: 'top-[5%] right-[2%] w-14 md:w-24', drift: -60, rot: 30 },
  { src: '/hero/circle-pink.webp', cls: 'hidden md:block top-[15%] left-[1%] w-16', drift: 45, rot: -20 },
  { src: '/hero/bubble-lilac.webp', cls: 'bottom-[6%] left-[3%] w-14 md:w-24', drift: -85, rot: 15 },
  { src: '/hero/arrow.webp', cls: 'hidden md:block top-[60%] left-[45%] w-16', drift: -40, rot: -10 },
  { src: '/hero/ribbon.webp', cls: 'hidden md:block bottom-[4%] right-[5%] w-28 md:w-36', drift: 20, rot: 8 },
]

type Prop = { src: string; cls: string; start: number }
const PROPS: Prop[] = [
  { src: '/hero/sunglasses.webp', cls: 'top-[-18px] left-0 md:top-[-34px] md:left-[-46px] w-20 md:w-32', start: 0.46 },
  { src: '/hero/handbag.webp', cls: 'top-[-28px] right-0 md:top-[-46px] md:right-[-50px] w-20 md:w-36', start: 0.495 },
  { src: '/hero/heels.webp', cls: 'bottom-[-14px] right-2 md:bottom-[-26px] md:right-[-44px] w-24 md:w-36', start: 0.53 },
  { src: '/hero/scarf.webp', cls: 'bottom-12 left-[-14px] md:bottom-16 md:left-[-58px] w-20 md:w-32', start: 0.565 },
  { src: '/hero/hanger.webp', cls: 'hidden md:block top-[-52px] right-16 w-28', start: 0.6 },
  { src: '/hero/hoodie.webp', cls: 'hidden md:block bottom-[-22px] left-14 w-32', start: 0.635 },
]

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const badgeRef = useRef<HTMLSpanElement>(null)
  const btnsRef = useRef<HTMLDivElement>(null)
  const winRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stickerRefs = useRef<Array<HTMLDivElement | null>>([])
  const propRefs = useRef<Array<HTMLDivElement | null>>([])
  const framesRef = useRef<HTMLImageElement[]>([])
  const lastIdx = useRef(-1)

  const [loaded, setLoaded] = useState(0)
  const [ready, setReady] = useState(false)
  const [reduced, setReduced] = useState(false)

  // Preload every frame before the hero shows anything but the LOADING box.
  useEffect(() => {
    let alive = true
    let n = 0
    const imgs: HTMLImageElement[] = []
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.onload = img.onerror = () => {
        n++
        if (!alive) return
        setLoaded(n)
        if (n === FRAME_COUNT) {
          framesRef.current = imgs
          setReady(true)
        }
      }
      img.src = frameSrc(i)
      imgs.push(img)
    }
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const draw = (idx: number) => {
    const cv = canvasRef.current
    const img = framesRef.current[idx]
    if (!cv || !img || !img.complete || !img.naturalWidth || lastIdx.current === idx) return
    const g = cv.getContext('2d')
    if (!g) return
    g.clearRect(0, 0, cv.width, cv.height)
    g.drawImage(img, 0, 0, cv.width, cv.height)
    lastIdx.current = idx
  }

  // One shared scroll progress drives every plane. stat = reduced-motion
  // static composition: final sticker/prop lockup, model on m_001, text home.
  const apply = (p: number, stat: boolean) => {
    const head = stat ? 0 : stage(p, 0.15, 0.38)
    const btnOp = stat ? 1 : p < 0.32 ? 1 - stage(p, 0.15, 0.3) : stage(p, 0.5, 0.62)
    const badgeT = stat ? 1 : stage(p, 0.45, 0.68)
    const settle = stat ? 1 : stage(p, 0, 0.15)
    const driftT = stat ? 1 : stage(p, 0.1, 0.75)

    if (headlineRef.current) {
      headlineRef.current.style.opacity = String(1 - head)
      headlineRef.current.style.transform = `translateY(${-50 * head}px)`
    }
    if (badgeRef.current) {
      badgeRef.current.style.transform = `scale(${1 + 0.12 * badgeT})`
    }
    if (btnsRef.current) {
      btnsRef.current.style.opacity = String(btnOp)
    }
    if (winRef.current) {
      winRef.current.style.transform = `translateY(${stat ? 0 : 36 * (1 - settle) - 24 * p}px)`
    }
    if (gridRef.current) {
      gridRef.current.style.backgroundPosition = `0 ${stat ? 0 : -30 * p}px`
    }
    STICKERS.forEach((s, i) => {
      const el = stickerRefs.current[i]
      if (el) el.style.transform = `translateY(${s.drift * driftT}px) rotate(${s.rot * driftT}deg)`
    })
    PROPS.forEach((pr, i) => {
      const el = propRefs.current[i]
      if (!el) return
      const t = stat ? 1 : ease(stage(p, pr.start, pr.start + 0.14))
      el.style.opacity = String(Math.min(1, t * 1.6))
      el.style.transform = `scale(${0.4 + 0.6 * t}) rotate(${(1 - t) * (i % 2 ? 12 : -12)}deg)`
    })
    // Plays once: 0 -> 80% maps frames 0 -> 63, then holds. Never wraps.
    const idx = stat ? 0 : Math.min(FRAME_COUNT - 1, Math.floor((p / 0.8) * FRAME_COUNT))
    draw(idx)
  }

  useEffect(() => {
    if (!ready) return
    if (reduced) {
      apply(0, true)
      return
    }
    let raf = 0
    const tick = () => {
      const sec = sectionRef.current
      if (sec) {
        const rect = sec.getBoundingClientRect()
        if (rect.bottom > -100 && rect.top < window.innerHeight + 100) {
          const range = sec.offsetHeight - (window.innerHeight - PIN_TOP)
          const p = Math.max(0, Math.min(1, (PIN_TOP - rect.top) / Math.max(1, range)))
          apply(p, false)
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // apply closes over refs and constants only, so the loop need not restart on it
  }, [ready, reduced])

  return (
    <section
      ref={sectionRef}
      aria-label="Elevate your wardrobe"
      className={reduced ? 'relative' : 'h-[200vh] md:h-[350vh]'}
    >
      <div
        className={
          reduced
            ? 'relative min-h-[calc(100vh-4rem)] overflow-hidden border-b-3 border-ink'
            : 'sticky top-16 h-[calc(100vh-4rem)] overflow-hidden border-b-3 border-ink'
        }
      >
        <div
          ref={gridRef}
          className="absolute inset-0"
          style={{
            backgroundColor: '#FFF6E0',
            backgroundImage: GRID,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 mx-auto flex h-full min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center gap-5 px-4 py-6 md:flex-row md:items-center md:gap-10 md:px-6 md:py-0">
          <div className="flex w-full flex-col items-start gap-4 md:w-[46%] md:gap-6">
            <span
              ref={badgeRef}
              className="inline-block origin-left border-3 border-ink bg-pink px-3 py-1.5 font-mono text-[10px] uppercase shadow-nb-sm md:text-xs"
            >
              A &amp; A Women Store • Old Pallavaram
            </span>
            <h1
              ref={headlineRef}
              className="font-display text-5xl uppercase leading-[0.95] md:text-7xl"
            >
              Elevate Your Wardrobe
            </h1>
            <div ref={btnsRef} className="flex flex-wrap gap-3">
              <Link to="/shop" className="nb-btn bg-gold">
                Shop Now
              </Link>
              <a
                href="https://wa.me/917904733345"
                target="_blank"
                rel="noreferrer"
                className="nb-btn nb-btn-ink"
              >
                WhatsApp Us
              </a>
            </div>
          </div>

          <div ref={winRef} className="relative flex w-full justify-center md:w-[54%]">
            {PROPS.map((pr, i) => (
              <img
                key={pr.src}
                ref={(el) => {
                  propRefs.current[i] = el
                }}
                src={pr.src}
                alt=""
                aria-hidden="true"
                className={`pointer-events-none absolute z-20 ${pr.cls}`}
                style={{ opacity: 0, transform: 'scale(0.4)' }}
              />
            ))}

            <div className="w-full max-w-[480px] border-4 border-ink bg-white shadow-[10px_10px_0_0_#0A0A0A] md:max-w-[460px]">
              <div className="flex items-center gap-2 border-b-4 border-ink bg-white px-3 py-2">
                <span className="size-3 rounded-full border-2 border-ink bg-pink" />
                <span className="size-3 rounded-full border-2 border-ink bg-gold" />
                <span className="size-3 rounded-full border-2 border-ink bg-ink" />
                <span className="ml-3 font-mono text-[10px] uppercase md:text-xs">
                  A &amp; A • NEW STOCK
                </span>
              </div>
              <div className="relative h-[38vh] min-h-[260px] overflow-hidden bg-lilac md:h-[54vh]">
                <div className="absolute bottom-1 left-1/2 z-0 h-7 w-[62%] -translate-x-1/2 rounded-full border-[3px] border-ink bg-gold shadow-[6px_6px_0_0_#0A0A0A]" />
                <canvas
                  ref={canvasRef}
                  width={464}
                  height={1038}
                  className="absolute bottom-[10px] left-1/2 z-10 h-[88%] w-auto -translate-x-1/2"
                  style={{ filter: 'drop-shadow(6px 6px 0 #0A0A0A)' }}
                />
                {!ready && (
                  <div className="hero-loading absolute inset-0 z-20 flex items-center justify-center">
                    <div className="border-3 border-ink bg-cream px-5 py-3 shadow-nb">
                      <span className="font-display text-sm uppercase">
                        Loading {loaded}/{FRAME_COUNT}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {STICKERS.map((s, i) => (
          <div
            key={s.src}
            ref={(el) => {
              stickerRefs.current[i] = el
            }}
            className={`pointer-events-none absolute z-30 ${s.cls}`}
          >
            <img src={s.src} alt="" aria-hidden="true" className="w-full" />
          </div>
        ))}
      </div>
    </section>
  )
}
