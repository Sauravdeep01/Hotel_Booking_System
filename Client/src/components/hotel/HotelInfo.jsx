import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, MapPin, Share2, Heart, Check, Sparkles } from 'lucide-react'

export default function HotelInfo({ hotel }) {
  const navigate = useNavigate()
  const [isSaved, setIsSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // fallback
    }
  }

  return (
    <div className="pb-6 border-b border-slate-200/80">
      {/* Top Navigation Row: Back Button & Actions */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#142B45] py-2 px-3 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Hotels</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            title="Share this hotel"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-[#142B45] hover:border-[#C6A15B] hover:bg-slate-50 transition shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700">Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>

          {/* Save / Wishlist Button */}
          <button
            onClick={() => setIsSaved(!isSaved)}
            title={isSaved ? 'Saved to Wishlist' : 'Save to Wishlist'}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition shadow-2xs ${
              isSaved
                ? 'border-rose-300 bg-rose-50 text-rose-600'
                : 'border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50/50'
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Hotel Title & Badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C6A15B] bg-[#C6A15B]/10 border border-[#C6A15B]/30 px-3 py-0.5 rounded-full">
              {hotel.roomType}
            </span>

            {hotel.discount && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                {hotel.discount} Limited Offer
              </span>
            )}
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl lg:text-4xl font-bold text-[#142B45] tracking-tight">
            {hotel.name}
          </h1>
        </div>
      </div>

      {/* Meta Row: Rating, Reviews & Map Location */}
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-1.5">
          <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
          <span className="font-bold text-[#142B45]">{hotel.rating.toFixed(1)}</span>
          <span className="text-slate-400 font-medium">({hotel.reviewsCount} reviews)</span>
        </div>

        <span className="text-slate-300 hidden sm:inline">•</span>

        <div className="flex items-center gap-1 text-slate-500">
          <MapPin className="h-4 w-4 text-[#C6A15B] shrink-0" />
          <span>{hotel.location}</span>
        </div>
      </div>
    </div>
  )
}

