import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Lenis from 'lenis'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Shell() {
  useEffect(() => {
    const lenis = new Lenis()
    let id = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time)
      id = requestAnimationFrame(raf)
    })
    return () => {
      cancelAnimationFrame(id)
      lenis.destroy()
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
