import Razorpay from 'razorpay'
import crypto from 'crypto'
import mongoose from 'mongoose'
import Booking from '../models/Booking.js'

/**
 * Initialize Razorpay SDK instance using environment credentials
 */
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || ''
  const key_secret = process.env.RAZORPAY_KEY_SECRET || ''

  return new Razorpay({
    key_id: key_id || 'rzp_test_placeholder',
    key_secret: key_secret || 'placeholder_secret',
  })
}

/**
 * Get public Razorpay configuration (Key ID only)
 * GET /api/payments/config
 */
export const getPaymentConfig = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      keyId: process.env.RAZORPAY_KEY_ID || '',
      currency: process.env.RAZORPAY_CURRENCY || 'INR',
    },
  })
}

/**
 * Create a new Razorpay Order for a verified booking
 * POST /api/payments/create-order
 *
 * Security:
 * - Verified Clerk authentication (requireAuth)
 * - Booking ownership verification
 * - Trusted amount calculation from MongoDB (never frontend amount)
 * - Rejects already-paid or cancelled bookings
 */
export const createPaymentOrder = async (req, res) => {
  try {
    const authenticatedUserId = req.auth?.userId

    if (!authenticatedUserId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please sign in to proceed with payment.',
      })
    }

    const { bookingId } = req.body

    if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid booking ID is required to create a payment order.',
      })
    }

    // 1. Fetch booking from MongoDB
    const booking = await Booking.findById(bookingId)
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      })
    }

    // 2. Verify booking ownership
    if (booking.userId !== authenticatedUserId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authorized to make payments for this reservation.',
      })
    }

    // 3. Validate booking status: prevent payment for cancelled bookings
    const currentStatus = (booking.status || '').toLowerCase()
    if (currentStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot process payment for a cancelled booking.',
      })
    }

    // 4. Prevent duplicate payments: check if already paid
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'This reservation has already been paid for.',
        data: booking,
      })
    }

    // 5. Calculate amount strictly from trusted MongoDB booking data (paise / smallest currency unit)
    const amountInPaise = Math.round(Number(booking.totalAmount) * 100)
    if (!amountInPaise || amountInPaise <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking total amount for payment calculation.',
      })
    }

    const currency = process.env.RAZORPAY_CURRENCY || 'INR'
    const receiptId = `rcpt_${booking._id.toString().slice(-8)}_${Date.now().toString().slice(-6)}`

    // 6. Create Razorpay order via official SDK
    const razorpay = getRazorpayInstance()

    const orderOptions = {
      amount: amountInPaise,
      currency,
      receipt: receiptId,
      notes: {
        bookingId: booking._id.toString(),
        hotelName: booking.hotelName,
        roomType: booking.roomType,
        userId: authenticatedUserId,
      },
    }

    const order = await razorpay.orders.create(orderOptions)

    // 7. Store Razorpay order ID in MongoDB
    booking.razorpayOrderId = order.id
    await booking.save()

    res.status(200).json({
      success: true,
      message: 'Razorpay order created successfully.',
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID || '',
        booking: {
          id: booking._id,
          hotelName: booking.hotelName,
          hotelImage: booking.hotelImage,
          location: booking.location,
          roomType: booking.roomType,
          roomName: booking.roomName,
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          guests: booking.guests,
          nights: booking.nights,
          basePrice: booking.basePrice,
          discount: booking.discount,
          taxes: booking.taxes,
          totalAmount: booking.totalAmount,
          paymentStatus: booking.paymentStatus || 'pending',
          guestName: booking.guestName,
          guestEmail: booking.guestEmail,
        },
      },
    })
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to initiate Razorpay payment order.',
      error: error.message,
    })
  }
}

/**
 * Verify Razorpay payment signature and mark booking as Paid
 * POST /api/payments/verify
 *
 * Security:
 * - Verified Clerk authentication (requireAuth)
 * - Booking ownership verification
 * - Cryptographic HMAC SHA256 signature verification on backend
 * - Prevents duplicate payment processing
 * - Rejects payments for cancelled reservations
 * - Never trusts client-side callbacks without signature verification
 */
export const verifyPayment = async (req, res) => {
  try {
    const authenticatedUserId = req.auth?.userId

    if (!authenticatedUserId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please sign in to verify payment.',
      })
    }

    // 1. Extract payload supporting camelCase, snake_case, and standard naming
    const bookingId = req.body.bookingId || req.body.booking_id
    let razorpayOrderId = (
      req.body.razorpayOrderId ||
      req.body.razorpay_order_id ||
      req.body.orderId ||
      req.body.order_id ||
      ''
    ).toString().trim()

    const razorpayPaymentId = (
      req.body.razorpayPaymentId ||
      req.body.razorpay_payment_id ||
      req.body.paymentId ||
      req.body.payment_id ||
      ''
    ).toString().trim()

    const razorpaySignature = (
      req.body.razorpaySignature ||
      req.body.razorpay_signature ||
      req.body.signature ||
      ''
    ).toString().trim()

    if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid booking ID is required to verify payment.',
      })
    }

    // 2. Fetch booking from MongoDB
    const booking = await Booking.findById(bookingId)
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      })
    }

    // Fallback: If orderId was omitted in frontend callback, use the orderId saved in booking document
    if (!razorpayOrderId && booking.razorpayOrderId) {
      razorpayOrderId = booking.razorpayOrderId.trim()
    }

    // Validate required fields
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'All payment verification fields (orderId, paymentId, signature) are required.',
      })
    }

    // 3. Verify booking ownership
    if (booking.userId !== authenticatedUserId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You are not authorized to verify this payment.',
      })
    }

    // 4. Do not allow cancelled bookings to be paid (Requirement 10)
    const currentStatus = (booking.status || '').toLowerCase()
    if (currentStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot process payment for a cancelled reservation.',
      })
    }

    // 5. Prevent duplicate payment processing (Requirement 12)
    if (booking.paymentStatus === 'paid') {
      return res.status(200).json({
        success: true,
        message: 'Booking has already been marked as Paid.',
        data: booking,
      })
    }

    // 6. Verify cryptographic HMAC-SHA256 signature using Razorpay Key Secret
    const secret = (process.env.RAZORPAY_KEY_SECRET || '').trim()

    if (!secret) {
      console.error('CRITICAL: RAZORPAY_KEY_SECRET is not configured in Server/.env')
      return res.status(500).json({
        success: false,
        message: 'Server configuration error: Razorpay key secret is not configured.',
      })
    }

    const bodyToSign = `${razorpayOrderId}|${razorpayPaymentId}`
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(bodyToSign)
      .digest('hex')

    const isSignatureValid =
      expectedSignature.toLowerCase() === razorpaySignature.toLowerCase()

    if (!isSignatureValid) {
      // Keep status as pending to allow retrying (Requirement 11)
      booking.paymentStatus = 'pending'
      await booking.save()

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid transaction signature.',
      })
    }

    // 7. Signature verified! Update booking status to 'paid' in MongoDB (Requirement 5)
    booking.paymentStatus = 'paid'
    booking.razorpayOrderId = razorpayOrderId
    booking.razorpayPaymentId = razorpayPaymentId
    booking.razorpaySignature = razorpaySignature
    booking.paidAt = new Date()

    const updatedBooking = await booking.save()

    // 8. Return successful response only after the database update succeeds (Requirement 6)
    return res.status(200).json({
      success: true,
      message: 'Payment successfully verified! Reservation is confirmed as Paid.',
      data: updatedBooking,
    })
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error)
    return res.status(500).json({
      success: false,
      message: 'Server error while verifying payment.',
      error: error.message,
    })
  }
}

/**
 * Handle payment failure/cancellation
 * POST /api/payments/failed
 * Keeps payment status as 'pending' to allow user retrying (Requirement 1.9)
 */
export const recordPaymentFailure = async (req, res) => {
  try {
    const authenticatedUserId = req.auth?.userId
    const { bookingId, errorDescription } = req.body

    if (bookingId && mongoose.Types.ObjectId.isValid(bookingId)) {
      const booking = await Booking.findById(bookingId)
      if (booking && booking.userId === authenticatedUserId) {
        // Keep status as 'pending' so user can retry payment anytime
        if (booking.paymentStatus !== 'paid') {
          booking.paymentStatus = 'pending'
          await booking.save()
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Payment attempt was cancelled or failed. Status remains pending to allow retrying.',
    })
  } catch (error) {
    console.error('Error recording payment failure:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while handling payment failure.',
      error: error.message,
    })
  }
}
