import express from 'express'
import {
  checkRoomAvailability,
  createBooking,
  getUserBookings,
  cancelBooking,
  getBookingById,
} from '../controllers/bookingController.js'

const router = express.Router()

// Check room availability (Supports GET with query params and POST with body)
router.get('/availability', checkRoomAvailability)
router.post('/availability', checkRoomAvailability)

// Create a new booking (rechecks availability on backend)
router.post('/', createBooking)

// Get all bookings for a user
router.get('/user/:userId', getUserBookings)

// Cancel a booking
router.patch('/:id/cancel', cancelBooking)

// Get single booking by ID
router.get('/:id', getBookingById)

export default router

