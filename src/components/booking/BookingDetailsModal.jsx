import {
  X,
  MapPin,
  Calendar,
  Users,
  CheckCircle2,
  CreditCard,
  Building,
} from 'lucide-react'

export default function BookingDetailsModal({ booking, isOpen, onClose, onPayNow }) {
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
            className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
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
          {/* Status Badges */}
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

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Payment:</span>
              <span
                className={`px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                  booking.paymentStatus === 'Paid'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {booking.paymentStatus}
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
              <span className="text-[11px] text-slate-500">Until 11:30 AM</span>
            </div>

            <div className="pt-2 border-t border-slate-200/60">
              <span className="text-[10px] font-bold uppercase text-slate-400 block flex items-center gap-1 mb-1">
                <Building className="h-3 w-3 text-[#C6A15B]" />
                Room / Suite
              </span>
              <span className="font-bold text-slate-700">{booking.roomType}</span>
            </div>

            <div className="pt-2 border-t border-slate-200/60">
              <span className="text-[10px] font-bold uppercase text-slate-400 block flex items-center gap-1 mb-1">
                <Users className="h-3 w-3 text-[#C6A15B]" />
                Occupancy & Stay
              </span>
              <span className="font-bold text-slate-700">
                {booking.guests} • {booking.nights} {booking.nights === 1 ? 'Night' : 'Nights'}
              </span>
            </div>
          </div>

          {/* Guest Contact Info */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-2">
              Primary Guest Details
            </span>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">{booking.guestName}</p>
                <p className="text-slate-500 text-[11px]">{booking.guestEmail}</p>
              </div>
              <div className="text-right text-[11px] text-slate-400">
                Booked on: {new Date(booking.createdAt).toLocaleDateString()}
              </div>
            </div>
            {booking.specialRequests && (
              <p className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 italic">
                Note: &quot;{booking.specialRequests}&quot;
              </p>
            )}
          </div>

          {/* Pricing Breakdown */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
              Payment Summary
            </span>

            <div className="flex items-center justify-between text-slate-600">
              <span>Standard Room Rate ({booking.nights} nights)</span>
              <span>${booking.basePrice}</span>
            </div>

            {booking.discount > 0 && (
              <div className="flex items-center justify-between text-emerald-700">
                <span>Member Luxury Discount</span>
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

            {booking.paymentStatus === 'Paid' && booking.paymentMethod && (
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-emerald-700 text-[11px]">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Paid via {booking.paymentMethod}</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-white transition-colors"
          >
            Close
          </button>

          {booking.paymentStatus === 'Unpaid' && booking.status !== 'Cancelled' && (
            <button
              type="button"
              onClick={() => {
                onClose()
                onPayNow(booking)
              }}
              className="flex items-center gap-1.5 bg-[#142B45] hover:bg-[#C6A15B] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-all active:scale-95"
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span>Pay ${booking.totalAmount} Now</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
