import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Hotel as HotelIcon,
  BellRing,
  Waves,
  Sparkles,
  Mountain,
  Compass,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowLeft,
  ChevronRight,
  Maximize,
  AlertCircle,
  RotateCcw,
} from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import HotelInfo from '../components/hotel/HotelInfo'
import HotelGallery from '../components/hotel/HotelGallery'
import AvailabilityCard from '../components/hotel/AvailabilityCard'
import HotelAmenities from '../components/hotel/HotelAmenities'
import HotelReviews from '../components/hotel/HotelReviews'
import { getHotelById, normalizeHotel } from '../services/hotelService'
import { FEATURED_HOTELS } from '../constants/hotels'

export default function HotelDetails() {
  const { id } = useParams()
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch hotel by ID from backend; fallback to local templates for numeric routes
  const loadHotel = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await getHotelById(id)

      if (res.success && res.data) {
        setHotel(res.data)
      } else {
        const numericId = parseInt(id, 10)
        if (!isNaN(numericId)) {
          const matchedStatic = FEATURED_HOTELS.find((h) => h.id === numericId)
          if (matchedStatic) {
            setHotel(normalizeHotel(matchedStatic))
            return
          }
        }
        setHotel(null)
      }
    } catch (err) {
      console.error('Error fetching hotel details:', err)
      setError(err.message || 'Unable to retrieve property information')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHotel()
  }, [id])

  // Highlights icon mapping
  const getHighlightIcon = (iconName) => {
    switch (iconName) {
      case 'BellRing':
        return <BellRing className="h-5 w-5 text-[#C6A15B]" />
      case 'Waves':
        return <Waves className="h-5 w-5 text-[#C6A15B]" />
      case 'Mountain':
        return <Mountain className="h-5 w-5 text-[#C6A15B]" />
      case 'Compass':
        return <Compass className="h-5 w-5 text-[#C6A15B]" />
      default:
        return <Sparkles className="h-5 w-5 text-[#C6A15B]" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-between">
        <Navbar />

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16">
          <div className="h-4 bg-slate-200 rounded w-48 mb-6 animate-pulse" />
          <div className="h-10 bg-slate-200 rounded w-2/3 mb-3 animate-pulse" />
          <div className="h-5 bg-slate-200 rounded w-1/3 mb-8 animate-pulse" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[380px] sm:h-[480px] mb-8">
            <div className="md:col-span-2 bg-slate-200 rounded-3xl animate-pulse" />
            <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-4">
              <div className="bg-slate-200 rounded-2xl animate-pulse" />
              <div className="bg-slate-200 rounded-2xl animate-pulse" />
              <div className="bg-slate-200 rounded-2xl animate-pulse" />
              <div className="bg-slate-200 rounded-2xl animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-8 h-48 border border-slate-200/80 animate-pulse" />
              <div className="bg-white rounded-3xl p-8 h-40 border border-slate-200/80 animate-pulse" />
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-8 h-96 border border-slate-200/80 animate-pulse" />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-between">
        <Navbar />

        <main className="flex-1 max-w-4xl mx-auto px-4 py-36 text-center flex flex-col items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 shadow-md mb-6">
            <AlertCircle className="h-8 w-8" />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#142B45] mb-3">
            Error Loading Property
          </h1>

          <p className="text-slate-600 max-w-md text-sm leading-relaxed mb-8">{error}</p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={loadHotel}
              className="inline-flex items-center gap-2 bg-[#142B45] hover:bg-[#C6A15B] text-white px-6 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retry</span>
            </button>
            <Link
              to="/hotels"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-6 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all shadow-xs active:scale-98"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Browse All Hotels</span>
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-between">
        <Navbar />

        <main className="flex-1 max-w-4xl mx-auto px-4 py-36 text-center flex flex-col items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#142B45] text-[#C6A15B] shadow-lg mb-6">
            <HotelIcon className="h-8 w-8" />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#142B45] mb-3">
            Hotel Not Found
          </h1>

          <p className="text-slate-600 max-w-md text-sm leading-relaxed mb-8">
            The property you are looking for may have been relocated or is temporarily unavailable in
            our luxury directory.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/hotels"
              className="inline-flex items-center gap-2 bg-[#142B45] hover:bg-[#C6A15B] text-white px-6 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98"
            >
              <HotelIcon className="h-4 w-4" />
              <span>Browse All Hotels</span>
            </Link>
            <Link
              to="/home"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-6 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all shadow-xs active:scale-98"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return Home</span>
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#142B45] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16">
        <div className="flex items-center justify-between gap-4 mb-4">
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 overflow-x-auto whitespace-nowrap">
            <Link to="/home" className="hover:text-[#142B45] transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/hotels" className="hover:text-[#142B45] transition-colors">
              Destinations
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#142B45] font-semibold truncate max-w-[200px] sm:max-w-none">
              {hotel.name}
            </span>
          </nav>

          <Link
            to="/hotels"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#142B45] transition-colors shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Hotels</span>
          </Link>
        </div>

        <HotelInfo hotel={hotel} />
        <HotelGallery hotel={hotel} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C6A15B]">
                StayEase Signature Residence
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#142B45] mt-1 mb-4">
                {hotel.tagline || 'Experience Luxury Like Never Before'}
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light mb-6">
                {hotel.shortDescription || hotel.description}
              </p>

              {hotel.facilityHighlights && hotel.facilityHighlights.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
                  {hotel.facilityHighlights.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#F5F7FA] border border-slate-200/60 flex items-start gap-3"
                    >
                      <div className="p-2 rounded-xl bg-white shadow-2xs shrink-0">
                        {getHighlightIcon(feat.iconName)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#142B45] leading-snug">
                          {feat.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          {feat.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <h3 className="font-serif text-2xl font-bold text-[#142B45] mb-4">
                About This Property
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light">
                {hotel.about || hotel.description}
              </p>
            </section>

            {hotel.roomDetails && (
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                <h3 className="font-serif text-2xl font-bold text-[#142B45] mb-4">
                  Room & Suite Specifications
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs mb-6">
                  {hotel.roomDetails.type && (
                    <div>
                      <span className="text-slate-400 uppercase font-semibold text-[10px] block">
                        Suite Type
                      </span>
                      <span className="font-bold text-[#142B45] mt-0.5 block">
                        {hotel.roomDetails.type}
                      </span>
                    </div>
                  )}

                  {hotel.roomDetails.bedType && (
                    <div>
                      <span className="text-slate-400 uppercase font-semibold text-[10px] block">
                        Bedding
                      </span>
                      <span className="font-bold text-[#142B45] mt-0.5 block">
                        {hotel.roomDetails.bedType}
                      </span>
                    </div>
                  )}

                  {hotel.roomDetails.capacity && (
                    <div>
                      <span className="text-slate-400 uppercase font-semibold text-[10px] block">
                        Capacity
                      </span>
                      <span className="font-bold text-[#142B45] mt-0.5 block">
                        {hotel.roomDetails.capacity}
                      </span>
                    </div>
                  )}

                  {hotel.roomDetails.size && (
                    <div>
                      <span className="text-slate-400 uppercase font-semibold text-[10px] block">
                        Dimensions
                      </span>
                      <span className="font-bold text-[#142B45] mt-0.5 block flex items-center gap-1">
                        <Maximize className="h-3 w-3 text-[#C6A15B]" />
                        {hotel.roomDetails.size}
                      </span>
                    </div>
                  )}
                </div>

                {hotel.roomDetails.features && hotel.roomDetails.features.length > 0 && (
                  <>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Included In-Room Luxuries
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {hotel.roomDetails.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </section>
            )}

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <HotelAmenities amenities={hotel.amenities} />
            </div>

            {hotel.houseRules && (
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                <h3 className="font-serif text-2xl font-bold text-[#142B45] mb-4">
                  House Rules & Policies
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                    <span className="font-bold text-[#142B45] flex items-center gap-1.5 mb-1">
                      <Clock className="h-3.5 w-3.5 text-[#C6A15B]" />
                      Check-in & Check-out
                    </span>
                    <p className="text-slate-500">
                      Check-in: {hotel.houseRules.checkIn} • Check-out: {hotel.houseRules.checkOut}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                    <span className="font-bold text-[#142B45] flex items-center gap-1.5 mb-1">
                      <ShieldAlert className="h-3.5 w-3.5 text-[#C6A15B]" />
                      Cancellation Policy
                    </span>
                    <p className="text-slate-500">{hotel.houseRules.cancellation}</p>
                  </div>
                </div>
              </section>
            )}

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <HotelReviews hotel={hotel} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <AvailabilityCard hotel={hotel} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
