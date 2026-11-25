import { useRef, useState } from 'react'
import Reveal from '../Reveal'

type Point = { name: string; x: number; y: number; text: string[] }

const POINTS: Point[] = [
  { name: 'Shoulder', x: 50.2, y: 16.9, text: ['Measure across the back from shoulder edge to shoulder edge.', 'Keep the tape straight and level.'] },
  { name: 'Bust', x: 52.2, y: 28.9, text: ['Measure around the fullest part of your bust.', 'Keep the tape snug, not tight.'] },
  { name: 'Waist', x: 47.2, y: 42.0, text: ['Measure around your natural waistline.', 'Keep one finger of ease under the tape.'] },
  { name: 'Hip', x: 49.8, y: 53.9, text: ['Measure around the fullest part of your hips.', 'Stand with feet together for a clean measure.'] },
  { name: 'Sleeve', x: 83.2, y: 30.0, text: ['Measure from shoulder point down to your wrist.', 'Keep your arm slightly bent while measuring.'] },
  { name: 'Length', x: 49.0, y: 89.9, text: ['Measure from shoulder top down to where you want the hem.', 'Stand straight and look forward.'] },
]

export default function MeasureGuide() {
  const [sel, setSel] = useState(0)
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])
  const p = POINTS[sel]

  const move = (dir: 1 | -1) => {
    const next = (sel + dir + POINTS.length) % POINTS.length
    setSel(next)
    btnRefs.current[next]?.focus()
  }

  return (
    <section id="measure" className="border-b-3 border-ink bg-cream px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-widest text-ink">Measure Guide</p>
        <Reveal>
          <h2 className="mt-2 font-display text-4xl uppercase md:text-6xl">Find Your Fit</h2>
        </Reveal>

        <div className="mt-10 grid gap-8 md:grid-cols-2 md:items-start">
          <div className="nb-border bg-lilac p-4 flex justify-center">
            <div className="relative inline-block" style={{ maxHeight: 360 }}>
              <img
                src="/tailor/mannequin-mini.webp"
                alt="Mannequin measurement guide"
                className="block h-auto w-auto max-h-[360px]"
                style={{ maxHeight: 360 }}
              />
              {POINTS.map((pt, i) => {
                const active = i === sel
                return (
                  <button
                    key={pt.name}
                    ref={(el) => { btnRefs.current[i] = el }}
                    type="button"
                    aria-label={pt.name}
                    aria-pressed={active}
                    onClick={() => setSel(i)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); move(1) }
                      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); move(-1) }
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 h-7 w-7 rounded-full border-[3px] border-ink focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink focus-visible:outline-offset-2"
                    style={{
                      left: `${pt.x}%`,
                      top: `${pt.y}%`,
                      background: active ? '#FF4D8D' : '#FFF6E0',
                    }}
                  >
                    <span className={`absolute inset-0 rounded-full ${active ? '' : 'animate-ping'} bg-pink/40`} aria-hidden="true" />
                    {active && (
                      <svg className="absolute -inset-3 h-[52px] w-[52px]" viewBox="0 0 52 52" aria-hidden="true">
                        <circle
                          cx="26" cy="26" r="22"
                          fill="none" stroke="#0A0A0A" strokeWidth="2"
                          strokeDasharray="138" strokeDashoffset="138"
                        >
                          <animate attributeName="stroke-dashoffset" from="138" to="0" dur="0.5s" fill="freeze" />
                        </circle>
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="nb-card bg-cream p-6 md:p-8">
            <p className="font-mono text-xs uppercase tracking-widest text-ink">HOW TO MEASURE</p>
            <h3 className="mt-3 font-display text-4xl uppercase text-ink">{p.name}</h3>
            <div className="mt-5 space-y-3 font-body text-lg text-ink">
              {p.text.map((t) => <p key={t}>{t}</p>)}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {POINTS.map((pt, i) => (
                <button
                  key={pt.name}
                  type="button"
                  onClick={() => { setSel(i); btnRefs.current[i]?.focus() }}
                  className={`nb-chip ${i === sel ? 'bg-pink' : ''}`}
                  data-active={i === sel}
                >
                  {pt.name}
                </button>
              ))}
            </div>
            <p className="mt-8 border-t-3 border-ink pt-4 font-mono text-sm uppercase text-ink">
              Not sure? We measure you in store.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}