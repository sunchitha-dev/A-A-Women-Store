import type { ButtonHTMLAttributes } from 'react'

type Variant = 'gold' | 'pink' | 'ink'

const variantClass: Record<Variant, string> = {
  gold: '',
  pink: 'nb-btn-pink',
  ink: 'nb-btn-ink',
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
}

export function Button({ variant = 'gold', className = '', children, ...props }: ButtonProps) {
  return (
    <button type="button" className={`nb-btn ${variantClass[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button
