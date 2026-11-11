import { useAuth, SignInButton } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { Hotel, Lock, ArrowLeft } from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

export default function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth()

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
    return (
      <div className="min-h-screen bg-[#F5F7FA] text-[#142B45] flex flex-col justify-between">
        <Navbar />

        <main className="flex-1 max-w-md mx-auto px-4 py-36 text-center flex flex-col items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#142B45] text-[#C6A15B] shadow-lg mb-4">
            <Lock className="h-8 w-8" />
          </div>

          <h1 className="font-serif text-3xl font-bold text-[#142B45] mb-2">
            Sign In Required
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-light">
            Please sign in to access your hotel reservations, manage payments, and complete bookings.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
            <SignInButton mode="modal">
              <button
                type="button"
                className="w-full sm:w-auto bg-[#142B45] hover:bg-[#C6A15B] text-white px-6 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Sign In to StayEase
              </button>
            </SignInButton>

            <Link
              to="/home"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-700 hover:bg-slate-100 px-5 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return Home</span>
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  return children
}
