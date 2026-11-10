import { useState } from 'react'
import {
  X,
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Zap,
} from 'lucide-react'

export default function PaymentModal({ booking, isOpen, onClose, onPaymentSuccess }) {
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242')
  const [cardHolder, setCardHolder] = useState(booking?.guestName || 'Valued Member')
  const [expiry, setExpiry] = useState('12/28')
  const [cvv, setCvv] = useState('888')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen || !booking) return null

  const handlePay = (e) => {
    if (e) e.preventDefault()
    setIsProcessing(true)

    // Simulate payment authorization
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)

      setTimeout(() => {
        setIsSuccess(false)
        onPaymentSuccess({
          method: `Credit Card ending in ${cardNumber.slice(-4) || '4242'}`,
        })
        onClose()
      }, 1200)
    }, 1400)
  }

  const handleQuickPay = () => {
    setCardNumber('4242 8821 9012 4242')
    setCardHolder(booking?.guestName || 'Valued Member')
    setExpiry('10/29')
    setCvv('912')
    handlePay()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#142B45]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden relative">
        {/* Header Banner */}
        <div className="bg-[#142B45] text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            aria-label="Close Payment Modal"
            className="absolute top-5 right-5 text-slate-300 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 text-[#C6A15B] text-xs font-bold uppercase tracking-wider mb-1">
            <Lock className="h-3.5 w-3.5" />
            <span>StayEase Secure Gateway</span>
          </div>

          <h3 className="font-serif text-2xl font-bold">Complete Reservation Payment</h3>

          <p className="text-slate-300 text-xs mt-1">
            Booking ID: <span className="font-mono text-[#C6A15B]">{booking.id}</span>
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* Amount Due Pill */}
          <div className="bg-[#F5F7FA] rounded-2xl p-4 border border-slate-200/80 mb-5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                {booking.hotelName}
              </span>
              <p className="text-xs text-slate-600 mt-0.5">{booking.roomType}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Total Due
              </span>
              <span className="font-serif text-2xl font-bold text-[#142B45]">
                ${booking.totalAmount}
              </span>
            </div>
          </div>

          {/* Processing Screen */}
          {isProcessing ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="h-14 w-14 rounded-2xl bg-[#142B45]/5 text-[#C6A15B] flex items-center justify-center mb-4">
                <Loader2 className="h-7 w-7 animate-spin text-[#C6A15B]" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#142B45]">
                Authorizing Transaction...
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Connecting with bank gateway. Please do not close or refresh this page.
              </p>
            </div>
          ) : isSuccess ? (
            <div className="py-12 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-200">
              <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-200">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h4 className="font-serif text-xl font-bold text-[#142B45]">Payment Successful!</h4>
              <p className="text-xs text-slate-500 mt-1">
                Your reservation is now fully paid and confirmed.
              </p>
            </div>
          ) : (
            <form onSubmit={handlePay} className="space-y-4">
              {/* Cardholder Name */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="Full name as shown on card"
                  className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#142B45] font-medium focus:outline-hidden focus:ring-2 focus:ring-[#C6A15B]/50 transition-all"
                />
              </div>

              {/* Card Number */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCard className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 •••• •••• 4242"
                    className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#142B45] font-mono tracking-wider focus:outline-hidden focus:ring-2 focus:ring-[#C6A15B]/50 transition-all"
                  />
                </div>
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Expires (MM/YY)
                  </label>
                  <input
                    type="text"
                    required
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#142B45] font-mono text-center focus:outline-hidden focus:ring-2 focus:ring-[#C6A15B]/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    CVC / CVV
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="•••"
                    className="w-full bg-[#F5F7FA] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#142B45] font-mono text-center focus:outline-hidden focus:ring-2 focus:ring-[#C6A15B]/50 transition-all"
                  />
                </div>
              </div>

              {/* Quick Mock Pay Button */}
              <button
                type="button"
                onClick={handleQuickPay}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-[#142B45] bg-[#C6A15B]/15 hover:bg-[#C6A15B]/25 border border-[#C6A15B]/30 transition-all"
              >
                <Zap className="h-3.5 w-3.5 text-[#C6A15B]" />
                <span>Simulate 1-Click Test Payment ($0 real charge)</span>
              </button>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-2 flex items-center justify-center gap-2 bg-[#142B45] hover:bg-[#C6A15B] text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all text-xs"
                >
                  <Lock className="h-3.5 w-3.5 text-[#C6A15B]" />
                  <span>Pay ${booking.totalAmount} Now</span>
                </button>
              </div>
            </form>
          )}

          {/* Security Guarantee Footer */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-[#C6A15B]" />
            <span>256-Bit Bank-Grade SSL Encryption • No Real Card Charged</span>
          </div>
        </div>
      </div>
    </div>
  )
}
