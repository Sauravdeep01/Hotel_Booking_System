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
    location: locationStr,
    fullAddress,
    starRating: apiHotel.starRating || template.starRating || 5,
    rating: hotelRating,
    reviewCount: countReviews,
    reviewsCount: countReviews,
    price: template.price || 350,
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
  if (!id) return { success: false, data: null }

  const response = await fetch(`${HOTELS_API_URL}/${id}`)
  if (!response.ok) {
    if (response.status === 404 || response.status === 400) {
      return { success: false, data: null }
    }
    throw new Error(`Failed to fetch hotel details (${response.status})`)
  }

  const result = await response.json()
  if (!result.success || !result.data) {
    return { success: false, data: null }
  }

  return {
    ...result,
    data: normalizeHotel(result.data),
  }
}
