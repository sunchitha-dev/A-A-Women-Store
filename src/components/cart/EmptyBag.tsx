import { Link } from 'react-router-dom'
import SplitWords from '../motion/SplitWords'
import Reveal from '../Reveal'

export default function EmptyBag() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="nb-card mx-auto max-w-lg p-10 text-center bg-cream">
        <img src="/about-media/bags.webp" alt="" aria-hidden="true" className="mx-auto w-32 md:w-40 motion-safe:animate-[bounce_2s_ease-in-out_infinite] motion-reduce:animate-none" onError={(e) => { e.currentTarget.style.display = 'none' }} />
        <SplitWords as="h1" className="mt-6 font-display text-4xl uppercase md:text-6xl">YOUR BAG IS EMPTY</SplitWords>
        <Reveal className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/shop" className="nb-btn bg-gold">SHOP LOOKS</Link>
          <Link to="/contact#try" className="nb-btn nb-btn-pink">SWIPE YOUR WARDROBE</Link>
        </Reveal>
      </div>
    </div>
  )
}
