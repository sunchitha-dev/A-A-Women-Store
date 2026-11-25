import { tailoringConfig } from '../../data/tailoringConfig'

export default function TailorMarquee() {
  const text = tailoringConfig.services.map((s) => s.name).join(' ✦ ') + ' ✦ '
  const items = Array.from({ length: 8 }, () => text)
  return (
    <section className="nb-marquee [&:hover_.nb-marquee-track]:[animation-play-state:paused]" aria-label="Tailoring services">
      <div className="nb-marquee-track">
        {items.concat(items).map((t, i) => (
          <span key={i} className="px-6 py-3 font-display text-xl uppercase text-ink md:text-2xl">
            {t}
          </span>
        ))}
      </div>
    </section>
  )
}
