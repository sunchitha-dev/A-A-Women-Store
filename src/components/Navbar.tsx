import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCartCount } from '../store/cart'
import { startLenis, stopLenis } from '../lib/lenis'

const links = [
  { label: 'Home', to: '/', end: true },
  { label: 'Shop', to: '/shop' },
  { label: 'Tailoring', to: '/tailoring' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

function Logo() {
  return (
    <Link to="/" className="flex items-center" aria-label="A and A Women Store, home">
      <img
        src="/logo.png"
        alt="A & A Women Store"
        className="h-14 w-14 border-3 border-gold object-cover"
        width={56}
        height={56}
      />
    </Link>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const count = useCartCount()
  const { pathname } = useLocation()

  useEffect(() => {
    if (!open) return
    stopLenis()
    return () => startLenis()
  }, [open])

  return (
    <>
      <header className="sticky top-0 z-40 bg-cream border-b-3 border-ink">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />

          <nav className="hidden md:flex items-center gap-6" aria-label="Main">
            {links.map((l) => {
              const active = l.to === '/shop' ? pathname.startsWith('/shop') || pathname.startsWith('/product') : undefined
              return (
                <NavLink
                  key={l.label}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `font-display text-sm uppercase hover:text-pink ${(active ?? isActive) ? 'text-pink' : 'text-ink'}`
                  }
                >
                  {l.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              className="nb-btn relative px-4 py-2 text-sm"
              aria-label={`Cart, ${count} items`}
            >
              Cart
              <span className="absolute -right-3 -top-3 flex size-6 items-center justify-center rounded-full border-3 border-ink bg-pink font-mono text-xs">
                {count}
              </span>
            </Link>
            <button
              type="button"
              className="nb-btn px-3 py-2 md:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              ≡
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 bg-cream flex flex-col">
          <div className="flex h-16 items-center justify-between border-b-3 border-ink px-4 sm:px-6">
            <Logo />
            <button
              type="button"
              className="nb-btn px-4 py-2"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-6 px-8" aria-label="Mobile">
            {links.map((l) => {
              const active = l.to === '/shop' ? pathname.startsWith('/shop') || pathname.startsWith('/product') : l.end ? pathname === '/' : pathname.startsWith(l.to)
              return (
                <Link
                  key={l.label}
                  to={l.to}
                  className={`font-display text-5xl uppercase hover:text-pink ${active ? 'text-pink' : ''}`}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </>
  )
}
