import { Star, Quote } from 'lucide-react'

export default function TestimonialCard({ testimonial }) {
  return (
    <div className="group bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-6 right-6 text-[#C6A15B]/15 group-hover:text-[#C6A15B]/25 transition-colors pointer-events-none">
        <Quote className="h-10 w-10 rotate-180" />
      </div>

      <div>
        <div className="flex items-center gap-1 mb-5">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`h-4 w-4 ${
                index < testimonial.rating
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-200 fill-slate-100'
              }`}
            />
          ))}
          <span className="ml-2 text-xs font-bold text-slate-500">
            {testimonial.rating}.0
          </span>
        </div>

        <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed italic relative z-10 mb-6 font-light">
          "{testimonial.review}"
        </p>
      </div>

      <div className="pt-5 border-t border-slate-100 flex items-center gap-3.5">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="h-12 w-12 rounded-full object-cover ring-2 ring-[#C6A15B]/40 group-hover:ring-[#C6A15B] transition-all"
        />
        <div>
          <h4 className="font-bold text-[#142B45] text-sm sm:text-base leading-snug">
            {testimonial.name}
          </h4>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {testimonial.role}
          </p>
        </div>
      </div>
    </div>
  )
}
