import express from 'express'
import {
  checkRoomAvailability,
  createBooking,
  getUserBookings,
  cancelBooking,
  getBookingById,
} from '../controllers/bookingController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

// Check room availability (Public - Supports GET with query params and POST with body)
router.get('/availability', checkRoomAvailability)
router.post('/availability', checkRoomAvailability)

// Protected Operations: Strictly authenticated and authorized via verified Clerk JWT

// Create a new booking (Protected - associates strictly with authenticated user)
router.post('/', requireAuth, createBooking)

// View My Bookings (Protected - fetches only the authenticated user's bookings)
router.get('/my-bookings', requireAuth, getUserBookings)
router.get('/user/:userId', requireAuth, getUserBookings)

// Cancel a booking (Protected - verifies booking ownership)
router.patch('/:bookingId/cancel', requireAuth, cancelBooking)
router.patch('/:id/cancel', requireAuth, cancelBooking)

// View individual booking details (Protected - verifies booking ownership)
router.get('/:bookingId', requireAuth, getBookingById)
router.get('/:id', requireAuth, getBookingById)

export default router

