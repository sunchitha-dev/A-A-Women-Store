import { useEffect, useState } from 'react'
import { contactConfig } from '../../data/contactConfig'

export default function GreetingsMarquee() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const text = contactConfig.greetings.join(' ✦ ') + ' ✦ '
  const items = Array.from({ length: 8 }, () => text)

  return (
    <section className="nb-marquee border-y-3 border-ink bg-pink [&:hover_.nb-marquee-track]:[animation-play-state:paused]" aria-label="Greetings">
      {reduced ? (
        <div className="px-6 py-3 font-display text-xl uppercase text-ink md:text-2xl">{text}</div>
      ) : (
        <div className="nb-marquee-track [animation-duration:18s]">
          {items.concat(items).map((t, i) => (
            <span key={i} className="px-6 py-3 font-display text-xl uppercase text-ink md:text-2xl">{t}</span>
          ))}
        </div>
      )}
    </section>
  )
}
