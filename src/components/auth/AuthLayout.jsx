import { Hotel, ShieldCheck, Award } from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthHero from './AuthHero'

export default function AuthLayout({ children, subtitle }) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F5F7FA]">
      {/* Left Hero Section Component */}
      <AuthHero />

      {/* Right Auth Form Section */}
      <section className="w-full lg:w-1/2 xl:w-[48%] flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 overflow-y-auto">
        <div className="flex items-center justify-between lg:hidden pb-6 border-b border-slate-200/80 mb-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#142B45] to-[#1D3D60] text-[#C6A15B] shadow-md">
              <Hotel className="h-5 w-5" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#142B45]">
                StayEase
              </span>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#C6A15B]">
                Luxury Stays
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-1 text-xs font-semibold text-[#142B45] bg-white border border-slate-200 rounded-full px-3 py-1 shadow-xs">
            <Award className="h-3.5 w-3.5 text-[#C6A15B]" />
            <span>5-Star Portal</span>
          </div>
        </div>

        {subtitle && (
          <div className="max-w-md mx-auto w-full mb-4 text-center hidden sm:block">
            <p className="text-xs uppercase tracking-widest font-semibold text-[#C6A15B]">
              StayEase Guest Access
            </p>
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          </div>
        )}

        <div className="my-auto flex flex-col items-center justify-center w-full py-4">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>

        <div className="pt-8 mt-6 border-t border-slate-200/80 text-center text-xs text-slate-500">
          <p className="flex items-center justify-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[#142B45] font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-[#C6A15B]" />
              256-Bit Encryption
            </span>
            <span className="text-slate-300">•</span>
            <span>Clerk Protected Session</span>
            <span className="text-slate-300">•</span>
            <span className="hover:text-[#142B45] cursor-pointer">Privacy & Terms</span>
          </p>
          <p className="mt-2 text-[11px] text-slate-400">
            © 2026 StayEase Hospitality Group Inc. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  )
}
