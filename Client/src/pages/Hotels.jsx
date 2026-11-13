import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Star,
  MapPin,
  ArrowRight,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Hotel as HotelIcon,
  AlertCircle,
  Check,
  X,
} from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { getAllHotels, formatLocation } from '../services/hotelService'

// Verified fallback Cloudinary image
const FALLBACK_IMAGE = 'https://res.cloudinary.com/demo/image/upload/pool.jpg'

// Filter configuration constants
const ROOM_TYPE_OPTIONS = ['Single Bed', 'Double Bed', 'Luxury Room', 'Family Suite']

const PRICE_RANGE_OPTIONS = [
  { id: '', label: 'All Prices' },
  { id: '0-500', label: '$0–$500' },
  { id: '500-1000', label: '$500–$1,000' },
  { id: '1000-2000', label: '$1,000–$2,000' },
  { id: '2000-3000', label: '$2,000–$3,000' },
]

const SORT_OPTIONS = [
  { id: 'price-low-high', label: 'Price: Low to High' },
  { id: 'price-high-low', label: 'Price: High to Low' },
  { id: 'newest', label: 'Newest First' },
]

export default function Hotels() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // Query parameters from Hero search
  const destinationParam = (searchParams.get('destination') || '').trim()
  const checkInParam = (searchParams.get('checkIn') || '').trim()
  const checkOutParam = (searchParams.get('checkOut') || '').trim()
  const guestsParam = (searchParams.get('guests') || '').trim()

  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters & Sorting state
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([])
  const [selectedPriceRange, setSelectedPriceRange] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Track image load errors by hotel ID
  const [failedImages, setFailedImages] = useState({})

  // Fetch hotels from backend API on mount
  const loadHotels = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await getAllHotels()
      if (res.success && Array.isArray(res.data)) {
        setHotels(res.data)
      } else {
        setHotels([])
      }
    } catch (err) {
      console.error('Error fetching all hotels:', err)
      setError(err.message || 'Unable to connect to the backend hotel server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHotels()
  }, [])

  // Toggle multiple room type selections
  const toggleRoomType = (type) => {
    setSelectedRoomTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  // Clear sidebar filters back to default
  const handleClearFilters = () => {
    setSelectedRoomTypes([])
    setSelectedPriceRange('')
    setSortBy('newest')
  }

  // Clear destination query param
  const handleClearDestination = () => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('destination')
    setSearchParams(nextParams)
  }

  // Clear everything including destination and sidebar filters
  const handleClearAll = () => {
    setSelectedRoomTypes([])
    setSelectedPriceRange('')
    setSortBy('newest')
    setSearchParams({})
  }

  const hasActiveFilters =
    selectedRoomTypes.length > 0 ||
    selectedPriceRange !== '' ||
    sortBy !== 'newest' ||
    Boolean(destinationParam)

  // Filter and sort hotel collection based on active filter sidebar and destination search
  const filteredHotels = useMemo(() => {
    return hotels
      .filter((hotel) => {
        // 1. Destination Search Filter (matches city, country, location, or name)
        if (destinationParam) {
          const q = destinationParam.toLowerCase()
          const hotelCity = (typeof hotel.city === 'string' ? hotel.city : '').toLowerCase()
          const hotelLoc = (
            typeof hotel.location === 'string'
              ? hotel.location
              : formatLocation(hotel.location)
          ).toLowerCase()
          const hotelName = (hotel.name || '').toLowerCase()
          const hotelCountry = (
            typeof hotel.country === 'string' ? hotel.country : ''
          ).toLowerCase()

          const matches =
            hotelCity.includes(q) ||
            hotelLoc.includes(q) ||
            hotelName.includes(q) ||
            hotelCountry.includes(q) ||
            q.includes(hotelCity)

          if (!matches) return false
        }

        // 2. Popular Filters: Room Types (Multiple selections allowed)
        if (selectedRoomTypes.length > 0) {
          const hotelRoomTypes = Array.isArray(hotel.roomTypes)
            ? hotel.roomTypes.map((r) => (r.roomType || r.type || '').trim())
            : []

          const matchesAnySelectedRoom = selectedRoomTypes.some((selectedType) =>
            hotelRoomTypes.includes(selectedType)
          )
          if (!matchesAnySelectedRoom) return false
        }

        // 3. Price Range Filter
        if (selectedPriceRange) {
          const startingPrice = hotel.price ?? 350
          const allPrices =
            Array.isArray(hotel.roomTypes) && hotel.roomTypes.length > 0
              ? [startingPrice, ...hotel.roomTypes.map((r) => r.price)]
              : [startingPrice]

          if (selectedPriceRange === '0-500') {
            const matches = allPrices.some((p) => p >= 0 && p <= 500)
            if (!matches) return false
          } else if (selectedPriceRange === '500-1000') {
            const matches = allPrices.some((p) => p >= 500 && p <= 1000)
            if (!matches) return false
          } else if (selectedPriceRange === '1000-2000') {
            const matches = allPrices.some((p) => p >= 1000 && p <= 2000)
            if (!matches) return false
          } else if (selectedPriceRange === '2000-3000') {
            const matches = allPrices.some((p) => p >= 2000 && p <= 3000)
            if (!matches) return false
          }
        }

        return true
      })
      .sort((a, b) => {
        const priceA = a.price ?? 350
        const priceB = b.price ?? 350

        if (sortBy === 'price-low-high') {
          return priceA - priceB
        }
        if (sortBy === 'price-high-low') {
          return priceB - priceA
        }
        if (sortBy === 'newest') {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return dateB - dateA
        }
        return 0
      })
  }, [hotels, selectedRoomTypes, selectedPriceRange, sortBy, destinationParam])

  // Resolve hotel primary image
  const getHotelImage = (hotel) => {
    const hotelId = hotel._id || hotel.id
    if (failedImages[hotelId]) return FALLBACK_IMAGE

    if (Array.isArray(hotel.images) && hotel.images.length > 0 && hotel.images[0]) {
      return typeof hotel.images[0] === 'string'
        ? hotel.images[0].replace(/^http:\/\//i, 'https://')
        : hotel.images[0].secure_url || hotel.images[0].url || FALLBACK_IMAGE
    }
    if (hotel.image) {
      return typeof hotel.image === 'string'
        ? hotel.image.replace(/^http:\/\//i, 'https://')
        : FALLBACK_IMAGE
    }
    return FALLBACK_IMAGE
  }

  const handleImageError = (hotelId) => {
    setFailedImages((prev) => ({ ...prev, [hotelId]: true }))
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#142B45] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-20">
        {/* Page Header */}
        <div className="pb-8 border-b border-slate-200/80 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#C6A15B]/15 border border-[#C6A15B]/30 px-3.5 py-1 text-xs font-semibold text-[#142B45] mb-2">
              <Sparkles className="h-3.5 w-3.5 text-[#C6A15B]" />
              <span>Curated Collection</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#142B45] tracking-tight">
              All Luxury Hotels & Resorts
            </h1>

            <p className="mt-2 text-slate-600 text-sm font-light">
              Explore handpicked five-star hotels, ocean villas, and palatial residences around the world.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-2xs">
              Showing <strong className="text-[#142B45]">{filteredHotels.length}</strong> of{' '}
              {hotels.length} stays
            </span>

            {/* Mobile Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden inline-flex items-center gap-1.5 bg-[#142B45] text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs cursor-pointer"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Filters {hasActiveFilters && '•'}</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Left Vertical Hotel List (8 cols) + Right Filter Sidebar (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Vertical List of Hotel Cards */}
          <div className="lg:col-span-8 space-y-6">
            {/* Active Destination Search Banner */}
            {destinationParam && (
              <div className="p-4 rounded-2xl bg-white border border-[#C6A15B]/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#C6A15B]/15 text-[#C6A15B] flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Destination Search
                    </div>
                    <div className="text-sm font-bold text-[#142B45] flex flex-wrap items-center gap-2">
                      <span>{destinationParam}</span>
                      {checkInParam && checkOutParam && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-600 font-medium">
                            {checkInParam} to {checkOutParam}
                          </span>
                        </>
                      )}
                      {guestsParam && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-600 font-medium">{guestsParam}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearDestination}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#142B45] hover:text-rose-600 bg-slate-100 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <span>Clear Destination</span>
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Loading Skeleton */}
            {loading && (
              <div className="space-y-6">
                {[1, 2, 3, 4].map((idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col md:flex-row h-auto md:h-72 animate-pulse"
                  >
                    <div className="md:w-80 lg:w-96 h-60 md:h-full bg-slate-200 shrink-0" />
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="h-4 bg-slate-200 rounded w-1/3" />
                        <div className="h-6 bg-slate-200 rounded w-3/4" />
                        <div className="h-4 bg-slate-200 rounded w-1/2" />
                        <div className="h-4 bg-slate-200 rounded w-2/3" />
                      </div>
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="h-8 bg-slate-200 rounded w-28" />
                        <div className="h-10 bg-slate-200 rounded-xl w-32" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="bg-white rounded-3xl p-12 text-center border border-rose-200 shadow-xs">
                <div className="h-14 w-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="h-7 w-7" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#142B45] mb-2">
                  Unable to load hotels
                </h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto mb-6 font-light">{error}</p>
                <button
                  type="button"
                  onClick={loadHotels}
                  className="inline-flex items-center gap-2 bg-[#142B45] hover:bg-[#C6A15B] text-white px-6 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Retry Fetching Hotels</span>
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredHotels.length === 0 && (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
                <div className="h-14 w-14 rounded-2xl bg-[#142B45]/5 text-[#C6A15B] flex items-center justify-center mx-auto mb-4">
                  <HotelIcon className="h-7 w-7" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#142B45] mb-2">
                  {destinationParam
                    ? `No luxury hotels found in "${destinationParam}"`
                    : 'No matching hotels found'}
                </h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto mb-6 font-light">
                  {destinationParam
                    ? `We couldn't find any available luxury stays matching "${destinationParam}" with your selected room types or price filters. Try exploring all destinations or resetting your filters.`
                    : "We couldn't find any properties matching your current room type or price filters. Try adjusting your selections."}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {destinationParam && (
                    <button
                      type="button"
                      onClick={handleClearDestination}
                      className="inline-flex items-center gap-2 bg-[#142B45] hover:bg-[#C6A15B] text-white px-5 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Explore All Destinations</span>
                    </button>
                  )}
                  {(selectedRoomTypes.length > 0 || selectedPriceRange !== '') && (
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-[#142B45] px-5 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Reset Filters</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* List of Hotel Cards */}
            {!loading && !error && filteredHotels.length > 0 && (
              <div className="space-y-6">
                {filteredHotels.map((hotel) => {
                  const hotelId = hotel._id || hotel.id
                  const displayImage = getHotelImage(hotel)
                  const displayLocation =
                    typeof hotel.location === 'object' && hotel.location !== null
                      ? [hotel.location.city, hotel.location.country].filter(Boolean).join(', ') ||
                      hotel.location.address ||
                      ''
                      : hotel.location || ''

                  const startingPrice = hotel.price ?? 350
                  const amenities = Array.isArray(hotel.amenities)
                    ? hotel.amenities.map((a) => (typeof a === 'string' ? a : a.title || ''))
                    : []

                  return (
                    <div
                      key={hotelId}
                      className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col md:flex-row"
                    >
                      {/* Left: Large Hotel Image */}
                      <div className="relative md:w-80 lg:w-88 h-64 md:h-auto shrink-0 overflow-hidden bg-slate-100">
                        <img
                          src={displayImage}
                          alt={hotel.name}
                          onError={() => handleImageError(hotelId)}
                          loading="lazy"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        {hotel.isFeatured && (
                          <div className="absolute top-3.5 left-3.5 bg-[#142B45]/90 backdrop-blur-xs text-[#C6A15B] text-[10px] font-bold px-3 py-1 rounded-full shadow-xs uppercase tracking-wider">
                            Featured
                          </div>
                        )}
                      </div>

                      {/* Right: Hotel Information & Actions */}
                      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Location */}
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
                            <MapPin className="h-3.5 w-3.5 text-[#C6A15B] shrink-0" />
                            <span className="truncate">{displayLocation}</span>
                          </div>

                          {/* Hotel Name */}
                          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#142B45] group-hover:text-[#C6A15B] transition-colors mb-2 leading-tight">
                            {hotel.name}
                          </h2>

                          {/* Star Rating & Reviews */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center text-amber-400">
                              {[...Array(hotel.starRating || 5)].map((_, i) => (
                                <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                              ))}
                            </div>
                            <span className="text-xs font-bold text-[#142B45]">
                              {hotel.rating ? hotel.rating.toFixed(1) : '4.9'}
                            </span>
                            <span className="text-xs text-slate-400 font-light">
                              ({hotel.reviewCount || hotel.reviewsCount || 100} reviews)
                            </span>
                          </div>

                          {/* Room Types Available Badges */}
                          {hotel.roomTypes && hotel.roomTypes.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {hotel.roomTypes.map((rt, i) => (
                                <span
                                  key={i}
                                  className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md"
                                >
                                  {rt.roomType || rt.type}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Amenities Tags */}
                          {amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {amenities.slice(0, 3).map((amenity, i) => (
                                <span
                                  key={i}
                                  className="text-[11px] font-medium text-slate-500 bg-[#F5F7FA] border border-slate-200/60 px-2.5 py-0.5 rounded-md"
                                >
                                  {amenity}
                                </span>
                              ))}
                              {amenities.length > 3 && (
                                <span className="text-[11px] font-medium text-slate-400 self-center">
                                  +{amenities.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Bottom Bar: Price & View Details */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                              Starting from
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="font-serif text-2xl font-bold text-[#142B45]">
                                ${startingPrice}
                              </span>
                              <span className="text-xs text-slate-500 font-light">/ night</span>
                            </div>
                          </div>

                          {/* Construct detail link with search params if available */}
                          {(() => {
                            const detailParams = new URLSearchParams()
                            if (checkInParam) detailParams.set('checkIn', checkInParam)
                            if (checkOutParam) detailParams.set('checkOut', checkOutParam)
                            if (guestsParam) detailParams.set('guests', guestsParam)
                            const queryStr = detailParams.toString()
                            const detailUrl = `/hotels/${hotelId}${queryStr ? `?${queryStr}` : ''}`

                            return (
                              <Link
                                to={detailUrl}
                                className="inline-flex items-center gap-2 bg-[#142B45] hover:bg-[#C6A15B] text-white text-xs font-semibold px-5 py-3 rounded-xl transition-all shadow-xs hover:shadow-md active:scale-95 shrink-0 cursor-pointer"
                              >
                                <span>View Details</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            )
                          })()}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Filter Sidebar */}
          <aside
            className={`lg:col-span-4 ${mobileFilterOpen ? 'block' : 'hidden'
              } lg:block`}
          >
            <div className="sticky top-24 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
              {/* Filter Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-[#C6A15B]" />
                  <h2 className="font-serif text-lg font-bold text-[#142B45]">Filters</h2>
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="text-xs font-semibold text-[#C6A15B] hover:text-[#142B45] transition-colors cursor-pointer"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {/* 1. Popular Filters (Multiple selection) */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Popular Filters
                </h3>
                <div className="space-y-2.5">
                  {ROOM_TYPE_OPTIONS.map((type) => {
                    const isChecked = selectedRoomTypes.includes(type)
                    return (
                      <label
                        key={type}
                        className="flex items-center gap-3 text-xs sm:text-sm font-medium text-slate-700 cursor-pointer select-none hover:text-[#142B45] transition-colors"
                      >
                        <div
                          className={`h-4 w-4 rounded border flex items-center justify-center transition-all ${isChecked
                              ? 'bg-[#142B45] border-[#142B45] text-white'
                              : 'border-slate-300 bg-white'
                            }`}
                        >
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleRoomType(type)}
                          className="sr-only"
                        />
                        <span>{type}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* 2. Price Range */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Price Range
                </h3>
                <div className="space-y-2.5">
                  {PRICE_RANGE_OPTIONS.map((range) => {
                    const isSelected = selectedPriceRange === range.id
                    return (
                      <label
                        key={range.id || 'all'}
                        className="flex items-center gap-3 text-xs sm:text-sm font-medium text-slate-700 cursor-pointer select-none hover:text-[#142B45] transition-colors"
                      >
                        <div
                          className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'border-[#C6A15B]' : 'border-slate-300 bg-white'
                            }`}
                        >
                          {isSelected && <div className="h-2 w-2 rounded-full bg-[#C6A15B]" />}
                        </div>
                        <input
                          type="radio"
                          name="priceRange"
                          checked={isSelected}
                          onChange={() => setSelectedPriceRange(range.id)}
                          className="sr-only"
                        />
                        <span>{range.label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* 3. Sort By */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Sort By
                </h3>
                <div className="space-y-2.5">
                  {SORT_OPTIONS.map((opt) => {
                    const isSelected = sortBy === opt.id
                    return (
                      <label
                        key={opt.id}
                        className="flex items-center gap-3 text-xs sm:text-sm font-medium text-slate-700 cursor-pointer select-none hover:text-[#142B45] transition-colors"
                      >
                        <div
                          className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all ${isSelected ? 'border-[#C6A15B]' : 'border-slate-300 bg-white'
                            }`}
                        >
                          {isSelected && <div className="h-2 w-2 rounded-full bg-[#C6A15B]" />}
                        </div>
                        <input
                          type="radio"
                          name="sortBy"
                          checked={isSelected}
                          onChange={() => setSortBy(opt.id)}
                          className="sr-only"
                        />
                        <span>{opt.label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Clear Filters Button at Bottom */}
              {hasActiveFilters && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-[#142B45] hover:bg-slate-50 transition shadow-2xs cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-[#C6A15B]" />
                    <span>Clear Filters</span>
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
