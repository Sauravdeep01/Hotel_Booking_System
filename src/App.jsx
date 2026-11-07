import { Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './routes/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route
        path="/"
        element={
          <>
            <SignedIn>
              <Navigate to="/dashboard" replace />
            </SignedIn>
            <SignedOut>
              <Navigate to="/login" replace />
            </SignedOut>
          </>
        }
      />

      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/login/*" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signup/*" element={<Signup />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
