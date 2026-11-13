import mongoose from 'mongoose'
import Hotel from '../models/Hotel.js'

// Get all active hotels
export const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ status: 'active' })

    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels,
    })
  } catch (error) {
    console.error('Error fetching hotels:', error.message)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching hotels',
      error: error.message,
    })
  }
}

// Get single hotel by its MongoDB ObjectId
export const getHotelById = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid hotel ID format',
      })
    }

    const hotel = await Hotel.findById(id)

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      })
    }

    res.status(200).json({
      success: true,
      data: hotel,
    })
  } catch (error) {
    console.error('Error fetching hotel details:', error.message)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching hotel details',
      error: error.message,
    })
  }
}

// Get featured active hotels
export const getFeaturedHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ isFeatured: true, status: 'active' })

    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels,
    })
  } catch (error) {
    console.error('Error fetching featured hotels:', error.message)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured hotels',
      error: error.message,
    })
  }
}
