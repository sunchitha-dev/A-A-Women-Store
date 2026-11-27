import HomeHero from '../components/home/HomeHero'
import HomeTicker from '../components/home/HomeTicker'
import StackCards from '../components/home/StackCards'
import WardrobeDial from '../components/home/WardrobeDial'
import StickerWall from '../components/home/StickerWall'
import FabricRip from '../components/home/FabricRip'
import NumbersStrip from '../components/home/NumbersStrip'
import HomeCTA from '../components/home/HomeCTA'

export default function Home() {
  return (
    <>
      <HomeHero />
      <HomeTicker />
      <StackCards />
      <WardrobeDial />
      <StickerWall />
      <FabricRip />
      <NumbersStrip />
      <HomeCTA />
    </>
  )
}
