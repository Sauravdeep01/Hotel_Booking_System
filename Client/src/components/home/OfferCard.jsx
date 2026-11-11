import { useNavigate } from 'react-router-dom'
import { ArrowRight, Clock, Tag } from 'lucide-react'

export default function OfferCard({ offer }) {
  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate(offer.link || '/offers')
  }

  return (
    <div
      onClick={handleNavigate}
      className="group relative h-[400px] sm:h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between p-6 sm:p-7 selection:bg-[#C6A15B] selection:text-white"
    >
      {/* Background Image with Zoom on Hover */}
      <img
        src={offer.image}
        alt={offer.title}
        className="absolute inset-0 h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
      />

      {/* Dark Gradient Overlay for Maximum Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#142B45] via-[#142B45]/70 to-[#142B45]/20 group-hover:via-[#142B45]/80 transition-colors duration-300" />

      {/* Top Section: Discount Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 bg-[#C6A15B] text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md">
          <Tag className="h-3.5 w-3.5" />
          {offer.discount}
        </span>
      </div>

      {/* Bottom Section: Title, Description, Expiry & View Link */}
      <div className="relative z-10 flex flex-col justify-end">
        <h3 className="font-serif text-2xl font-bold text-white tracking-tight mb-2 group-hover:text-[#C6A15B] transition-colors duration-200">
          {offer.title}
        </h3>

        <p className="text-white/85 text-sm leading-relaxed mb-4 line-clamp-2 font-light">
          {offer.description}
        </p>

        {/* Expiry Date & CTA Row */}
        <div className="pt-4 border-t border-white/15 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-white/70 font-medium">
            <Clock className="h-3.5 w-3.5 text-[#C6A15B]" />
            <span>Expires {offer.expiry}</span>
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#C6A15B] group-hover:text-white group-hover:translate-x-1 transition-all duration-200">
            <span>View Offers</span>
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </div>
  )
}

