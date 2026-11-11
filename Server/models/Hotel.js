import mongoose from 'mongoose'

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hotel name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    location: {
      city: {
        type: String,
        default: '',
        trim: true,
      },
      country: {
        type: String,
        default: '',
        trim: true,
      },
      address: {
        type: String,
        default: '',
        trim: true,
      },
    },
    starRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    images: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: 'active',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

const Hotel = mongoose.model('Hotel', hotelSchema)

export default Hotel
