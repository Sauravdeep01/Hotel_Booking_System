import express from 'express'
import {
  getPaymentConfig,
  createPaymentOrder,
  verifyPayment,
  recordPaymentFailure,
} from '../controllers/paymentController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

// Public route to retrieve public Key ID and currency
router.get('/config', getPaymentConfig)

// Protected payment endpoints
router.post('/create-order', requireAuth, createPaymentOrder)
router.post('/verify', requireAuth, verifyPayment)
router.post('/failed', requireAuth, recordPaymentFailure)

export default router
