import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Star, ArrowRight } from 'lucide-react'

// Verified fallback Cloudinary HTTPS image
const FALLBACK_IMAGE = 'https://res.cloudinary.com/demo/image/upload/pool.jpg'

// Helper to extract a string image URL from string or object
const extractImageUrl = (value) => {
  if (!value) return ''
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'object') {
    return value.secure_url || value.url || ''
  }
  return ''
}

// Helper to ensure HTTPS for Cloudinary/external URLs
const ensureHttps = (url) => {
  if (!url || typeof url !== 'string') return ''
  return url.replace(/^http:\/\//i, 'https://')
}

// Resolve primary image from various possible backend structures
const resolveHotelImage = (hotel) => {
  if (!hotel) return FALLBACK_IMAGE

  let resolved = ''

  // 1. First image from images array
  if (Array.isArray(hotel.images) && hotel.images.length > 0) {
    resolved = extractImageUrl(hotel.images[0])
  }

  // 2. Singular image field
  if (!resolved && hotel.image) {
    resolved = extractImageUrl(hotel.image)
  }

  // 3. Alternative img or thumbnail fields
  if (!resolved && hotel.img) {
    resolved = extractImageUrl(hotel.img)
  }

  if (!resolved && hotel.thumbnail) {
    resolved = extractImageUrl(hotel.thumbnail)
  }

  const secureUrl = ensureHttps(resolved)
  return secureUrl || FALLBACK_IMAGE
}

export default function HotelCard({ hotel }) {
  const navigate = useNavigate()

  if (!hotel) return null

  const hotelId = hotel._id || hotel.id
  const targetImage = resolveHotelImage(hotel)
  const [imgSrc, setImgSrc] = useState(targetImage)

  // Synchronize image source if hotel data changes
  useEffect(() => {
    setImgSrc(targetImage)
  }, [targetImage])

  const handleImageError = () => {
    if (imgSrc !== FALLBACK_IMAGE) {
      setImgSrc(FALLBACK_IMAGE)
    }
  }

  const displayLocation =
    typeof hotel.location === 'object' && hotel.location !== null
      ? [hotel.location.city, hotel.location.country].filter(Boolean).join(', ') ||
        hotel.location.address ||
        ''
      : hotel.location || ''
  const displayRating =
    typeof hotel.rating === 'number' ? hotel.rating.toFixed(1) : '5.0'
  const displayPrice = hotel.price ?? 350
  const isBestSellerOrFeatured = hotel.isBestSeller ?? hotel.isFeatured

  const handleNavigate = () => {
    navigate(`/hotels/${hotelId}`)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleNavigate()
    }
  }

  return (
    <div
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${hotel.name}`}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#C6A15B]/50"
    >
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        <img
          src={imgSrc}
          alt={hotel.name}
          onError={handleImageError}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {isBestSellerOrFeatured && (
          <div className="absolute top-3 left-3 bg-[#142B45]/90 backdrop-blur-xs text-[#C6A15B] text-[11px] font-bold px-3 py-1 rounded-full shadow-xs uppercase tracking-wider">
            {hotel.isBestSeller ? 'Best Seller' : 'Featured'}
          </div>
        )}

        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-[#142B45] shadow-xs">
          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
          <span>{displayRating}</span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
            <MapPin className="h-3.5 w-3.5 text-[#C6A15B] shrink-0" />
            <span className="truncate">{displayLocation}</span>
          </div>

          <h3 className="font-serif text-lg font-bold text-[#142B45] leading-snug line-clamp-1 group-hover:text-[#C6A15B] transition-colors mb-4">
            {hotel.name}
          </h3>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Starting from
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-xl font-bold text-[#142B45]">
                ${displayPrice}
              </span>
              <span className="text-xs text-slate-500">/ night</span>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleNavigate()
            }}
            className="flex items-center gap-1.5 bg-[#142B45] group-hover:bg-[#C6A15B] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs hover:shadow-md active:scale-95 shrink-0 cursor-pointer"
          >
            <span>Book Now</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}
