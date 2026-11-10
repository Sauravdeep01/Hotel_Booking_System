import { useState, useEffect } from 'react'
import { UserButton, SignedIn, SignedOut } from '@clerk/clerk-react'
import { Hotel, Search, Menu, X, LogIn } from 'lucide-react'
import { Link } from 'react-router-dom'
import { stayEaseClerkAppearance } from '../../utils/clerkAppearance'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Home', path: '/home' },
    { label: 'Hotels', path: '/hotels' },
    { label: 'Experience', path: '/experience' },
    { label: 'About', path: '/about' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs'
          : 'bg-transparent backdrop-blur-[3px] border-b border-white/10 shadow-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[68px] relative flex items-center justify-between transition-all duration-300">
        {/* Left Column: Brand Logo & Name */}
        <div className="flex items-center">
          <Link
            to="/home"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 sm:gap-3 group"
          >
            <div
              className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl shadow-md transition-all duration-300 shrink-0 ${
                isScrolled
                  ? 'bg-gradient-to-br from-[#142B45] to-[#1D3D60] text-[#C6A15B] ring-2 ring-[#C6A15B]/25'
                  : 'bg-gradient-to-br from-[#C6A15B] to-[#9E7B36] text-white ring-2 ring-white/20'
              }`}
            >
              <Hotel className="h-5 w-5" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-serif text-lg sm:text-xl font-bold tracking-tight transition-colors duration-300 ${
                    isScrolled ? 'text-[#142B45]' : 'text-white'
                  }`}
                >
                  StayEase
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#C6A15B]" />
              </div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#C6A15B] leading-none">
                Luxury Stays
              </p>
            </div>
          </Link>
        </div>

        {/* Center Column: Perfectly Centered Navigation Links (regardless of side widths) */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-7 lg:gap-9">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`text-sm font-semibold tracking-wide transition-colors duration-200 hover:text-[#C6A15B] whitespace-nowrap ${
                isScrolled ? 'text-[#142B45]' : 'text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Column: Search Icon & Authentication Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Quick Search Button */}
          <Link
            to="/hotels"
            aria-label="Search destinations"
            className={`p-2 rounded-xl border transition-all duration-300 ${
              isScrolled
                ? 'border-slate-200 text-slate-700 hover:text-[#142B45] hover:border-[#C6A15B] hover:bg-slate-50'
                : 'border-white/20 text-white hover:text-[#C6A15B] hover:border-[#C6A15B] bg-white/10 hover:bg-white/15 backdrop-blur-xs'
            }`}
          >
            <Search className="h-4 w-4" />
          </Link>

          {/* User signed in: Clerk UserButton */}
          <SignedIn>
            <div className="flex items-center pl-1">
              <UserButton
                appearance={stayEaseClerkAppearance}
                userProfileMode="modal"
                fallbackRedirectUrl="/login"
              />
            </div>
          </SignedIn>

          {/* User signed out: Login Button */}
          <SignedOut>
            <Link
              to="/login"
              className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-sm active:scale-95 ${
                isScrolled
                  ? 'bg-[#142B45] hover:bg-[#1D3D60] text-white'
                  : 'bg-[#C6A15B] hover:bg-[#b58f4a] text-white shadow-[#C6A15B]/30'
              }`}
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Login</span>
            </Link>
          </SignedOut>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Navigation Menu"
            className={`md:hidden p-2 rounded-xl border transition-colors ${
              isScrolled
                ? 'border-slate-200 text-[#142B45]'
                : 'border-white/20 text-white bg-white/10'
            }`}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-xl border-b border-slate-200 shadow-2xl px-6 py-6 transition-all duration-300">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-[#142B45] hover:text-[#C6A15B] py-2 border-b border-slate-100 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <SignedOut>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 w-full bg-[#142B45] hover:bg-[#C6A15B] text-white py-2.5 rounded-xl font-semibold text-sm transition-all"
              >
                <LogIn className="h-4 w-4" />
                <span>Login to StayEase</span>
              </Link>
            </SignedOut>
          </nav>
        </div>
      )}
    </header>
  )
}
