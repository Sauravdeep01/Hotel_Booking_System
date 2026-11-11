import {
  X,
  MapPin,
  Calendar,
  Users,
  Building,
} from 'lucide-react'

export default function BookingDetailsModal({ booking, isOpen, onClose }) {
  if (!isOpen || !booking) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#142B45]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header with Hotel Image */}
        <div className="relative h-44 sm:h-52 w-full bg-slate-100 overflow-hidden shrink-0">
          <img
            src={booking.hotelImage}
            alt={booking.hotelName}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#142B45] via-[#142B45]/50 to-transparent" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Hotel Name & Reference */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C6A15B] font-bold block">
              Reference #{booking.id}
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight mt-0.5">
              {booking.hotelName}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-200 mt-1">
              <MapPin className="h-3 w-3 text-[#C6A15B] shrink-0" />
              <span>{booking.location}</span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-[#142B45] text-xs">
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Booking:</span>
              <span
                className={`px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                  booking.status === 'Confirmed'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : booking.status === 'Pending'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {booking.status}
              </span>
            </div>
          </div>

          {/* Itinerary Details */}
          <div className="bg-[#F5F7FA] rounded-2xl p-4 border border-slate-200/80 grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block flex items-center gap-1 mb-1">
                <Calendar className="h-3 w-3 text-[#C6A15B]" />
                Check-in Date
              </span>
              <span className="font-bold text-sm text-[#142B45] block">{booking.checkIn}</span>
              <span className="text-[11px] text-slate-500">From 15:00 PM</span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block flex items-center gap-1 mb-1">
                <Calendar className="h-3 w-3 text-[#C6A15B]" />
                Check-out Date
              </span>
              <span className="font-bold text-sm text-[#142B45] block">{booking.checkOut}</span>
              <span className="text-[11px] text-slate-500">Until 11:00 AM</span>
            </div>
          </div>

          {/* Guest and Room Specification */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              Accommodations
            </span>
            <div className="p-3.5 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 text-[#C6A15B]" />
                  Room Specification
                </span>
                <span className="font-semibold text-[#142B45]">{booking.roomType}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-[#C6A15B]" />
                  Registered Guests
                </span>
                <span className="font-semibold text-[#142B45]">
                  {booking.guests} ({booking.nights} {booking.nights === 1 ? 'Night' : 'Nights'})
                </span>
              </div>
            </div>
          </div>

          {/* Guest Personal Information */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              Primary Guest
            </span>
            <div className="p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-[#142B45] block">
                  {booking.guestName || 'Valued Member'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {booking.guestEmail || 'guest@stayease.com'}
                </span>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {booking.specialRequests && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Special Requests
              </span>
              <p className="p-3 rounded-xl bg-slate-50 text-slate-600 border border-slate-200/60 leading-relaxed text-[11px]">
                {booking.specialRequests}
              </p>
            </div>
          )}

          {/* Price Breakdown */}
          <div className="p-4 rounded-2xl bg-[#F5F7FA] border border-slate-200/80 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
              Pricing Summary
            </span>

            <div className="flex items-center justify-between text-slate-600">
              <span>Room Rate ({booking.nights} nights)</span>
              <span>${booking.basePrice}</span>
            </div>

            {booking.discount > 0 && (
              <div className="flex items-center justify-between text-emerald-700 font-medium">
                <span>Member Luxury Privilege</span>
                <span>-${booking.discount}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-slate-600">
              <span>Resort Amenities & Local Taxes</span>
              <span>${booking.taxes}</span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between font-bold text-sm text-[#142B45]">
              <span>Total Amount</span>
              <span className="font-serif text-xl font-bold">${booking.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
