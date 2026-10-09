import { HeroSlide, BrandStoryContent, StoreSettings } from './types';

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: '1',
    tag: 'WEDDING COUTURE 2026',
    title: 'Wear The Dream, Skip The Price',
    subtitle: 'Rent authentic designer bridal lehengas, royal sherwanis, and red-carpet gowns starting at ₹1,499. Custom altered to your measurements with complimentary dry cleaning.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=2000&auto=format&fit=crop',
    ctaText: 'Explore Wedding Wear',
    ctaLink: '/catalog?category=bridal-lehengas',
  },
  {
    id: '2',
    tag: 'ROYAL GROOM COLLECTION',
    title: 'Majestic Heritage Sherwanis',
    subtitle: 'Hand-embroidered zardozi, raw silk bandhgalas, and jodhpuri suits for grooms and baraatis. Rent iconic royalty without wardrobe commitment.',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=2000&auto=format&fit=crop',
    ctaText: 'Discover Groom Wear',
    ctaLink: '/catalog?category=groom-sherwanis',
  },
  {
    id: '3',
    tag: 'COCKTAIL & RECEPTION GOWNS',
    title: 'Glamour Reimagined',
    subtitle: 'Scintillating sequin trails, structured corset silhouettes, and organza drapery for sangeet nights and reception galas.',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2000&auto=format&fit=crop',
    ctaText: 'View Evening Gowns',
    ctaLink: '/catalog?category=cocktail-gowns',
  },
];

export const DEFAULT_BRAND_STORY: BrandStoryContent = {
  title: 'The Smart, Sustainable Way to Celebrate',
  subtitle: 'REWEAR COUTURE PHILOSOPHY',
  narrative1: 'Special occasions like weddings happen once in a lifetime, but that does not mean a ₹1,50,000 designer lehenga should sit in a closet forever. At ReWear, we believe in democratizing high-end fashion with seamless, hygienic luxury rentals.',
  narrative2: 'Every outfit is sanitized with hospital-grade eco-friendly dry cleaning, customized to your exact bust/waist/length measurements by master tailors, and delivered to your doorstep 2 days before your big celebration.',
  yearEstablished: '2024',
  image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600&auto=format&fit=crop',
  quote: '"Why purchase what you will only wear once? ReWear allows you to turn heads at every wedding with a brand new designer silhouette."',
  author: 'Ananya Singhania, Founder & Creative Director',
};

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'ReWear',
  tagline: 'Luxury Occasion & Wedding Wear Rentals',
  contactEmail: 'care@rewear.in',
  contactPhone: '+91 (800) 420-7890',
  address: 'Indiranagar 100ft Road, Bengaluru & Bandra West, Mumbai',
  currencySymbol: '₹',
  taxRatePercent: 12.0,
  freeShippingThreshold: 3000,
  shippingFlatRate: 250,
  announcementText: '✨ Free Custom Alterations, Doorstep Delivery & Return Dry Cleaning across all Wedding Bookings in India',
  announcementActive: true,
};

export const TRUST_PRESS = [
  { name: 'VOGUE INDIA', quote: '"ReWear is redefining the big fat Indian wedding wardrobe."' },
  { name: 'GQ INDIA', quote: '"The premier grooming destination for wedding guests and grooms."' },
  { name: 'HARPER’S BAZAAR', quote: '"Sustainable bridal elegance without financial excess."' },
  { name: 'ELLE', quote: '"Flawlessly fitted designer lehengas delivered to your hotel door."' },
  { name: 'FORBES INDIA', quote: '"The future of circular occasionwear retail in India."' },
];
