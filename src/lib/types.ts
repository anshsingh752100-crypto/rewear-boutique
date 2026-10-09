export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  displayOrder: number;
  productCount?: number;
}

export interface ProductVariant {
  name: string; // e.g. "Material" or "Strap"
  options: string[]; // e.g. ["18K Yellow Gold", "Platinum", "Rose Gold"]
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  craftsmanship?: string | null;
  materials?: string | null;
  origin?: string | null;
  careInstructions?: string | null;
  price: number;
  originalPrice?: number | null;
  rating: number;
  reviewsCount: number;
  stock: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  images: string[]; // parsed array
  variants?: ProductVariant[] | null;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt?: string;
}

export interface CartItem {
  id: string; // unique item key e.g. productId + selectedVariant
  productId: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  quantity: number;
  selectedVariant?: string;
  maxStock: number;
}

export interface AddressData {
  id?: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface OrderItemData {
  id: string;
  productId?: string | null;
  productName: string;
  productImage?: string | null;
  price: number;
  quantity: number;
  variant?: string | null;
}

export interface OrderData {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  shippingAddress: AddressData;
  billingAddress?: AddressData | null;
  paymentMethod: 'COD' | 'CARD';
  paymentStatus: 'PAID' | 'PENDING';
  status: 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  subtotal: number;
  tax: number;
  shippingFee: number;
  discountAmount: number;
  total: number;
  couponCode?: string | null;
  estimatedDelivery?: string | null;
  notes?: string | null;
  createdAt: string;
  items: OrderItemData[];
}

export interface ReviewItem {
  id: string;
  productId: string;
  userId?: string | null;
  userName: string;
  rating: number;
  title?: string | null;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  productName?: string;
}

export interface CouponItem {
  id: string;
  code: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  timesUsed: number;
  isActive: boolean;
  expiresAt?: string | null;
}

export interface HeroSlide {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}

export interface BrandStoryContent {
  title: string;
  subtitle: string;
  narrative1: string;
  narrative2: string;
  yearEstablished: string;
  image: string;
  quote: string;
  author: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  currencySymbol: string;
  taxRatePercent: number;
  freeShippingThreshold: number;
  shippingFlatRate: number;
  announcementText: string;
  announcementActive: boolean;
}
