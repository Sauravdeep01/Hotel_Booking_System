import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useUser, useAuth } from '@clerk/clerk-react'
import {
  CreditCard,
  ShieldCheck,
  Calendar,
  MapPin,
  Users,
  Building,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Lock,
} from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { getBookingByIdApi } from '../services/bookingService'
import {
  loadRazorpayScript,
  createPaymentOrderApi,
  verifyPaymentApi,
  recordPaymentFailureApi,
  getPaymentConfigApi,
} from '../services/paymentService'

export default function Payment() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const { user } = useUser()
  const { getToken } = useAuth()

  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [paymentError, setPaymentError] = useState(null)
  const [razorpayKeyId, setRazorpayKeyId] = useState(
    import.meta.env.VITE_RAZORPAY_KEY_ID || ''
  )

  // Load booking details and public Razorpay configuration
  useEffect(() => {
    let isMounted = true

    const fetchBookingAndConfig = async () => {
      try {
        setLoading(true)
        setError(null)

        let token = null
        try {
          token = await getToken()
        } catch (e) {
          console.warn('Could not retrieve Clerk token:', e)
        }

        // 1. Fetch public Razorpay config if Key ID not in env
        if (!razorpayKeyId) {
          const configRes = await getPaymentConfigApi()
          if (configRes?.data?.keyId && isMounted) {
            setRazorpayKeyId(configRes.data.keyId)
          }
        }

        // 2. Fetch booking details
        const res = await getBookingByIdApi(bookingId, token || user?.id)

        if (!isMounted) return

        if (res.success && res.data) {
          setBooking(res.data)
        } else {
          setError(res.message || 'Unable to retrieve reservation details.')
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching booking details for payment:', err)
          setError('Failed to load reservation for payment.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    if (bookingId) {
      fetchBookingAndConfig()
    }

    return () => {
      isMounted = false
    }
  }, [bookingId, user?.id])

  // Initiate Razorpay checkout modal
  const handleProceedToPayment = async () => {
    try {
      setPaymentError(null)
      setIsProcessing(true)

      let token = null
      try {
        token = await getToken()
      } catch (e) {
        console.warn('Could not get Clerk token:', e)
      }

      // 1. Ensure Razorpay checkout script is loaded
      const isScriptLoaded = await loadRazorpayScript()
      if (!isScriptLoaded) {
        setPaymentError('Could not load Razorpay payment gateway. Please check your internet connection.')
        setIsProcessing(false)
        return
      }

      // 2. Create Razorpay order on backend (amount calculated strictly from MongoDB)
      const orderRes = await createPaymentOrderApi(booking._id || booking.id, token || user?.id)

      if (!orderRes.success) {
        setPaymentError(orderRes.message || 'Failed to initialize payment order.')
        setIsProcessing(false)
        return
      }

      const orderData = orderRes.data
      const effectiveKeyId = orderData.keyId || razorpayKeyId || import.meta.env.VITE_RAZORPAY_KEY_ID

      if (!effectiveKeyId) {
        setPaymentError(
          'Razorpay Key ID is not configured. Please add RAZORPAY_KEY_ID in Server/.env and VITE_RAZORPAY_KEY_ID in Client/.env.'
        )
        setIsProcessing(false)
        return
      }

      // 3. Configure Razorpay checkout options
      const options = {
        key: effectiveKeyId,
        amount: orderData.amount, // in paise
        currency: orderData.currency || 'INR',
        name: 'StayEase Luxury Hotels',
        description: `Reservation Payment • ${booking.hotelName}`,
        image:
          booking.hotelImage ||
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80',
        order_id: orderData.orderId,
        handler: async function (response) {
          setIsProcessing(false)
          setIsVerifying(true)
          setPaymentError(null)

          try {
            // Retrieve fresh token right before verification to ensure token is valid and not expired
            let authToken = null
            try {
              authToken = await getToken()
            } catch (tokenErr) {
              console.warn('Could not refresh Clerk token before verification:', tokenErr)
            }
            if (!authToken && user?.id) {
              authToken = user.id
            }

            // Extract payment confirmation fields with reliable fallback to initial orderId
            const paymentId = response?.razorpay_payment_id
            const orderId =
              response?.razorpay_order_id ||
              orderData?.orderId ||
              booking?.razorpayOrderId
            const signature = response?.razorpay_signature

            if (!paymentId || !signature) {
              setPaymentError('Missing transaction confirmation fields from Razorpay.')
              setIsVerifying(false)
              return
            }

            // Verify payment signature on backend
            const verifyRes = await verifyPaymentApi(
              {
                bookingId: booking._id || booking.id,
                razorpayOrderId: orderId,
                razorpayPaymentId: paymentId,
                razorpaySignature: signature,
              },
              authToken
            )

            if (verifyRes.success && verifyRes.data) {
              // Redirect to My Bookings with updated data
              navigate('/my-bookings', {
                state: {
                  paymentSuccess: true,
                  bookingId: booking._id || booking.id,
                  hotelName: booking.hotelName,
                  paymentId: paymentId,
                  updatedBooking: verifyRes.data,
                },
                replace: true,
              })
            } else {
              setPaymentError(verifyRes.message || 'Payment signature verification failed.')
              setIsVerifying(false)
            }
          } catch (err) {
            console.error('Error during payment verification:', err)
            setPaymentError('Verification failed. Your reservation status remains Pending.')
            setIsVerifying(false)
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false)
            recordPaymentFailureApi(
              booking._id || booking.id,
              'User closed Razorpay checkout popup',
              token || user?.id
            )
            setPaymentError('Payment was not completed. Your reservation remains Pending and you can retry anytime.')
          },
        },
        prefill: {
          name: booking.guestName || user?.fullName || 'Valued Guest',
          email: booking.guestEmail || user?.primaryEmailAddress?.emailAddress || 'guest@stayease.com',
          contact: '+919999999999',
        },
        notes: {
          bookingId: booking._id || booking.id,
          hotelName: booking.hotelName,
          roomType: booking.roomType,
        },
        theme: {
          color: '#142B45', // StayEase luxury navy
        },
      }

      const rzp = new window.Razorpay(options)

      rzp.on('payment.failed', function (response) {
        setIsProcessing(false)
        const errorDesc = response.error?.description || 'Payment was declined.'
        recordPaymentFailureApi(booking._id || booking.id, errorDesc, token || user?.id)
        setPaymentError(`Payment failed: ${errorDesc}. Your reservation remains Pending so you can retry.`)
      })

      rzp.open()
    } catch (err) {
      console.error('Razorpay launch error:', err)
      setPaymentError(err.message || 'An error occurred while launching Razorpay checkout.')
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#142B45] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-20">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-6">
          <Link to="/home" className="hover:text-[#142B45] transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/my-bookings" className="hover:text-[#142B45] transition-colors">
            My Reservations
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#142B45] font-semibold">Payment</span>
        </nav>

        {/* Page Header */}
        <div className="pb-8 border-b border-slate-200/80">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#C6A15B]/15 border border-[#C6A15B]/30 px-3.5 py-1 text-xs font-semibold text-[#142B45] mb-3">
            <Sparkles className="h-3.5 w-3.5 text-[#C6A15B]" />
            <span>Razorpay Test Mode Checkout</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142B45] tracking-tight">
            Complete Reservation Payment
          </h1>

          <p className="mt-2 text-slate-600 text-sm sm:text-base font-light">
            Review your itinerary summary below and complete your transaction using Razorpay's simulated test environment.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-xs mt-8 max-w-md mx-auto flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-[#C6A15B] animate-spin mb-3" />
            <p className="text-sm font-semibold text-[#142B45]">Loading reservation details...</p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="bg-white rounded-3xl p-10 sm:p-12 text-center border border-rose-200 shadow-xs mt-8 max-w-xl mx-auto flex flex-col items-center">
            <div className="h-14 w-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-200">
              <AlertCircle className="h-7 w-7" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#142B45] mb-2">
              Unable to Access Payment
            </h3>

            <p className="text-slate-600 text-sm max-w-md font-light leading-relaxed mb-6">
              {error}
            </p>

            <Link
              to="/my-bookings"
              className="inline-flex items-center gap-2 bg-[#142B45] hover:bg-[#C6A15B] text-white px-6 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to My Bookings</span>
            </Link>
          </div>
        ) : booking ? (
          /* Content: 2-Column Responsive Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
            {/* Column 1: Booking Itinerary & Pricing Breakdown */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C6A15B] block mb-2">
                  Reservation Reference #{booking._id || booking.id}
                </span>

                <div className="flex flex-col sm:flex-row gap-5 items-start pb-6 border-b border-slate-100">
                  <img
                    src={booking.hotelImage}
                    alt={booking.hotelName}
                    className="w-full sm:w-36 h-28 rounded-2xl object-cover bg-slate-100 border border-slate-200 shrink-0 shadow-2xs"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src =
                        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'
                    }}
                  />

                  <div className="min-w-0 flex-1 space-y-1.5">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#142B45] leading-snug">
                      {booking.hotelName}
                    </h3>

                    <p className="text-xs sm:text-sm font-semibold text-[#C6A15B]">
                      {booking.roomName || booking.roomType}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{booking.location}</span>
                    </div>
                  </div>
                </div>

                {/* Itinerary Dates & Guest Details */}
                <div className="grid grid-cols-2 gap-4 py-5 border-b border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-[#C6A15B]" />
                      Check-in
                    </span>
                    <span className="font-semibold text-sm text-[#142B45] block">
                      {typeof booking.checkIn === 'string' ? booking.checkIn.split('T')[0] : ''}
                    </span>
                    <span className="text-[11px] text-slate-400">From 15:00 PM</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-[#C6A15B]" />
                      Check-out
                    </span>
                    <span className="font-semibold text-sm text-[#142B45] block">
                      {typeof booking.checkOut === 'string' ? booking.checkOut.split('T')[0] : ''}
                    </span>
                    <span className="text-[11px] text-slate-400">Until 11:00 AM</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-slate-100 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-[#C6A15B]" />
                    Guest Count
                  </span>
                  <span className="font-semibold text-[#142B45]">{booking.guests}</span>
                </div>

                {/* Price Breakdown */}
                <div className="pt-5 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>
                      Duration of Stay ({booking.nights} {booking.nights === 1 ? 'night' : 'nights'})
                    </span>
                    <span className="font-semibold text-[#142B45]">${booking.basePrice}</span>
                  </div>

                  {booking.discount > 0 && (
                    <div className="flex items-center justify-between text-emerald-700">
                      <span>Special Member Discount</span>
                      <span className="font-semibold">-${booking.discount}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span>Taxes & Luxury Resort Fees</span>
                    <span className="font-semibold text-[#142B45]">${booking.taxes}</span>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between text-base font-bold text-[#142B45]">
                    <span>Total Amount</span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-2xl font-bold text-[#142B45]">
                        ${booking.totalAmount}
                      </span>
                      <span className="text-xs text-slate-400 font-normal">USD</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Payment Action Box */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 sticky top-24">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Payment Gateway
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      booking.paymentStatus === 'paid'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        booking.paymentStatus === 'paid' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                      }`}
                    />
                    {booking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                  </span>
                </div>

                {/* Razorpay Test Mode Banner */}
                <div className="mt-5 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-950">
                    <Sparkles className="h-4 w-4 text-[#C6A15B]" />
                    <span>Razorpay Test Mode Active</span>
                  </div>
                  <p className="leading-relaxed text-[11px] text-amber-900/90 font-light">
                    This is a simulated transaction environment. No real funds will be charged. You can use standard Razorpay test card credentials (e.g. Card <span className="font-mono font-semibold">4111 1111 1111 1111</span>, any future MM/YY, CVV <span className="font-mono font-semibold">123</span>).
                  </p>
                </div>

                {/* Feedback Alerts */}
                {paymentError && (
                  <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in">
                    <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{paymentError}</p>
                  </div>
                )}

                {/* Action Area */}
                <div className="mt-6 space-y-3">
                  {booking.paymentStatus === 'paid' ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Reservation is Fully Paid!</p>
                          <p className="mt-0.5 text-[11px] text-emerald-700">
                            Transaction Reference: <span className="font-mono">{booking.razorpayPaymentId || 'Completed'}</span>
                          </p>
                        </div>
                      </div>

                      <Link
                        to="/my-bookings"
                        className="w-full flex items-center justify-center gap-2 bg-[#142B45] hover:bg-[#C6A15B] text-white py-3.5 px-6 rounded-2xl font-semibold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Return to My Bookings</span>
                      </Link>
                    </div>
                  ) : booking.status?.toLowerCase() === 'cancelled' ? (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
                      <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                      <p>This reservation has been cancelled and cannot accept payment.</p>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled={isProcessing || isVerifying}
                        onClick={handleProceedToPayment}
                        className="w-full flex items-center justify-center gap-2 bg-[#C6A15B] hover:bg-[#b58f4a] disabled:bg-slate-300 text-white py-4 px-6 rounded-2xl font-semibold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Opening Razorpay Checkout...</span>
                          </>
                        ) : isVerifying ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Verifying Transaction...</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4" />
                            <span>Proceed to Payment (${booking.totalAmount})</span>
                          </>
                        )}
                      </button>

                      <Link
                        to="/my-bookings"
                        className="w-full flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Pay Later (Keep in My Bookings)</span>
                      </Link>
                    </>
                  )}
                </div>

                {/* Trust & Guarantee Badges */}
                <div className="mt-6 pt-5 border-t border-slate-100 space-y-2 text-[11px] text-slate-400 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-[#C6A15B]" />
                    <span>256-Bit SSL Encrypted Razorpay Checkout</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-slate-400" />
                    <span>Verified Clerk Identity • Zero Card Data Stored</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  )
}
