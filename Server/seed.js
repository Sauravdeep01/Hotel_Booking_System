import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from './config/db.js'
import Hotel from './models/Hotel.js'

// Complete collection of 15 hotels with realistic, distinct room types and configurations
const allHotels = [
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
    price: 480,
    roomTypes: [
      {
        roomType: 'Single Bed',
        name: 'Overwater Lagoon Solo Suite',
        images: ['https://res.cloudinary.com/demo/image/upload/beach.jpg'],
        price: 480,
        capacity: 1,
        bedConfiguration: '1 Queen Plush Bed',
        amenities: ['Overwater Sun Deck', 'Freestanding Soaking Tub', 'Free High-Speed Wi-Fi', 'Espresso Bar'],
        shortDescription:
          'A serene overwater hideaway offering direct lagoon ladders, a cantilevered hammock, and mesmerizing sunrise ocean views.',
      },
      {
        roomType: 'Double Bed',
        name: 'Deluxe Sunset Water Pavilion',
        images: ['https://res.cloudinary.com/demo/image/upload/pool.jpg'],
        price: 850,
        capacity: 2,
        bedConfiguration: '1 King Canopy Bed',
        amenities: ['Private Infinity Plunge Pool', 'Ocean Glass Floor Panels', '24/7 Butler Service', 'Mini Bar'],
        shortDescription:
          'Perched above turquoise reefs with glass floor viewing panels, an infinity plunge pool, and unobstructed sunset panoramas.',
      },
      {
        roomType: 'Luxury Room',
        name: 'Azure Horizon Grand Plunge Suite',
        images: ['https://res.cloudinary.com/demo/image/upload/landscape.jpg'],
        price: 1450,
        capacity: 3,
        bedConfiguration: '1 King Bed + 1 Premium Daybed',
        amenities: ['12m Freshwater Lap Pool', 'Bespoke Champagne Cellar', 'Outdoor Rain Shower', 'Private Catamaran Tour'],
        shortDescription:
          'Our signature luxury overwater residence featuring expansive outdoor sundecks, oversized plunge pools, and bespoke butler dining.',
      },
      {
        roomType: 'Family Suite',
        name: 'Two-Bedroom Royal Ocean Residence',
        images: ['https://res.cloudinary.com/demo/image/upload/castle.jpg'],
        price: 2400,
        capacity: 5,
        bedConfiguration: '2 King Beds + 1 Rollaway Bed',
        amenities: ['Two Master Bedrooms', 'Private Lagoon Jet-Ski', 'Personal Private Chef', 'Full Kitchenette'],
        shortDescription:
          'The ultimate family sanctuary over the Indian Ocean with dual master suites, private chef service, and dedicated water excursions.',
      },
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
    price: 520,
    roomTypes: [
      {
        roomType: 'Single Bed',
        name: 'Classic Montaigne Studio',
        images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
        price: 520,
        capacity: 1,
        bedConfiguration: '1 French Single Bed',
        amenities: ['Courtyard Garden View', 'Carrara Marble Bath', 'Gourmet Nespresso Bar', 'Free Wi-Fi'],
        shortDescription:
          'Sophisticated Parisian room adorned with custom silk drapery, historic architectural moldings, and serene courtyard garden views.',
      },
      {
        roomType: 'Double Bed',
        name: 'Eiffel Prestige Boulevard Suite',
        images: ['https://res.cloudinary.com/demo/image/upload/castle.jpg'],
        price: 950,
        capacity: 2,
        bedConfiguration: '1 King Bed with Silk Linens',
        amenities: ['Direct Eiffel Tower View', 'Haute Parfumerie Amenities', 'Complimentary Champagne', 'Balcony'],
        shortDescription:
          'Wake up to spellbinding panoramas of the Eiffel Tower from your wrought-iron Parisian balcony with French continental breakfast.',
      },
      {
        roomType: 'Luxury Room',
        name: 'Palace Belle Époque Penthouse',
        images: ['https://res.cloudinary.com/demo/image/upload/landscape.jpg'],
        price: 1850,
        capacity: 3,
        bedConfiguration: '1 King Bed + 1 Gilded Chaise Lounge',
        amenities: ['Chauffeured Maybach Service', 'Private Rooftop Solarium', 'Hermès Bath Essentials', 'VIP Museum Access'],
        shortDescription:
          'An extravagant neoclassical penthouse suite featuring gilded gold leaf ceilings, a private rooftop solarium, and bespoke butler service.',
      },
      {
        roomType: 'Family Suite',
        name: 'Presidential Royal Grand Apartment',
        images: ['https://res.cloudinary.com/demo/image/upload/cld-sample.jpg'],
        price: 2800,
        capacity: 4,
        bedConfiguration: '2 King Beds',
        amenities: ['Two Interconnected Master Suites', 'Private Library & Dining Room', 'Dedicated Concierge Team'],
        shortDescription:
          'Sprawling palatial family apartment spanning 220 square meters with private elevator access, dual marble master baths, and fine dining.',
      },
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
    price: 420,
    roomTypes: [
      {
        roomType: 'Single Bed',
        name: 'Lotus Garden Pavilion',
        images: ['https://res.cloudinary.com/demo/image/upload/beach.jpg'],
        price: 420,
        capacity: 1,
        bedConfiguration: '1 Queen Teak Bed',
        amenities: ['Open-Air Rain Shower', 'Private Sun Deck', 'Daily Coconut Refreshment', 'Free Wi-Fi'],
        shortDescription:
          'Secluded standalone pavilion surrounded by whispering tropical flora, reflecting pools, and an outdoor sunken bath.',
      },
      {
        roomType: 'Double Bed',
        name: 'Oceanfront Sunset Sala',
        images: ['https://res.cloudinary.com/demo/image/upload/pool.jpg'],
        price: 780,
        capacity: 2,
        bedConfiguration: '1 King Platform Bed',
        amenities: ['Private Beach Pathway', 'Andaman Sunset View', 'Daily Morning Yoga', 'Bespoke Minibar'],
        shortDescription:
          'Steps away from powdery white sand beaches with an open-air teak sala, handcrafted Thai silks, and uninterrupted sea views.',
      },
      {
        roomType: 'Luxury Room',
        name: 'Andaman Cliffside Pool Villa',
        images: ['https://res.cloudinary.com/demo/image/upload/landscape.jpg'],
        price: 1350,
        capacity: 3,
        bedConfiguration: '1 King Bed + 1 Daybed',
        amenities: ['10m Private Plunge Pool', 'Outdoor Massage Pavilion', 'Ayurvedic Treatment Package', 'Butler'],
        shortDescription:
          'Dramatic cliffside villa cantilevered over azure waves, offering private freshwater pools and holistic in-villa wellness treatments.',
      },
      {
        roomType: 'Family Suite',
        name: 'Two-Tier Coastal Compound',
        images: ['https://res.cloudinary.com/demo/image/upload/castle.jpg'],
        price: 2200,
        capacity: 5,
        bedConfiguration: '2 King Beds + 1 Daybed',
        amenities: ['Private Beach Cabana', 'Family Yacht Excursion', 'Private Chef BBQ', 'Game Pavilion'],
        shortDescription:
          'Expansive multi-tier compound featuring separate living and sleeping pavilions, private beach frontage, and customized family dining.',
      },
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
    price: 380,
    roomTypes: [
      {
        roomType: 'Single Bed',
        name: 'Alpine Timber Cabin',
        images: ['https://res.cloudinary.com/demo/image/upload/cld-sample-2.jpg'],
        price: 380,
        capacity: 1,
        bedConfiguration: '1 Single Pine Bed',
        amenities: ['Stone Pine Fragrance', 'Heated Boot Rack', 'Glacier Stream Balcony', 'Free Wi-Fi'],
        shortDescription:
          'Warm alpine retreat crafted from natural Swiss stone pine, featuring heated heated hardwood floors and pine-scented mountain air.',
      },
      {
        roomType: 'Double Bed',
        name: 'Matterhorn Vista Chalet Room',
        images: ['https://res.cloudinary.com/demo/image/upload/landscape.jpg'],
        price: 680,
        capacity: 2,
        bedConfiguration: '1 King Down Feather Bed',
        amenities: ['Direct Matterhorn View', 'Wood-burning Fireplace', 'Swiss Chocolate Welcome', 'Sauna Pass'],
        shortDescription:
          'Iconic alpine luxury room with a stone wood-burning fireplace, plush down duvets, and front-row vistas of the iconic Matterhorn.',
      },
      {
        roomType: 'Luxury Room',
        name: 'Glacier Sky Spa Suite',
        images: ['https://res.cloudinary.com/demo/image/upload/mountain.jpg'],
        price: 1150,
        capacity: 3,
        bedConfiguration: '1 King Bed + 1 Trundle Bed',
        amenities: ['Cedar Outdoor Hot Tub', 'Swiss Fondue Butler', 'Unlimited Ski Valet', 'Panoramic Balcony'],
        shortDescription:
          'Top-floor luxury suite with private heated cedar soaking tub on the balcony, crackling fires, and evening private fondue service.',
      },
      {
        roomType: 'Family Suite',
        name: 'Highland Grand Alpine Lodge',
        images: ['https://res.cloudinary.com/demo/image/upload/cld-sample.jpg'],
        price: 1950,
        capacity: 6,
        bedConfiguration: '2 King Beds + 2 Twin Bunk Beds',
        amenities: ['Two Level Chalet Loft', 'Full Alpine Kitchen', 'Heli-Skiing Concierge', 'Private Sledges'],
        shortDescription:
          'Traditional two-story Swiss chalet suite with bunk rooms for children, grand timber dining table, and direct ski-in/ski-out trail access.',
      },
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
    price: 490,
    roomTypes: [
      {
        roomType: 'Single Bed',
        name: 'Lemon Grove Solo Hideaway',
        images: ['https://res.cloudinary.com/demo/image/upload/landscape.jpg'],
        price: 490,
        capacity: 1,
        bedConfiguration: '1 Queen Iron Bed',
        amenities: ['Vietri Hand-painted Tiles', 'Lemon Grove Fragrance', 'Private Terrace', 'Free Wi-Fi'],
        shortDescription:
          'Sunlit coastal hideaway decorated with antique Positano ceramics, citrus orchard views, and an espresso terrace.',
      },
      {
        roomType: 'Double Bed',
        name: 'Positano Cliffside Romance Suite',
        images: ['https://res.cloudinary.com/demo/image/upload/beach.jpg'],
        price: 890,
        capacity: 2,
        bedConfiguration: '1 King Bed with Linen Canopy',
        amenities: ['Cliffside Sunset Balcony', 'Prosecco Welcome Flutes', 'Private Beach Lift Access'],
        shortDescription:
          'Suspended dramatically over the shimmering Mediterranean with breathtaking pastel cliff village views and cliffside elevator access.',
      },
      {
        roomType: 'Luxury Room',
        name: 'Amalfi Azure Horizon Suite',
        images: ['https://res.cloudinary.com/demo/image/upload/pool.jpg'],
        price: 1550,
        capacity: 3,
        bedConfiguration: '1 King Bed + 1 Daybed',
        amenities: ['Heated Cliff Plunge Pool', 'Private Riva Boat Sunset Tour', 'Rooftop Dining Service'],
        shortDescription:
          'Exclusive cliffside suite with private heated horizon pool overlooking Capri, personalized sommelier service, and luxury boat charter.',
      },
      {
        roomType: 'Family Suite',
        name: 'Villa Bellissima Master Palazzo',
        images: ['https://res.cloudinary.com/demo/image/upload/castle.jpg'],
        price: 2600,
        capacity: 5,
        bedConfiguration: '2 King Beds + 1 Rollaway Bed',
        amenities: ['Private Sun Terrace & Solarium', 'Dedicated Italian Butler', 'Private Chef Pasta Class'],
        shortDescription:
          'Expansive private floor with sweeping 180-degree Mediterranean vistas, two king bedrooms, outdoor pergola dining, and private butler.',
      },
    ],
    rating: 4.8,
    reviewCount: 104,
    isFeatured: true,
    status: 'active',
  },
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
    price: 360,
    roomTypes: [
      {
        roomType: 'Single Bed',
        name: 'Arashiyama Zen Room',
        images: ['https://res.cloudinary.com/demo/image/upload/mountain.jpg'],
        price: 360,
        capacity: 1,
        bedConfiguration: '1 Traditional Japanese Futon / Semi-Double',
        amenities: ['Tatami Mat Floors', 'Hinoki Cedar Bath', 'Matcha Tea Set', 'Free Wi-Fi'],
        shortDescription:
          'Minimalist Japanese suite featuring aromatic tatami mats, shoji screens, and an authentic Hinoki cypress soaking tub.',
      },
      {
        roomType: 'Double Bed',
        name: 'Bamboo Grove Onsen Suite',
        images: ['https://res.cloudinary.com/demo/image/upload/landscape.jpg'],
        price: 640,
        capacity: 2,
        bedConfiguration: '1 King Low-Profile Platform Bed',
        amenities: ['Private Mineral Onsen', 'Japanese Rock Garden View', 'Kaiseki Breakfast Service'],
        shortDescription:
          'Features a private outdoor natural hot spring bath surrounded by whispering bamboo stalks, and seasonal multi-course kaiseki meals.',
      },
      {
        roomType: 'Luxury Room',
        name: 'Imperial Heritage Ryokan Suite',
        images: ['https://res.cloudinary.com/demo/image/upload/castle.jpg'],
        price: 1250,
        capacity: 3,
        bedConfiguration: '1 King Bed + 1 Tatami Futon',
        amenities: ['Open-air Hot Spring Bath', 'Private Tea Ceremony Room', 'Traditional Yukata Robes'],
        shortDescription:
          'Authentic historic imperial suite with a dedicated tea ceremony master, private stone onsen bath, and personal nakai-san attendant.',
      },
      {
        roomType: 'Family Suite',
        name: 'Grand Daimyo Garden Compound',
        images: ['https://res.cloudinary.com/demo/image/upload/pool.jpg'],
        price: 2100,
        capacity: 4,
        bedConfiguration: '2 King Platform Beds',
        amenities: ['Private Japanese Walled Garden', 'Dual Thermal Baths', 'Rickshaw Concierge'],
        shortDescription:
          'A private walled sanctuary with two interconnected tatami suites, dual mineral onsen baths, and a secluded private koi pond garden.',
      },
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
    price: 450,
    roomTypes: [
      {
        roomType: 'Single Bed',
        name: 'Cycladic Solo Cave Retreat',
        images: ['https://res.cloudinary.com/demo/image/upload/beach.jpg'],
        price: 450,
        capacity: 1,
        bedConfiguration: '1 Queen Built-In Stone Bed',
        amenities: ['Curved Whitewashed Walls', 'Caldera View Balcony', 'Greek Breakfast', 'Free Wi-Fi'],
        shortDescription:
          'Traditional vaulted cave room sculpted directly into volcanic rock, offering breezy Aegean breezes and pristine white aesthetics.',
      },
      {
        roomType: 'Double Bed',
        name: 'Oia Sunset Horizon Suite',
        images: ['https://res.cloudinary.com/demo/image/upload/pool.jpg'],
        price: 820,
        capacity: 2,
        bedConfiguration: '1 King Floating Bed',
        amenities: ['Private Heated Jacuzzi', 'Front-row Sunset Terrace', 'Champagne Welcome'],
        shortDescription:
          'Features a private terrace with a heated outdoor jacuzzi overlooking the caldera and Oia’s legendary sunset horizon.',
      },
      {
        roomType: 'Luxury Room',
        name: 'Caldera Mirage Plunge Villa',
        images: ['https://res.cloudinary.com/demo/image/upload/landscape.jpg'],
        price: 1450,
        capacity: 3,
        bedConfiguration: '1 King Bed + 1 Daybed',
        amenities: ['Cliff-Edge Infinity Pool', 'Catamaran Cruise Discount', '24/7 Butler Service'],
        shortDescription:
          'Perched at the highest ridge of Oia with an infinity-edge cave pool extending outward over the cliff face toward the sparkling Aegean.',
      },
      {
        roomType: 'Family Suite',
        name: 'Aegean Cliffside Compound',
        images: ['https://res.cloudinary.com/demo/image/upload/cld-sample.jpg'],
        price: 2350,
        capacity: 4,
        bedConfiguration: '2 King Beds',
        amenities: ['Two Interconnected Cave Villas', 'Private Sun Deck', 'In-Villa Greek Chef Dinner'],
        shortDescription:
          'Two adjoining traditional whitewashed cave residences with expansive panoramic terrace, dual outdoor spas, and bespoke dining.',
      },
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
    price: 420,
    roomTypes: [
      {
        roomType: 'Single Bed',
        name: 'Bedouin Dunes Suite',
        images: ['https://res.cloudinary.com/demo/image/upload/cld-sample-2.jpg'],
        price: 420,
        capacity: 1,
        bedConfiguration: '1 Queen Canopied Bed',
        amenities: ['Terracotta Dune View', 'Oud Incense Ritual', 'Daily Sunset Camel Ride', 'Free Wi-Fi'],
        shortDescription:
          'Handcrafted Arabian room with antique brass lanterns, Arabian tapestries, and serene views of the sweeping golden desert dunes.',
      },
      {
        roomType: 'Double Bed',
        name: 'Desert Oasis Pool Villa',
        images: ['https://res.cloudinary.com/demo/image/upload/castle.jpg'],
        price: 750,
        capacity: 2,
        bedConfiguration: '1 King Bed with Silk Cushions',
        amenities: ['Temperature-controlled Plunge Pool', 'Arabian High Tea', 'Gazelle Watching Deck'],
        shortDescription:
          'Stand-alone desert villa featuring a private plunge pool where Arabian gazelles and onyx roam freely along the perimeter.',
      },
      {
        roomType: 'Luxury Room',
        name: 'Royal Falconry Desert Pavilion',
        images: ['https://res.cloudinary.com/demo/image/upload/landscape.jpg'],
        price: 1300,
        capacity: 3,
        bedConfiguration: '1 King Bed + 1 Daybed',
        amenities: ['Private Falconry Experience', 'Sunset Dune Dining Tent', 'Stargazing Telescope'],
        shortDescription:
          'Palatial Arabian residence with custom Persian rugs, dedicated desert safari guide, and private dinner under desert stars.',
      },
      {
        roomType: 'Family Suite',
        name: 'Sultan Grand Desert Compound',
        images: ['https://res.cloudinary.com/demo/image/upload/pool.jpg'],
        price: 2150,
        capacity: 5,
        bedConfiguration: '2 King Beds + 1 Rollaway Bed',
        amenities: ['Two Master Pavilion Suites', 'Private 4x4 Dune Rover', 'Dedicated Bedouin Host'],
        shortDescription:
          'An exclusive desert compound with private heated swimming pool, outdoor majlis seating area, and private safari excursions.',
      },
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
    price: 460,
    roomTypes: [
      {
        roomType: 'Single Bed',
        name: 'Safari Bush Tent Suite',
        images: ['https://res.cloudinary.com/demo/image/upload/mountain.jpg'],
        price: 460,
        capacity: 1,
        bedConfiguration: '1 Queen Bed with Mosquito Netting',
        amenities: ['Elevated Bush Deck', 'Binoculars & Field Guide', 'Daily Game Drive', 'Free Wi-Fi'],
        shortDescription:
          'Canvas-walled luxury suite elevated on timber stilts, offering open-air views of the African savannah and native wildlife.',
      },
      {
        roomType: 'Double Bed',
        name: 'Riverbank Safari Chalet',
        images: ['https://res.cloudinary.com/demo/image/upload/landscape.jpg'],
        price: 840,
        capacity: 2,
        bedConfiguration: '1 King Bed with Safari Linens',
        amenities: ['Sabie River View Deck', 'Outdoor Victorian Clawfoot Tub', 'Boma BBQ Dinner'],
        shortDescription:
          'Luxury chalet overlooking the active riverbank where elephants and hippos gather at dawn; features outdoor soaking tub.',
      },
      {
        roomType: 'Luxury Room',
        name: 'Leopard Ridge Plunge Pavilion',
        images: ['https://res.cloudinary.com/demo/image/upload/pool.jpg'],
        price: 1400,
        capacity: 3,
        bedConfiguration: '1 King Bed + 1 Daybed',
        amenities: ['Private Heated Plunge Pool', 'Dedicated Tracker & Ranger', 'Sundowner Cocktails'],
        shortDescription:
          'Exclusive ridge-top lodge pavilion with heated infinity plunge pool, private game drive vehicle, and sunset bush bar.',
      },
      {
        roomType: 'Family Suite',
        name: 'Kruger Big Five Family Homestead',
        images: ['https://res.cloudinary.com/demo/image/upload/castle.jpg'],
        price: 2500,
        capacity: 6,
        bedConfiguration: '2 King Beds + 2 Safari Bunk Beds',
        amenities: ['Exclusive Safari Vehicle', 'Private Chef & Ranger Team', 'Junior Ranger Program'],
        shortDescription:
          'Sole-use luxury safari villa with dedicated ranger team, open-air stone fireplace boma, and tailored children’s tracking adventures.',
      },
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
    price: 550,
    roomTypes: [
      {
        roomType: 'Single Bed',
        name: 'Fifth Avenue Executive Room',
        images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
        price: 550,
        capacity: 1,
        bedConfiguration: '1 Queen Custom Serta Bed',
        amenities: ['High-Floor City View', 'Italian Frette Linens', 'Acoustic Soundproofing', 'Free Wi-Fi'],
        shortDescription:
          'Whisper-quiet Art Deco room with tailored mahogany finishes, city views, and luxurious marble bathroom with rainfall shower.',
      },
      {
        roomType: 'Double Bed',
        name: 'Central Park Vista Suite',
        images: ['https://res.cloudinary.com/demo/image/upload/cld-sample.jpg'],
        price: 980,
        capacity: 2,
        bedConfiguration: '1 King Bed with Feather Top',
        amenities: ['Unobstructed Central Park View', 'Marble Fireplace', 'Moët Champagne Welcome'],
        shortDescription:
          'Dramatic floor-to-ceiling vistas across Central Park’s treetops, a carved marble gas fireplace, and personalized butler unpacking.',
      },
      {
        roomType: 'Luxury Room',
        name: 'Skyline Duplex Penthouse',
        images: ['https://res.cloudinary.com/demo/image/upload/landscape.jpg'],
        price: 1750,
        capacity: 3,
        bedConfiguration: '1 King Bed + 1 Daybed',
        amenities: ['Private Landscaped Terrace', 'Chauffeured Rolls-Royce', 'In-Suite Michelin Dinner'],
        shortDescription:
          'Two-story architectural marvel with private outdoor skyline terrace, baby grand piano, and house car limousine service.',
      },
      {
        roomType: 'Family Suite',
        name: 'Manhattan Grand Manor Residence',
        images: ['https://res.cloudinary.com/demo/image/upload/castle.jpg'],
        price: 2900,
        capacity: 5,
        bedConfiguration: '2 King Beds + 1 Sofa Sleeper',
        amenities: ['Three Bathrooms', 'Private Chef’s Kitchen', 'Private Keyed Elevator', 'Butler'],
        shortDescription:
          'Over 300 square meters of prime Fifth Avenue luxury with private elevator landing, full gourmet kitchen, and 24/7 butler service.',
      },
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
    price: 490,
    roomTypes: [
      {
        roomType: 'Single Bed',
        name: 'Lagoon Edge Water Bungalow',
        images: ['https://res.cloudinary.com/demo/image/upload/beach.jpg'],
        price: 490,
        capacity: 1,
        bedConfiguration: '1 Queen Bamboo Canopy Bed',
        amenities: ['Glass Viewing Coffee Table', 'Direct Reef Ladder', 'Snorkeling Gear', 'Free Wi-Fi'],
        shortDescription:
          'Charming overwater bungalow with glass coffee table looking down upon living coral gardens and colorful tropical fish.',
      },
      {
        roomType: 'Double Bed',
        name: 'Mount Otemanu Overwater Villa',
        images: ['https://res.cloudinary.com/demo/image/upload/pool.jpg'],
        price: 920,
        capacity: 2,
        bedConfiguration: '1 King Bed with Ocean Views',
        amenities: ['Direct Mount Otemanu View', 'Canoe Breakfast Delivery', 'Overwater Hammock Net'],
        shortDescription:
          'Unrivaled views of Mount Otemanu across crystal lagoon water, with breakfast delivered by traditional outrigger canoe.',
      },
      {
        roomType: 'Luxury Room',
        name: 'Royal Turquoise Plunge Villa',
        images: ['https://res.cloudinary.com/demo/image/upload/landscape.jpg'],
        price: 1600,
        capacity: 3,
        bedConfiguration: '1 King Bed + 1 Daybed',
        amenities: ['Private Infinity Plunge Pool Over Water', 'Sunset Champagne Cruise', 'Spa Access'],
        shortDescription:
          'Expansive overwater villa with private freshwater horizon pool suspended above the lagoon and private motu picnic cruise.',
      },
      {
        roomType: 'Family Suite',
        name: 'Two-Bedroom Presidential Lagoon Estate',
        images: ['https://res.cloudinary.com/demo/image/upload/castle.jpg'],
        price: 2700,
        capacity: 5,
        bedConfiguration: '2 King Beds + 1 Daybed',
        amenities: ['Dual Overwater Pavilions', 'Private Boat Captain', 'Helicopter Transfer Inclusions'],
        shortDescription:
          'Sprawling private overwater compound with dual master bedrooms, private dining gazebo, and dedicated boat captain.',
      },
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
    price: 440,
    roomTypes: [
      {
        roomType: 'Single Bed',
        name: 'Palazzo Garden Room',
        images: ['https://res.cloudinary.com/demo/image/upload/landscape.jpg'],
        price: 440,
        capacity: 1,
        bedConfiguration: '1 Italian Single Bed',
        amenities: ['Cypress Garden View', 'Marble Bath', 'Lake Breeze Balcony', 'Free Wi-Fi'],
        shortDescription:
          'Tranquil room with classical Italian artwork, view of 100-year-old cedar trees, and antique marble furnishings.',
      },
      {
        roomType: 'Double Bed',
        name: 'Lake Como Prestige Suite',
        images: ['https://res.cloudinary.com/demo/image/upload/castle.jpg'],
        price: 790,
        capacity: 2,
        bedConfiguration: '1 King Bed with Velvet Headboard',
        amenities: ['Direct Lake Como Balcony', 'Vintage Riva Boat Cruise', 'Wine Cellar Tasting'],
        shortDescription:
          'Step onto a private stone balcony directly overlooking the glittering waters of Lake Como and historic lakeside villas.',
      },
      {
        roomType: 'Luxury Room',
        name: 'Countess Bellinzaghi Grand Suite',
        images: ['https://res.cloudinary.com/demo/image/upload/pool.jpg'],
        price: 1380,
        capacity: 3,
        bedConfiguration: '1 King Bed + 1 Daybed',
        amenities: ['Floating Pool Access', 'Private Lake Pier Dinner', 'Personal Sommelier'],
        shortDescription:
          'Historic 19th-century suite featuring original ceiling frescoes, crystal chandeliers, and access to the iconic floating pool.',
      },
      {
        roomType: 'Family Suite',
        name: 'Villa Renaissance Royal Wing',
        images: ['https://res.cloudinary.com/demo/image/upload/cld-sample.jpg'],
        price: 2300,
        capacity: 5,
        bedConfiguration: '2 King Beds + 1 Trundle Bed',
        amenities: ['Entire Private Villa Floor', 'Private Speedboat at Disposal', 'Private Chef'],
        shortDescription:
          'Exclusive wing of the palazzo with private lakeside gardens, personal speedboat at your disposal, and private chef dinners.',
      },
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
    price: 320,
    roomTypes: [
      {
        roomType: 'Single Bed',
        name: 'Jungle Canopy Studio',
        images: ['https://res.cloudinary.com/demo/image/upload/mountain.jpg'],
        price: 320,
        capacity: 1,
        bedConfiguration: '1 Queen Bamboo Platform Bed',
        amenities: ['Ayung River Sounds', 'Outdoor Stone Bath', 'Daily Yoga Session', 'Free Wi-Fi'],
        shortDescription:
          'Intimate open-air room open to the sights and sounds of the Bali rainforest canopy, with carved river-stone bathtub.',
      },
      {
        roomType: 'Double Bed',
        name: 'Valley View Hanging Villa',
        images: ['https://res.cloudinary.com/demo/image/upload/pool.jpg'],
        price: 580,
        capacity: 2,
        bedConfiguration: '1 King Teak Bed with Voile Draping',
        amenities: ['Private Heated Plunge Pool', 'Floating Breakfast', 'Balinese Massage Package'],
        shortDescription:
          'Suspended dramatically over the rainforest ravine with private heated infinity pool and famous floating breakfast service.',
      },
      {
        roomType: 'Luxury Room',
        name: 'Sacred River Waterfall Sanctuary',
        images: ['https://res.cloudinary.com/demo/image/upload/landscape.jpg'],
        price: 1100,
        capacity: 3,
        bedConfiguration: '1 King Bed + 1 Daybed',
        amenities: ['Two-tier Cascading Pool', 'Sound Healing Pavilion', 'Private Holistic Butler'],
        shortDescription:
          'Multi-level teak residence with private cascading pools, private yoga shala, and sound healing therapy with a Balinese priest.',
      },
      {
        roomType: 'Family Suite',
        name: 'Ubud Royal Rainforest Compound',
        images: ['https://res.cloudinary.com/demo/image/upload/castle.jpg'],
        price: 1900,
        capacity: 5,
        bedConfiguration: '2 King Beds + 1 Daybed',
        amenities: ['Private Riverfront Pavilion', 'Ayung River Rafting Tour', 'Private Farm-to-Table Chef'],
        shortDescription:
          'Private jungle estate with two open-air luxury pavilions, private river access, and organic garden chef dining.',
      },
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
    price: 350,
    roomTypes: [
      {
        roomType: 'Single Bed',
        name: 'Bow Valley Castle Room',
        images: ['https://res.cloudinary.com/demo/image/upload/cld-sample-2.jpg'],
        price: 350,
        capacity: 1,
        bedConfiguration: '1 Queen Scottish Pine Bed',
        amenities: ['Pine Forest View', 'Heated Bathroom Tiles', 'Ski Locker Access', 'Free Wi-Fi'],
        shortDescription:
          'Cozy baronial room with thick stone walls, heated bathroom slate tiles, and panoramic views of evergreen pine forests.',
      },
      {
        roomType: 'Double Bed',
        name: 'Rocky Mountain Peak Suite',
        images: ['https://res.cloudinary.com/demo/image/upload/mountain.jpg'],
        price: 620,
        capacity: 2,
        bedConfiguration: '1 King Bed with Plaid Wool Blankets',
        amenities: ['Bow River Valley View', 'Gas Fireplace', 'Thermal Springs Mineral Pass'],
        shortDescription:
          'Charming mountain suite with a crackling gas fireplace, wool tartan accents, and complimentary access to outdoor hot springs.',
      },
      {
        roomType: 'Luxury Room',
        name: 'Castle Turret Alpine Suite',
        images: ['https://res.cloudinary.com/demo/image/upload/landscape.jpg'],
        price: 1150,
        capacity: 3,
        bedConfiguration: '1 King Bed + 1 Trundle Bed',
        amenities: ['360-degree Turret Windows', 'Glacier Heli-Tour Shuttle', 'Private Butler Fondue'],
        shortDescription:
          'Located in the historic castle turret with 360-degree mountain vistas of the Canadian Rockies and bespoke mountain guide service.',
      },
      {
        roomType: 'Family Suite',
        name: 'Baronial Grand Mountain Chalet',
        images: ['https://res.cloudinary.com/demo/image/upload/castle.jpg'],
        price: 1950,
        capacity: 6,
        bedConfiguration: '2 King Beds + 2 Twin Beds',
        amenities: ['Two Master Bedrooms', 'Full Kitchen & Dining Room', 'Ski Valet & Pass Concierge'],
        shortDescription:
          'Expansive luxury family suite with large stone dining table, two master bedrooms, children’s twin bedroom, and ski valet.',
      },
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
    price: 480,
    roomTypes: [
      {
        roomType: 'Single Bed',
        name: 'The Rocks Heritage Studio',
        images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
        price: 480,
        capacity: 1,
        bedConfiguration: '1 Queen Plush Bed',
        amenities: ['Historic Sandstone View', 'Espresso Machine', 'Executive Work Desk', 'Free Wi-Fi'],
        shortDescription:
          'Modern waterfront room incorporating historic Sydney sandstone, floor-to-ceiling windows, and luxury Australian organic amenities.',
      },
      {
        roomType: 'Double Bed',
        name: 'Sydney Opera House Vista Suite',
        images: ['https://res.cloudinary.com/demo/image/upload/landscape.jpg'],
        price: 860,
        capacity: 2,
        bedConfiguration: '1 King Bed with Harbour Views',
        amenities: ['Direct Opera House Balcony', 'Rooftop Heated Pool Access', 'Hunter Valley Wine'],
        shortDescription:
          'Features a private balcony looking directly across the glistening harbor toward the sails of the Sydney Opera House.',
      },
      {
        roomType: 'Luxury Room',
        name: 'Harbour Bridge Panoramic Suite',
        images: ['https://res.cloudinary.com/demo/image/upload/pool.jpg'],
        price: 1500,
        capacity: 3,
        bedConfiguration: '1 King Bed + 1 Daybed',
        amenities: ['Wrap-Around Glass Balcony', 'Private Harbour Yacht Charter', 'Club Lounge Access'],
        shortDescription:
          'Corner glass suite showcasing dual views of both the Sydney Opera House and Harbour Bridge, with private club lounge privileges.',
      },
      {
        roomType: 'Family Suite',
        name: 'Governor General Harbour Penthouse',
        images: ['https://res.cloudinary.com/demo/image/upload/castle.jpg'],
        price: 2450,
        capacity: 5,
        bedConfiguration: '2 King Beds + 1 Rollaway Bed',
        amenities: ['Panoramic Harbor Sun Deck', 'Chauffeured Airport Limousine', '24/7 Butler Service'],
        shortDescription:
          'Over 250 square meters of prime Sydney waterfront luxury with outdoor hot tub, full kitchen, and 24/7 dedicated butler service.',
      },
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

    let updatedCount = 0
    let createdCount = 0

    // Upsert each hotel so existing records are enriched with price and roomTypes in-place
    for (const hotelData of allHotels) {
      const existing = await Hotel.findOne({ name: hotelData.name })
      if (existing) {
        await Hotel.updateOne({ _id: existing._id }, { $set: hotelData })
        updatedCount++
      } else {
        await Hotel.create(hotelData)
        createdCount++
      }
    }

    console.log(
      `Seed complete: ${createdCount} created, ${updatedCount} updated in-place with prices & roomTypes.`
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
