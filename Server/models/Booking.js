import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      trim: true,
      index: true,
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: [true, 'Hotel ID is required'],
      index: true,
    },
    hotelName: {
      type: String,
      required: [true, 'Hotel name is required'],
      trim: true,
    },
    hotelImage: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    roomType: {
      type: String,
      required: [true, 'Room type is required'],
      trim: true,
    },
    roomName: {
      type: String,
      default: '',
      trim: true,
    },
    checkIn: {
      type: Date,
      required: [true, 'Check-in date is required'],
      index: true,
    },
    checkOut: {
      type: Date,
      required: [true, 'Check-out date is required'],
      index: true,
    },
    guests: {
      type: String,
      default: '2 Guests',
    },
    nights: {
      type: Number,
      required: [true, 'Number of nights is required'],
      min: 1,
    },
    selectedRoomPrice: {
      type: Number,
      default: 0,
    },
    basePrice: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    taxes: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Cancelled', 'Completed', 'Pending', 'confirmed', 'cancelled', 'completed', 'pending'],
      default: 'Confirmed',
      index: true,
    },
    guestName: {
      type: String,
      default: 'Valued Guest',
      trim: true,
    },
    guestEmail: {
      type: String,
      default: '',
      trim: true,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema)

export default Booking

