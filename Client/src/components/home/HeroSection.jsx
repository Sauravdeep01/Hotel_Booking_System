import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin,
  Calendar,
  Users,
  Search,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  X,
} from 'lucide-react'
import { IMAGES } from '../../constants/images'
import { getUniqueDestinations } from '../../services/hotelService'

const TODAY_STR = new Date().toISOString().split('T')[0]

const getNextDayStr = (dateStr) => {
  if (!dateStr) return TODAY_STR
  const d = new Date(dateStr)
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

export default function HeroSection() {
  const navigate = useNavigate()
  const checkInRef = useRef(null)
  const checkOutRef = useRef(null)

  // Form states
  const [destination, setDestination] = useState('')
  const [destinations, setDestinations] = useState([])
  const [destinationsLoading, setDestinationsLoading] = useState(true)

  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('2 Guests')

  const [formError, setFormError] = useState(null)

  // Fetch unique destinations dynamically from backend MongoDB
  useEffect(() => {
    let isMounted = true
    const fetchDestinations = async () => {
      try {
        setDestinationsLoading(true)
        const cities = await getUniqueDestinations()
        if (isMounted && Array.isArray(cities)) {
          setDestinations(cities)
        }
      } catch (err) {
        console.error('Error fetching destinations:', err)
      } finally {
        if (isMounted) setDestinationsLoading(false)
      }
    }

    fetchDestinations()
    return () => {
      isMounted = false
    }
  }, [])

  // Validate form and navigate with search query parameters
  const handleSearch = (e) => {
    if (e) e.preventDefault()
    setFormError(null)

    // 1. Destination validation
    if (!destination || destination.trim() === '') {
      setFormError('Please select a destination from the list.')
      return
    }

    // 2. Dates validation
    if (!checkIn) {
      setFormError('Please select a check-in date.')
      checkInRef.current?.showPicker?.()
      return
    }

    if (!checkOut) {
      setFormError('Please select a check-out date.')
      checkOutRef.current?.showPicker?.()
      return
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setFormError('Check-out date must be strictly after check-in date.')
      return
    }

    if (checkIn < TODAY_STR) {
      setFormError('Check-in date cannot be in the past.')
      return
    }

    // 3. Navigate to All Hotels page with query params
    const params = new URLSearchParams({
      destination: destination.trim(),
      checkIn,
      checkOut,
      guests,
    })

    navigate(`/hotels?${params.toString()}`)
  }

  return (
    <section
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#142B45] text-white"
      style={{
        backgroundImage: `url(${IMAGES.hero})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Background Image */}
      <img
        src={IMAGES.hero}
        alt="StayEase Luxury Resort"
        className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
      />

      {/* Dark & Gold Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#142B45] via-[#142B45]/65 to-[#142B45]/45" />
      <div className="absolute inset-0 bg-radial-at-tr from-[#C6A15B]/20 via-transparent to-transparent pointer-events-none" />

      {/* Hero Content - Left Aligned to match QuickStay screenshot */}
      <div className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 sm:pb-20 text-left flex flex-col items-start justify-center">
        {/* Heading */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white max-w-3xl text-left leading-[1.15]">
          Your Journey Begins With The Perfect Stay.
        </h1>

        {/* Subtitle / Description */}
        <p className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-white/85 max-w-2xl font-light leading-relaxed text-left">
          Discover exceptional stays, explore beautiful destinations, and book your perfect
          getaway with handpicked luxury hospitality.
        </p>

        {/* Search Panel Container - Width ~850px, aligned to left edge */}
        <div className="mt-8 sm:mt-9 w-full max-w-[850px] bg-white p-3 sm:p-3.5 rounded-[12px] shadow-2xl border border-slate-100 text-slate-800 text-left">
          {/* Validation Alert */}
          {formError && (
            <div className="mb-3 px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center justify-between gap-2 text-left animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{formError}</span>
              </div>
              <button
                type="button"
                onClick={() => setFormError(null)}
                className="text-rose-400 hover:text-rose-700 p-0.5 rounded cursor-pointer transition-colors"
                aria-label="Dismiss error"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Horizontal Search Row (1 Row on Desktop, Responsive Stacking on Mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row lg:items-end gap-2.5 sm:gap-3">
            {/* 1. Destination (Reduced width) */}
            <div className="col-span-1 sm:col-span-2 lg:flex-[1.25] lg:min-w-0">
              <label
                htmlFor="hero-destination-select"
                className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1.5 text-left"
              >
                Destination
              </label>
              <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-50 focus-within:bg-white focus-within:border-slate-800 focus-within:ring-1 focus-within:ring-slate-800 transition-all h-[42px]">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                <select
                  id="hero-destination-select"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value)
                    setFormError(null)
                  }}
                  className={`w-full bg-transparent text-xs sm:text-sm font-medium focus:outline-hidden cursor-pointer truncate ${
                    destination ? 'text-slate-900' : 'text-slate-500'
                  }`}
                >
                  <option value="" className="text-slate-500">
                    {destinationsLoading ? 'Loading cities...' : 'Where are you going?'}
                  </option>
                  {destinations.map((city) => (
                    <option key={city} value={city} className="text-slate-900">
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. Check-in (Balanced width) */}
            <div className="col-span-1 lg:flex-1 lg:min-w-0">
              <label
                htmlFor="hero-checkin"
                className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1.5 text-left"
              >
                Check in
              </label>
              <div
                onClick={() => checkInRef.current?.showPicker?.()}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-50 focus-within:bg-white focus-within:border-slate-800 focus-within:ring-1 focus-within:ring-slate-800 transition-all h-[42px] cursor-pointer"
              >
                <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  ref={checkInRef}
                  id="hero-checkin"
                  type="date"
                  min={TODAY_STR}
                  value={checkIn}
                  onChange={(e) => {
                    const val = e.target.value
                    setCheckIn(val)
                    setFormError(null)
                    if (!checkOut || new Date(checkOut) <= new Date(val)) {
                      setCheckOut(getNextDayStr(val))
                    }
                  }}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden cursor-pointer"
                />
              </div>
            </div>

            {/* 3. Check-out (Balanced width) */}
            <div className="col-span-1 lg:flex-1 lg:min-w-0">
              <label
                htmlFor="hero-checkout"
                className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1.5 text-left"
              >
                Check out
              </label>
              <div
                onClick={() => checkOutRef.current?.showPicker?.()}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-50 focus-within:bg-white focus-within:border-slate-800 focus-within:ring-1 focus-within:ring-slate-800 transition-all h-[42px] cursor-pointer"
              >
                <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  ref={checkOutRef}
                  id="hero-checkout"
                  type="date"
                  min={checkIn ? getNextDayStr(checkIn) : getNextDayStr(TODAY_STR)}
                  value={checkOut}
                  onChange={(e) => {
                    const val = e.target.value
                    if (checkIn && new Date(val) <= new Date(checkIn)) {
                      setFormError('Check-out date must be later than check-in date.')
                      return
                    }
                    setCheckOut(val)
                    setFormError(null)
                  }}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden cursor-pointer"
                />
              </div>
            </div>

            {/* 4. Guests (Balanced width) */}
            <div className="col-span-1 sm:col-span-1 lg:flex-1 lg:min-w-0">
              <label
                htmlFor="hero-guests-select"
                className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1.5 text-left"
              >
                Guests
              </label>
              <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-50 focus-within:bg-white focus-within:border-slate-800 focus-within:ring-1 focus-within:ring-slate-800 transition-all h-[42px]">
                <Users className="h-4 w-4 text-slate-400 shrink-0" />
                <select
                  id="hero-guests-select"
                  value={guests}
                  onChange={(e) => {
                    setGuests(e.target.value)
                    setFormError(null)
                  }}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden cursor-pointer truncate"
                >
                  <option value="1 Guest">1 Guest</option>
                  <option value="2 Guests">2 Guests</option>
                  <option value="3 Guests">3 Guests</option>
                  <option value="4+ Guests">4+ Guests</option>
                </select>
              </div>
            </div>

            {/* 5. Compact Search Button */}
            <div className="col-span-1 sm:col-span-1 lg:w-auto lg:shrink-0">
              <div
                className="hidden lg:block text-[11px] sm:text-xs font-semibold text-transparent mb-1.5 select-none"
                aria-hidden="true"
              >
                &nbsp;
              </div>
              <button
                type="button"
                onClick={handleSearch}
                className="w-full lg:w-auto lg:px-5 h-[42px] flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm hover:shadow transition-all active:scale-[0.98] cursor-pointer shrink-0"
              >
                <Search className="h-4 w-4 text-white shrink-0" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>

        {/* Trust Badges - Left-aligned */}
        <div className="mt-8 w-full flex flex-wrap items-center justify-start gap-4 sm:gap-6 text-xs text-white/70">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#C6A15B]" />
            2,500+ Handpicked Luxury Resorts
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-[#C6A15B]" />
            Best Rate Guarantee
          </span>
          <span className="hidden sm:inline">•</span>
          <span>Instant Confirmation</span>
        </div>
      </div>
    </section>
  )
}
