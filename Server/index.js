import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import hotelRoutes from './routes/hotelRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true)
      }
      return callback(null, true) // Allow in dev/preview
    },
    credentials: true,
  })
)
app.use(express.json())

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'StayEase Backend API is running successfully.',
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/hotels', hotelRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/payments', paymentRoutes)

// Error handling middleware
app.use((err, req, res, _next) => {
  console.error('Server error:', err.stack || err.message)
  res.status(500).json({ error: 'Internal Server Error' })
})

app.listen(PORT, async () => {
  console.log('Server running successfully')
  await connectDB()
})
