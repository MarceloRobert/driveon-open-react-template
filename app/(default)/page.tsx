export const metadata = {
  title: 'DriveOn - Home',
  description: 'Página inicial do aplicativo de caronas DriveOn',
}

import Hero from '@/components/hero'
import Features from '@/components/features'
import Newsletter from '@/components/newsletter'
import Zigzag from '@/components/zigzag'
import TripCalculator from '@/components/trip-calculator'
import Testimonials from '@/components/testimonials'

const center = { lat: -34.397, lng: 150.644 };
const zoom = 4;

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Zigzag />
      <TripCalculator/>
      <Testimonials />
      <Newsletter />
    </>
  )
}
