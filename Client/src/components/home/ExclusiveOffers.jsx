import { useNavigate } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import OfferCard from './OfferCard'
import { EXCLUSIVE_OFFERS } from '../../constants/offers'

export default function ExclusiveOffers() {
  const navigate = useNavigate()

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Left Heading & Right "View All Offers" */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-slate-100">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#C6A15B]/15 border border-[#C6A15B]/30 px-3.5 py-1 text-xs font-semibold text-[#142B45] mb-3">
              <Sparkles className="h-3.5 w-3.5 text-[#C6A15B]" />
              <span>Limited Time Specials</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142B45] tracking-tight">
              Exclusive Offers
            </h2>

            <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed font-light">
              Take advantage of our limited-time offers and special packages to enhance your stay
              and create unforgettable memories.
            </p>
          </div>

          <button
            onClick={() => navigate('/offers')}
            className="self-start md:self-end shrink-0 inline-flex items-center gap-2 text-sm font-bold text-[#142B45] hover:text-[#C6A15B] transition-colors group"
          >
            <span>View All Offers</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Dynamic Offer Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-10 sm:mt-12">
          {EXCLUSIVE_OFFERS.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </div>
    </section>
  )
}

