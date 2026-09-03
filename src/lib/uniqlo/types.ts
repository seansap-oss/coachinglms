export type UniqloCategory = {
  id: string;
  slug: string;
  name: string;
  gender: 'WOMEN' | 'MEN' | 'KIDS' | 'BABY' | 'UNISEX';
  image?: string;
  sortOrder: number;
  isActive: boolean;
};

export type UniqloProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  categoryId: string;
  subcategory?: string;
  gender: 'WOMEN' | 'MEN' | 'KIDS' | 'BABY' | 'UNISEX';
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  images: string[];
  colors: { name: string; hex: string; image?: string }[];
  sizes: string[];
  inStock: boolean;
  available: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: number;
  updatedAt: number;
};

export type HeroSection = {
  id: string;
  type: 'image' | 'video';
  src: string;
  poster?: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaLink?: string;
  alignment?: 'left' | 'center' | 'right';
  overlayOpacity?: number;
  isActive: boolean;
};

export type HeroLayer = {
  id: string;
  type: 'image' | 'video';
  src: string;
  poster?: string;
  duration?: number; // seconds to show (image) or override (video, 0 = use video duration)
  enabled: boolean;
  sortOrder: number;
};

export type TickerConfig = {
  enabled: boolean;
  text: string;
  speed: number; // seconds
  bgColor: string;
  textColor: string;
  link?: string;
};

export type Coupon = {
  id: string;
  code: string;
  type: 'percent' | 'fixed' | 'free_shipping';
  value: number;
  minBasket?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  applicableCategoryIds?: string[];
  description?: string;
};

export type UniqloCartItem = {
  product: UniqloProduct;
  quantity: number;
  size?: string;
  color?: string;
};

export type UniqloOrder = {
  id: string;
  orderNumber: string;
  username?: string;
  items: UniqloCartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode?: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'card' | 'paypal' | 'cod';
  shippingAddress?: string;
  createdAt: number;
};

export type UniqloSectionImage = {
  id: string;
  title: string;
  image: string;
  link: string;
  sortOrder: number;
  isActive: boolean;
};
