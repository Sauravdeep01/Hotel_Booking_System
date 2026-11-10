import { IMAGES } from './images'

export const FEATURED_HOTELS = [
  {
    id: 1,
    name: 'Grand Azure Horizon Villa',
    roomType: 'Ocean Pavilion Suite • Double Bed',
    discount: '20% OFF',
    rating: 4.9,
    reviewsCount: 128,
    price: 340,
    priceCurrency: '$',
    priceUnit: 'night',
    location: 'North Malé Atoll, Maldives',
    fullAddress: 'Villa 104, Horizon Bay Atoll, North Malé, Maldives 08420',
    isBestSeller: true,
    image: IMAGES.hotels.grandAzure,
    gallery: IMAGES.hotelGalleries.grandAzure,
    tagline: 'Experience Luxury Like Never Before',
    shortDescription:
      'Perched directly over crystal-clear turquoise waters, this private overwater villa features an infinity plunge pool, floor-to-ceiling panoramic glass walls, and dedicated 24/7 personal butler service.',
    facilityHighlights: [
      {
        title: '24/7 Room Service',
        description: 'Bespoke private chef & butler dining anytime',
        iconName: 'BellRing',
      },
      {
        title: 'Panoramic Ocean View',
        description: '180° uninterrupted sunset views over the turquoise lagoon',
        iconName: 'Waves',
      },
      {
        title: 'Private Pool Access',
        description: 'Freshwater infinity plunge pool with submerged sun loungers',
        iconName: 'Sparkles',
      },
    ],
    about:
      'Nestled on an exclusive private coral island, Grand Azure Horizon Villa provides an unrivaled sanctuary where barefoot luxury harmonizes with pristine marine nature. Handcrafted from sustainably harvested teak and local limestone, each residence offers expansive sun decks, direct lagoon swim-out stairs, and custom Italian linens. Guests enjoy complimentary seaplane transfers, private sunset yacht cruises, and Michelin-curated dining on their private veranda.',
    roomDetails: {
      type: 'Executive Overwater Villa',
      bedType: '1 King Bed + 1 Premium Daybed',
      capacity: 'Up to 3 Guests (2 Adults, 1 Child)',
      size: '185 m² (1,990 sq ft)',
      features: [
        'Private infinity plunge pool',
        'Direct submerged sea staircase',
        'Freestanding marble soaking tub with sea view',
        'Bang & Olufsen acoustic surround system',
        'Complimentary gourmet minibar & Nespresso bar',
        'Walk-in rain shower & double vanity',
      ],
    },
    amenities: [
      {
        title: 'Clean & Safe Stay',
        description: 'Certified hospital-grade sanitization standards',
        iconName: 'ShieldCheck',
      },
      {
        title: 'Enhanced Cleaning',
        description: 'Daily steam cleaning & UV luggage sterilization',
        iconName: 'Sparkles',
      },
      {
        title: 'Excellent Location',
        description: 'Rated 9.9/10 by guests for marine tranquility',
        iconName: 'MapPin',
      },
      {
        title: 'Smooth Check-In',
        description: 'Contactless VIP private boat check-in',
        iconName: 'KeyRound',
      },
      {
        title: 'Free High-Speed Wi-Fi',
        description: 'Starlink 300 Mbps across entire villa',
        iconName: 'Wifi',
      },
      {
        title: 'Swimming Pool',
        description: 'Private infinity plunge pool + resort lagoon pool',
        iconName: 'Waves',
      },
      {
        title: 'Complimentary Parking',
        description: 'Free yacht mooring & private jet lounge valet',
        iconName: 'Car',
      },
      {
        title: 'Waterfront Restaurant',
        description: '3 Michelin-starred overwater restaurants & wine cellar',
        iconName: 'UtensilsCrossed',
      },
      {
        title: 'Dual-Zone Air Conditioning',
        description: 'Whisper-quiet eco-inverter climate control',
        iconName: 'Wind',
      },
    ],
    houseRules: {
      checkIn: '14:00 PM onwards',
      checkOut: 'Until 12:00 PM noon',
      cancellation: 'Free cancellation up to 48 hours before scheduled arrival.',
      smoking: 'Non-smoking indoors (permitted on open-air sun deck).',
      pets: 'Permitted in select private villas upon prior request.',
    },
    locationDetails: {
      neighborhood: 'North Malé Marine Protected Biosphere',
      distances: [
        { place: 'Velana International Airport (MLE)', distance: '25 min by speedboat' },
        { place: 'Manta Ray Coral Sanctuary', distance: '5 min by private boat' },
        { place: 'Banana Reef Diving Spot', distance: '12 min by boat' },
      ],
    },
    reviews: [
      {
        id: 1,
        author: 'Charlotte Dubois',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: 'October 2026',
        comment:
          'The overwater villa exceeded every single expectation. Waking up to the Indian Ocean breeze and having our breakfast delivered by outrigger canoe was pure magic.',
      },
      {
        id: 2,
        author: 'Marcus Vance',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: 'September 2026',
        comment:
          'Unmatched attention to detail. The butler staff were so attentive without ever being intrusive. The private plunge pool overlooking the sunset was breathtaking.',
      },
      {
        id: 3,
        author: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        rating: 4.8,
        date: 'August 2026',
        comment:
          'Pure paradise. The coral reef right under our villa stairs had manta rays and sea turtles swimming past daily. Truly the most relaxing vacation of our lives.',
      },
    ],
  },
  {
    id: 2,
    name: 'The Royal Serenity Palace',
    roomType: 'Grand Deluxe Suite • King Bed',
    discount: '25% OFF',
    rating: 4.8,
    reviewsCount: 96,
    price: 420,
    priceCurrency: '$',
    priceUnit: 'night',
    location: 'Paris, France',
    fullAddress: '18 Avenue Montaigne, 8th Arrondissement, 75008 Paris, France',
    isBestSeller: true,
    image: IMAGES.hotels.royalPalace,
    gallery: IMAGES.hotelGalleries.royalPalace,
    tagline: 'Experience Luxury Like Never Before',
    shortDescription:
      'Immerse yourself in Parisian grand architecture with views of the Eiffel Tower, private neoclassical salons, and bespoke concierge access to haute couture fashion houses.',
    facilityHighlights: [
      {
        title: '24/7 Room Service',
        description: 'Fine French dining & champagne delivered to your salon',
        iconName: 'BellRing',
      },
      {
        title: 'Eiffel Tower View',
        description: 'Private balcony overlooking Paris’ most iconic monuments',
        iconName: 'Compass',
      },
      {
        title: 'Heated Indoor Spa',
        description: 'Dior-partnered wellness spa and mosaic heated plunge pool',
        iconName: 'Sparkles',
      },
    ],
    about:
      'The Royal Serenity Palace represents the pinnacle of French elegance on the legendary Avenue Montaigne. Dating back to 1912, this landmark palace blends historic Belle Époque moldings with contemporary Parisian haute decor. Featuring crystal chandeliers, custom silk wall coverings, and an exceptional wine cellar curated by world-class sommeliers.',
    roomDetails: {
      type: 'Palatial Deluxe Suite',
      bedType: '1 Imperial King Bed',
      capacity: 'Up to 2 Adults',
      size: '120 m² (1,290 sq ft)',
      features: [
        'Private wrought-iron balcony with Eiffel Tower view',
        'Carrara marble bathroom with deep whirlpool tub',
        'Dedicated dressing room with custom cedar wardrobes',
        'Hermès luxury bath amenities',
        'Daily afternoon tea service',
      ],
    },
    amenities: [
      {
        title: 'Clean & Safe Stay',
        description: 'Hospitality Gold Seal sanitization protocols',
        iconName: 'ShieldCheck',
      },
      {
        title: 'Enhanced Cleaning',
        description: 'Twice-daily housekeeping with evening turndown',
        iconName: 'Sparkles',
      },
      {
        title: 'Excellent Location',
        description: 'Located in the golden triangle of Parisian fashion',
        iconName: 'MapPin',
      },
      {
        title: 'Smooth Check-In',
        description: 'Private in-suite registration with vintage champagne',
        iconName: 'KeyRound',
      },
      {
        title: 'Free High-Speed Wi-Fi',
        description: 'Fiber optic 500 Mbps connection',
        iconName: 'Wifi',
      },
      {
        title: 'Swimming Pool',
        description: 'Heated Roman-style indoor pool with vitality jets',
        iconName: 'Waves',
      },
      {
        title: 'Valet Parking',
        description: 'Secure underground parking with electric charging',
        iconName: 'Car',
      },
      {
        title: 'Gastronomic Restaurant',
        description: '2 Michelin Star restaurant led by Chef Alain Laurent',
        iconName: 'UtensilsCrossed',
      },
      {
        title: 'Silent Air Conditioning',
        description: 'Independent climate control in bedroom and salon',
        iconName: 'Wind',
      },
    ],
    houseRules: {
      checkIn: '15:00 PM onwards',
      checkOut: 'Until 12:00 PM noon',
      cancellation: 'Free cancellation up to 72 hours before arrival.',
      smoking: '100% smoke-free property.',
      pets: 'Small pets welcomed with custom pet amenities.',
    },
    locationDetails: {
      neighborhood: 'Champs-Élysées & Avenue Montaigne',
      distances: [
        { place: 'Eiffel Tower', distance: '12 min walk (900m)' },
        { place: 'Champs-Élysées', distance: '5 min walk (400m)' },
        { place: 'Louvre Museum', distance: '10 min by car' },
      ],
    },
    reviews: [
      {
        id: 1,
        author: 'Alexander Wright',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: 'October 2026',
        comment:
          'Sitting on the private balcony sipping espresso while the Eiffel Tower sparkled was an unforgettable memory. The service was impeccable.',
      },
      {
        id: 2,
        author: 'Sophie Martin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        rating: 4.8,
        date: 'September 2026',
        comment:
          'A true French palace in every sense. The spa treatments and in-room dining were second to none. We will definitely return!',
      },
    ],
  },
  {
    id: 3,
    name: 'Amanpuri Coastal Haven',
    roomType: 'Cliffside Ocean Villa • Double Bed',
    discount: '15% OFF',
    rating: 4.7,
    reviewsCount: 142,
    price: 260,
    priceCurrency: '$',
    priceUnit: 'night',
    location: 'Bali, Indonesia',
    fullAddress: 'Jalan Pantai Bingin No. 8, Uluwatu, Bali 80361, Indonesia',
    isBestSeller: false,
    image: IMAGES.hotels.amanpuriHaven,
    gallery: IMAGES.hotelGalleries.amanpuriHaven,
    tagline: 'Experience Luxury Like Never Before',
    shortDescription:
      'Set high above the dramatic cliffs of Uluwatu, this sanctuary features an ocean-facing infinity pool, traditional Balinese thatched architecture, and tranquil tropical gardens.',
    facilityHighlights: [
      {
        title: '24/7 Room Service',
        description: 'Indonesian gourmet cuisine and tropical cocktails',
        iconName: 'BellRing',
      },
      {
        title: 'Cliffside Ocean View',
        description: 'Dramatic sunset vistas across the Indian Ocean',
        iconName: 'Waves',
      },
      {
        title: 'Private Infinity Pool',
        description: 'Edge-of-the-world pool overlooking Uluwatu surf breaks',
        iconName: 'Sparkles',
      },
    ],
    about:
      'Perched atop limestone cliffs with a secluded private beach staircase, Amanpuri Coastal Haven is an oasis of calm. Designed with natural volcanic stone, reclaimed ironwood, and handwoven Balinese textiles, every villa is an architectural masterpiece celebrating Indonesia’s cultural heritage and unspoiled coastal beauty.',
    roomDetails: {
      type: 'Cliffside Pool Sanctuary',
      bedType: '1 Handcrafted Teak King Bed',
      capacity: 'Up to 2 Adults',
      size: '145 m² (1,560 sq ft)',
      features: [
        'Private 12-meter cliffside infinity pool',
        'Open-air tropical stone rain shower and soaking tub',
        'Private outdoor gazebo (Bale) for yoga and massage',
        'Organic local wellness botanicals',
        'Dedicated villa host',
      ],
    },
    amenities: [
      {
        title: 'Clean & Safe Stay',
        description: 'Eco-certified green cleaning standards',
        iconName: 'ShieldCheck',
      },
      {
        title: 'Enhanced Cleaning',
        description: 'Eco-botanical non-toxic sanitization',
        iconName: 'Sparkles',
      },
      {
        title: 'Excellent Location',
        description: 'Direct cliffside access to Bingin beach',
        iconName: 'MapPin',
      },
      {
        title: 'Smooth Check-In',
        description: 'Traditional Balinese blessing and flower garland welcome',
        iconName: 'KeyRound',
      },
      {
        title: 'Free High-Speed Wi-Fi',
        description: 'Fiber-backed high-speed coverage throughout',
        iconName: 'Wifi',
      },
      {
        title: 'Swimming Pool',
        description: 'Private infinity plunge pool + cliff resort pool',
        iconName: 'Waves',
      },
      {
        title: 'Free Parking',
        description: 'Complimentary on-site valet parking and scooter rental',
        iconName: 'Car',
      },
      {
        title: 'Sunset Cliff Restaurant',
        description: 'Oceanfront open-air grill and seafood restaurant',
        iconName: 'UtensilsCrossed',
      },
      {
        title: 'Natural Breeze & AC',
        description: 'Full AC plus ceiling fans and ocean cross-breeze',
        iconName: 'Wind',
      },
    ],
    houseRules: {
      checkIn: '14:00 PM onwards',
      checkOut: 'Until 12:00 PM noon',
      cancellation: 'Free cancellation up to 48 hours prior.',
      smoking: 'Outdoor areas only.',
      pets: 'Pets not permitted.',
    },
    locationDetails: {
      neighborhood: 'Uluwatu Cliffs & Bingin Beach',
      distances: [
        { place: 'Uluwatu Temple', distance: '10 min by car' },
        { place: 'Bingin Beach', distance: 'Private cliff path access' },
        { place: 'Ngurah Rai International Airport (DPS)', distance: '40 min by car' },
      ],
    },
    reviews: [
      {
        id: 1,
        author: 'Liam Johnson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: 'October 2026',
        comment:
          'The sunset from our private infinity pool was the most stunning view I have ever seen. Outstanding staff, incredible food, and deep peace.',
      },
    ],
  },
  {
    id: 4,
    name: 'The Highland Alpine Retreat',
    roomType: 'Matterhorn Chalet Suite • Double Bed',
    discount: '18% OFF',
    rating: 4.9,
    reviewsCount: 84,
    price: 380,
    priceCurrency: '$',
    priceUnit: 'night',
    location: 'Zermatt, Switzerland',
    fullAddress: 'Riedweg 45, 3920 Zermatt, Valais, Switzerland',
    isBestSeller: false,
    image: IMAGES.hotels.alpineRetreat,
    gallery: IMAGES.hotelGalleries.alpineRetreat,
    tagline: 'Experience Luxury Like Never Before',
    shortDescription:
      'Wake up to front-row vistas of the iconic Matterhorn. Featuring a wood-burning stone fireplace, cedar hot tub on the snow terrace, and ski-in/ski-out luxury.',
    facilityHighlights: [
      {
        title: '24/7 Room Service',
        description: 'Traditional Swiss fondue and Alpine delicacies in-suite',
        iconName: 'BellRing',
      },
      {
        title: 'Matterhorn Mountain View',
        description: 'Direct majestic views of the Matterhorn peak from bed',
        iconName: 'Mountain',
      },
      {
        title: 'Heated Outdoor Hot Tub',
        description: 'Private bubbling cedar hot tub surrounded by snow',
        iconName: 'Sparkles',
      },
    ],
    about:
      'Situated in the car-free mountain village of Zermatt, The Highland Alpine Retreat marries timeless Swiss chalet craftsmanship with five-star luxury. Built with local larch wood, granite stone, and warm cashmere textiles, it offers an intimate, cozy refuge after an exhilarating day on the ski slopes.',
    roomDetails: {
      type: 'Alpine Matterhorn Chalet',
      bedType: '1 Swiss Pine King Bed',
      capacity: 'Up to 3 Guests',
      size: '110 m² (1,180 sq ft)',
      features: [
        'Stone wood-burning fireplace with complimentary seasoned birch wood',
        'Private heated balcony with cedar whirlpool hot tub',
        'Finnish private sauna in-suite',
        'Ski room with boot warmers and equipment tuning',
        'Heated oak hardwood floors throughout',
      ],
    },
    amenities: [
      {
        title: 'Clean & Safe Stay',
        description: 'Swiss Clean & Safe hospitality certified',
        iconName: 'ShieldCheck',
      },
      {
        title: 'Enhanced Cleaning',
        description: 'HEPA air filtration and hypo-allergenic cedar cleaning',
        iconName: 'Sparkles',
      },
      {
        title: 'Excellent Location',
        description: 'Ski-in ski-out access to Sunnegga and Gornergrat',
        iconName: 'MapPin',
      },
      {
        title: 'Smooth Check-In',
        description: 'Electro-taxi luggage transfer from Zermatt Train Station',
        iconName: 'KeyRound',
      },
      {
        title: 'Free High-Speed Wi-Fi',
        description: 'Fiber-optic connectivity throughout chalet',
        iconName: 'Wifi',
      },
      {
        title: 'Heated Pool & Spa',
        description: 'Indoor heated mountain spring pool and Alpine spa',
        iconName: 'Waves',
      },
      {
        title: 'Electro-Taxi Valet',
        description: 'Complimentary village electro-cab service',
        iconName: 'Car',
      },
      {
        title: 'Alpine Restaurant',
        description: 'Gourmet restaurant featuring local Valais wines and raclette',
        iconName: 'UtensilsCrossed',
      },
      {
        title: 'Geothermal Heating',
        description: 'Eco-friendly underfloor radiant heating & climate control',
        iconName: 'Wind',
      },
    ],
    houseRules: {
      checkIn: '15:00 PM onwards',
      checkOut: 'Until 11:00 AM',
      cancellation: 'Free cancellation up to 5 days before arrival.',
      smoking: 'Non-smoking throughout.',
      pets: 'Well-behaved dogs welcomed with Alpine dog beds.',
    },
    locationDetails: {
      neighborhood: 'Winkelmatten, Zermatt',
      distances: [
        { place: 'Matterhorn Glacier Paradise Cable Car', distance: '5 min walk' },
        { place: 'Zermatt Train Station', distance: '8 min by electric taxi' },
        { place: 'Gornergrat Bahn', distance: '8 min by taxi' },
      ],
    },
    reviews: [
      {
        id: 1,
        author: 'Emma Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: 'October 2026',
        comment:
          'Soaking in the outdoor cedar tub with snow falling and the Matterhorn right in front of us was pure perfection. Cozy fireplace, lovely staff, and delicious breakfast.',
      },
    ],
  },
]
