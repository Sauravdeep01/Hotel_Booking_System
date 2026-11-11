export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© 2026 StayEase Hospitality Group. All rights reserved.</p>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="hover:text-[#142B45] cursor-pointer">Privacy Policy</span>
          <span>•</span>
          <span className="hover:text-[#142B45] cursor-pointer">Terms of Service</span>
          <span>•</span>
          <span className="hover:text-[#142B45] cursor-pointer">Support</span>
        </div>
      </div>
    </footer>
  )
}

