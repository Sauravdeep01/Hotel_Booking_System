import { useNavigate } from 'react-router-dom'
import { MapPin, Star, ArrowRight } from 'lucide-react'

export default function HotelCard({ hotel }) {
  const navigate = useNavigate()

  const handleBookNow = () => {
    navigate(`/hotel/${hotel.id}`)
  }

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      {/* Hotel Image with Badges */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Optional Best Seller Badge */}
        {hotel.isBestSeller && (
          <div className="absolute top-3 left-3 bg-[#142B45]/90 backdrop-blur-xs text-[#C6A15B] text-[11px] font-bold px-3 py-1 rounded-full shadow-xs uppercase tracking-wider">
            Best Seller
          </div>
        )}

        {/* Rating Pill */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-[#142B45] shadow-xs">
          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
          <span>{hotel.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Hotel Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
            <MapPin className="h-3.5 w-3.5 text-[#C6A15B] shrink-0" />
            <span className="truncate">{hotel.location}</span>
          </div>

          {/* Hotel Name */}
          <h3 className="font-serif text-lg font-bold text-[#142B45] leading-snug line-clamp-1 group-hover:text-[#C6A15B] transition-colors mb-4">
            {hotel.name}
          </h3>
        </div>

        {/* Price & Book Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Starting from
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-xl font-bold text-[#142B45]">
                ${hotel.price}
              </span>
              <span className="text-xs text-slate-500">/ night</span>
            </div>
          </div>

          <button
            onClick={handleBookNow}
            className="flex items-center gap-1.5 bg-[#142B45] hover:bg-[#C6A15B] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs hover:shadow-md active:scale-95 shrink-0"
          >
            <span>Book Now</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

