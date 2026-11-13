import { Link } from 'react-router-dom'
import {
  Sparkles,
  ShieldCheck,
  Award,
  Clock,
  HeartHandshake,
  ArrowRight,
  CheckCircle2,
  Globe,
  Building2,
  Users,
  Star,
  ChevronRight,
  Compass,
  MapPin,
  Smile,
} from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

// Core statistics for StayEase
const STATS = [
  {
    icon: Building2,
    value: '250+',
    label: 'Curated Luxury Stays',
    description: 'Villas, palaces & boutique chalets',
  },
  {
    icon: Globe,
    value: '45+',
    label: 'Iconic Destinations',
    description: 'Across 6 vibrant continents',
  },
  {
    icon: Users,
    value: '120k+',
    label: 'Happy Travelers',
    description: 'Seamless verified stays booked',
  },
  {
    icon: Star,
    value: '4.9★',
    label: 'Average Guest Rating',
    description: 'From over 85,000 guest reviews',
  },
]

// Feature highlights for Why Choose StayEase
const FEATURES = [
  {
    icon: Award,
    title: 'Handpicked 5-Star Sanctuaries',
    description:
      'Every property in our portfolio undergoes an intensive 80-point quality evaluation to guarantee exceptional comfort, architecture, and service.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparent & Effortless Booking',
    description:
      'Clear, all-inclusive pricing with zero hidden booking fees, instant confirmations, and flexible 48-hour free cancellation policies.',
  },
  {
    icon: Clock,
    title: '24/7 Dedicated Concierge',
    description:
      'Our personal concierge specialists are on standby around the clock to arrange bespoke dining, private transfers, and tailored experiences.',
  },
  {
    icon: HeartHandshake,
    title: 'Bespoke VIP Privileges',
    description:
      'Enjoy exclusive member privileges including complimentary room upgrades upon availability, welcome gifts, and spa credit credits.',
  },
]

// Guarantees for comfortable, hassle-free travel
const COMMITMENTS = [
  {
    title: 'Rigorous Hygiene & Comfort Standards',
    description:
      'Daily professional housekeeping, certified sanitation, and hospital-grade wellness protocols in all residences.',
  },
  {
    title: 'Seamless Digital Check-In',
    description:
      'Fast, queue-free arrivals with digital keycards and personal butler greetings directly at your suite or villa.',
  },
  {
    title: 'Best Luxury Rate Guarantee',
    description:
      'Direct partnerships with resort owners ensure you always receive the most competitive premium pricing available.',
  },
  {
    title: 'Flexible Travel Protection',
    description:
      'Life happens. Enjoy hassle-free date changes and flexible cancellation terms across our entire global collection.',
  },
]

export default function About() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#142B45] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <section className="relative min-h-[500px] sm:min-h-[580px] flex items-center justify-center overflow-hidden bg-[#142B45] text-white">
          <img
            src="https://res.cloudinary.com/demo/image/upload/landscape.jpg"
            alt="StayEase Luxury Resort Landscape"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#142B45] via-[#142B45]/75 to-[#142B45]/50" />
          <div className="absolute inset-0 bg-radial-at-tr from-[#C6A15B]/20 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 sm:pt-32 sm:pb-24 text-center flex flex-col items-center">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs font-medium text-white/70 mb-6 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
              <Link to="/home" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3 w-3 text-[#C6A15B]" />
              <span className="text-white font-semibold">About Us</span>
            </nav>

            <div className="inline-flex items-center gap-2 rounded-full bg-[#C6A15B]/25 border border-[#C6A15B]/40 px-4 py-1.5 mb-6 backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-[#C6A15B]" />
              <span className="text-xs font-semibold tracking-wide text-white uppercase tracking-wider">
                About StayEase
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white max-w-4xl text-balance leading-tight">
              Crafting Unforgettable Stays Around The World
            </h1>

            <p className="mt-5 text-base sm:text-lg md:text-xl text-white/85 max-w-2xl font-light leading-relaxed">
              We connect passionate travelers with handpicked luxury properties, delivering
              uncompromising comfort, bespoke hospitality, and effortless booking experiences.
            </p>
          </div>
        </section>

        {/* 2. Key Statistics Section */}
        <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {STATS.map((stat, idx) => {
              const IconComponent = stat.icon
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-start gap-4"
                >
                  <div className="h-12 w-12 rounded-2xl bg-[#C6A15B]/15 border border-[#C6A15B]/30 text-[#C6A15B] flex items-center justify-center shrink-0">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-[#142B45] tracking-tight block">
                      {stat.value}
                    </span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mt-1">
                      {stat.label}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                      {stat.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 3. Our Story and Mission */}
        <section className="py-20 sm:py-24 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Visual Image Composition */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-4/3 sm:aspect-16/10 lg:aspect-4/3">
                <img
                  src="https://res.cloudinary.com/demo/image/upload/pool.jpg"
                  alt="StayEase Luxury Infinity Pool Villa"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Overlapping secondary image card */}
              <div className="hidden sm:block absolute -bottom-8 -right-6 w-3/5 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-4/3">
                <img
                  src="https://res.cloudinary.com/demo/image/upload/castle.jpg"
                  alt="StayEase Heritage Residence"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Floating verified badge */}
              <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-slate-200/80 flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Our Standard
                  </span>
                  <span className="text-xs font-bold text-[#142B45]">
                    100% Verified Sanctuaries
                  </span>
                </div>
              </div>
            </div>

            {/* Narrative Story & Mission Text */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#C6A15B]/15 border border-[#C6A15B]/30 px-3.5 py-1 text-xs font-semibold text-[#142B45] mb-3">
                  <Compass className="h-3.5 w-3.5 text-[#C6A15B]" />
                  <span>The StayEase Journey</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#142B45] tracking-tight leading-snug">
                  Reimagining Luxury Hospitality For The Modern Explorer
                </h2>

                <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed font-light">
                  StayEase began with a simple yet powerful realization: true luxury isn't about
                  cookie-cutter marble lobbies; it's about authentic moments, serene environments,
                  and intuitive care. Frustrated by overcrowded hotel directories and hidden fees,
                  we set out to build a sanctuary where every listing is an architectural masterpiece.
                </p>

                <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed font-light">
                  Today, we curate only the top tier of international residences — from sun-drenched
                  overwater villas in the Maldives to historic private palaces in Paris and alpine
                  chalets in the Swiss Alps.
                </p>
              </div>

              {/* Mission Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border-l-4 border-[#C6A15B] border-y border-r border-slate-200/80 shadow-xs">
                <h3 className="font-serif text-lg font-bold text-[#142B45] mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#C6A15B]" />
                  <span>Our Mission</span>
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-light">
                  To eliminate friction in luxury travel by pairing discerning guests with
                  meticulously vetted properties, transparent pricing, and 24/7 personalized care —
                  ensuring every journey is as tranquil as the destination itself.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Why Choose StayEase Section */}
        <section className="bg-white py-20 sm:py-24 border-y border-slate-200/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#C6A15B]/15 border border-[#C6A15B]/30 px-3.5 py-1 text-xs font-semibold text-[#142B45] mb-3">
                <Award className="h-3.5 w-3.5 text-[#C6A15B]" />
                <span>The StayEase Distinction</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142B45] tracking-tight">
                Why Choose StayEase
              </h2>

              <p className="mt-4 text-base text-slate-600 font-light leading-relaxed">
                We go beyond standard hotel reservations to deliver a curated travel experience
                steeped in elegance, reliability, and peace of mind.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
              {FEATURES.map((feature, idx) => {
                const IconComp = feature.icon
                return (
                  <div
                    key={idx}
                    className="group bg-[#F5F7FA] rounded-2xl sm:rounded-3xl p-7 border border-slate-200/80 shadow-2xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-12 w-12 rounded-2xl bg-white text-[#C6A15B] border border-slate-200/60 shadow-xs flex items-center justify-center mb-6 group-hover:bg-[#142B45] group-hover:text-[#C6A15B] transition-colors duration-300">
                        <IconComp className="h-6 w-6" />
                      </div>

                      <h3 className="font-serif text-lg font-bold text-[#142B45] mb-3 group-hover:text-[#C6A15B] transition-colors">
                        {feature.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                        {feature.description}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-semibold text-[#142B45]">
                      <span className="text-[11px] uppercase tracking-wider text-[#C6A15B]">
                        Verified Standard
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* 5. Commitment to Comfortable & Hassle-Free Travel */}
        <section className="py-20 sm:py-24 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#C6A15B]/15 border border-[#C6A15B]/30 px-3.5 py-1 text-xs font-semibold text-[#142B45]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#C6A15B]" />
                <span>Our Uncompromising Pledge</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-4xl font-bold text-[#142B45] tracking-tight leading-snug">
                Your Comfort & Peace of Mind, Guaranteed Every Step of the Way
              </h2>

              <p className="text-slate-600 text-sm sm:text-base font-light leading-relaxed">
                Travel should rejuvenate you, not cause anxiety. That's why every StayEase booking
                is backed by strict guest satisfaction standards, direct host guarantees, and
                flexible accommodations designed for modern living.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {COMMITMENTS.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-[#142B45] leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-100 aspect-4/5">
                <img
                  src="https://res.cloudinary.com/demo/image/upload/beach.jpg"
                  alt="Tranquil StayEase Beachfront Haven"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#142B45]/80 via-transparent to-transparent" />

                {/* Floating Guest Testimonial Card */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-white/40 shadow-xl">
                  <div className="flex items-center gap-1 text-amber-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 italic font-light leading-relaxed">
                    "From check-in to checkout, StayEase delivered the most effortless and luxurious
                    getaway we've ever experienced. Every detail was immaculate."
                  </p>
                  <div className="mt-3 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#142B45]">Elena & Marcus V.</span>
                    <span className="text-slate-400">Verified Malé Atoll Guest</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Call To Action (CTA) Section */}
        <section className="bg-gradient-to-br from-[#142B45] to-[#1D3D60] text-white py-16 sm:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-at-tr from-[#C6A15B]/20 via-transparent to-transparent pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#C6A15B]/25 border border-[#C6A15B]/40 px-3.5 py-1 text-xs font-semibold text-white mb-4 backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5 text-[#C6A15B]" />
              <span>Begin Your Journey</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white max-w-2xl text-balance">
              Find Your Next Sanctuary With StayEase
            </h2>

            <p className="mt-4 text-sm sm:text-base text-white/80 max-w-xl font-light leading-relaxed">
              Explore our handpicked collection of over 250 five-star residences and experience
              luxury hospitality reimagined for the modern traveler.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/hotels"
                className="inline-flex items-center gap-2 bg-[#C6A15B] hover:bg-[#b58f4a] text-white px-7 py-3.5 rounded-xl font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-xl active:scale-95 cursor-pointer"
              >
                <span>Explore Hotels</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/home"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-xl font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all backdrop-blur-xs active:scale-95"
              >
                <span>Return Home</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

