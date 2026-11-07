import { Hotel, Sparkles, Star, ShieldCheck, Compass, Award } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AuthLayout({ children, subtitle }) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F5F7FA]">
      {/* Hero section */}
      <section className="relative hidden lg:flex lg:w-1/2 xl:w-[52%] flex-col justify-between overflow-hidden bg-[#142B45] text-white p-10 xl:p-14 selection:bg-[#C6A15B] selection:text-white">
        <img
          src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2000&q=85"
          alt="Luxury Resort"
          className="absolute inset-0 h-full w-full object-cover object-center scale-105 transition-transform duration-1000 ease-out hover:scale-100"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#142B45] via-[#142B45]/75 to-[#142B45]/45" />
        <div className="absolute inset-0 bg-radial-at-tr from-[#C6A15B]/20 via-transparent to-transparent pointer-events-none" />

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

      {/* Auth form container */}
      <section className="w-full lg:w-1/2 xl:w-[48%] flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 overflow-y-auto">
        <div className="flex items-center justify-between lg:hidden pb-6 border-b border-slate-200/80 mb-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#142B45] to-[#1D3D60] text-[#C6A15B] shadow-md">
              <Hotel className="h-5 w-5" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#142B45]">
                StayEase
              </span>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#C6A15B]">
                Luxury Stays
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-1 text-xs font-semibold text-[#142B45] bg-white border border-slate-200 rounded-full px-3 py-1 shadow-xs">
            <Award className="h-3.5 w-3.5 text-[#C6A15B]" />
            <span>5-Star Portal</span>
          </div>
        </div>

        {subtitle && (
          <div className="max-w-md mx-auto w-full mb-4 text-center hidden sm:block">
            <p className="text-xs uppercase tracking-widest font-semibold text-[#C6A15B]">
              StayEase Guest Access
            </p>
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          </div>
        )}

        <div className="my-auto flex flex-col items-center justify-center w-full py-4">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>

        <div className="pt-8 mt-6 border-t border-slate-200/80 text-center text-xs text-slate-500">
          <p className="flex items-center justify-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[#142B45] font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-[#C6A15B]" />
              256-Bit Encryption
            </span>
            <span className="text-slate-300">•</span>
            <span>Clerk Protected Session</span>
            <span className="text-slate-300">•</span>
            <span className="hover:text-[#142B45] cursor-pointer">Privacy & Terms</span>
          </p>
          <p className="mt-2 text-[11px] text-slate-400">
            © 2026 StayEase Hospitality Group Inc. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  )
}
