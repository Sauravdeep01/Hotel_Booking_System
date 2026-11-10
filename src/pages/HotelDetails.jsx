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
} from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import HotelInfo from '../components/hotel/HotelInfo'
import HotelGallery from '../components/hotel/HotelGallery'
import AvailabilityCard from '../components/hotel/AvailabilityCard'
import HotelAmenities from '../components/hotel/HotelAmenities'
import HotelReviews from '../components/hotel/HotelReviews'
import { FEATURED_HOTELS } from '../constants/hotels'

export default function HotelDetails() {
  const { id } = useParams()
  const hotelId = parseInt(id, 10)
  const hotel = FEATURED_HOTELS.find((h) => h.id === hotelId)

  // 404 Not Found State
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

          <Link
            to="/home"
            className="inline-flex items-center gap-2 bg-[#142B45] hover:bg-[#C6A15B] text-white px-6 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Homepage</span>
          </Link>
        </main>

        <Footer />
      </div>
    )
  }

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

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#142B45] flex flex-col justify-between">
      <Navbar />

      {/* Main Container with top padding for fixed navbar */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-4 overflow-x-auto whitespace-nowrap">
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

        {/* 1. Hotel Information Section */}
        <HotelInfo hotel={hotel} />

        {/* 2. Hotel Image Gallery with Lightbox */}
        <HotelGallery hotel={hotel} />

        {/* 3. Two-Column Layout: Left Content & Right Sticky Availability Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 mt-8">
          {/* Left Column (Content Sections) */}
          <div className="lg:col-span-2 space-y-8">
            {/* 3a. Hotel Description & Pricing Highlights */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C6A15B]">
                StayEase Signature Residence
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#142B45] mt-1 mb-4">
                {hotel.tagline || 'Experience Luxury Like Never Before'}
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light mb-6">
                {hotel.shortDescription}
              </p>

              {/* Facility Highlights Cards */}
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
            </section>

            {/* 3b. About This Property */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <h3 className="font-serif text-2xl font-bold text-[#142B45] mb-4">
                About This Property
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light">
                {hotel.about}
              </p>
            </section>

            {/* 3c. Room Details */}
            {hotel.roomDetails && (
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                <h3 className="font-serif text-2xl font-bold text-[#142B45] mb-4">
                  Room & Suite Specifications
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs mb-6">
                  <div>
                    <span className="text-slate-400 uppercase font-semibold text-[10px] block">
                      Suite Type
                    </span>
                    <span className="font-bold text-[#142B45] mt-0.5 block">
                      {hotel.roomDetails.type}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 uppercase font-semibold text-[10px] block">
                      Bedding
                    </span>
                    <span className="font-bold text-[#142B45] mt-0.5 block">
                      {hotel.roomDetails.bedType}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 uppercase font-semibold text-[10px] block">
                      Capacity
                    </span>
                    <span className="font-bold text-[#142B45] mt-0.5 block">
                      {hotel.roomDetails.capacity}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 uppercase font-semibold text-[10px] block">
                      Dimensions
                    </span>
                    <span className="font-bold text-[#142B45] mt-0.5 block flex items-center gap-1">
                      <Maximize className="h-3 w-3 text-[#C6A15B]" />
                      {hotel.roomDetails.size}
                    </span>
                  </div>
                </div>

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
              </section>
            )}

            {/* 3d. Hotel Amenities & Highlights Grid */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <HotelAmenities amenities={hotel.amenities} />
            </div>

            {/* 3e. House Rules */}
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

            {/* 3f. Guest Reviews */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <HotelReviews hotel={hotel} />
            </div>
          </div>

          {/* Right Column (Sticky Booking & Availability Card) */}
          <div className="lg:col-span-1">
            <AvailabilityCard hotel={hotel} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

