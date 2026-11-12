import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight, AlertCircle, RotateCcw } from 'lucide-react'
import HotelCard from './HotelCard'
import { getFeaturedHotels } from '../../services/hotelService'

export default function FeaturedDestinations() {
  const navigate = useNavigate()
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch featured hotels on component mount
  const loadFeaturedHotels = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await getFeaturedHotels()
      if (res.success && Array.isArray(res.data)) {
        setHotels(res.data)
      } else {
        setHotels([])
      }
    } catch (err) {
      console.error('Error fetching featured hotels:', err)
      setError(err.message || 'Unable to connect to the hotel directory service')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFeaturedHotels()
  }, [])

  return (
    <section className="bg-[#F5F7FA] py-16 sm:py-20 lg:py-24 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 mt-12 sm:mt-16">
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs animate-pulse flex flex-col justify-between h-[380px]"
              >
                <div className="h-56 bg-slate-200" />
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="h-3 bg-slate-200 rounded w-1/3" />
                    <div className="h-5 bg-slate-200 rounded w-4/5" />
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="h-6 bg-slate-200 rounded w-1/3" />
                    <div className="h-8 bg-slate-200 rounded-xl w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="mt-12 bg-white rounded-2xl p-8 border border-rose-200 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#142B45] mb-1">
              Unable to load featured destinations
            </h3>
            <p className="text-xs text-slate-500 mb-4">{error}</p>
            <button
              type="button"
              onClick={loadFeaturedHotels}
              className="inline-flex items-center gap-1.5 bg-[#142B45] hover:bg-[#C6A15B] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {!loading && !error && hotels.length === 0 && (
          <div className="mt-12 bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-lg mx-auto shadow-xs">
            <p className="text-sm text-slate-500 font-light">
              No featured destinations currently available in our directory.
            </p>
          </div>
        )}

        {!loading && !error && hotels.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 mt-12 sm:mt-16">
            {hotels.slice(0, 4).map((hotel) => (
              <HotelCard key={hotel._id || hotel.id} hotel={hotel} />
            ))}
          </div>
        )}

        <div className="mt-12 sm:mt-16 text-center">
          <button
            onClick={() => navigate('/hotels')}
            className="inline-flex items-center gap-2 border-2 border-[#142B45] text-[#142B45] hover:bg-[#142B45] hover:text-white font-semibold text-sm px-8 py-3.5 rounded-xl transition-all duration-300 shadow-xs hover:shadow-lg active:scale-95 cursor-pointer"
          >
            <span>View All Destinations</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
