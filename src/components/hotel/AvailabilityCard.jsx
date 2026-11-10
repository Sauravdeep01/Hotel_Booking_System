import { useState } from 'react'
import { Calendar, Users, ShieldCheck, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react'

// Static date baseline outside component for render purity
const TODAY_STR = new Date().toISOString().split('T')[0]
const getTomorrowStr = () => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

export default function AvailabilityCard({ hotel }) {
  const [checkIn, setCheckIn] = useState(TODAY_STR)
  const [checkOut, setCheckOut] = useState(getTomorrowStr)
  const [guests, setGuests] = useState('2 Guests')
  const [isChecking, setIsChecking] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)
  const [isAvailable, setIsAvailable] = useState(null)

  // Calculate nights
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1
    const d1 = new Date(checkIn)
    const d2 = new Date(checkOut)
    const diffTime = d2 - d1
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 1
  }

  const nights = calculateNights()
  const basePrice = hotel.price * nights
  const discountAmount = Math.round(basePrice * 0.15)
  const taxesFees = Math.round(basePrice * 0.1)
  const totalPrice = basePrice - discountAmount + taxesFees

  const handleCheckAvailability = (e) => {
    e.preventDefault()

    // Validate dates
    if (!checkIn || !checkOut) {
      setStatusMessage({ type: 'error', text: 'Please select both check-in and check-out dates.' })
      setIsAvailable(false)
      return
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setStatusMessage({ type: 'error', text: 'Check-out date must be strictly after check-in date.' })
      setIsAvailable(false)
      return
    }

    setIsChecking(true)
    setStatusMessage(null)
    setIsAvailable(null)

    // Simulate backend availability inquiry
    setTimeout(() => {
      setIsChecking(false)
      setIsAvailable(true)
      setStatusMessage({
        type: 'success',
        text: `Suite is available for ${nights} ${nights === 1 ? 'night' : 'nights'}! 2 suites remaining at this rate.`,
      })
    }, 700)
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-7 sticky top-24 transition-all">
      {/* Price Header */}
      <div className="flex items-baseline justify-between pb-5 border-b border-slate-100">
        <div>
          <span className="text-xs uppercase font-bold text-slate-400 block tracking-wider">
            Starting rate
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-serif text-3xl font-bold text-[#142B45]">
              ${hotel.price}
            </span>
            <span className="text-sm font-medium text-slate-500">/ {hotel.priceUnit}</span>
          </div>
        </div>

        {hotel.discount && (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1 shadow-2xs">
            <Sparkles className="h-3 w-3" />
            {hotel.discount}
          </span>
        )}
      </div>

      {/* Date & Guest Form */}
      <form onSubmit={handleCheckAvailability} className="mt-5 space-y-3.5">
        <div className="grid grid-cols-2 gap-2.5">
          {/* Check-In */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 focus-within:border-[#C6A15B] transition-colors">
            <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              <Calendar className="h-3 w-3 text-[#C6A15B]" />
              Check-in
            </label>
            <input
              type="date"
              min={TODAY_STR}
              value={checkIn}
              onChange={(e) => {
                setCheckIn(e.target.value)
                setIsAvailable(null)
                setStatusMessage(null)
              }}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#142B45] focus:outline-hidden cursor-pointer"
            />
          </div>

          {/* Check-Out */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 focus-within:border-[#C6A15B] transition-colors">
            <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              <Calendar className="h-3 w-3 text-[#C6A15B]" />
              Check-out
            </label>
            <input
              type="date"
              min={checkIn || TODAY_STR}
              value={checkOut}
              onChange={(e) => {
                setCheckOut(e.target.value)
                setIsAvailable(null)
                setStatusMessage(null)
              }}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#142B45] focus:outline-hidden cursor-pointer"
            />
          </div>
        </div>

        {/* Guests Count */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 focus-within:border-[#C6A15B] transition-colors">
          <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            <Users className="h-3 w-3 text-[#C6A15B]" />
            Guests
          </label>
          <select
            value={guests}
            onChange={(e) => {
              setGuests(e.target.value)
              setIsAvailable(null)
              setStatusMessage(null)
            }}
            className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#142B45] focus:outline-hidden cursor-pointer"
          >
            <option value="1 Guest">1 Guest</option>
            <option value="2 Guests">2 Guests</option>
            <option value="3 Guests">3 Guests</option>
            <option value="4+ Guests">4+ Guests (VIP Family Suite)</option>
          </select>
        </div>

        {/* Check Availability Button */}
        <button
          type="submit"
          disabled={isChecking}
          className="w-full flex items-center justify-center gap-2 bg-[#C6A15B] hover:bg-[#b58f4a] disabled:bg-slate-300 text-white font-semibold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-[0.99] text-sm"
        >
          {isChecking ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Verifying Suite Availability...</span>
            </>
          ) : (
            <span>Check Availability</span>
          )}
        </button>
      </form>

      {/* Dynamic Feedback Banner */}
      {statusMessage && (
        <div
          className={`mt-4 p-3.5 rounded-2xl text-xs flex items-start gap-2.5 transition-all ${
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

      {/* Price Summary Breakdown (shown after check or by default) */}
      <div className="mt-6 pt-5 border-t border-slate-100 text-xs text-slate-600 space-y-2.5">
        <div className="flex items-center justify-between">
          <span>
            ${hotel.price} × {nights} {nights === 1 ? 'night' : 'nights'}
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

      {/* Action Button once verified */}
      {isAvailable && (
        <button
          onClick={() => alert(`Availability verified! Booking flow for ${hotel.name} will be connected to the booking engine.`)}
          className="mt-4 w-full bg-[#142B45] hover:bg-[#1D3D60] text-white font-semibold py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
        >
          Reserve This Suite
        </button>
      )}

      {/* Security Assurance */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
        <ShieldCheck className="h-4 w-4 text-[#C6A15B]" />
        <span>No immediate charge • 256-Bit SSL Encrypted</span>
      </div>
    </div>
  )
}
