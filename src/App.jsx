import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Hotels from './pages/Hotels'
import HotelDetails from './pages/HotelDetails'
import MyBookings from './pages/MyBookings'
import ProtectedRoute from './routes/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      {/* Public Pages - Accessible to all visitors without login */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/hotels" element={<Hotels />} />
      <Route path="/hotels/:id" element={<HotelDetails />} />
      <Route path="/hotel/:id" element={<HotelDetails />} />
      <Route path="/offers" element={<Home />} />
      <Route path="/offers/:id" element={<Home />} />
      <Route path="/experience" element={<Home />} />
      <Route path="/about" element={<Home />} />

      {/* Redirect obsolete auth routes to homepage */}
      <Route path="/login" element={<Navigate to="/home" replace />} />
      <Route path="/login/*" element={<Navigate to="/home" replace />} />
      <Route path="/signup" element={<Navigate to="/home" replace />} />
      <Route path="/signup/*" element={<Navigate to="/home" replace />} />

      {/* Protected Routes - Accessible only to authenticated users */}
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking/confirm"
        element={<Navigate to="/my-bookings" replace />}
      />
      <Route
        path="/dashboard"
        element={<Navigate to="/my-bookings" replace />}
      />

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}
