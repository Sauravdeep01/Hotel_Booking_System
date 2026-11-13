import { FEATURED_HOTELS } from '../constants/hotels'

// Centralized API configuration using VITE_API_URL
const rawUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000'

const cleanUrl = rawUrl.replace(/\/+$/, '')
export const API_BASE_URL = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`
export const HOTELS_API_URL = `${API_BASE_URL}/hotels`

// Format location object into a display string
export const formatLocation = (loc) => {
  if (!loc) return ''
  if (typeof loc === 'string') return loc
  if (typeof loc === 'object') {
    const parts = [loc.city, loc.country].filter(Boolean)
    if (parts.length > 0) return parts.join(', ')
    return loc.address || ''
  }
  return ''
}

// Normalize hotel object from MongoDB API with UI fallback templates
export const normalizeHotel = (apiHotel) => {
  if (!apiHotel) return null

  const template =
    FEATURED_HOTELS.find(
      (h) => h.name?.toLowerCase().trim() === apiHotel.name?.toLowerCase().trim()
    ) || {}

  const locationStr = formatLocation(apiHotel.location) || template.location || ''
  const fullAddress =
    (typeof apiHotel.location === 'object' && apiHotel.location?.address) ||
    template.fullAddress ||
    locationStr

  const FALLBACK_IMAGE = 'https://res.cloudinary.com/demo/image/upload/pool.jpg'

  const rawImages =
    Array.isArray(apiHotel.images) && apiHotel.images.length > 0
      ? apiHotel.images
      : apiHotel.image
        ? [apiHotel.image]
        : apiHotel.img
          ? [apiHotel.img]
          : template.gallery || (template.image ? [template.image] : [])

  const images = (Array.isArray(rawImages) ? rawImages : [rawImages])
    .map((item) => {
      const url = typeof item === 'string' ? item.trim() : item?.secure_url || item?.url || ''
      return url.replace(/^http:\/\//i, 'https://')
    })
    .filter(Boolean)

  const primaryImage = images[0] || template.image || FALLBACK_IMAGE

  let normalizedAmenities = template.amenities || []
  if (Array.isArray(apiHotel.amenities) && apiHotel.amenities.length > 0) {
    normalizedAmenities = apiHotel.amenities.map((item) => {
      if (typeof item === 'string') {
        const matched = (template.amenities || []).find(
          (a) => a.title?.toLowerCase() === item.toLowerCase()
        )
        return (
          matched || {
            title: item,
            description: 'Included complimentary luxury amenity for verified guests',
            iconName: 'Sparkles',
          }
        )
      }
      return item
    })
  }

  const hotelRating =
    typeof apiHotel.rating === 'number' && apiHotel.rating > 0
      ? apiHotel.rating
      : template.rating || 4.8

  const countReviews =
    typeof apiHotel.reviewCount === 'number'
      ? apiHotel.reviewCount
      : template.reviewsCount || 100

  const roomTypes =
    Array.isArray(apiHotel.roomTypes) && apiHotel.roomTypes.length > 0
      ? apiHotel.roomTypes.map((rt) => {
          const rawImgs =
            Array.isArray(rt.images) && rt.images.length > 0 ? rt.images : images
          const sanitizedImgs = rawImgs
            .map((img) => (typeof img === 'string' ? img.replace(/^http:\/\//i, 'https://') : ''))
            .filter(Boolean)

          return {
            ...rt,
            roomType: rt.roomType || rt.name || 'Double Bed',
            name: rt.name || rt.roomType || 'Deluxe Suite',
            images: sanitizedImgs.length > 0 ? sanitizedImgs : [primaryImage],
            price: typeof rt.price === 'number' && rt.price > 0 ? rt.price : 350,
            capacity: typeof rt.capacity === 'number' && rt.capacity > 0 ? rt.capacity : 2,
            bedConfiguration: rt.bedConfiguration || '1 King Bed',
            amenities:
              Array.isArray(rt.amenities) && rt.amenities.length > 0
                ? rt.amenities
                : ['Free High-Speed Wi-Fi', 'Ensuite Bathroom', 'Air Conditioning'],
            shortDescription: rt.shortDescription || '',
          }
        })
      : [
          {
            roomType: 'Single Bed',
            name: 'Solo Explorer Room',
            images: [primaryImage],
            price: typeof apiHotel.price === 'number' && apiHotel.price > 0 ? apiHotel.price : 350,
            capacity: 1,
            bedConfiguration: '1 Queen Bed',
            amenities: ['Free High-Speed Wi-Fi', 'Private Bathroom', 'Air Conditioning'],
            shortDescription: 'Ideal for solo luxury travelers seeking peaceful comfort.',
          },
          {
            roomType: 'Double Bed',
            name: 'Deluxe Horizon Suite',
            images: [images[1] || primaryImage],
            price: Math.round(
              (typeof apiHotel.price === 'number' && apiHotel.price > 0 ? apiHotel.price : 350) *
                1.5
            ),
            capacity: 2,
            bedConfiguration: '1 King Bed',
            amenities: ['King Bed', 'Room Service', 'Balcony View', 'Free Wi-Fi'],
            shortDescription: 'Spacious suite designed for couples with private balcony vistas.',
          },
          {
            roomType: 'Luxury Room',
            name: 'Panoramic Plunge Suite',
            images: [primaryImage],
            price: Math.round(
              (typeof apiHotel.price === 'number' && apiHotel.price > 0 ? apiHotel.price : 350) *
                2.5
            ),
            capacity: 3,
            bedConfiguration: '1 King Bed + 1 Daybed',
            amenities: ['Panoramic View', 'Jacuzzi Plunge Tub', 'Butler Service'],
            shortDescription: 'Top-tier luxury residence featuring plunge pool and bespoke butler service.',
          },
          {
            roomType: 'Family Suite',
            name: 'Royal Multi-Bedroom Villa',
            images: [images[1] || primaryImage],
            price: Math.round(
              (typeof apiHotel.price === 'number' && apiHotel.price > 0 ? apiHotel.price : 350) * 4
            ),
            capacity: 5,
            bedConfiguration: '2 King Beds + 1 Rollaway',
            amenities: ['2 Master Bedrooms', 'Private Pool', 'Dedicated Host'],
            shortDescription: 'Expansive family residence with dual bedrooms and private dining.',
          },
        ]

  const startingPrice =
    typeof apiHotel.price === 'number' && apiHotel.price > 0
      ? apiHotel.price
      : roomTypes.length > 0
        ? Math.min(...roomTypes.map((r) => r.price).filter((p) => typeof p === 'number' && p > 0))
        : template.price || 350

  return {
    ...template,
    ...apiHotel,
    id: apiHotel._id || apiHotel.id || template.id,
    _id: apiHotel._id || apiHotel.id,
    name: apiHotel.name || template.name,
    description: apiHotel.description || template.about || template.shortDescription || '',
    shortDescription:
      apiHotel.description || template.shortDescription || apiHotel.name,
    about: apiHotel.description || template.about || '',
    city:
      (typeof apiHotel.location === 'object' && apiHotel.location?.city) ||
      apiHotel.city ||
      locationStr.split(',')?.[0]?.trim() ||
      '',
    country:
      (typeof apiHotel.location === 'object' && apiHotel.location?.country) ||
      apiHotel.country ||
      locationStr.split(',')?.[1]?.trim() ||
      '',
    location: locationStr,
    fullAddress,
    starRating: apiHotel.starRating || template.starRating || 5,
    rating: hotelRating,
    reviewCount: countReviews,
    reviewsCount: countReviews,
    price: startingPrice,
    roomTypes,
    isFeatured: apiHotel.isFeatured ?? template.isFeatured ?? false,
    isBestSeller: apiHotel.isFeatured ?? template.isBestSeller ?? false,
    image: primaryImage,
    images,
    gallery: images.length > 1 ? images : (template.gallery || images),
    amenities: normalizedAmenities,
    facilityHighlights: template.facilityHighlights || [
      {
        title: '24/7 Room Service',
        description: 'Bespoke private dining and concierge anytime',
        iconName: 'BellRing',
      },
      {
        title: 'Panoramic View',
        description: '180° uninterrupted panoramic views of nature',
        iconName: 'Waves',
      },
      {
        title: 'Private Pool Access',
        description: 'Freshwater infinity pool with submerged sun loungers',
        iconName: 'Sparkles',
      },
    ],
    roomDetails: template.roomDetails || {
      type: 'Executive Luxury Suite',
      bedType: '1 King Bed + 1 Premium Daybed',
      capacity: 'Up to 3 Guests',
      size: '150 m² (1,615 sq ft)',
      features: [
        'Private panoramic balcony',
        'Freestanding marble soaking tub',
        'Complimentary gourmet minibar',
        'Bang & Olufsen acoustic surround system',
      ],
    },
    houseRules: template.houseRules || {
      checkIn: '3:00 PM',
      checkOut: '12:00 PM',
      cancellation: 'Free cancellation up to 48 hours prior to arrival',
    },
    reviews: template.reviews || [],
  }
}

// Fetch all active hotels from backend API
export const getAllHotels = async () => {
  const response = await fetch(HOTELS_API_URL)
  if (!response.ok) {
    throw new Error(`Failed to fetch hotels from server (${response.status})`)
  }
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message || 'Server returned unsuccessful response')
  }

  return {
    ...result,
    data: (result.data || []).map(normalizeHotel),
  }
}

// Fetch featured hotels from backend API
export const getFeaturedHotels = async () => {
  const response = await fetch(`${HOTELS_API_URL}/featured`)
  if (!response.ok) {
    throw new Error(`Failed to fetch featured hotels from server (${response.status})`)
  }
  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message || 'Server returned unsuccessful response')
  }

  return {
    ...result,
    data: (result.data || []).map(normalizeHotel),
  }
}

// Fetch single hotel details by its MongoDB ID
export const getHotelById = async (id) => {
  if (!id) return { success: false, message: 'Hotel ID is required', data: null }

  const response = await fetch(`${HOTELS_API_URL}/${id}`)
  const result = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 400 || response.status === 404) {
      return {
        success: false,
        status: response.status,
        message:
          result?.message ||
          (response.status === 400 ? 'Invalid hotel ID format' : 'Hotel not found'),
        data: null,
      }
    }
    throw new Error(result?.message || `Failed to fetch hotel details (${response.status})`)
  }

  if (!result || !result.success || !result.data) {
    return {
      success: false,
      status: response.status,
      message: result?.message || 'Hotel not found',
      data: null,
    }
  }

  return {
    ...result,
    data: normalizeHotel(result.data),
  }
}

// Fetch unique destination cities from active hotels in MongoDB
export const getUniqueDestinations = async () => {
  try {
    const res = await getAllHotels()
    const hotels = res.data || []
    const citiesSet = new Set()

    hotels.forEach((hotel) => {
      if (hotel.city && typeof hotel.city === 'string' && hotel.city.trim()) {
        citiesSet.add(hotel.city.trim())
      } else if (hotel.location) {
        if (typeof hotel.location === 'object' && hotel.location.city) {
          citiesSet.add(hotel.location.city.trim())
        } else if (typeof hotel.location === 'string') {
          const cityPart = hotel.location.split(',')[0]?.trim()
          if (cityPart) citiesSet.add(cityPart)
        }
      }
    })

    const sortedCities = Array.from(citiesSet).filter(Boolean).sort((a, b) => a.localeCompare(b))
    if (sortedCities.length > 0) {
      return sortedCities
    }
  } catch (err) {
    console.warn('Failed to fetch destinations dynamically from MongoDB, using fallback', err)
  }

  // Graceful fallback from FEATURED_HOTELS if API is down or empty
  const fallbackSet = new Set(
    FEATURED_HOTELS.map((h) => h.location?.split(',')?.[0]?.trim()).filter(Boolean)
  )
  return Array.from(fallbackSet).sort((a, b) => a.localeCompare(b))
}

