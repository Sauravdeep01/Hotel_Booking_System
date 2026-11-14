import { API_BASE_URL } from './hotelService'

/**
 * Check real-time room availability for a hotel
 * GET /api/hotels/:id/availability?roomType=Double Bed&checkIn=2026-11-20&checkOut=2026-11-24
 */
export const checkRoomAvailabilityApi = async ({ hotelId, roomType, checkIn, checkOut }) => {
  try {
    if (!hotelId) {
      return { success: false, message: 'Hotel ID is required' }
    }
    if (!roomType) {
      return { success: false, message: 'Room type is required' }
    }
    if (!checkIn || !checkOut) {
      return { success: false, message: 'Both check-in and check-out dates are required' }
    }

    const params = new URLSearchParams({
      roomType: roomType.trim(),
      checkIn: checkIn.trim(),
      checkOut: checkOut.trim(),
    })

    const url = `${API_BASE_URL}/hotels/${hotelId}/availability?${params.toString()}`

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    const data = await res.json()

    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        message: data.message || 'Failed to check room availability',
        data: data.data || null,
      }
    }

    return {
      success: true,
      status: res.status,
      message: data.message,
      data: data.data,
    }
  } catch (error) {
    console.error('Error in checkRoomAvailabilityApi:', error)
    return {
      success: false,
      message: error.message || 'Network error while checking room availability',
    }
  }
}

/**
 * Create a new confirmed booking in MongoDB
 * POST /api/bookings
 * Authenticated with Clerk Bearer token
 */
export const createBookingApi = async (bookingPayload, token = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    } else if (bookingPayload?.userId) {
      headers['Authorization'] = `Bearer ${bookingPayload.userId}`
    }

    const res = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers,
      body: JSON.stringify(bookingPayload),
    })

    const data = await res.json()

    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        message: data.message || 'Failed to create booking',
        isSoldOut: res.status === 409,
      }
    }

    return {
      success: true,
      status: res.status,
      message: data.message || 'Booking confirmed successfully',
      data: data.data,
    }
  } catch (error) {
    console.error('Error in createBookingApi:', error)
    return {
      success: false,
      message: error.message || 'Network error while creating booking',
    }
  }
}

/**
 * Fetch all bookings for an authenticated user from MongoDB
 * GET /api/bookings/my-bookings or GET /api/bookings/user/:userId
 * Authenticated with Clerk Bearer token
 */
export const getUserBookingsApi = async (userId, token = null) => {
  try {
    if (!userId) {
      return { success: false, message: 'User ID is required', data: [] }
    }

    const headers = {
      'Accept': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    } else {
      headers['Authorization'] = `Bearer ${userId}`
    }

    const res = await fetch(`${API_BASE_URL}/bookings/user/${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers,
    })

    const data = await res.json()

    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        message: data.message || 'Failed to fetch user bookings',
        data: [],
      }
    }

    // Normalize bookings ensuring id is set to _id for UI compatibility
    const normalizedBookings = (data.data || []).map((b) => ({
      ...b,
      id: b._id || b.id,
      checkIn: typeof b.checkIn === 'string' ? b.checkIn.split('T')[0] : b.checkIn,
      checkOut: typeof b.checkOut === 'string' ? b.checkOut.split('T')[0] : b.checkOut,
    }))

    return {
      success: true,
      count: data.count || normalizedBookings.length,
      data: normalizedBookings,
    }
  } catch (error) {
    console.error('Error in getUserBookingsApi:', error)
    return {
      success: false,
      message: error.message || 'Network error while fetching bookings',
      data: [],
    }
  }
}

/**
 * Cancel a booking and release room availability in MongoDB
 * PATCH /api/bookings/:bookingId/cancel
 * Verifies Clerk authentication and booking ownership
 */
export const cancelBookingApi = async (bookingId, userId = null, token = null) => {
  try {
    if (!bookingId) {
      return { success: false, message: 'Booking ID is required' }
    }

    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    if (userId) {
      headers['x-user-id'] = userId
    }

    const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ userId }),
    })

    const data = await res.json()

    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        message: data.message || 'Failed to cancel booking',
      }
    }

    const updated = data.data
      ? {
          ...data.data,
          id: data.data._id || data.data.id,
          status: data.data.status,
          checkIn: typeof data.data.checkIn === 'string' ? data.data.checkIn.split('T')[0] : data.data.checkIn,
          checkOut: typeof data.data.checkOut === 'string' ? data.data.checkOut.split('T')[0] : data.data.checkOut,
        }
      : null

    return {
      success: true,
      status: res.status,
      message: data.message || 'Booking cancelled successfully',
      data: updated,
    }
  } catch (error) {
    console.error('Error in cancelBookingApi:', error)
    return {
      success: false,
      message: error.message || 'Network error while cancelling booking',
    }
  }
}

/**
 * Get single booking by ID
 * GET /api/bookings/:id
 * Protected with Clerk Bearer token
 */
export const getBookingByIdApi = async (bookingId, token = null) => {
  try {
    if (!bookingId) return { success: false, message: 'Booking ID is required' }

    const headers = {
      'Accept': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'GET',
      headers,
    })

    const data = await res.json()

    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        message: data.message || 'Failed to fetch booking',
      }
    }

    const item = data.data
    const normalized = item
      ? {
          ...item,
          id: item._id || item.id,
          checkIn: typeof item.checkIn === 'string' ? item.checkIn.split('T')[0] : item.checkIn,
          checkOut: typeof item.checkOut === 'string' ? item.checkOut.split('T')[0] : item.checkOut,
        }
      : null

    return {
      success: true,
      data: normalized,
    }
  } catch (error) {
    console.error('Error in getBookingByIdApi:', error)
    return {
      success: false,
      message: error.message || 'Network error while fetching booking',
    }
  }
}

