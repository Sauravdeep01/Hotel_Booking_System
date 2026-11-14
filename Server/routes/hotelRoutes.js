import express from 'express'
import {
  getAllHotels,
  getFeaturedHotels,
  getHotelById,
} from '../controllers/hotelController.js'
import { checkRoomAvailability } from '../controllers/bookingController.js'

const router = express.Router()

// Note: /featured must be defined before /:id so it is not treated as an ID param
router.get('/', getAllHotels)
router.get('/featured', getFeaturedHotels)
router.get('/:id/availability', checkRoomAvailability)
router.post('/:id/availability', checkRoomAvailability)
router.get('/:id', getHotelById)

export default router

