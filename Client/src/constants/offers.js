import { IMAGES } from './images'

export const EXCLUSIVE_OFFERS = [
  {
    id: 1,
    title: 'Summer Escape Package',
    discount: '25% OFF',
    description: 'Enjoy a complimentary night and daily breakfast.',
    expiry: 'Aug 31',
    image: IMAGES.offers.summerEscape,
    link: '/offers/summer-escape',
  },
  {
    id: 2,
    title: 'Romantic Getaway',
    discount: '20% OFF',
    description: 'Special couples package including spa treatment.',
    expiry: 'Sep 20',
    image: IMAGES.offers.romanticGetaway,
    link: '/offers/romantic-getaway',
  },
  {
    id: 3,
    title: 'Luxury Retreat',
    discount: '30% OFF',
    description: 'Book 60 days in advance and save on your stay at any of our luxury properties worldwide.',
    expiry: 'Sep 25',
    image: IMAGES.offers.luxuryRetreat,
    link: '/offers/luxury-retreat',
  },
]

