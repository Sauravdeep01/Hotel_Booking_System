import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Grid, Maximize2 } from 'lucide-react'

export default function HotelGallery({ hotel }) {
  const images = hotel.gallery && hotel.gallery.length > 0 ? hotel.gallery : [hotel.image]
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!lightboxOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowRight') setSelectedIndex((prev) => (prev + 1) % images.length)
      if (e.key === 'ArrowLeft') setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, images.length])

  const openLightboxAt = (index) => {
    setSelectedIndex(index)
    setLightboxOpen(true)
  }

  const primaryImage = images[selectedIndex] || images[0]
  const sideImages = images.slice(1, 5)

  return (
    <div className="my-6">
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 h-[380px] sm:h-[480px] lg:h-[520px]">
        {/* Large Primary Image (Left - spans 2 or 3 cols) */}
        <div
          onClick={() => openLightboxAt(selectedIndex)}
          className="relative md:col-span-2 lg:col-span-2 h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm group cursor-pointer bg-slate-100"
        >
          <img
            src={primaryImage}
            alt={`${hotel.name} Primary View`}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
          />

          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />

          {/* Quick View Button */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs font-semibold text-[#142B45] shadow-sm">
            <Maximize2 className="h-3.5 w-3.5 text-[#C6A15B]" />
            <span>Click to expand</span>
          </div>
        </div>

        {/* 4 Smaller Images Grid (Right - 2 cols, 2x2 layout) */}
        <div className="hidden md:grid md:col-span-2 lg:col-span-2 grid-cols-2 gap-3 sm:gap-4 h-full">
          {sideImages.map((imgUrl, idx) => {
            const actualIndex = idx + 1
            const isSelected = selectedIndex === actualIndex

            return (
              <div
                key={actualIndex}
                onClick={() => openLightboxAt(actualIndex)}
                className={`relative h-full rounded-2xl overflow-hidden shadow-2xs group cursor-pointer bg-slate-100 transition-all ${
                  isSelected ? 'ring-3 ring-[#C6A15B] shadow-md' : 'hover:opacity-95'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`${hotel.name} View ${actualIndex + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors" />

                {/* Last image overlay badge if there are more photos */}
                {idx === 3 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openLightboxAt(0)
                    }}
                    className="absolute inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center text-white text-xs sm:text-sm font-bold gap-1.5 hover:bg-black/60 transition-colors"
                  >
                    <Grid className="h-4 w-4 text-[#C6A15B]" />
                    <span>View all {images.length} photos</span>
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Full-Screen Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200">
          {/* Lightbox Header */}
          <div className="flex items-center justify-between text-white pb-3 border-b border-white/10">
            <div>
              <p className="text-sm font-semibold">{hotel.name}</p>
              <p className="text-xs text-white/60">
                Photo {selectedIndex + 1} of {images.length}
              </p>
            </div>

            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close Gallery"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Lightbox Main Stage */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <img
              src={images[selectedIndex]}
              alt={`${hotel.name} Fullscreen View`}
              className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl transition-all select-none"
            />

            {/* Previous Arrow */}
            <button
              onClick={() => setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)}
              className="absolute left-2 sm:left-6 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/15 transition-all hover:scale-105"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Next Arrow */}
            <button
              onClick={() => setSelectedIndex((prev) => (prev + 1) % images.length)}
              className="absolute right-2 sm:right-6 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/15 transition-all hover:scale-105"
              aria-label="Next Photo"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto py-2">
            {images.map((imgUrl, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={`h-14 w-20 sm:h-16 sm:w-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  selectedIndex === i
                    ? 'border-[#C6A15B] scale-105 opacity-100 shadow-md'
                    : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

