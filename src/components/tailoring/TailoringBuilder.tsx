import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { useCart } from '../../store/cart'
import { startLenis, stopLenis } from '../../lib/lenis'
import type { Garment } from '../../data/tailoring'
import { basePrices } from '../../data/tailoring'

const WA = '917904733345'

type Props = {
  garment: Garment
  onClose: () => void
}

type Selection = Record<string, string>
type Measurements = Record<string, string>

const MEASUREMENT_FIELDS: { id: keyof Measurements; label: string; unit: string; placeholder: string }[] = [
  { id: 'bust', label: 'Bust', unit: 'in', placeholder: '34' },
  { id: 'waist', label: 'Waist', unit: 'in', placeholder: '28' },
  { id: 'hip', label: 'Hip', unit: 'in', placeholder: '36' },
  { id: 'shoulder', label: 'Shoulder', unit: 'in', placeholder: '15' },
  { id: 'sleeveLength', label: 'Sleeve Length', unit: 'in', placeholder: '22' },
  { id: 'armhole', label: 'Armhole', unit: 'in', placeholder: '16' },
  { id: 'neck', label: 'Neck', unit: 'in', placeholder: '14' },
  { id: 'length', label: 'Garment Length', unit: 'in', placeholder: '30' },
  { id: 'rise', label: 'Rise (jeans only)', unit: 'in', placeholder: '10' },
  { id: 'inseam', label: 'Inseam (jeans only)', unit: 'in', placeholder: '30' },
  { id: 'thigh', label: 'Thigh (jeans only)', unit: 'in', placeholder: '22' },
  { id: 'ankle', label: 'Ankle (jeans only)', unit: 'in', placeholder: '14' },
]

export default function TailoringBuilder({ garment, onClose }: Props) {
  const [step, setStep] = useState(1)
  const [fabric, setFabric] = useState(garment.fabrics[0])
  const [selections, setSelections] = useState<Selection>({})
  const [measurements, setMeasurements] = useState<Measurements>({})
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [reduced, setReduced] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const add = useCart((s) => s.add)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    stopLenis()
    return () => startLenis()
  }, [])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    if (reduced || !panelRef.current) return
    gsap.fromTo(panelRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out' })
  }, [reduced])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
      if (e.key !== 'Tab' || !panelRef.current) return
      const els = panelRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      if (!els.length) return
      const first = els[0]
      const last = els[els.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const totalPrice = basePrices[garment.id] +
    garment.details.reduce((sum, d) => {
      const sel = selections[d.id]
      const opt = d.options.find(o => o.value === sel)
      return sum + (opt?.priceDelta ?? 0)
    }, 0)

  const detail = garment.details[step - 2] // steps 2-5 = details

  const nextStep = () => {
    if (step === 1) { setStep(2); return }
    if (step <= 5 && detail) {
      if (!selections[detail.id]) {
        setErrors({ [detail.id]: true })
        return
      }
    }
    if (step === 5) {
      // Validate measurements
      const required = garment.id === 'jeans'
        ? ['bust', 'waist', 'hip', 'shoulder', 'sleeveLength', 'armhole', 'neck', 'length', 'rise', 'inseam', 'thigh', 'ankle']
        : ['bust', 'waist', 'hip', 'shoulder', 'sleeveLength', 'armhole', 'neck', 'length']
      const missing = required.filter(m => !measurements[m])
      if (missing.length) {
        setErrors(Object.fromEntries(missing.map(m => [m, true])))
        return
      }
      submitOrder()
      return
    }
    setStep(s => s + 1)
  }

  const prevStep = () => setStep(s => Math.max(1, s - 1))

  const submitOrder = () => {
    const details = garment.details.map(d => {
      const sel = selections[d.id]
      const opt = d.options.find(o => o.value === sel)
      return `${d.label}: ${opt?.label ?? sel}`
    }).join(', ')

    const measText = Object.entries(measurements)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}in`)
      .join(', ')

    add(garment.id, '', 1, {
      name: garment.name,
      code: garment.code,
      price: totalPrice,
      details: `${details} | Fabric: ${fabric} | ${measText}`,
    })
    setSubmitted(true)
  }

  const waText = encodeURIComponent(
    `Hi! I'd like to order custom ${garment.name} (${garment.code}) from A & A Women Store.\n` +
    `Fabric: ${fabric}\n` +
    garment.details.map(d => {
      const sel = selections[d.id]
      const opt = d.options.find(o => o.value === sel)
      return `${d.label}: ${opt?.label ?? sel}`
    }).join('\n') +
    `\nMeasurements:\n${Object.entries(measurements).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}in`).join('\n')}\n` +
    `Total: ₹${totalPrice}`
  )

  if (submitted) {
    return createPortal(
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(10,10,10,0.6)' }}
        onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
        role="dialog"
        aria-modal="true"
        aria-label="Order submitted"
      >
        <div className="nb-card max-w-md w-full p-8 text-center" style={{ backgroundColor: '#0A0A0A' }}>
          <p className="font-display text-4xl uppercase text-gold mb-4">ORDER SUBMITTED</p>
          <p className="font-mono text-lg uppercase text-cream mb-2">₹{totalPrice}</p>
          <p className="font-mono text-sm uppercase text-cream/70 mb-6">We'll confirm on WhatsApp within 2 hours</p>
          <a href={`https://wa.me/${WA}?text=${waText}`} target="_blank" rel="noreferrer" className="nb-btn block mb-3">
            SEND ON WHATSAPP
          </a>
          <button type="button" className="nb-btn nb-btn-ink w-full" onClick={onClose}>
            DONE
          </button>
        </div>
      </div>,
      document.body,
    )
  }

  const progressSteps = ['FABRIC', 'DETAILS', 'DETAILS', 'DETAILS', 'MEASUREMENTS']

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(10,10,10,0.6)' }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label={`Custom ${garment.name} builder`}
    >
      <div
        ref={panelRef}
        className="max-h-[92vh] w-full overflow-y-auto border-4 border-ink bg-cream shadow-nb-lg md:max-w-[720px]"
        data-lenis-prevent
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-3 border-ink px-4 py-3">
          <div>
            <p className="font-mono text-xs uppercase">Step {step} of 5</p>
            <h2 className="font-display text-2xl uppercase">{garment.name}</h2>
          </div>
          <button ref={closeRef} type="button" className="nb-btn px-3 py-1 text-sm" aria-label="Close builder" onClick={onClose}>✕</button>
        </div>

        {/* Progress */}
        <div className="border-b-3 border-ink px-4 py-3 overflow-x-auto" data-lenis-prevent-wheel>
          <div className="flex gap-2 min-w-max">
            {progressSteps.map((label, i) => (
              <div key={label} className="flex flex-col items-center min-w-[100px] px-2 relative">
                <div
                  className={`w-8 h-8 border-3 border-ink flex items-center justify-center font-mono text-xs
                    ${i < step - 1 ? 'bg-gold text-ink' : i === step - 1 ? 'bg-ink text-cream' : 'bg-white text-ink/50'}`}
                >
                  {i < step - 1 ? '✓' : i + 1}
                </div>
                <span className="mt-1 font-mono text-xs uppercase text-center whitespace-nowrap">
                  {label}
                </span>
                {i < 4 && <div className="absolute top-3 left-[calc(100%+2px)] right-[calc(100%+2px)] h-0.5 bg-ink" />}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-5 md:p-6">
          {/* Step 1: Fabric */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <p className="font-display text-3xl uppercase mb-2">CHOOSE FABRIC</p>
                <p className="font-mono text-sm uppercase text-ink/70">Select your base fabric</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {garment.fabrics.map((f) => (
                  <button
                    key={f}
                    type="button"
                    className={`nb-chip px-6 py-4 font-mono text-base text-left ${
                      fabric === f ? 'bg-ink text-cream' : 'bg-white'
                    }`}
                    aria-pressed={fabric === f}
                    onClick={() => setFabric(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Steps 2-4: Details */}
          {step >= 2 && step <= 4 && detail && (
            <div className="space-y-6">
              <div>
                <p className="font-display text-3xl uppercase mb-1">{detail.label.toUpperCase()}</p>
                <p className="font-mono text-sm uppercase text-ink/70">
                  {detail.options.map(o => o.label).join(' / ')}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {detail.options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`nb-chip px-4 py-3 font-mono text-sm text-left ${
                      selections[detail.id] === opt.value ? 'bg-ink text-cream' : 'bg-white'
                    }`}
                    aria-pressed={selections[detail.id] === opt.value}
                    onClick={() => { setSelections(s => ({ ...s, [detail.id]: opt.value })); setErrors(e => ({ ...e, [detail.id]: false })) }}
                  >
                    <div className="flex justify-between">
                      <span>{opt.label}</span>
                      <span className="font-mono text-xs">
                        {opt.priceDelta > 0 ? `+₹${opt.priceDelta}` : opt.priceDelta < 0 ? `₹${opt.priceDelta}` : 'Included'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              {errors[detail.id] && (
                <p className="font-mono text-sm uppercase text-pink">SELECT AN OPTION</p>
              )}
            </div>
          )}

          {/* Step 5: Measurements */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <p className="font-display text-3xl uppercase mb-2">YOUR MEASUREMENTS</p>
                <p className="font-mono text-sm uppercase text-ink/70">
                  {garment.id === 'jeans' ? 'All 12 fields required' : 'First 8 fields required (jeans fields optional)'}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {MEASUREMENT_FIELDS.map((field) => {
                  const isJeansOnly = ['rise', 'inseam', 'thigh', 'ankle'].includes(field.id)
                  const required = garment.id === 'jeans' || !isJeansOnly
                  return (
                    <label key={field.id} className="block">
                      <span className="mb-1 block font-mono text-xs uppercase">
                        {field.label} {required && <span className="text-pink">*</span>}
                      </span>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        className={`nb-input w-full ${errors[field.id] ? 'border-pink' : ''}`}
                        placeholder={field.placeholder}
                        value={measurements[field.id] ?? ''}
                        onChange={(e) => { setMeasurements(m => ({ ...m, [field.id]: e.target.value })); setErrors(e => ({ ...e, [field.id]: false })) }}
                        aria-required={required}
                      />
                      <span className="font-mono text-xs uppercase text-ink/50 mt-1 block">{field.unit}</span>
                    </label>
                  )
                })}
              </div>
              {Object.keys(errors).some(k => errors[k] && MEASUREMENT_FIELDS.some(f => f.id === k)) && (
                <p className="font-mono text-sm uppercase text-pink">FILL ALL REQUIRED FIELDS</p>
              )}
            </div>
          )}

          {/* Price Summary (steps 2-5) */}
          {step >= 2 && (
            <div className="border-t-3 border-ink pt-4 mt-6 font-mono uppercase">
              <div className="flex justify-between">
                <span>Base Price</span>
                <span>₹{basePrices[garment.id]}</span>
              </div>
              {garment.details.slice(0, step - 1).map(d => {
                const sel = selections[d.id]
                const opt = d.options.find(o => o.value === sel)
                return opt?.priceDelta ? (
                  <div key={d.id} className="flex justify-between text-sm mt-1">
                    <span>{d.label}: {opt.label}</span>
                    <span>{opt.priceDelta > 0 ? '+' : ''}₹{opt.priceDelta}</span>
                  </div>
                ) : null
              })}
              <div className="flex justify-between border-t-3 border-ink mt-3 pt-3 text-xl font-bold">
                <span>TOTAL</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t-3 border-ink px-4 py-4 flex gap-3">
          {step > 1 && (
            <button type="button" className="nb-btn nb-btn-ink flex-1" onClick={prevStep}>
              BACK
            </button>
          )}
          {step < 5 ? (
            <button type="button" className="nb-btn bg-gold flex-1" onClick={nextStep}>
              NEXT
            </button>
          ) : (
            <button type="button" className="nb-btn bg-gold flex-1" onClick={nextStep}>
              SUBMIT ORDER
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}