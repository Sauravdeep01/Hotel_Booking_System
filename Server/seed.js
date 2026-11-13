import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from './config/db.js'
import Hotel from './models/Hotel.js'

const sampleHotels = [
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
]

const seedHotels = async () => {
  try {
    await connectDB()

    // Delete existing hotels to prevent duplicates on repeated runs
    await Hotel.deleteMany({})
    console.log('Cleared existing hotel data')

    // Insert sample hotels
    const createdHotels = await Hotel.insertMany(sampleHotels)
    console.log(`Successfully seeded ${createdHotels.length} hotels into MongoDB`)

    await mongoose.connection.close()
    console.log('Database connection closed')
    process.exit(0)
  } catch (error) {
    console.error(`Error seeding hotels: ${error.message}`)
    process.exit(1)
  }
}

seedHotels()
