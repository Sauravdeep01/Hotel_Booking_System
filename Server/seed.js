import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from './config/db.js'
import Hotel from './models/Hotel.js'

// Complete collection containing original sample hotels plus 10 unique new global destinations
const allHotels = [
  // Existing 5 hotels
  {
    name: 'Grand Azure Horizon Villa',
    description:
      'Perched directly over crystal-clear turquoise waters, this private overwater villa features an infinity plunge pool, floor-to-ceiling panoramic glass walls, and dedicated 24/7 personal butler service.',
    location: {
      city: 'North Malé Atoll',
      country: 'Maldives',
      address: 'Villa 104, Horizon Bay Atoll, North Malé, Maldives 08420',
    },
    starRating: 5,
    images: [
      'https://res.cloudinary.com/demo/image/upload/pool.jpg',
      'https://res.cloudinary.com/demo/image/upload/beach.jpg',
    ],
    amenities: [
      'Private Infinity Pool',
      'Ocean View',
      'Free High-Speed Wi-Fi',
      '24/7 Room Service',
      'Spa & Wellness Center',
      'Waterfront Restaurant',
    ],
    rating: 4.9,
    reviewCount: 128,
    isFeatured: true,
    status: 'active',
  },
  {
    name: 'The Royal Serenity Palace',
    description:
      'An epitome of French neoclassical elegance, offering opulent gilded suites, Michelin-starred fine dining, and breathtaking vistas of the Eiffel Tower and Seine riverbanks.',
    location: {
      city: 'Paris',
      country: 'France',
      address: '15 Avenue Montaigne, 75008 Paris, France',
    },
    starRating: 5,
    images: [
      'https://res.cloudinary.com/demo/image/upload/castle.jpg',
      'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    ],
    amenities: [
      'Eiffel Tower View',
      'Michelin-Star Dining',
      'Luxury Spa',
      'Valet Parking',
      'Free High-Speed Wi-Fi',
      'Cocktail Lounge',
    ],
    rating: 4.8,
    reviewCount: 96,
    isFeatured: true,
    status: 'active',
  },
  {
    name: 'Amanpuri Coastal Haven',
    description:
      'Surrounded by whispering coconut palms and tranquil turquoise waves, this Andaman sanctuary offers private beach access, secluded plunge pavilions, and holistic wellness rituals.',
    location: {
      city: 'Phuket',
      country: 'Thailand',
      address: 'Pansea Beach, Cherngtalay, Thalang District, Phuket 83110, Thailand',
    },
    starRating: 5,
    images: [
      'https://res.cloudinary.com/demo/image/upload/beach.jpg',
      'https://res.cloudinary.com/demo/image/upload/pool.jpg',
    ],
    amenities: [
      'Private Beach Access',
      'Holistic Wellness Spa',
      'Infinity Pool',
      'Yoga Pavilion',
      'Airport Shuttle',
      'Free High-Speed Wi-Fi',
    ],
    rating: 4.9,
    reviewCount: 112,
    isFeatured: true,
    status: 'active',
  },
  {
    name: 'The Highland Alpine Retreat',
    description:
      'Nestled in the majestic Swiss Alps with direct ski-in/ski-out convenience, heated cedar outdoor pools, and cozy timber suites warmed by stone wood-burning fireplaces.',
    location: {
      city: 'Zermatt',
      country: 'Switzerland',
      address: 'Riffelalp 2222m, 3920 Zermatt, Switzerland',
    },
    starRating: 5,
    images: [
      'https://res.cloudinary.com/demo/image/upload/cld-sample-2.jpg',
      'https://res.cloudinary.com/demo/image/upload/landscape.jpg',
    ],
    amenities: [
      'Ski-In / Ski-Out Access',
      'Heated Alpine Pool',
      'Mountain View Terrace',
      'Stone Fireplace Lounge',
      'Finnish Sauna',
      'Free High-Speed Wi-Fi',
    ],
    rating: 4.7,
    reviewCount: 84,
    isFeatured: false,
    status: 'active',
  },
  {
    name: 'Villa Bellissima Cliff',
    description:
      'Carved into the sun-drenched cliffs of the Amalfi Coast, offering spellbinding Mediterranean panoramas, lemon grove terraces, private boat charters, and classic Italian hospitality.',
    location: {
      city: 'Positano',
      country: 'Italy',
      address: 'Via Cristoforo Colombo 30, 84017 Positano, Salerno, Italy',
    },
    starRating: 5,
    images: [
      'https://res.cloudinary.com/demo/image/upload/landscape.jpg',
      'https://res.cloudinary.com/demo/image/upload/beach.jpg',
    ],
    amenities: [
      'Cliffside Sea Views',
      'Rooftop Terrace Bar',
      'Private Beach Club',
      'Infinity Pool',
      'Fine Dining Restaurant',
      'Free High-Speed Wi-Fi',
    ],
    rating: 4.8,
    reviewCount: 104,
    isFeatured: true,
    status: 'active',
  },

  // 10 Unique New Global Destinations
  {
    name: 'Kyoto Bamboo Sanctuary & Onsen',
    description:
      'Immerse yourself in tranquil Japanese heritage among whispering bamboo groves, private mineral onsen baths, and tatami-matted suites overlooking historic Kyoto zen gardens.',
    location: {
      city: 'Kyoto',
      country: 'Japan',
      address: '12 Arashiyama Sogencho, Ukyo Ward, Kyoto 616-8385, Japan',
    },
    starRating: 5,
    images: [
      'https://res.cloudinary.com/demo/image/upload/landscape.jpg',
      'https://res.cloudinary.com/demo/image/upload/mountain.jpg',
    ],
    amenities: [
      'Traditional Thermal Onsen',
      'Zen Garden Views',
      'Kaiseki Fine Dining',
      'Tea Ceremony Pavilion',
      'Free High-Speed Wi-Fi',
      'Bespoke Yukata Service',
    ],
    rating: 4.9,
    reviewCount: 142,
    isFeatured: true,
    status: 'active',
  },
  {
    name: 'Santorini Caldera Mirage Suites',
    description:
      'Chiseled into volcanic sea cliffs with whitewashed cave terraces, featuring private horizon plunge pools with front-row sunset vistas across the sapphire Aegean waters.',
    location: {
      city: 'Oia, Santorini',
      country: 'Greece',
      address: 'Caldera Footpath 45, Oia 847 02, Santorini, Greece',
    },
    starRating: 5,
    images: [
      'https://res.cloudinary.com/demo/image/upload/beach.jpg',
      'https://res.cloudinary.com/demo/image/upload/pool.jpg',
    ],
    amenities: [
      'Infinity Caldera Plunge Pool',
      'Sunset Terrace Bar',
      'Aegean Sea Views',
      'Private Yacht Charter',
      'Free High-Speed Wi-Fi',
      'Complimentary Champagne Breakfast',
    ],
    rating: 4.9,
    reviewCount: 168,
    isFeatured: true,
    status: 'active',
  },
  {
    name: 'Burj Al-Zafaran Desert Oasis',
    description:
      'An opulent Arabian desert sanctuary amidst sweeping terracotta dunes, featuring Bedouin-inspired palatial villas, private plunge pools, and bespoke desert safari excursions.',
    location: {
      city: 'Dubai',
      country: 'United Arab Emirates',
      address: 'Al Maha Desert Reserve, Dubai-Al Ain Road, Dubai, UAE',
    },
    starRating: 5,
    images: [
      'https://res.cloudinary.com/demo/image/upload/cld-sample-2.jpg',
      'https://res.cloudinary.com/demo/image/upload/castle.jpg',
    ],
    amenities: [
      'Private Desert Pool',
      'Falconry & Camel Treks',
      'Arabian Fine Dining',
      'Star-Gazing Lounge',
      'Free High-Speed Wi-Fi',
      'Full Spa Treatments',
    ],
    rating: 4.8,
    reviewCount: 94,
    isFeatured: false,
    status: 'active',
  },
  {
    name: 'Kruger Savannah Safari Lodge',
    description:
      'Perched along the iconic Sabie riverbank, this luxury eco-lodge provides panoramic views of free-roaming wildlife, open-vehicle game drives, and starlit open-fire dining.',
    location: {
      city: 'Greater Kruger',
      country: 'South Africa',
      address: 'Sabi Sand Game Reserve, Kruger National Park 1350, South Africa',
    },
    starRating: 5,
    images: [
      'https://res.cloudinary.com/demo/image/upload/landscape.jpg',
      'https://res.cloudinary.com/demo/image/upload/mountain.jpg',
    ],
    amenities: [
      'Game Drive Expeditions',
      'Waterhole Viewing Deck',
      'Boma Fire Dining',
      'Bushveld Plunge Pool',
      'Free High-Speed Wi-Fi',
      'Airport Air Strip Shuttle',
    ],
    rating: 4.9,
    reviewCount: 88,
    isFeatured: true,
    status: 'active',
  },
  {
    name: 'The Manhattan Skyline Penthouse',
    description:
      'An iconic Art Deco masterpiece soaring above Central Park, offering floor-to-ceiling panoramic skyline vistas, gold-leaf finishes, and white-glove personal butler service.',
    location: {
      city: 'New York City',
      country: 'United States',
      address: '768 5th Ave, New York, NY 10019, USA',
    },
    starRating: 5,
    images: [
      'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      'https://res.cloudinary.com/demo/image/upload/cld-sample.jpg',
    ],
    amenities: [
      'Central Park Views',
      'Private Rooftop Terrace',
      'Michelin-Star In-Suite Dining',
      'Chauffeured Rolls-Royce',
      'Free High-Speed Wi-Fi',
      '24/7 Butler Service',
    ],
    rating: 4.8,
    reviewCount: 156,
    isFeatured: true,
    status: 'active',
  },
  {
    name: 'Bora Bora Overwater Lagoon Resort',
    description:
      'Floating gracefully over tranquil turquoise lagoons with Mount Otemanu rising majestically in the background, offering glass-floor ocean viewing and private sundeck reef ladders.',
    location: {
      city: 'Bora Bora',
      country: 'French Polynesia',
      address: 'Motu Tevairoa, BP 169, Vaitape 98730, French Polynesia',
    },
    starRating: 5,
    images: [
      'https://res.cloudinary.com/demo/image/upload/pool.jpg',
      'https://res.cloudinary.com/demo/image/upload/beach.jpg',
    ],
    amenities: [
      'Glass-Bottom Overwater Villa',
      'Coral Reef Snorkeling',
      'Polynesian Deep Ocean Spa',
      'Canoe Breakfast Delivery',
      'Free High-Speed Wi-Fi',
      'Private Beach Access',
    ],
    rating: 5.0,
    reviewCount: 110,
    isFeatured: true,
    status: 'active',
  },
  {
    name: 'Villa Del Lago Como Heritage',
    description:
      'A 19th-century aristocratic lakeside palazzo surrounded by 25 acres of manicured Italian Renaissance gardens, marble fountains, and private wooden speedboat excursions on Lake Como.',
    location: {
      city: 'Lake Como',
      country: 'Italy',
      address: 'Via Regina 24, 22010 Cernobbio, Como, Italy',
    },
    starRating: 5,
    images: [
      'https://res.cloudinary.com/demo/image/upload/castle.jpg',
      'https://res.cloudinary.com/demo/image/upload/landscape.jpg',
    ],
    amenities: [
      'Private Riva Boat Dock',
      'Lakeside Floating Pool',
      'Renaissance Gardens',
      'Wine Tasting Cellar',
      'Free High-Speed Wi-Fi',
      'Valet Parking',
    ],
    rating: 4.9,
    reviewCount: 122,
    isFeatured: false,
    status: 'active',
  },
  {
    name: 'Ubud Rainforest Hanging Haven',
    description:
      'Hovering serenely above the sacred Ayung River and cascading tropical jungle canopy, offering tiered multi-level infinity pools, open-air teak pavilions, and sound healing rituals.',
    location: {
      city: 'Ubud, Bali',
      country: 'Indonesia',
      address: 'Banjar Susut, Desa Buahan, Payangan, Gianyar, Bali 80572, Indonesia',
    },
    starRating: 5,
    images: [
      'https://res.cloudinary.com/demo/image/upload/pool.jpg',
      'https://res.cloudinary.com/demo/image/upload/mountain.jpg',
    ],
    amenities: [
      'Tiered Jungle Infinity Pool',
      'Holistic Ayurvedic Spa',
      'River Valley Views',
      'Organic Garden Dining',
      'Free High-Speed Wi-Fi',
      'Daily Sunrise Yoga',
    ],
    rating: 4.8,
    reviewCount: 135,
    isFeatured: true,
    status: 'active',
  },
  {
    name: 'Banff Rocky Mountain Castle & Spa',
    description:
      'A timeless Scottish baronial castle nestled in the heart of Banff National Park, surrounded by emerald pine forests, snow-capped peaks, and rejuvenating outdoor hot springs.',
    location: {
      city: 'Banff, Alberta',
      country: 'Canada',
      address: '405 Spray Ave, Banff, AB T1L 1J4, Canada',
    },
    starRating: 5,
    images: [
      'https://res.cloudinary.com/demo/image/upload/mountain.jpg',
      'https://res.cloudinary.com/demo/image/upload/cld-sample-2.jpg',
    ],
    amenities: [
      'Heated Thermal Mineral Springs',
      'Ski Valet & Lift Shuttles',
      'Panoramic Alpine Views',
      'Stone Fireplace Lounges',
      'Free High-Speed Wi-Fi',
      'Glacier Heli-Tours',
    ],
    rating: 4.8,
    reviewCount: 118,
    isFeatured: false,
    status: 'active',
  },
  {
    name: 'The Sydney Harbour Luminary',
    description:
      'Situated waterfront in historic The Rocks, offering breathtaking uninterrupted views of the Sydney Opera House and Harbour Bridge from floor-to-ceiling glass suites.',
    location: {
      city: 'Sydney',
      country: 'Australia',
      address: '7 Hickson Rd, The Rocks, Sydney NSW 2000, Australia',
    },
    starRating: 5,
    images: [
      'https://res.cloudinary.com/demo/image/upload/landscape.jpg',
      'https://res.cloudinary.com/demo/image/upload/pool.jpg',
    ],
    amenities: [
      'Harbour Bridge & Opera House Views',
      'Rooftop Heated Pool',
      'Waterside Seafood Grill',
      'Day Spa by the Harbour',
      'Free High-Speed Wi-Fi',
      'Executive Club Lounge',
    ],
    rating: 4.9,
    reviewCount: 147,
    isFeatured: true,
    status: 'active',
  },
]

const seedHotels = async () => {
  try {
    await connectDB()

    let addedCount = 0
    let skippedCount = 0

    // Iterate through hotels and insert only those not already in the database
    for (const hotelData of allHotels) {
      const existing = await Hotel.findOne({ name: hotelData.name })
      if (!existing) {
        await Hotel.create(hotelData)
        addedCount++
      } else {
        skippedCount++
      }
    }

    console.log(
      `Seed complete: ${addedCount} new hotel(s) added, ${skippedCount} existing hotel(s) preserved.`
    )

    const totalCount = await Hotel.countDocuments({})
    console.log(`Total hotels in database: ${totalCount}`)

    await mongoose.connection.close()
    console.log('Database connection closed')
    process.exit(0)
  } catch (error) {
    console.error(`Error seeding hotels: ${error.message}`)
    process.exit(1)
  }
}

seedHotels()
