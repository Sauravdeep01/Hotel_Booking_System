import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import HeroSection from '../components/home/HeroSection'
import FeaturedDestinations from '../components/home/FeaturedDestinations'
import ExclusiveOffers from '../components/home/ExclusiveOffers'
import Testimonials from '../components/home/Testimonials'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#142B45] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        <HeroSection />
        <FeaturedDestinations />
        <ExclusiveOffers />
        <Testimonials />
      </main>

      <Footer />
    </div>
  )
}
