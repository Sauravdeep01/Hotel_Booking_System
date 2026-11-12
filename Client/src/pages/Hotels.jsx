import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  SlidersHorizontal,
  Star,
  ChevronRight,
  RotateCcw,
  Sparkles,
  MapPin,
  ArrowUpDown,
  X,
  Hotel as HotelIcon,
  AlertCircle,
} from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import HotelCard from '../components/home/HotelCard'
import { getAllHotels } from '../services/hotelService'

export default function Hotels() {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDestination, setSelectedDestination] = useState('All')
  const [priceRange, setPriceRange] = useState('all')
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState('recommended')

  // Fetch hotels from backend on mount
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

  // Derive region filter list from active hotel data
  const destinations = useMemo(() => {
    const list = new Set(['All'])
    hotels.forEach((h) => {
      if (typeof h.location === 'object' && h.location?.country) {
        list.add(h.location.country)
      } else if (typeof h.location === 'string' && h.location.trim()) {
        const parts = h.location.split(',')
        if (parts.length > 1) {
          list.add(parts[parts.length - 1].trim())
        } else {
          list.add(h.location.trim())
        }
      }
    })

    if (list.size <= 1) {
      ;['Maldives', 'France', 'Thailand', 'Switzerland', 'Italy'].forEach((d) => list.add(d))
    }

    return Array.from(list)
  }, [hotels])

  // Apply search query, filters, and sort options
  const filteredHotels = useMemo(() => {
    return hotels
      .filter((hotel) => {
        const locString =
          typeof hotel.location === 'object' && hotel.location !== null
            ? `${hotel.location.city || ''} ${hotel.location.country || ''} ${hotel.location.address || ''}`
            : hotel.location || ''

        if (selectedDestination !== 'All') {
          const matchesDest =
            locString.toLowerCase().includes(selectedDestination.toLowerCase()) ||
            hotel.name.toLowerCase().includes(selectedDestination.toLowerCase())
          if (!matchesDest) return false
        }

        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim()
          const matchesQuery =
            hotel.name.toLowerCase().includes(query) ||
            locString.toLowerCase().includes(query) ||
            hotel.description?.toLowerCase().includes(query) ||
            hotel.shortDescription?.toLowerCase().includes(query) ||
            hotel.roomType?.toLowerCase().includes(query) ||
            (Array.isArray(hotel.amenities) &&
              hotel.amenities.some((a) =>
                (typeof a === 'string' ? a : a.title || '').toLowerCase().includes(query)
              ))
          if (!matchesQuery) return false
        }

        const price = hotel.price ?? 350
        if (priceRange === 'under-350' && price >= 350) return false
        if (priceRange === '350-450' && (price < 350 || price > 450)) return false
        if (priceRange === 'above-450' && price <= 450) return false

        const rating = hotel.rating ?? 0
        if (minRating > 0 && rating < minRating) return false

        return true
      })
      .sort((a, b) => {
        const priceA = a.price ?? 350
        const priceB = b.price ?? 350
        const ratingA = a.rating ?? 0
        const ratingB = b.rating ?? 0
        const reviewsA = a.reviewsCount ?? a.reviewCount ?? 0
        const reviewsB = b.reviewsCount ?? b.reviewCount ?? 0

        if (sortBy === 'price-asc') return priceA - priceB
        if (sortBy === 'price-desc') return priceB - priceA
        if (sortBy === 'rating-desc') return ratingB - ratingA
        if (sortBy === 'reviews-desc') return reviewsB - reviewsA
        return 0
      })
  }, [hotels, searchQuery, selectedDestination, priceRange, minRating, sortBy])

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedDestination !== 'All' ||
    priceRange !== 'all' ||
    minRating > 0 ||
    sortBy !== 'recommended'

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedDestination('All')
    setPriceRange('all')
    setMinRating(0)
    setSortBy('recommended')
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#142B45] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-20">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-6">
          <Link to="/home" className="hover:text-[#142B45] transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#142B45] font-semibold">Luxury Destinations</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200/80">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#C6A15B]/15 border border-[#C6A15B]/30 px-3.5 py-1 text-xs font-semibold text-[#142B45] mb-3">
              <Sparkles className="h-3.5 w-3.5 text-[#C6A15B]" />
              <span>Curated Global Portfolio</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142B45] tracking-tight">
              Explore Luxury Hotels & Resorts
            </h1>

            <p className="mt-3 text-slate-600 text-sm sm:text-base max-w-2xl font-light leading-relaxed">
              Discover our exclusive portfolio of five-star ocean retreats, heritage palaces, and
              private mountain chalets. Handcrafted for unforgettable experiences.
            </p>
          </div>

          <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200/80 shadow-2xs self-start md:self-auto shrink-0 flex items-center gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Available Stays
              </span>
              <span className="font-serif text-xl font-bold text-[#142B45]">
                {loading ? '...' : filteredHotels.length}{' '}
                <span className="text-xs font-normal text-slate-500">
                  of {loading ? '...' : hotels.length}
                </span>
              </span>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-[#C6A15B] hover:text-[#142B45] flex items-center gap-1 transition-colors pl-3 border-l border-slate-200 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <MapPin className="h-3 w-3 text-[#C6A15B]" />
            Regions:
          </span>
          {destinations.map((dest) => (
            <button
              key={dest}
              type="button"
              onClick={() => setSelectedDestination(dest)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedDestination === dest
                  ? 'bg-[#142B45] text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
              }`}
            >
              {dest}
            </button>
          ))}
        </div>

        <div className="mt-6 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-5 relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hotel name, location, or amenities..."
                className="w-full bg-[#F5F7FA] border border-slate-200/80 rounded-xl pl-10 pr-9 py-2.5 text-xs text-[#142B45] placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#C6A15B]/50 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="lg:col-span-3">
              <div className="flex items-center gap-2 bg-[#F5F7FA] border border-slate-200/80 rounded-xl px-3 py-2">
                <SlidersHorizontal className="h-4 w-4 text-[#C6A15B] shrink-0" />
                <div className="flex-1">
                  <label htmlFor="price-filter" className="sr-only">
                    Price Range
                  </label>
                  <select
                    id="price-filter"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full bg-transparent text-xs font-medium text-[#142B45] focus:outline-hidden cursor-pointer"
                  >
                    <option value="all">All Price Ranges</option>
                    <option value="under-350">Under $350 / night</option>
                    <option value="350-450">$350 – $450 / night</option>
                    <option value="above-450">Above $450 / night</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 bg-[#F5F7FA] border border-slate-200/80 rounded-xl px-3 py-2">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400 shrink-0" />
                <div className="flex-1">
                  <label htmlFor="rating-filter" className="sr-only">
                    Rating
                  </label>
                  <select
                    id="rating-filter"
                    value={minRating}
                    onChange={(e) => setMinRating(parseFloat(e.target.value))}
                    className="w-full bg-transparent text-xs font-medium text-[#142B45] focus:outline-hidden cursor-pointer"
                  >
                    <option value="0">All Ratings</option>
                    <option value="4.8">4.8+ Superb</option>
                    <option value="4.9">4.9+ Exceptional</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 bg-[#F5F7FA] border border-slate-200/80 rounded-xl px-3 py-2">
                <ArrowUpDown className="h-4 w-4 text-[#C6A15B] shrink-0" />
                <div className="flex-1">
                  <label htmlFor="sort-by" className="sr-only">
                    Sort By
                  </label>
                  <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-transparent text-xs font-medium text-[#142B45] focus:outline-hidden cursor-pointer"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating-desc">Highest Rated</option>
                    <option value="reviews-desc">Most Reviews</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Active Filters:</span>

              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 bg-[#142B45]/5 text-[#142B45] px-2.5 py-1 rounded-full font-medium">
                  Keyword: &quot;{searchQuery}&quot;
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="hover:text-rose-600 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {selectedDestination !== 'All' && (
                <span className="inline-flex items-center gap-1.5 bg-[#142B45]/5 text-[#142B45] px-2.5 py-1 rounded-full font-medium">
                  Region: {selectedDestination}
                  <button
                    type="button"
                    onClick={() => setSelectedDestination('All')}
                    className="hover:text-rose-600 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {priceRange !== 'all' && (
                <span className="inline-flex items-center gap-1.5 bg-[#142B45]/5 text-[#142B45] px-2.5 py-1 rounded-full font-medium">
                  Price: {priceRange}
                  <button
                    type="button"
                    onClick={() => setPriceRange('all')}
                    className="hover:text-rose-600 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {minRating > 0 && (
                <span className="inline-flex items-center gap-1.5 bg-[#142B45]/5 text-[#142B45] px-2.5 py-1 rounded-full font-medium">
                  Rating: {minRating}+ Stars
                  <button
                    type="button"
                    onClick={() => setMinRating(0)}
                    className="hover:text-rose-600 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 ml-auto transition-colors cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-7 mt-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
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
          <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-rose-200 shadow-xs mt-8 max-w-2xl mx-auto flex flex-col items-center">
            <div className="h-16 w-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#142B45] mb-2">
              Failed to load hotel catalog
            </h3>
            <p className="text-slate-500 text-sm max-w-md font-light leading-relaxed mb-6">
              {error}
            </p>
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

        {!loading && !error && filteredHotels.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-7 mt-8">
            {filteredHotels.map((hotel) => (
              <HotelCard key={hotel._id || hotel.id} hotel={hotel} />
            ))}
          </div>
        )}

        {!loading && !error && filteredHotels.length === 0 && (
          <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-slate-200/80 shadow-xs mt-8 max-w-2xl mx-auto flex flex-col items-center">
            <div className="h-16 w-16 rounded-2xl bg-[#142B45]/5 text-[#C6A15B] flex items-center justify-center mb-4">
              <HotelIcon className="h-8 w-8" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#142B45] mb-2">
              {hotels.length === 0
                ? 'No luxury stays in the directory yet'
                : 'No matching luxury stays found'}
            </h3>

            <p className="text-slate-500 text-sm max-w-md font-light leading-relaxed mb-6">
              {hotels.length === 0
                ? 'Our curated hotel catalog is currently being updated. Please check back shortly.'
                : "We couldn't find any properties matching your selected criteria. Try adjusting your search keywords, price tier, or region filters."}
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 bg-[#142B45] hover:bg-[#C6A15B] text-white px-6 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
