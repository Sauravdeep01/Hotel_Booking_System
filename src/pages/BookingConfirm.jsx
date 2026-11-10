import { useState, useMemo } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import {
  Calendar,
  Users,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Building,
  ChevronRight,
  Lock,
} from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import PaymentModal from '../components/booking/PaymentModal'
import { FEATURED_HOTELS } from '../constants/hotels'
import {
  getPendingBooking,
  clearPendingBooking,
  createBooking,
} from '../utils/bookingStorage'

export default function BookingConfirm() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useUser()

  const pendingBooking = useMemo(() => getPendingBooking(), [])

  // Resolve hotel and parameters from searchParams or pendingBooking in session
  const hotelIdParam = searchParams.get('hotelId') || pendingBooking?.hotelId
  const hotelId = parseInt(hotelIdParam, 10) || 1
  const hotel = FEATURED_HOTELS.find((h) => h.id === hotelId) || FEATURED_HOTELS[0]

  const checkIn = searchParams.get('checkIn') || pendingBooking?.checkIn || '2026-12-01'
  const checkOut = searchParams.get('checkOut') || pendingBooking?.checkOut || '2026-12-05'
  const guests = searchParams.get('guests') || pendingBooking?.guests || '2 Guests'
  const roomType = hotel.roomDetails?.type || hotel.roomType

  // Form states
  const [guestName, setGuestName] = useState(
    user?.fullName || user?.firstName || pendingBooking?.guestName || 'Valued Member'
  )
  const [guestEmail, setGuestEmail] = useState(
    user?.primaryEmailAddress?.emailAddress || pendingBooking?.guestEmail || 'guest@stayease.com'
  )
  const [guestPhone, setGuestPhone] = useState('+1 (555) 234-5678')
  const [specialRequests, setSpecialRequests] = useState('')
  const [paymentOption, setPaymentOption] = useState('pay_now') // 'pay_now' | 'pay_later'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmedBooking, setConfirmedBooking] = useState(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  // Calculations
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1
    const d1 = new Date(checkIn)
    const d2 = new Date(checkOut)
    const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 1
  }

  const nights = calculateNights()
  const basePrice = hotel.price * nights
  const discountAmount = Math.round(basePrice * 0.15)
  const taxesFees = Math.round(basePrice * 0.1)
  const totalAmount = basePrice - discountAmount + taxesFees

  const previewBooking = useMemo(
    () => ({
      id: 'SE-2026-CHECKOUT',
      hotelName: hotel.name,
      roomType,
      totalAmount,
      guestName,
    }),
    [hotel.name, roomType, totalAmount, guestName]
  )

  // Base booking payload
  const createPayload = (paymentStatus = 'Unpaid', paymentMethod = null) => ({
    hotelId: hotel.id,
    hotelName: hotel.name,
    hotelImage: hotel.image,
    location: hotel.location,
    roomType,
    checkIn,
    checkOut,
    nights,
    guests,
    basePrice,
    discount: discountAmount,
    taxes: taxesFees,
    totalAmount,
    paymentStatus,
    paymentMethod: paymentMethod || (paymentStatus === 'Paid' ? 'Credit Card' : null),
    guestName,
    guestEmail,
    guestPhone,
    specialRequests: specialRequests.trim() || undefined,
  })

  // Handle Pay Later confirmation
  const handleConfirmPayLater = (e) => {
    e.preventDefault()
    if (!user) return
    setIsSubmitting(true)

    setTimeout(() => {
      const newBooking = createBooking(user.id, createPayload('Unpaid'))
      clearPendingBooking()
      setIsSubmitting(false)
      setConfirmedBooking(newBooking)
    }, 600)
  }

  // Handle Pay Now flow: open mock payment modal
  const handleInitiatePayNow = (e) => {
    e.preventDefault()
    setIsPaymentModalOpen(true)
  }

  const handlePaymentSuccess = (paymentDetails) => {
    if (!user) return
    const newBooking = createBooking(user.id, createPayload('Paid', paymentDetails.method))
    clearPendingBooking()
    setConfirmedBooking(newBooking)
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#142B45] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-20">
        {/* Success View */}
        {confirmedBooking ? (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center animate-in zoom-in-95 duration-300">
            <div className="h-20 w-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 border-2 border-emerald-200">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#C6A15B] block mb-1">
              Reservation Confirmed
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#142B45] mb-2">
              Your Luxury Escape is Booked!
            </h1>

            <p className="text-slate-600 text-sm max-w-md mx-auto font-light leading-relaxed mb-6">
              Thank you, <span className="font-bold text-[#142B45]">{confirmedBooking.guestName}</span>. Your reservation voucher has been generated and saved to your account.
            </p>

            {/* Voucher Card */}
            <div className="bg-[#F5F7FA] rounded-2xl p-5 border border-slate-200/80 text-left mb-8 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Booking Reference
                  </span>
                  <span className="font-mono font-bold text-base text-[#142B45]">
                    #{confirmedBooking.id}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Payment Status
                  </span>
                  <span
                    className={`font-bold uppercase tracking-wider text-[11px] px-2.5 py-0.5 rounded-full ${
                      confirmedBooking.paymentStatus === 'Paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {confirmedBooking.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">
                    Property
                  </span>
                  <span className="font-bold text-[#142B45]">{confirmedBooking.hotelName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">
                    Dates
                  </span>
                  <span className="font-bold text-[#142B45]">
                    {confirmedBooking.checkIn} to {confirmedBooking.checkOut}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">
                    Suite
                  </span>
                  <span className="font-bold text-[#142B45]">{confirmedBooking.roomType}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">
                    Total Amount
                  </span>
                  <span className="font-serif font-bold text-base text-[#142B45]">
                    ${confirmedBooking.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/bookings')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#142B45] hover:bg-[#C6A15B] text-white px-8 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
              >
                <span>View My Bookings</span>
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/home')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-700 hover:bg-slate-50 px-6 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all"
              >
                <span>Return to Homepage</span>
              </button>
            </div>
          </div>
        ) : (
          /* Confirmation Form */
          <div>
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-6">
              <Link to="/home" className="hover:text-[#142B45] transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link to="/hotels" className="hover:text-[#142B45] transition-colors">
                Destinations
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link to={`/hotels/${hotel.id}`} className="hover:text-[#142B45] transition-colors">
                {hotel.name}
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[#142B45] font-semibold">Reservation Checkout</span>
            </nav>

            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#C6A15B]/15 border border-[#C6A15B]/30 px-3.5 py-1 text-xs font-semibold text-[#142B45] mb-2">
                <Sparkles className="h-3.5 w-3.5 text-[#C6A15B]" />
                <span>Instant VIP Confirmation</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#142B45]">
                Review & Confirm Reservation
              </h1>
              <p className="text-slate-600 text-sm mt-1 font-light">
                Please verify your stay details and select your payment preference.
              </p>
            </div>

            {/* Main Form Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
              {/* Left Column (Guest info & Payment choices) */}
              <div className="lg:col-span-2 space-y-6">
                {/* 1. Guest Information Card */}
                <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                  <h2 className="font-serif text-xl font-bold text-[#142B45] mb-1">
                    1. Primary Guest Information
                  </h2>
                  <p className="text-xs text-slate-500 mb-5">
                    Pre-filled from your authenticated StayEase membership account.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full bg-[#F5F7FA] border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs text-[#142B45] font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#C6A15B]/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="w-full bg-[#F5F7FA] border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs text-[#142B45] font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#C6A15B]/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        className="w-full bg-[#F5F7FA] border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs text-[#142B45] font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#C6A15B]/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Special Requests (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Quiet floor, early check-in, anniversary"
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        className="w-full bg-[#F5F7FA] border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs text-[#142B45] focus:outline-hidden focus:ring-2 focus:ring-[#C6A15B]/50 transition-all"
                      />
                    </div>
                  </div>
                </section>

                {/* 2. Stay & Room Specification Summary */}
                <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                  <h2 className="font-serif text-xl font-bold text-[#142B45] mb-4">
                    2. Itinerary & Suite Selection
                  </h2>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#F5F7FA] border border-slate-200/60 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block flex items-center gap-1 mb-1">
                        <Calendar className="h-3 w-3 text-[#C6A15B]" />
                        Check-in
                      </span>
                      <span className="font-bold text-[#142B45]">{checkIn}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block flex items-center gap-1 mb-1">
                        <Calendar className="h-3 w-3 text-[#C6A15B]" />
                        Check-out
                      </span>
                      <span className="font-bold text-[#142B45]">{checkOut}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block flex items-center gap-1 mb-1">
                        <Users className="h-3 w-3 text-[#C6A15B]" />
                        Occupancy
                      </span>
                      <span className="font-bold text-[#142B45]">
                        {guests} ({nights}N)
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block flex items-center gap-1 mb-1">
                        <Building className="h-3 w-3 text-[#C6A15B]" />
                        Room Type
                      </span>
                      <span className="font-bold text-[#142B45] truncate block">{roomType}</span>
                    </div>
                  </div>
                </section>

                {/* 3. Payment Method Choice */}
                <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                  <h2 className="font-serif text-xl font-bold text-[#142B45] mb-1">
                    3. Payment Preference
                  </h2>
                  <p className="text-xs text-slate-500 mb-5">
                    Select whether to settle payment now or upon arrival at the property.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Pay Now Option */}
                    <div
                      onClick={() => setPaymentOption('pay_now')}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentOption === 'pay_now'
                          ? 'border-[#C6A15B] bg-[#C6A15B]/5 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-[#C6A15B]" />
                          <h4 className="font-bold text-sm text-[#142B45]">Pay Now (Instant)</h4>
                        </div>
                        <input
                          type="radio"
                          name="paymentOption"
                          checked={paymentOption === 'pay_now'}
                          onChange={() => setPaymentOption('pay_now')}
                          className="accent-[#C6A15B]"
                        />
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Pay online now with zero surcharge. Instant booking confirmation voucher marked as Paid.
                      </p>
                    </div>

                    {/* Pay at Hotel Option */}
                    <div
                      onClick={() => setPaymentOption('pay_later')}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentOption === 'pay_later'
                          ? 'border-[#C6A15B] bg-[#C6A15B]/5 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Building className="h-5 w-5 text-[#142B45]" />
                          <h4 className="font-bold text-sm text-[#142B45]">Pay at Property</h4>
                        </div>
                        <input
                          type="radio"
                          name="paymentOption"
                          checked={paymentOption === 'pay_later'}
                          onChange={() => setPaymentOption('pay_later')}
                          className="accent-[#C6A15B]"
                        />
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Reserve now with no upfront charge. Pay the full balance upon check-in at the hotel.
                      </p>
                    </div>
                  </div>

                  {/* Submission CTA */}
                  <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Lock className="h-4 w-4 text-[#C6A15B]" />
                      <span>256-Bit SSL Encrypted • Guaranteed Reservation</span>
                    </div>

                    {paymentOption === 'pay_now' ? (
                      <button
                        type="button"
                        onClick={handleInitiatePayNow}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#142B45] hover:bg-[#C6A15B] text-white px-8 py-4 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg active:scale-95"
                      >
                        <Lock className="h-3.5 w-3.5 text-[#C6A15B]" />
                        <span>Proceed to Pay ${totalAmount}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleConfirmPayLater}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#142B45] hover:bg-[#1D3D60] text-white px-8 py-4 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg active:scale-95"
                      >
                        <span>Confirm Reservation (Pay at Hotel)</span>
                      </button>
                    )}
                  </div>
                </section>
              </div>

              {/* Right Column: Sticky Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-7 sticky top-24">
                  {/* Hotel Thumbnail */}
                  <div className="h-44 w-full rounded-2xl overflow-hidden mb-5 bg-slate-100">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Hotel Info */}
                  <div className="pb-4 border-b border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C6A15B] block">
                      Selected Destination
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#142B45] mt-0.5">
                      {hotel.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-[#C6A15B]" />
                      <span>{hotel.location}</span>
                    </p>
                  </div>

                  {/* Price Calculation Itemization */}
                  <div className="py-4 space-y-2.5 text-xs text-slate-600 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <span>
                        ${hotel.price} × {nights} {nights === 1 ? 'night' : 'nights'}
                      </span>
                      <span className="font-semibold text-[#142B45]">${basePrice}</span>
                    </div>

                    <div className="flex items-center justify-between text-emerald-700">
                      <span>Special Member Discount</span>
                      <span className="font-semibold">-${discountAmount}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Resort Amenities & Taxes</span>
                      <span className="font-semibold text-[#142B45]">${taxesFees}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="pt-4 flex items-baseline justify-between text-sm font-bold text-[#142B45]">
                    <span>Total Amount Due</span>
                    <span className="font-serif text-2xl font-bold text-[#142B45]">
                      ${totalAmount}
                    </span>
                  </div>

                  {/* Peace of Mind Guarantee */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
                    <ShieldCheck className="h-4 w-4 text-[#C6A15B] shrink-0" />
                    <span>Free cancellation up to 48 hours prior to arrival.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Payment Gateway Modal */}
      <PaymentModal
        booking={previewBooking}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  )
}
