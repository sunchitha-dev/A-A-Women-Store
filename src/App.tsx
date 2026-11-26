import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Shell from './components/Shell'
import Home from './pages/Home'

const Shop = lazy(() => import('./pages/Shop'))
const Tailoring = lazy(() => import('./pages/Tailoring'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Cart = lazy(() => import('./pages/Cart'))
const Stub = lazy(() => import('./pages/Stub'))

const preloaders: Record<string, () => Promise<unknown>> = {
  '/shop': () => import('./pages/Shop'),
  '/tailoring': () => import('./pages/Tailoring'),
  '/about': () => import('./pages/About'),
  '/contact': () => import('./pages/Contact'),
  '/cart': () => import('./pages/Cart'),
}

function preloadFor(href: string) {
  const path = href.startsWith('/') ? href.split('#')[0] : ''
  const key = Object.keys(preloaders).find((k) => path === k || path.startsWith(k + '/'))
  if (key) preloaders[key]()
}

function RouteReady({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [])
  return <>{children}</>
}

function PreloadIntent() {
  useEffect(() => {
    const onIntent = (e: Event) => {
      const a = (e.target as HTMLElement).closest?.('a[href]') as HTMLAnchorElement | null
      if (a) preloadFor(a.getAttribute('href') || '')
    }
    document.addEventListener('mouseover', onIntent, { passive: true })
    document.addEventListener('focusin', onIntent)
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback
    const idle = ric ? ric(() => Object.values(preloaders).forEach((p) => p())) : window.setTimeout(() => Object.values(preloaders).forEach((p) => p()), 1500)
    return () => {
      document.removeEventListener('mouseover', onIntent)
      document.removeEventListener('focusin', onIntent)
      if (!ric) window.clearTimeout(idle as number)
    }
  }, [])
  return null
}

function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="nb-card bg-cream px-8 py-6 font-mono text-sm uppercase text-ink">LOADING</div>
    </div>
  )
}

function LazyOutlet() {
  return <Suspense fallback={<Loading />}><Outlet /></Suspense>
}

function App() {
  return (
    <BrowserRouter>
      <PreloadIntent />
      <Routes>
        <Route element={<Shell />}>
          <Route element={<LazyOutlet />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<RouteReady><Shop /></RouteReady>} />
            <Route path="/product/:id" element={<RouteReady><Stub title="Product" /></RouteReady>} />
            <Route path="/tailoring" element={<RouteReady><Tailoring /></RouteReady>} />
            <Route path="/about" element={<RouteReady><About /></RouteReady>} />
            <Route path="/contact" element={<RouteReady><Contact /></RouteReady>} />
            <Route path="/cart" element={<RouteReady><Cart /></RouteReady>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
