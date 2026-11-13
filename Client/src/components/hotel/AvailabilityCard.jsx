import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useClerk, useUser } from '@clerk/clerk-react'
import {
  Calendar,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  Search,
  Bed,
} from 'lucide-react'
import { savePendingBooking, createBooking } from '../../utils/bookingStorage'

const TODAY_STR = new Date().toISOString().split('T')[0]
const getTomorrowStr = () => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

export default function AvailabilityCard({
  hotel,
  selectedRoom,
  onSelectRoom,
  onRoomRequired,
}) {
  const navigate = useNavigate()
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const { openSignIn } = useClerk()

  const [checkIn, setCheckIn] = useState(TODAY_STR)
  const [checkOut, setCheckOut] = useState(getTomorrowStr)
  const [guests, setGuests] = useState('2 Guests')
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)

  // Clear room validation error when room is selected
  useEffect(() => {
    if (selectedRoom) {
      if (
        statusMessage?.type === 'error' &&
        statusMessage?.text?.toLowerCase().includes('room type')
      ) {
        setStatusMessage(null)
      }
    }
  }, [selectedRoom])

  // Calculate duration of stay in nights
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1
    const d1 = new Date(checkIn)
    const d2 = new Date(checkOut)
    const diffTime = d2 - d1
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 1
  }

  const nights = calculateNights()
  const currentPrice = selectedRoom ? selectedRoom.price : hotel.price || 350
  const roomName = selectedRoom ? selectedRoom.roomType : null
  const roomImage = selectedRoom?.images?.[0] || hotel.image
  const priceUnit = hotel.priceUnit || 'night'
  const basePrice = currentPrice * nights
  const discountAmount = Math.round(basePrice * 0.15)
  const taxesFees = Math.round(basePrice * 0.1)
  const totalPrice = basePrice - discountAmount + taxesFees

  const validateDates = () => {
    if (!checkIn || !checkOut) {
      setStatusMessage({ type: 'error', text: 'Please select both check-in and check-out dates.' })
      setIsAvailable(false)
      return false
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setStatusMessage({
        type: 'error',
        text: 'Check-out date must be strictly after check-in date.',
      })
      setIsAvailable(false)
      return false
    }

    return true
  }

  // Handle action: verify room selection and dates first, then check availability or book
  const handleActionClick = (e) => {
    e.preventDefault()

    // 1. Mandatory Room Type Selection
    if (!selectedRoom) {
      const msg = 'Please select a room type before booking.'
      setStatusMessage({
        type: 'error',
        text: msg,
      })
      if (onRoomRequired) {
        onRoomRequired(msg)
      }
      return
    }

    // 2. Validate booking dates
    if (!validateDates()) return

    if (!isAvailable) {
      setIsChecking(true)
      setStatusMessage(null)

      setTimeout(() => {
        setIsChecking(false)
        setIsAvailable(true)
        setStatusMessage({
          type: 'success',
          text: `${selectedRoom.roomType} is available for ${nights} ${
            nights === 1 ? 'night' : 'nights'
          }! Click Book Now to secure your stay.`,
        })
      }, 500)
      return
    }

    const bookingPayload = {
      hotelId: hotel.id || hotel._id,
      hotelName: hotel.name,
      hotelImage: roomImage,
      location: hotel.location,
      roomType: selectedRoom.roomType,
      roomName: selectedRoom.name || selectedRoom.roomType,
      selectedRoomPrice: selectedRoom.price,
      checkIn,
      checkOut,
      nights,
      guests,
      basePrice,
      discount: discountAmount,
      taxes: taxesFees,
      totalAmount: totalPrice,
      status: 'Confirmed',
      guestName: user?.fullName || user?.firstName || 'Valued Member',
      guestEmail: user?.primaryEmailAddress?.emailAddress || 'guest@stayease.com',
    }

    if (!isSignedIn) {
      // Save pending booking for unauthenticated users redirecting through Clerk login
      savePendingBooking(bookingPayload)
      try {
        const hotelKey = hotel.id || hotel._id
        sessionStorage.setItem(`stayease_selected_room_${hotelKey}`, JSON.stringify(selectedRoom))
      } catch (err) {}
      openSignIn({
        fallbackRedirectUrl: '/my-bookings',
        forceRedirectUrl: '/my-bookings',
      })
    } else {
      createBooking(user.id, bookingPayload)
      navigate('/my-bookings')
    }
  }

  const handleDateChange = (type, value) => {
    if (type === 'checkIn') setCheckIn(value)
    if (type === 'checkOut') setCheckOut(value)
    setIsAvailable(false)
    setStatusMessage(null)
  }

  const handleGuestsChange = (value) => {
    setGuests(value)
    setIsAvailable(false)
    setStatusMessage(null)
  }

  const handleRoomSelectChange = (roomTypeName) => {
    if (!roomTypeName) {
      if (onSelectRoom) onSelectRoom(null)
      setIsAvailable(false)
      return
    }

    const available =
      hotel.roomTypes && hotel.roomTypes.length > 0
        ? hotel.roomTypes
        : [
            { roomType: 'Single Bed', price: Math.round((hotel.price || 350) * 0.75) },
            { roomType: 'Double Bed', price: hotel.price || 350 },
            { roomType: 'Luxury Room', price: Math.round((hotel.price || 350) * 1.4) },
            { roomType: 'Family Suite', price: Math.round((hotel.price || 350) * 2.0) },
          ]

    const matched = available.find((r) => r.roomType === roomTypeName)
    if (matched && onSelectRoom) {
      onSelectRoom(matched)
      setIsAvailable(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-7 sticky top-24 transition-all">
      <div className="flex items-start justify-between pb-5 border-b border-slate-100 gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#C6A15B] tracking-wider block mb-0.5">
            {selectedRoom ? 'Selected Room' : 'Starting rate'}
          </span>
          <span className="text-xs font-bold text-[#142B45] block truncate max-w-[180px] mb-1">
            {selectedRoom ? selectedRoom.roomType : 'No Room Selected'}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-serif text-3xl font-bold text-[#142B45]">
              ${currentPrice}
            </span>
            <span className="text-sm font-medium text-slate-500">/ {priceUnit}</span>
          </div>
        </div>

        {hotel.discount && (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1 shadow-2xs shrink-0">
            <Sparkles className="h-3 w-3" />
            {hotel.discount}
          </span>
        )}
      </div>

      <form onSubmit={handleActionClick} className="mt-5 space-y-3.5">
        {/* Room Type Selector dropdown in booking card */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 focus-within:border-[#C6A15B] transition-colors">
          <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            <Bed className="h-3 w-3 text-[#C6A15B]" />
            Room Type <span className="text-rose-500">*</span>
          </label>
          <select
            value={selectedRoom?.roomType || ''}
            onChange={(e) => handleRoomSelectChange(e.target.value)}
            className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#142B45] focus:outline-hidden cursor-pointer"
          >
            <option value="">-- Select Room Type --</option>
            {(hotel.roomTypes && hotel.roomTypes.length > 0
              ? hotel.roomTypes
              : [
                  { roomType: 'Single Bed', price: Math.round((hotel.price || 350) * 0.75) },
                  { roomType: 'Double Bed', price: hotel.price || 350 },
                  { roomType: 'Luxury Room', price: Math.round((hotel.price || 350) * 1.4) },
                  { roomType: 'Family Suite', price: Math.round((hotel.price || 350) * 2.0) },
                ]
            ).map((r) => (
              <option key={r.roomType} value={r.roomType}>
                {r.roomType} (${r.price}/night)
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 focus-within:border-[#C6A15B] transition-colors">
            <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              <Calendar className="h-3 w-3 text-[#C6A15B]" />
              Check-in
            </label>
            <input
              type="date"
              min={TODAY_STR}
              value={checkIn}
              onChange={(e) => handleDateChange('checkIn', e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#142B45] focus:outline-hidden cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 focus-within:border-[#C6A15B] transition-colors">
            <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              <Calendar className="h-3 w-3 text-[#C6A15B]" />
              Check-out
            </label>
            <input
              type="date"
              min={checkIn || TODAY_STR}
              value={checkOut}
              onChange={(e) => handleDateChange('checkOut', e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#142B45] focus:outline-hidden cursor-pointer"
            />
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 focus-within:border-[#C6A15B] transition-colors">
          <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            <Users className="h-3 w-3 text-[#C6A15B]" />
            Guests
          </label>
          <select
            value={guests}
            onChange={(e) => handleGuestsChange(e.target.value)}
            className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#142B45] focus:outline-hidden cursor-pointer"
          >
            <option value="1 Guest">1 Guest</option>
            <option value="2 Guests">2 Guests</option>
            <option value="3 Guests">3 Guests</option>
            <option value="4+ Guests">4+ Guests (VIP Family Suite)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isChecking}
          className={`w-full flex items-center justify-center gap-2 font-semibold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-[0.99] text-xs uppercase tracking-wider cursor-pointer ${
            isAvailable
              ? 'bg-[#142B45] hover:bg-[#C6A15B] text-white ring-2 ring-[#C6A15B]/30'
              : 'bg-[#C6A15B] hover:bg-[#b58f4a] text-white disabled:bg-slate-300'
          }`}
        >
          {isChecking ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Verifying Room Availability...</span>
            </>
          ) : isAvailable ? (
            <>
              <span>Book Now</span>
              <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              <span>Check Availability</span>
            </>
          )}
        </button>
      </form>

      {statusMessage && (
        <div
          className={`mt-4 p-3.5 rounded-2xl text-xs flex items-start gap-2.5 transition-all animate-in fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          <p className="font-medium leading-relaxed">{statusMessage.text}</p>
        </div>
      )}

      <div className="mt-6 pt-5 border-t border-slate-100 text-xs text-slate-600 space-y-2.5">
        {!selectedRoom && (
          <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200/60 text-[11px] text-amber-800 text-center font-medium">
            Estimated base rate • Select a room type for exact pricing
          </div>
        )}

        <div className="flex items-center justify-between">
          <span>
            ${currentPrice} × {nights} {nights === 1 ? 'night' : 'nights'}
          </span>
          <span className="font-semibold text-[#142B45]">${basePrice}</span>
        </div>

        {hotel.discount && (
          <div className="flex items-center justify-between text-emerald-700">
            <span>Special Member Discount</span>
            <span className="font-semibold">-${discountAmount}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span>Taxes & Luxury Resort Fees</span>
          <span className="font-semibold text-[#142B45]">${taxesFees}</span>
        </div>

        <div className="pt-3 border-t border-slate-200/80 flex items-baseline justify-between text-sm font-bold text-[#142B45]">
          <span>Estimated Total</span>
          <span className="font-serif text-xl font-bold text-[#142B45]">
            ${totalPrice}
          </span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
        <ShieldCheck className="h-4 w-4 text-[#C6A15B]" />
        <span>Instant Confirmation • Best Rate Guarantee</span>
      </div>
    </div>
  )
}
