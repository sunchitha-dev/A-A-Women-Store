import TailorHero from '../components/tailoring/TailorHero'
import TailorMarquee from '../components/tailoring/TailorMarquee'
import TailorProcess from '../components/tailoring/TailorProcess'
import TailorVideo from '../components/tailoring/TailorVideo'
import MeasureGuide from '../components/tailoring/MeasureGuide'
import BookingForm from '../components/tailoring/BookingForm'
import TailorTrust from '../components/tailoring/TailorTrust'

export default function Tailoring() {
  return (
    <>
      <TailorHero />
      <TailorMarquee />
      <TailorProcess />
      <TailorVideo />
      <MeasureGuide />
      <BookingForm />
      <TailorTrust />
    </>
  )
}
