import { useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import HotelCard from './HotelCard'
import { FEATURED_HOTELS } from '../../constants/hotels'

export default function FeaturedDestinations() {
  const navigate = useNavigate()

  return (
    <section className="bg-[#F5F7FA] py-16 sm:py-20 lg:py-24 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#C6A15B]/15 border border-[#C6A15B]/30 px-3.5 py-1 text-xs font-semibold text-[#142B45] mb-3">
            <Sparkles className="h-3.5 w-3.5 text-[#C6A15B]" />
            <span>Curated Collection</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142B45] tracking-tight">
            Featured Destinations
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-light">
            Discover our handpicked selection of exceptional properties around the world, offering
            unparalleled luxury and unforgettable experiences.
          </p>
        </div>

        {/* Dynamic Hotel Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 mt-12 sm:mt-16">
          {FEATURED_HOTELS.slice(0, 4).map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>

        {/* View All Destinations Action */}
        <div className="mt-12 sm:mt-16 text-center">
          <button
            onClick={() => navigate('/hotels')}
            className="inline-flex items-center gap-2 border-2 border-[#142B45] text-[#142B45] hover:bg-[#142B45] hover:text-white font-semibold text-sm px-8 py-3.5 rounded-xl transition-all duration-300 shadow-xs hover:shadow-lg active:scale-95"
          >
            <span>View All Destinations</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

