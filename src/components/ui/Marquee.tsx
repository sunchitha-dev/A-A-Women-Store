import type { ReactNode } from 'react'

type MarqueeProps = {
  items: ReactNode[]
  className?: string
}

export function Marquee({ items, className = '' }: MarqueeProps) {
  return (
    <div className={`nb-marquee ${className}`}>
      <div className="nb-marquee-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="px-4 py-2 whitespace-nowrap">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export default Marquee
