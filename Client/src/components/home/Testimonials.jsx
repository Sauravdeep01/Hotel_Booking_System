import { MessageSquareQuote } from 'lucide-react'
import TestimonialCard from './TestimonialCard'
import { TESTIMONIALS } from '../../constants/testimonials'

export default function Testimonials() {
  return (
    <section className="bg-[#F5F7FA] py-16 sm:py-20 lg:py-24 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#C6A15B]/15 border border-[#C6A15B]/30 px-3.5 py-1 text-xs font-semibold text-[#142B45] mb-3">
            <MessageSquareQuote className="h-3.5 w-3.5 text-[#C6A15B]" />
            <span>Guest Experiences</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142B45] tracking-tight">
            What Our Guests Say
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-light">
            Discover why travelers consistently choose StayEase for their exceptional and luxurious
            accommodations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12 sm:mt-16">
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}
