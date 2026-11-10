import { IMAGES } from './images'

export const FEATURED_HOTELS = [
  {
    id: 1,
    name: 'Grand Azure Horizon Villa',
    location: 'North Malé Atoll, Maldives',
    rating: 4.9,
    price: 340,
    isBestSeller: true,
    image: IMAGES.hotels.grandAzure,
  },
  {
    id: 2,
    name: 'The Royal Serenity Palace',
    location: 'Paris, France',
    rating: 4.8,
    price: 420,
    isBestSeller: true,
    image: IMAGES.hotels.royalPalace,
  },
  {
    id: 3,
    name: 'Amanpuri Coastal Haven',
    location: 'Bali, Indonesia',
    rating: 4.7,
    price: 260,
    isBestSeller: false,
    image: IMAGES.hotels.amanpuriHaven,
  },
  {
    id: 4,
    name: 'The Highland Alpine Retreat',
    location: 'Zermatt, Switzerland',
    rating: 4.9,
    price: 380,
    isBestSeller: false,
    image: IMAGES.hotels.alpineRetreat,
  },
]

