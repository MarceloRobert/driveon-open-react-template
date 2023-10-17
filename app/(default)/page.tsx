export const metadata = {
  title: 'DriveOn - Home',
  description: 'Página inicial do aplicativo de caronas DriveOn',
}

import Hero from '@/components/hero'
import Features from '@/components/features'
import Newsletter from '@/components/newsletter'
import Zigzag from '@/components/zigzag'
import Testimonials from '@/components/testimonials'
import MapCalculator from '@/components/map-calculator'

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Zigzag />
      <MapCalculator />
      <Testimonials />
      <Newsletter />
    </>
  )
}
