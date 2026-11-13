import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import {
  Calendar,
  MapPin,
  Users,
  Eye,
  XCircle,
  Sparkles,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Hotel as HotelIcon,
} from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import BookingDetailsModal from '../components/booking/BookingDetailsModal'
import {
  getUserBookings,
  createBooking,
  cancelBooking,
  getPendingBooking,
  clearPendingBooking,
} from '../utils/bookingStorage'

export default function MyBookings() {
  const { user } = useUser()
  const [loadedUserId, setLoadedUserId] = useState(user?.id || null)
  const [notification, setNotification] = useState(() => {
    if (user?.id) {
      const pending = getPendingBooking()
      if (pending) {
        return {
          type: 'success',
          text: `Booking confirmed! Your reservation for ${pending.hotelName} has been booked successfully.`,
        }
      }
    }
    return null
  })

  const [bookings, setBookings] = useState(() => {
    if (user?.id) {
      const pending = getPendingBooking()
      if (pending) {
        createBooking(user.id, pending)
        clearPendingBooking()
      }
      return getUserBookings(
        user.id,
        user.fullName || user.firstName || 'Valued Member',
        user.primaryEmailAddress?.emailAddress || 'member@stayease.com'
      )
    }
    return []
  })

  // Sync bookings when authenticated user loads or changes
  if (user?.id && user.id !== loadedUserId) {
    setLoadedUserId(user.id)
    const pending = getPendingBooking()
    if (pending) {
      createBooking(user.id, pending)
      clearPendingBooking()
      setNotification({
        type: 'success',
        text: `Booking confirmed! Your reservation for ${pending.hotelName} has been booked successfully.`,
      })
    }
    setBookings(
      getUserBookings(
        user.id,
        user.fullName || user.firstName || 'Valued Member',
        user.primaryEmailAddress?.emailAddress || 'member@stayease.com'
      )
    )
  }

  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState(null)
  const [bookingToCancel, setBookingToCancel] = useState(null)

  // Confirm and persist reservation cancellation
  const handleConfirmCancel = () => {
    if (!user || !bookingToCancel) return
    const updated = cancelBooking(user.id, bookingToCancel.id)
    if (updated) {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingToCancel.id ? updated : b))
      )
      setNotification({
        type: 'info',
        text: `Reservation #${bookingToCancel.id} for ${bookingToCancel.hotelName} has been cancelled.`,
      })
      setTimeout(() => setNotification(null), 5000)
    }
    setBookingToCancel(null)
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#142B45] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-20">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-6">
          <Link to="/home" className="hover:text-[#142B45] transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#142B45] font-semibold">My Reservations</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200/80">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#C6A15B]/15 border border-[#C6A15B]/30 px-3.5 py-1 text-xs font-semibold text-[#142B45] mb-3">
              <Sparkles className="h-3.5 w-3.5 text-[#C6A15B]" />
              <span>Guest Concierge Portal</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142B45] tracking-tight">
              My Hotel Bookings
            </h1>

            <p className="mt-2 text-slate-600 text-sm sm:text-base font-light">
              Welcome back, <span className="font-semibold text-[#142B45]">{user?.firstName || 'Guest'}</span>. Review upcoming itineraries and manage your reservations.
            </p>
          </div>

          <Link
            to="/hotels"
            className="inline-flex items-center gap-2 bg-[#142B45] hover:bg-[#C6A15B] text-white px-5 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 shrink-0 self-start md:self-auto"
          >
            <HotelIcon className="h-4 w-4" />
            <span>Book New Stay</span>
          </Link>
        </div>

        {notification && (
          <div
            className={`mt-6 p-4 rounded-2xl flex items-center justify-between text-xs font-medium transition-all animate-in fade-in ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : notification.type === 'error'
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : 'bg-amber-50 text-amber-900 border border-amber-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              ) : notification.type === 'error' ? (
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
              )}
              <span>{notification.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        {bookings.length > 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden mt-8 max-w-6xl mx-auto">
            {/* Table Header: Only three main column headings */}
            <div className="hidden md:grid grid-cols-12 gap-6 px-6 sm:px-8 py-4 bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
              <div className="col-span-6">Hotels</div>
              <div className="col-span-3">Date & Timings</div>
              <div className="col-span-3">Payment</div>
            </div>

            {/* Bookings rows with clearly visible light-grey horizontal divider */}
            <div className="divide-y divide-slate-200">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-6 px-5 sm:px-8 py-6 sm:py-7 items-center hover:bg-slate-50/60 transition-colors"
                >
                  {/* Column 1: Hotels */}
                  <div className="md:col-span-6 flex items-start sm:items-center gap-4 sm:gap-5 min-w-0">
                    {/* Hotel Thumbnail: around 150 x 100px */}
                    <img
                      src={booking.hotelImage}
                      alt={booking.hotelName}
                      className="w-28 h-20 sm:w-[150px] sm:h-[100px] rounded-2xl object-cover shrink-0 bg-slate-100 border border-slate-200 shadow-2xs"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src =
                          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'
                      }}
                    />

                    <div className="min-w-0 flex-1 space-y-2">
                      <h3 className="font-serif text-base sm:text-lg lg:text-xl font-bold text-[#142B45] leading-snug truncate">
                        {booking.hotelName}
                      </h3>

                      <p className="text-xs sm:text-sm font-semibold text-[#C6A15B] leading-tight truncate">
                        {booking.roomType || 'Standard Suite'}
                      </p>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{booking.location}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                        <span className="inline-flex items-center gap-1.5 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg font-medium text-xs">
                          <Users className="h-3.5 w-3.5 text-[#C6A15B]" />
                          {booking.guests}
                        </span>
                        <span className="text-slate-300">•</span>
                        <div className="flex items-baseline gap-1">
                          <span className="font-serif font-bold text-base text-[#142B45]">
                            ${booking.totalAmount}
                          </span>
                          <span className="text-xs text-slate-400 font-normal">total</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Date & Timings */}
                  <div className="md:col-span-3 space-y-3 text-xs pt-3 md:pt-0 border-t md:border-t-0 border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block md:hidden mb-1">
                      Date & Timings
                    </span>
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 rounded-lg bg-amber-50 text-[#C6A15B] shrink-0 mt-0.5">
                        <Calendar className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block leading-tight">
                          Check-in
                        </span>
                        <span className="font-semibold text-sm text-[#142B45] block mt-0.5">
                          {booking.checkIn}
                        </span>
                        <span className="text-[11px] text-slate-400">From 15:00 PM</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500 shrink-0 mt-0.5">
                        <Calendar className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block leading-tight">
                          Check-out
                        </span>
                        <span className="font-semibold text-sm text-[#142B45] block mt-0.5">
                          {booking.checkOut}
                        </span>
                        <span className="text-[11px] text-slate-400">Until 11:00 AM</span>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Payment */}
                  <div className="md:col-span-3 flex flex-row md:flex-col sm:items-start justify-between md:justify-center gap-3.5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block md:hidden mb-1">
                        Payment
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          booking.status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : booking.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            booking.status === 'Confirmed'
                              ? 'bg-emerald-500'
                              : booking.status === 'Pending'
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                          }`}
                        />
                        {booking.status}
                      </span>
                    </div>

                    {/* Action buttons: Only "View Details" and "Cancel Booking" */}
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => setSelectedBookingForDetails(booking)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-[#142B45] text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer shadow-2xs"
                      >
                        <Eye className="h-3.5 w-3.5 text-slate-500" />
                        <span>View Details</span>
                      </button>

                      {booking.status !== 'Cancelled' && (
                        <button
                          type="button"
                          onClick={() => setBookingToCancel(booking)}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-all active:scale-95 cursor-pointer"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Cancel Booking</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-slate-200/80 shadow-xs mt-8 max-w-2xl mx-auto flex flex-col items-center">
            <div className="h-16 w-16 rounded-2xl bg-[#142B45]/5 text-[#C6A15B] flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#142B45] mb-2">
              No bookings found
            </h3>

            <p className="text-slate-500 text-sm max-w-md font-light leading-relaxed mb-6">
              You currently have no reservations. Explore our curated destinations and book an extraordinary getaway with StayEase.
            </p>

            <Link
              to="/hotels"
              className="inline-flex items-center gap-2 bg-[#142B45] hover:bg-[#C6A15B] text-white px-6 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
            >
              <HotelIcon className="h-4 w-4" />
              <span>Explore Luxury Hotels</span>
            </Link>
          </div>
        )}
      </main>

      <Footer />

      <BookingDetailsModal
        booking={selectedBookingForDetails}
        isOpen={Boolean(selectedBookingForDetails)}
        onClose={() => setSelectedBookingForDetails(null)}
      />

      {bookingToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#142B45]/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 text-center">
            <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200">
              <AlertCircle className="h-6 w-6" />
            </div>

            <h3 className="font-serif text-xl font-bold text-[#142B45] mb-2">
              Cancel Reservation?
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Are you sure you want to cancel your reservation for <span className="font-bold text-[#142B45]">{bookingToCancel.hotelName}</span> (Ref #{bookingToCancel.id})? This action will mark your booking as cancelled.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setBookingToCancel(null)}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
