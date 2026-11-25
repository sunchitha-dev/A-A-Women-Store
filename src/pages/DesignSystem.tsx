import { Button, Card, Chip, Input, Marquee, Sticker } from '../components/ui'
import Hero from '../components/Hero'
import { useState } from 'react'

const colors = [
  { name: 'ink', hex: '#0A0A0A' },
  { name: 'gold', hex: '#D4AF55' },
  { name: 'cream', hex: '#FFF6E0' },
  { name: 'pink', hex: '#FF4D8D' },
  { name: 'lilac', hex: '#C9B6FF' },
  { name: 'white', hex: '#FFFFFF' },
]

const shadows = [
  { name: 'shadow-nb-sm', cls: 'shadow-nb-sm' },
  { name: 'shadow-nb', cls: 'shadow-nb' },
  { name: 'shadow-nb-lg', cls: 'shadow-nb-lg' },
]

export default function DesignSystem() {
  const [chip, setChip] = useState('dresses')

  return (
    <>
      <Hero />
      <div className="min-h-screen px-8 py-12 max-w-6xl mx-auto space-y-16">
      <header className="space-y-4">
        <Sticker>Design System</Sticker>
        <h1 className="font-display text-6xl uppercase">A &amp; A Women Store</h1>
        <p className="font-serif italic text-2xl text-ink">
          Neobrutalism system — Old Pallavaram, Chennai
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="font-display text-2xl uppercase border-b-3 border-ink pb-2">Colors</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {colors.map((c) => (
            <div key={c.name} className="nb-card p-0 overflow-hidden">
              <div className="h-24 border-b-3 border-ink" style={{ backgroundColor: c.hex }} />
              <div className="p-3">
                <p className="font-display text-sm uppercase">{c.name}</p>
                <p className="font-mono text-xs">{c.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl uppercase border-b-3 border-ink pb-2">Fonts</h2>
        <div className="space-y-3">
          <p className="font-display text-4xl uppercase">Archivo Black — Display</p>
          <p className="font-body text-3xl">Space Grotesk — Body 400/500/700</p>
          <p className="font-serif italic text-3xl">Cormorant Garamond — Serif Italic</p>
          <p className="font-mono text-2xl">DM Mono — 0123456789</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl uppercase border-b-3 border-ink pb-2">Shadows</h2>
        <div className="flex flex-wrap gap-8 p-4">
          {shadows.map((s) => (
            <div key={s.name} className={`bg-white nb-border ${s.cls} px-6 py-4`}>
              <p className="font-mono text-sm">{s.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl uppercase border-b-3 border-ink pb-2">Buttons</h2>
        <div className="flex flex-wrap items-center gap-6">
          <Button>Gold</Button>
          <Button variant="pink">Pink</Button>
          <Button variant="ink">Ink</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl uppercase border-b-3 border-ink pb-2">Inputs</h2>
        <div className="max-w-md space-y-3">
          <Input placeholder="Email address" />
          <Input placeholder="Disabled" disabled className="bg-cream text-ink/50" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl uppercase border-b-3 border-ink pb-2">Chips</h2>
        <div className="flex flex-wrap gap-3">
          {['dresses', 'western', 'ethnic', 'innerwear'].map((c) => (
            <Chip key={c} active={chip === c} onClick={() => setChip(c)}>
              {c}
            </Chip>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl uppercase border-b-3 border-ink pb-2">Card + Sticker</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          <Card>
            <Sticker>New</Sticker>
            <p className="font-display uppercase mt-4">Korean Dress</p>
            <p className="font-body mt-2">Imported. Size S–XL.</p>
            <p className="font-mono mt-4">₹ 2,499</p>
          </Card>
          <Card>
            <p className="font-serif italic text-2xl">“Custom tailoring, 3 days.”</p>
          </Card>
          <Card className="bg-lilac">
            <p className="font-display uppercase">Lilac card</p>
          </Card>
        </div>
      </section>

      <section className="space-y-4 pb-8">
        <h2 className="font-display text-2xl uppercase border-b-3 border-ink pb-2">Marquee</h2>
        <Marquee
          items={[
            'Korean Dresses',
            'Western Wear',
            'Ethnic Fusion',
            'Custom Tailoring',
            'Old Pallavaram, Chennai',
          ]}
        />
      </section>
      </div>
    </>
  )
}
