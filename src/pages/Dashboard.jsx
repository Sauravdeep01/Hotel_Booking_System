import { UserButton } from '@clerk/clerk-react'
import { Hotel } from 'lucide-react'
import { stayEaseClerkAppearance } from '../utils/clerkAppearance'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#142B45] flex flex-col">
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#142B45] to-[#1D3D60] text-[#C6A15B] shadow-md ring-2 ring-[#C6A15B]/25">
              <Hotel className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#142B45]">
                  StayEase
                </span>
                <span className="h-2 w-2 rounded-full bg-[#C6A15B]" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C6A15B]">
                Hotel Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <UserButton
              appearance={stayEaseClerkAppearance}
              userProfileMode="modal"
              fallbackRedirectUrl="/login"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <p className="text-xl sm:text-2xl font-semibold text-[#142B45]">
          This is dashboard page
        </p>
      </main>
    </div>
  )
}
