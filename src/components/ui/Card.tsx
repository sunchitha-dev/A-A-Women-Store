import type { HTMLAttributes } from 'react'

export function Card({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`nb-card p-6 ${className}`} {...props}>
      {children}
    </div>
  )
}

export default Card
