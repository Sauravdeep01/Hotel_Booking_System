import { API_BASE_URL } from './hotelService'

/**
 * Dynamically loads the official Razorpay Checkout SDK script if not already present
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => {
      console.error('Failed to load Razorpay checkout script.')
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

/**
 * Get public Razorpay configuration (Key ID & Currency)
 * GET /api/payments/config
 */
export const getPaymentConfigApi = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/payments/config`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching Razorpay config:', error)
    return { success: false, data: { keyId: '', currency: 'INR' } }
  }
}

/**
 * Create a new Razorpay payment order for a booking
 * POST /api/payments/create-order
 */
export const createPaymentOrderApi = async (bookingId, token = null) => {
  try {
    if (!bookingId) {
      return { success: false, message: 'Booking ID is required' }
    }

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    if (token) {
      headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`
    }

    const res = await fetch(`${API_BASE_URL}/payments/create-order`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ bookingId }),
    })

    const data = await res.json()

    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        message: data.message || 'Failed to create payment order',
      }
    }

    return {
      success: true,
      status: res.status,
      message: data.message,
      data: data.data,
    }
  } catch (error) {
    console.error('Error in createPaymentOrderApi:', error)
    return {
      success: false,
      message: error.message || 'Network error while initiating payment',
    }
  }
}

/**
 * Verify Razorpay payment signature and confirm booking as Paid
 * POST /api/payments/verify
 */
export const verifyPaymentApi = async (
  { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature },
  token = null
) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    if (token) {
      headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`
    }

    const res = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        bookingId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        message: data.message || 'Payment signature verification failed',
      }
    }

    return {
      success: true,
      status: res.status,
      message: data.message,
      data: data.data,
    }
  } catch (error) {
    console.error('Error in verifyPaymentApi:', error)
    return {
      success: false,
      message: error.message || 'Network error while verifying payment',
    }
  }
}

/**
 * Record payment failure / cancellation on backend
 * POST /api/payments/failed
 */
export const recordPaymentFailureApi = async (bookingId, errorDescription, token = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    if (token) {
      headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`
    }

    const res = await fetch(`${API_BASE_URL}/payments/failed`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ bookingId, errorDescription }),
    })

    return await res.json()
  } catch (error) {
    console.warn('Failed to report payment failure to backend:', error)
    return { success: false }
  }
}
