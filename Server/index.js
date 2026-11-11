import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
)
app.use(express.json())

// Basic Health Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'StayEase Backend API is running successfully.',
    timestamp: new Date().toISOString(),
  })
})

// Basic Error Handling Middleware
app.use((err, req, res, _next) => {
  console.error('Server error:', err.stack || err.message)
  res.status(500).json({ error: 'Internal Server Error' })
})

// Start server first, then connect to MongoDB
app.listen(PORT, async () => {
  console.log('Server running successfully')
  await connectDB()
})
