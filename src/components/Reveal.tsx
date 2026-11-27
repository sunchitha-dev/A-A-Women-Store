import { useRef, type ElementType, type HTMLAttributes } from 'react'
import { useReveal } from '../hooks/useReveal'

type Props = HTMLAttributes<HTMLElement> & {
  as?: ElementType
  delay?: number
  y?: number
  stagger?: string
  once?: boolean
  duration?: number
  staggerEach?: number
}

export default function Reveal({ as: Tag = 'div', delay, y, stagger, once, duration, staggerEach, children, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref, { delay, y, stagger, once, duration, staggerEach })
  return <Tag ref={ref} {...rest}>{children}</Tag>
}