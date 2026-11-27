import { Link } from 'react-router-dom'
import Reveal from '../Reveal'

const WA = 'https://wa.me/917904733345'

export default function HomeTailoring() {
  return (
    <section className="bg-ink text-cream border-b-[4px] border-ink overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-16 md:py-24">
        <Reveal className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-display uppercase leading-[0.95] [font-size:clamp(2.5rem,7vw,6rem)]">
              <span className="block text-cream">CUSTOM FIT.</span>
              <span className="block text-gold">YOUR MEASURE.</span>
            </h2>
            <p className="mt-6 font-accent italic text-[22px] text-cream/70 max-w-xl">Blouses, kurtis, anarkalis and more. Tailored in store.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/tailoring" className="nb-btn bg-gold text-ink">BOOK A FITTING</Link>
              <a href={WA} target="_blank" rel="noreferrer" className="nb-btn nb-btn-pink">WHATSAPP US</a>
            </div>
          </div>

          <div className="relative flex justify-center items-center min-h-[340px]">
            <div className="absolute w-[280px] h-[280px] md:w-[340px] md:h-[340px] rounded-full bg-gold border-[3px] border-ink" aria-hidden="true" />
            <img src="/tailor/dressform.webp" alt="Dress form" className="relative z-10 max-h-[400px] w-auto [animation:aa-float-a_5s_ease-in-out_infinite] motion-reduce:[animation:none]" />
            <img src="/tailor/scissors.webp" alt="" aria-hidden="true" className="absolute top-6 left-6 md:left-10 w-[60px] rotate-12 [animation:aa-float-a_4.5s_ease-in-out_infinite_0.8s] motion-reduce:[animation:none]" />
            <img src="/tailor/tape.webp" alt="" aria-hidden="true" className="absolute bottom-8 right-6 md:right-10 w-[60px] -rotate-[8deg] [animation:aa-float-a_5.2s_ease-in-out_infinite_1.6s] motion-reduce:[animation:none]" />
          </div>
        </Reveal>
      </div>
      <style>{`@keyframes aa-float-a { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }`}</style>
    </section>
  )
}
