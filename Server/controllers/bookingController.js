import mongoose from 'mongoose'
import Hotel from '../models/Hotel.js'
import Booking from '../models/Booking.js'

/**
 * Validate booking check-in and check-out dates
 */
export const validateBookingDates = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) {
    return { isValid: false, message: 'Both check-in and check-out dates are required.' }
  }

  const dCheckIn = new Date(checkIn)
  const dCheckOut = new Date(checkOut)

  if (isNaN(dCheckIn.getTime()) || isNaN(dCheckOut.getTime())) {
    return { isValid: false, message: 'Invalid date format. Please use YYYY-MM-DD.' }
  }

  // Normalize to midnight UTC/local to compare calendar days
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const checkInMidnight = new Date(dCheckIn)
  checkInMidnight.setHours(0, 0, 0, 0)

  if (checkInMidnight < today) {
    return { isValid: false, message: 'Check-in date cannot be in the past.' }
  }

  const checkOutMidnight = new Date(dCheckOut)
  checkOutMidnight.setHours(0, 0, 0, 0)

  if (checkOutMidnight <= checkInMidnight) {
    return { isValid: false, message: 'Check-out date must be strictly after check-in date.' }
  }

  return { isValid: true, dCheckIn, dCheckOut }
}

/**
 * Helper to calculate real-time room availability from MongoDB
 */
export const calculateAvailability = async ({ hotelId, roomType, checkIn, checkOut }) => {
  if (!hotelId) {
    return { error: 'Hotel ID is required.', statusCode: 400 }
  }

  if (!mongoose.Types.ObjectId.isValid(hotelId)) {
    return { error: 'Invalid hotel ID format.', statusCode: 400 }
  }

  if (!roomType || typeof roomType !== 'string' || !roomType.trim()) {
    return { error: 'Room type is required.', statusCode: 400 }
  }

  const dateValidation = validateBookingDates(checkIn, checkOut)
  if (!dateValidation.isValid) {
    return { error: dateValidation.message, statusCode: 400 }
  }

  const { dCheckIn, dCheckOut } = dateValidation

  const hotel = await Hotel.findById(hotelId)
  if (!hotel) {
    return { error: 'Hotel not found.', statusCode: 404 }
  }

  // Find the matching room type inside the hotel's embedded roomTypes array
  const targetRoom = hotel.roomTypes?.find(
    (rt) => rt.roomType?.toLowerCase().trim() === roomType.toLowerCase().trim()
  )

  if (!targetRoom) {
    const availableTypes = hotel.roomTypes?.map((r) => r.roomType).join(', ') || 'None'
    return {
      error: `Room type "${roomType}" not found for this property. Available room types: ${availableTypes}`,
      statusCode: 404,
    }
  }

  const totalRooms =
    typeof targetRoom.totalRooms === 'number' && targetRoom.totalRooms > 0
      ? targetRoom.totalRooms
      : 5

  // Count active confirmed bookings that overlap with requested [checkIn, checkOut]
  // Overlap condition: booking.checkIn < requestedCheckOut && booking.checkOut > requestedCheckIn
  // Cancelled bookings are explicitly excluded (Requirement 6)
  const overlappingBookings = await Booking.countDocuments({
    hotelId: hotel._id,
    roomType: targetRoom.roomType,
    status: 'Confirmed',
    checkIn: { $lt: dCheckOut },
    checkOut: { $gt: dCheckIn },
  })

  const availableRooms = Math.max(0, totalRooms - overlappingBookings)
  const isAvailable = availableRooms > 0

  return {
    hotel,
    targetRoom,
    dCheckIn,
    dCheckOut,
    totalRooms,
    bookedRooms: overlappingBookings,
    availableRooms,
    isAvailable,
    status: isAvailable ? 'Available' : 'Sold Out',
  }
}

/**
 * Controller: Check Room Availability
 * GET /api/hotels/:id/availability?roomType=Double Bed&checkIn=2026-11-20&checkOut=2026-11-24
 * Also supports POST with body
 */
export const checkRoomAvailability = async (req, res) => {
  try {
    const hotelId = req.params.id || req.query.hotelId || req.body.hotelId
    const roomType = req.query.roomType || req.body.roomType
    const checkIn = req.query.checkIn || req.body.checkIn
    const checkOut = req.query.checkOut || req.body.checkOut

    const result = await calculateAvailability({ hotelId, roomType, checkIn, checkOut })

    if (result.error) {
      return res.status(result.statusCode || 400).json({
        success: false,
        message: result.error,
      })
    }

    const { hotel, targetRoom, dCheckIn, dCheckOut, totalRooms, bookedRooms, availableRooms, isAvailable, status } =
      result

    res.status(200).json({
      success: true,
      message: isAvailable
        ? `${targetRoom.roomType} is available (${availableRooms} of ${totalRooms} rooms left)`
        : `All ${targetRoom.roomType} rooms are sold out for these dates`,
      data: {
        hotelId: hotel._id,
        hotelName: hotel.name,
        roomType: targetRoom.roomType,
        roomName: targetRoom.name || targetRoom.roomType,
        pricePerNight: targetRoom.price,
        checkIn: dCheckIn.toISOString().split('T')[0],
        checkOut: dCheckOut.toISOString().split('T')[0],
        totalRooms,
        bookedRooms,
        availableRooms,
        isAvailable,
        status,
      },
    })
  } catch (error) {
    console.error('Error checking room availability:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while checking room availability',
      error: error.message,
    })
  }
}

/**
 * Controller: Create Booking
 * POST /api/bookings
 * Re-checks availability on the backend to prevent race-condition double bookings (Requirement 12 & 13)
 */
export const createBooking = async (req, res) => {
  try {
    const {
      userId,
      hotelId,
      roomType,
      checkIn,
      checkOut,
      guests,
      guestName,
      guestEmail,
    } = req.body

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required to create a booking.',
      })
    }

    // 1. Recheck availability on the backend
    const availability = await calculateAvailability({
      hotelId,
      roomType,
      checkIn,
      checkOut,
    })

    if (availability.error) {
      return res.status(availability.statusCode || 400).json({
        success: false,
        message: availability.error,
      })
    }

    if (!availability.isAvailable || availability.availableRooms <= 0) {
      return res.status(409).json({
        success: false,
        message: `Sorry, ${availability.targetRoom.roomType} is completely sold out for the selected dates.`,
        availableRooms: 0,
        status: 'Sold Out',
      })
    }

    const { hotel, targetRoom, dCheckIn, dCheckOut } = availability

    // Calculate nights & pricing securely on backend
    const diffTime = Math.abs(dCheckOut - dCheckIn)
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1
    const roomPrice = targetRoom.price || hotel.price || 350
    const basePrice = roomPrice * nights
    const discount = Math.round(basePrice * 0.15)
    const taxes = Math.round(basePrice * 0.1)
    const totalAmount = basePrice - discount + taxes

    const primaryImage =
      targetRoom.images?.[0] ||
      (Array.isArray(hotel.images) ? hotel.images[0] : hotel.image) ||
      ''

    const locationStr =
      typeof hotel.location === 'object' && hotel.location !== null
        ? [hotel.location.city, hotel.location.country].filter(Boolean).join(', ') ||
          hotel.location.address ||
          ''
        : hotel.location || ''

    const newBooking = await Booking.create({
      userId,
      hotelId: hotel._id,
      hotelName: hotel.name,
      hotelImage: primaryImage,
      location: locationStr,
      roomType: targetRoom.roomType,
      roomName: targetRoom.name || targetRoom.roomType,
      checkIn: dCheckIn,
      checkOut: dCheckOut,
      guests: guests || '2 Guests',
      nights,
      selectedRoomPrice: roomPrice,
      basePrice,
      discount,
      taxes,
      totalAmount,
      status: 'Confirmed',
      guestName: guestName || 'Valued Guest',
      guestEmail: guestEmail || '',
    })

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully.',
      data: newBooking,
    })
  } catch (error) {
    console.error('Error creating booking:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while creating booking.',
      error: error.message,
    })
  }
}

/**
 * Controller: Get Bookings for a User
 * GET /api/bookings/user/:userId
 */
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required.',
      })
    }

    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    })
  } catch (error) {
    console.error('Error fetching user bookings:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings.',
      error: error.message,
    })
  }
}

/**
 * Controller: Cancel Booking
 * PATCH /api/bookings/:id/cancel
 * Cancelling sets status to Cancelled, which instantly releases room availability! (Requirement 6)
 */
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID format.',
      })
    }

    const booking = await Booking.findById(id)
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      })
    }

    if (booking.status === 'Cancelled') {
      return res.status(200).json({
        success: true,
        message: 'Booking is already cancelled.',
        data: booking,
      })
    }

    booking.status = 'Cancelled'
    booking.cancelledAt = new Date()
    await booking.save()

    res.status(200).json({
      success: true,
      message: `Booking #${booking._id} has been cancelled successfully and room inventory has been released.`,
      data: booking,
    })
  } catch (error) {
    console.error('Error cancelling booking:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling booking.',
      error: error.message,
    })
  }
}

/**
 * Controller: Get Single Booking
 * GET /api/bookings/:id
 */
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID format.',
      })
    }

    const booking = await Booking.findById(id)
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      })
    }

    res.status(200).json({
      success: true,
      data: booking,
    })
  } catch (error) {
    console.error('Error fetching booking details:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching booking details.',
      error: error.message,
    })
  }
}

