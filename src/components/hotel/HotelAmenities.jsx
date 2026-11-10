import {
  ShieldCheck,
  Sparkles,
  MapPin,
  KeyRound,
  Wifi,
  Waves,
  Car,
  UtensilsCrossed,
  Wind,
} from 'lucide-react'

// Mapping icon names to Lucide icons
const iconMap = {
  ShieldCheck,
  Sparkles,
  MapPin,
  KeyRound,
  Wifi,
  Waves,
  Car,
  UtensilsCrossed,
  Wind,
}

export default function HotelAmenities({ amenities }) {
  const defaultAmenities = [
    {
      title: 'Clean & Safe Stay',
      description: 'Certified sanitization & hospital-grade hygiene protocols',
      iconName: 'ShieldCheck',
    },
    {
      title: 'Enhanced Cleaning',
      description: 'Daily steam sterilization & high-touch disinfection',
      iconName: 'Sparkles',
    },
    {
      title: 'Excellent Location',
      description: 'Handpicked setting with prime access to attractions',
      iconName: 'MapPin',
    },
    {
      title: 'Smooth Check-In',
      description: 'Fast digital or private concierge check-in service',
      iconName: 'KeyRound',
    },
    {
      title: 'Free High-Speed Wi-Fi',
      description: 'Complimentary fiber coverage in all suites and areas',
      iconName: 'Wifi',
    },
    {
      title: 'Swimming Pool',
      description: 'Climate-controlled infinity pool & luxury sun loungers',
      iconName: 'Waves',
    },
    {
      title: 'Complimentary Parking',
      description: 'Private valet and secure vehicle parking access',
      iconName: 'Car',
    },
    {
      title: 'Waterfront Restaurant',
      description: 'Gourmet fine dining curated by renowned executive chefs',
      iconName: 'UtensilsCrossed',
    },
    {
      title: 'Air Conditioning',
      description: 'Individual in-room climate control with HEPA filtration',
      iconName: 'Wind',
    },
  ]

  const items = amenities && amenities.length > 0 ? amenities : defaultAmenities

  return (
    <div>
      <h3 className="font-serif text-2xl font-bold text-[#142B45] mb-2">
        Hotel Facilities & Highlights
      </h3>
      <p className="text-sm text-slate-500 mb-6 font-light">
        Carefully curated amenities designed to guarantee comfort, leisure, and complete peace of mind.
      </p>

      {/* Grid of Amenities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, idx) => {
          const IconComponent = iconMap[item.iconName] || Sparkles

          return (
            <div
              key={idx}
              className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-[#C6A15B] transition-colors group"
            >
              <div className="p-2.5 rounded-xl bg-slate-50 text-[#C6A15B] group-hover:bg-[#C6A15B]/10 transition-colors shrink-0">
                <IconComponent className="h-5 w-5" />
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#142B45] leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

