import { useState, type FormEvent } from 'react'
import { tailoringConfig } from '../../data/tailoringConfig'
import { products } from '../../data/products'
import Reveal from '../Reveal'

const SWATCHES = [
  { name: 'Pink', value: '#FF4D8D' },
  { name: 'Lilac', value: '#C9B6FF' },
  { name: 'Gold', value: '#D4AF55' },
  { name: 'Cream', value: '#FFF6E0' },
  { name: 'Ink', value: '#0A0A0A' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Sage', value: '#A8C3A0' },
  { name: 'Wine', value: '#7A2E3A' },
]

const GARMENTS = Array.from(new Set(products.map((p) => p.collection)))
const G_LABEL: Record<string, string> = { kurti: 'Kurti', jeans: 'Jeans', party: 'Party', y2k: 'Y2K' }

const M_FIELDS = [
  { key: 'bust', label: 'BUST/CHEST', ph: '32-40' },
  { key: 'waist', label: 'WAIST', ph: '26-34' },
  { key: 'hip', label: 'HIP', ph: '34-42' },
  { key: 'shoulder', label: 'SHOULDER', ph: '13-16' },
  { key: 'sleeve', label: 'SLEEVE LENGTH', ph: '22-25' },
  { key: 'length', label: 'FULL LENGTH', ph: '40-46' },
  { key: 'neck', label: 'NECK DEPTH', ph: '6-9' },
] as const

type MKey = (typeof M_FIELDS)[number]['key']
type Unit = 'in' | 'cm'

function roundTo(n: number, step: number) {
  return Math.round(n / step) * step
}

function convert(val: string, from: Unit, to: Unit) {
  if (!val) return ''
  const n = Number(val)
  if (!Number.isFinite(n)) return val
  if (from === to) return val
  const out = from === 'in' ? n * 2.54 : n / 2.54
  const r = to === 'in' ? roundTo(out, 0.5) : roundTo(out, 1)
  return String(Number(r.toFixed(2)))
}

function validMeasure(val: string, unit: Unit) {
  if (!val) return ''
  const n = Number(val)
  if (!Number.isFinite(n)) return 'Enter a number'
  const min = unit === 'in' ? 4 : 10
  const max = unit === 'in' ? 70 : 180
  if (n < min || n > max) return `Must be ${min}-${max} ${unit}`
  return ''
}

export default function BookingForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [garment, setGarment] = useState('')
  const [colour, setColour] = useState(SWATCHES[0].name)
  const [fabric, setFabric] = useState<'I have my own fabric' | 'I need fabric'>('I have my own fabric')
  const [unit, setUnit] = useState<Unit>('in')
  const [m, setM] = useState<Record<MKey, string>>({ bust: '', waist: '', hip: '', shoulder: '', sleeve: '', length: '', neck: '' })
  const [measureInStore, setMeasureInStore] = useState(false)
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [slipOpen, setSlipOpen] = useState(false)

  const setUnitAndConvert = (next: Unit) => {
    if (next === unit) return
    setM((prev) => {
      const out = { ...prev }
      ;(Object.keys(out) as MKey[]).forEach((k) => { out[k] = convert(out[k], unit, next) })
      return out
    })
    setUnit(next)
  }

  const mErrors = (Object.keys(m) as MKey[]).reduce((acc, k) => {
    acc[k] = measureInStore ? '' : validMeasure(m[k], unit)
    return acc
  }, {} as Record<MKey, string>)

  const slipLines = () => {
    const lines = [
      'ORDER SLIP',
      `NAME ........ ${name || '—'}`,
      `PHONE ....... ${phone || '—'}`,
      `GARMENT ..... ${garment || '—'}`,
      `COLOUR ...... ${colour}`,
      `FABRIC ...... ${fabric}`,
      'MEASUREMENTS',
    ]
    if (measureInStore) {
      lines.push('MEASURE IN STORE')
    } else {
      const filled = M_FIELDS.filter((f) => m[f.key])
      if (filled.length === 0) lines.push('—')
      filled.forEach((f) => lines.push(`${f.label.padEnd(12, '.')} ${m[f.key]} ${unit}`))
    }
    lines.push(`VISIT ....... ${date || '—'}`)
    lines.push(`NOTES ....... ${notes || '—'}`)
    return lines
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!/^\d{10}$/.test(phone.trim())) {
      setError('Enter a 10-digit phone number.')
      return
    }
    setError('')
    const msg = slipLines().join('\n')
    window.open(`https://wa.me/${tailoringConfig.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer')
    setSent(true)
  }

  const slip = slipLines()

  return (
    <section id="book" className="border-b-3 border-ink bg-pink px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-widest text-ink">Booking</p>
        <Reveal>
          <h2 className="mt-2 font-display text-4xl uppercase text-ink md:text-6xl">Book A Fitting</h2>
        </Reveal>

        <div className="mt-10 grid gap-8 md:grid-cols-[1fr_360px]">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="nb-card bg-cream p-6 md:p-8">
              <p className="font-mono text-xs uppercase text-ink">1 YOU</p>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block font-mono text-xs uppercase text-ink">Name</span>
                  <input className="nb-input w-full" value={name} onChange={(e) => setName(e.target.value)} required />
                </label>
                <label className="block">
                  <span className="mb-1 block font-mono text-xs uppercase text-ink">Phone (10 digits)</span>
                  <input className="nb-input w-full" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} inputMode="tel" pattern="\d{10}" maxLength={10} required />
                </label>
              </div>
            </div>

            <div className="nb-card bg-cream p-6 md:p-8">
              <p className="font-mono text-xs uppercase text-ink">2 GARMENT</p>
              <fieldset className="mt-4">
                <legend className="mb-2 font-mono text-xs uppercase text-ink">Garment</legend>
                <div className="flex flex-wrap gap-2">
                  {GARMENTS.map((g) => {
                    const label = G_LABEL[g] ?? g
                    return (
                      <button key={g} type="button" className={`nb-chip ${garment === label ? 'bg-ink text-cream' : ''}`} data-active={garment === label} onClick={() => setGarment(label)}>
                        {label}
                      </button>
                    )
                  })}
                </div>
              </fieldset>
              <fieldset className="mt-6">
                <legend className="mb-2 font-mono text-xs uppercase text-ink">Fabric Colour</legend>
                <div className="flex flex-wrap gap-3">
                  {SWATCHES.map((s) => (
                    <button key={s.name} type="button" aria-label={s.name} onClick={() => setColour(s.name)} className="h-9 w-9 rounded-full border-[3px] border-ink focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink focus-visible:outline-offset-2" style={{ background: s.value, boxShadow: colour === s.name ? '0 0 0 3px #FFF6E0, 0 0 0 6px #0A0A0A' : undefined }} />
                  ))}
                </div>
              </fieldset>
              <fieldset className="mt-6">
                <legend className="mb-2 font-mono text-xs uppercase text-ink">Fabric</legend>
                <div className="flex flex-wrap gap-2">
                  {(['I have my own fabric', 'I need fabric'] as const).map((opt) => (
                    <button key={opt} type="button" className={`nb-chip ${fabric === opt ? 'bg-ink text-cream' : ''}`} data-active={fabric === opt} onClick={() => setFabric(opt)}>{opt}</button>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className="nb-card bg-cream p-6 md:p-8">
              <p className="font-mono text-xs uppercase text-ink">3 MEASUREMENTS</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {(['in', 'cm'] as Unit[]).map((u) => (
                  <button key={u} type="button" className={`nb-chip ${unit === u ? 'bg-ink text-cream' : ''}`} data-active={unit === u} onClick={() => setUnitAndConvert(u)}>
                    {u === 'in' ? 'INCHES' : 'CM'}
                  </button>
                ))}
                <a href="#measure" className="ml-auto font-mono text-xs uppercase underline">How to measure</a>
              </div>

              <label className="mt-4 flex items-start gap-3 font-mono text-sm text-ink">
                <input type="checkbox" className="mt-1 h-4 w-4 border-3 border-ink accent-pink" checked={measureInStore} onChange={(e) => setMeasureInStore(e.target.checked)} />
                <span>I don't know my measurements, measure me in store.</span>
              </label>

              <div className={`mt-5 grid gap-4 sm:grid-cols-2 ${measureInStore ? 'opacity-40' : ''}`}>
                {M_FIELDS.map((f) => (
                  <label key={f.key} className="block">
                    <span className="mb-1 block font-mono text-xs uppercase text-ink">{f.label}</span>
                    <input
                      className="nb-input w-full"
                      inputMode="decimal"
                      placeholder={f.ph}
                      value={m[f.key]}
                      disabled={measureInStore}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1')
                        setM((prev) => ({ ...prev, [f.key]: v }))
                      }}
                    />
                    {mErrors[f.key] && <span className="mt-1 block font-mono text-xs text-pink">{mErrors[f.key]}</span>}
                  </label>
                ))}
              </div>
            </div>

            <div className="nb-card bg-cream p-6 md:p-8">
              <p className="font-mono text-xs uppercase text-ink">4 VISIT</p>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block font-mono text-xs uppercase text-ink">Preferred Visit Date</span>
                  <input type="date" className="nb-input w-full" value={date} onChange={(e) => setDate(e.target.value)} />
                </label>
              </div>
              <label className="mt-5 block">
                <span className="mb-1 block font-mono text-xs uppercase text-ink">Notes</span>
                <textarea className="nb-input min-h-28 w-full" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </label>
              <p className="mt-3 font-mono text-sm text-ink">Send your reference photo on WhatsApp</p>
            </div>

            {error && <p className="font-mono text-sm text-ink bg-gold px-3 py-2 border-3 border-ink">{error}</p>}

            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" className="nb-btn bg-gold">SEND ON WHATSAPP</button>
              {sent && <span className="nb-sticker" style={{ background: '#D4AF55', transform: 'rotate(-2deg)' }}>SENT ✦</span>}
            </div>
          </form>

          <div className="relative md:sticky md:top-24 md:self-start">
            <img src="/tailor/sewing-machine.webp" alt="" aria-hidden="true" className="pointer-events-none absolute -right-4 -top-10 w-28 md:w-32" />
            <div className="border-[3px] border-dashed border-ink bg-cream font-mono text-sm text-ink shadow-[6px_6px_0_#0A0A0A]">
              <button type="button" className="flex w-full items-center justify-between p-4 md:hidden" onClick={() => setSlipOpen((v) => !v)} aria-expanded={slipOpen}>
                <span className="font-display text-xl uppercase">ORDER SLIP</span>
                <span aria-hidden="true">{slipOpen ? '−' : '+'}</span>
              </button>
              <div className={`${slipOpen ? 'block' : 'hidden'} p-6 pt-0 md:block md:p-6`}>
                <p className="hidden font-display text-2xl uppercase md:block">ORDER SLIP</p>
                <div className="mt-4 space-y-2 border-t-3 border-ink pt-4 text-xs sm:text-sm">
                  {slip.map((line, i) => (
                    <p key={i} className={i === 0 ? 'hidden' : 'whitespace-pre-wrap'}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}