import { Star, MessageSquare } from 'lucide-react'

export default function HotelReviews({ hotel }) {
  const ratingCategories = [
    { label: 'Cleanliness & Hygiene', score: 4.9 },
    { label: 'Location & Surroundings', score: 4.9 },
    { label: 'Butler & Service', score: 4.8 },
    { label: 'Comfort & Quietness', score: 4.9 },
    { label: 'Value for Experience', score: 4.7 },
  ]

  const reviews = hotel.reviews || []

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#142B45]">
            Guest Reviews & Experiences
          </h3>
          <p className="text-sm text-slate-500 mt-1 font-light">
            Verified stays verified by StayEase Global Concierge
          </p>
        </div>

        {/* Big Overall Rating Pill */}
        <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs shrink-0 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 text-amber-500">
            <Star className="h-5 w-5 fill-amber-400" />
            <span className="font-serif text-2xl font-bold text-[#142B45]">
              {hotel.rating.toFixed(1)}
            </span>
          </div>
          <div className="border-l border-slate-200 pl-3">
            <p className="text-xs font-bold text-[#142B45]">Superb Experience</p>
            <p className="text-[11px] text-slate-400 font-medium">
              Based on {hotel.reviewsCount} verified stays
            </p>
          </div>
        </div>
      </div>

      {/* Rating Breakdown Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 p-5 rounded-2xl bg-white border border-slate-200/80 mb-8">
        {ratingCategories.map((cat, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-600">{cat.label}</span>
              <span className="font-bold text-[#142B45]">{cat.score}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C6A15B] rounded-full"
                style={{ width: `${(cat.score / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Review Comments Cards */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.author}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-[#C6A15B]/30"
                />
                <div>
                  <h4 className="font-bold text-sm text-[#142B45]">{rev.author}</h4>
                  <p className="text-xs text-slate-400">{rev.date}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, idx) => (
                  <Star
                    key={idx}
                    className={`h-3.5 w-3.5 ${
                      idx < Math.floor(rev.rating)
                        ? 'fill-amber-400'
                        : 'text-slate-200 fill-slate-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed font-light">
              "{rev.comment}"
            </p>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-xs">
            <MessageSquare className="h-6 w-6 mx-auto mb-2 text-slate-300" />
            <span>Be the first guest to review {hotel.name}!</span>
          </div>
        )}
      </div>
    </div>
  )
}

