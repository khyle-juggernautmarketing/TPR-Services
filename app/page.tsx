import { Footer } from '@/components/Footer'
import { GeoTargeting } from '@/components/GeoTargeting'
import { Hero } from '@/components/Hero'
import { Navbar } from '@/components/Navbar'
import { Process } from '@/components/Process'
import { Services } from '@/components/Services'
import { TrustBadges } from '@/components/TrustBadges'

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main" className="overflow-hidden">
        <Hero />
        <TrustBadges />
        <Services />
        <Process />
        <GeoTargeting />
      </main>
      <Footer />
    </>
  )
}
