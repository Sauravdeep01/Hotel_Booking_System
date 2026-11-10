import { FEATURED_HOTELS } from '../constants/hotels'

const STORAGE_KEY = 'stayease_bookings_db'
const PENDING_BOOKING_KEY = 'stayease_pending_booking'

// Helper to generate seed bookings for a user
const generateSeedBookings = (userId, userName = 'Guest Traveler', userEmail = 'guest@stayease.com') => [
  {
    id: 'SE-2026-9281',
    userId,
    hotelId: 1,
    hotelName: 'Grand Azure Horizon Villa',
    hotelImage: FEATURED_HOTELS[0]?.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    location: 'North Malé Atoll, Maldives',
    roomType: 'Executive Overwater Villa • King Bed',
    checkIn: '2026-12-14',
    checkOut: '2026-12-18',
    nights: 4,
    guests: '2 Guests',
    basePrice: 1360,
    discount: 204,
    taxes: 136,
    totalAmount: 1292,
    paymentStatus: 'Paid',
    status: 'Confirmed',
    createdAt: '2026-11-01T10:30:00.000Z',
    paidAt: '2026-11-01T10:34:00.000Z',
    paymentMethod: 'Visa ending in 4242',
    guestName: userName,
    guestEmail: userEmail,
    specialRequests: 'Upper floor with sunset lagoon view requested.',
  },
  {
    id: 'SE-2026-7840',
    userId,
    hotelId: 2,
    hotelName: 'The Royal Serenity Palace',
    hotelImage: FEATURED_HOTELS[1]?.image || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    location: 'Paris, France',
    roomType: 'Grand Deluxe Suite • King Bed',
    checkIn: '2026-11-25',
    checkOut: '2026-11-28',
    nights: 3,
    guests: '2 Guests',
    basePrice: 1260,
    discount: 189,
    taxes: 126,
    totalAmount: 1197,
    paymentStatus: 'Unpaid',
    status: 'Pending',
    createdAt: '2026-11-09T14:15:00.000Z',
    guestName: userName,
    guestEmail: userEmail,
    specialRequests: 'Late check-in anticipated around 8:00 PM.',
  },
  {
    id: 'SE-2026-5129',
    userId,
    hotelId: 3,
    hotelName: 'Sanctuary Kyoto Pavilion',
    hotelImage: FEATURED_HOTELS[2]?.image || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    location: 'Kyoto, Japan',
    roomType: 'Zen Garden Villa • King Platform Bed',
    checkIn: '2026-09-10',
    checkOut: '2026-09-14',
    nights: 4,
    guests: '1 Guest',
    basePrice: 1560,
    discount: 234,
    taxes: 156,
    totalAmount: 1482,
    paymentStatus: 'Paid',
    status: 'Completed',
    createdAt: '2026-08-20T08:00:00.000Z',
    paidAt: '2026-08-20T08:05:00.000Z',
    paymentMethod: 'Mastercard ending in 8891',
    guestName: userName,
    guestEmail: userEmail,
    specialRequests: 'Traditional Japanese breakfast preference.',
  },
  {
    id: 'SE-2026-3841',
    userId,
    hotelId: 4,
    hotelName: 'Alpine Pinnacle Chalet',
    hotelImage: FEATURED_HOTELS[3]?.image || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    location: 'Zermatt, Switzerland',
    roomType: 'Matterhorn Panorama Chalet • King Bed',
    checkIn: '2026-07-02',
    checkOut: '2026-07-06',
    nights: 4,
    guests: '2 Guests',
    basePrice: 1920,
    discount: 288,
    taxes: 192,
    totalAmount: 1824,
    paymentStatus: 'Unpaid',
    status: 'Cancelled',
    createdAt: '2026-06-15T12:00:00.000Z',
    guestName: userName,
    guestEmail: userEmail,
    specialRequests: 'Cancelled due to travel rescheduling.',
  },
]

// Fetch all bookings stored across users
const getRawBookingsStore = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch (err) {
    console.error('Failed to parse stayease bookings store', err)
    return {}
  }
}

const saveRawBookingsStore = (store) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch (err) {
    console.error('Failed to save stayease bookings store', err)
  }
}

/**
 * Get all bookings belonging to a specific user.
 * Automatically seeds initial demo records for this user if first time.
 */
export const getUserBookings = (userId, userName, userEmail) => {
  if (!userId) return []
  const store = getRawBookingsStore()

  if (!store[userId]) {
    // Seed initial mock bookings for this user
    store[userId] = generateSeedBookings(userId, userName, userEmail)
    saveRawBookingsStore(store)
  }

  return store[userId] || []
}

/**
 * Create a new booking for the user
 */
export const createBooking = (userId, bookingPayload) => {
  if (!userId) throw new Error('User must be authenticated to create a booking')
  const store = getRawBookingsStore()
  const userBookings = store[userId] || []

  const newBookingId = `SE-2026-${Math.floor(1000 + Math.random() * 9000)}`

  const newBooking = {
    id: newBookingId,
    userId,
    status: bookingPayload.paymentStatus === 'Paid' ? 'Confirmed' : 'Pending',
    createdAt: new Date().toISOString(),
    ...bookingPayload,
  }

  store[userId] = [newBooking, ...userBookings]
  saveRawBookingsStore(store)
  return newBooking
}

/**
 * Update payment status for a specific booking
 */
export const updateBookingPayment = (userId, bookingId, paymentDetails = {}) => {
  if (!userId || !bookingId) return false
  const store = getRawBookingsStore()
  const userBookings = store[userId] || []

  const index = userBookings.findIndex((b) => b.id === bookingId)
  if (index === -1) return false

  userBookings[index] = {
    ...userBookings[index],
    paymentStatus: 'Paid',
    status: 'Confirmed',
    paidAt: new Date().toISOString(),
    paymentMethod: paymentDetails.method || 'Credit Card ending in 4242',
  }

  store[userId] = userBookings
  saveRawBookingsStore(store)
  return userBookings[index]
}

/**
 * Cancel a booking
 */
export const cancelBooking = (userId, bookingId) => {
  if (!userId || !bookingId) return false
  const store = getRawBookingsStore()
  const userBookings = store[userId] || []

  const index = userBookings.findIndex((b) => b.id === bookingId)
  if (index === -1) return false

  userBookings[index] = {
    ...userBookings[index],
    status: 'Cancelled',
    cancelledAt: new Date().toISOString(),
  }

  store[userId] = userBookings
  saveRawBookingsStore(store)
  return userBookings[index]
}

/**
 * Pending Booking in sessionStorage
 * Used to preserve hotel, dates, guests when unauthenticated user signs in
 */
export const savePendingBooking = (bookingData) => {
  try {
    sessionStorage.setItem(PENDING_BOOKING_KEY, JSON.stringify(bookingData))
  } catch (err) {
    console.error('Failed to save pending booking in session', err)
  }
}

export const getPendingBooking = () => {
  try {
    const raw = sessionStorage.getItem(PENDING_BOOKING_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (err) {
    console.error('Failed to get pending booking from session', err)
    return null
  }
}

export const clearPendingBooking = () => {
  try {
    sessionStorage.removeItem(PENDING_BOOKING_KEY)
  } catch (err) {
    console.error('Failed to clear pending booking from session', err)
  }
}

