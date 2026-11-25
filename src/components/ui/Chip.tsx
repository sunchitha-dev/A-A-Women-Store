import type { ButtonHTMLAttributes } from 'react'

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean
}

export function Chip({ active = false, className = '', children, ...props }: ChipProps) {
  return (
    <button type="button" data-active={active} className={`nb-chip ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Chip
