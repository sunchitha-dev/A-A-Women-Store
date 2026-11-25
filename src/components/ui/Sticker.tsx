import type { HTMLAttributes } from 'react'

export function Sticker({ className = '', children, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={`nb-sticker ${className}`} {...props}>
      {children}
    </span>
  )
}

export default Sticker
