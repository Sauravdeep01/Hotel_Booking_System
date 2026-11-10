import { Hotel, Sparkles, Star, ShieldCheck, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import { IMAGES } from '../../constants/images'

export default function AuthHero() {
  return (
    <section className="relative hidden lg:flex lg:w-1/2 xl:w-[52%] flex-col justify-between overflow-hidden bg-[#142B45] text-white p-10 xl:p-14 selection:bg-[#C6A15B] selection:text-white">
      <img
        src={IMAGES.hero}
        alt="Luxury Resort"
        className="absolute inset-0 h-full w-full object-cover object-center scale-105 transition-transform duration-1000 ease-out hover:scale-100"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#142B45] via-[#142B45]/75 to-[#142B45]/45" />
      <div className="absolute inset-0 bg-radial-at-tr from-[#C6A15B]/20 via-transparent to-transparent pointer-events-none" />

      {/* Brand Header */}
      <div className="relative z-10 flex items-center justify-between">
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#C6A15B] to-[#997939] text-white shadow-lg shadow-[#C6A15B]/25 ring-2 ring-[#C6A15B]/40 group-hover:scale-105 transition-transform">
            <Hotel className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                StayEase
              </span>
              <span className="h-2 w-2 rounded-full bg-[#C6A15B]" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C6A15B]">
              Luxury Hotel Management
            </p>
          </div>
        </Link>

        <div className="hidden xl:flex items-center gap-2 rounded-full border border-white/15 bg-white/10 backdrop-blur-md px-3.5 py-1.5 text-xs font-medium text-white/90">
          <Sparkles className="h-3.5 w-3.5 text-[#C6A15B]" />
          <span>Private Collection 2026</span>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 my-auto py-12 max-w-xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#C6A15B]/20 border border-[#C6A15B]/40 px-3.5 py-1.5 mb-6 backdrop-blur-md">
          <div className="flex text-[#C6A15B]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-[#C6A15B]" />
            ))}
          </div>
          <span className="text-xs font-semibold tracking-wide text-white">
            Voted Best Luxury Booking Platform
          </span>
        </div>

        <h1 className="font-serif text-4xl xl:text-5xl font-bold leading-tight tracking-tight text-white text-balance">
          Your Journey Begins With The Perfect Stay.
        </h1>

        <p className="mt-5 text-base xl:text-lg text-white/80 leading-relaxed font-light">
          Discover exceptional stays, explore beautiful destinations, and book your perfect
          getaway with curated 5-star hospitality.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/15 pt-8">
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold text-[#C6A15B]">2,500+</span>
            <span className="text-xs text-white/70 mt-0.5">Handpicked Resorts</span>
          </div>
          <div className="flex flex-col border-l border-white/15 pl-4">
            <span className="font-serif text-2xl font-bold text-[#C6A15B]">120+</span>
            <span className="text-xs text-white/70 mt-0.5">Global Destinations</span>
          </div>
          <div className="flex flex-col border-l border-white/15 pl-4">
            <span className="font-serif text-2xl font-bold text-[#C6A15B]">99.8%</span>
            <span className="text-xs text-white/70 mt-0.5">Guest Satisfaction</span>
          </div>
        </div>
      </div>

      {/* Footer Badges */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6 text-xs text-white/60">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#C6A15B]" />
          <span>Guaranteed Best Rates & Verified Standards</span>
        </div>
        <div className="hidden xl:flex items-center gap-1.5">
          <Compass className="h-3.5 w-3.5 text-[#C6A15B]" />
          <span>World Concierge Network</span>
        </div>
      </div>
    </section>
  )
}

