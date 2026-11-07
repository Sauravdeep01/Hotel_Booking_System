import { useAuth } from '@clerk/clerk-react'
import { Navigate, useLocation } from 'react-router-dom'
import { Hotel } from 'lucide-react'

export default function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth()
  const location = useLocation()

  if (!isLoaded) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F5F7FA]">
        <div className="relative flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#142B45] text-[#C6A15B] shadow-xl ring-4 ring-[#C6A15B]/20 animate-pulse">
            <Hotel className="h-8 w-8" />
          </div>

          <div className="mt-6 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#C6A15B] animate-bounce [animation-delay:-0.3s]" />
            <div className="h-2 w-2 rounded-full bg-[#C6A15B] animate-bounce [animation-delay:-0.15s]" />
            <div className="h-2 w-2 rounded-full bg-[#C6A15B] animate-bounce" />
          </div>

          <p className="mt-3 text-xs uppercase font-bold tracking-widest text-[#142B45]">
            Verifying Session
          </p>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
