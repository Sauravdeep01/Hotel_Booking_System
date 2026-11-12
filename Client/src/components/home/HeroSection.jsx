import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Users, Search, Star, Sparkles, ShieldCheck } from 'lucide-react'
import { IMAGES } from '../../constants/images'

export default function HeroSection() {
  const navigate = useNavigate()
  const [destination, setDestination] = useState('')
  const [guests, setGuests] = useState('2 Guests')

  const handleSearch = () => {
    navigate('/hotels')
  }

  return (
    <section className="relative min-h-[580px] sm:min-h-[640px] flex items-center justify-center overflow-hidden bg-[#142B45] text-white">
      <img
        src={IMAGES.hero}
        alt="StayEase Luxury Resort"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#142B45] via-[#142B45]/65 to-[#142B45]/45" />
      <div className="absolute inset-0 bg-radial-at-tr from-[#C6A15B]/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#C6A15B]/20 border border-[#C6A15B]/40 px-4 py-1.5 mb-6 backdrop-blur-md">
          <div className="flex text-[#C6A15B]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-[#C6A15B]" />
            ))}
          </div>
          <span className="text-xs font-semibold tracking-wide text-white">
            Curated 5-Star Hotel Sanctuaries
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white max-w-4xl text-balance">
          Your Journey Begins With The Perfect Stay.
        </h1>

        <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-white/85 max-w-2xl font-light leading-relaxed">
          Discover exceptional stays, explore beautiful destinations, and book your perfect
          getaway with handpicked luxury hospitality.
        </p>

        <div className="mt-10 w-full max-w-4xl bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 text-[#142B45]">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 items-center">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <MapPin className="h-5 w-5 text-[#C6A15B] shrink-0" />
              <div className="text-left w-full">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Destination
                </label>
                <input
                  type="text"
                  placeholder="Where are you going?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#142B45] placeholder:text-slate-400 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <Calendar className="h-5 w-5 text-[#C6A15B] shrink-0" />
              <div className="text-left">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Dates
                </label>
                <span className="text-xs sm:text-sm font-semibold text-[#142B45]">
                  Select dates
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <Users className="h-5 w-5 text-[#C6A15B] shrink-0" />
              <div className="text-left w-full">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#142B45] focus:outline-hidden cursor-pointer"
                >
                  <option value="1 Guest">1 Guest</option>
                  <option value="2 Guests">2 Guests</option>
                  <option value="3 Guests">3 Guests</option>
                  <option value="4+ Guests">4+ Guests</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3 lg:col-span-1">
              <button
                type="button"
                onClick={handleSearch}
                className="w-full flex items-center justify-center gap-2 bg-[#C6A15B] hover:bg-[#b58f4a] text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
              >
                <Search className="h-4 w-4" />
                <span className="text-sm">Search</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-white/70">
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
