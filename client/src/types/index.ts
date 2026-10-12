export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export interface Address {
  id: string;
  userId?: string;
  label: string;
  street: string;
  area?: string;
  city: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  imageUrl?: string;
  _count?: {
    items: number;
  };
}

export interface ItemVariation {
  id: string;
  menuItemId?: string;
  name: string;
  price: number; // in paise
}

export interface ItemAddon {
  id: string;
  menuItemId?: string;
  name: string;
  price: number; // in paise
}

export interface MenuItem {
  id: string;
  categoryId: string;
  category?: { id: string; name: string; slug: string };
  name: string;
  description: string;
  price: number; // in paise
  isVeg: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  imageUrl?: string;
  variations: ItemVariation[];
  addons: ItemAddon[];
}

export interface CartItem {
  id: string; // unique cart entry ID
  menuItem: MenuItem;
  selectedVariation?: ItemVariation;
  selectedAddons: ItemAddon[];
  specialInstructions?: string;
  quantity: number;
  unitPricePaise: number;
  totalPricePaise: number;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'COMPLETED'
  | 'CANCELLED';

export type PaymentMethod = 'RAZORPAY' | 'COD';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type OrderType = 'DELIVERY' | 'TAKEAWAY';

export interface OrderItemAddon {
  id: string;
  addonName: string;
  priceSnapshot: number;
}

export interface OrderItem {
  id: string;
  menuItemId?: string;
  itemName: string;
  variationName?: string;
  priceSnapshot: number;
  quantity: number;
  subtotal: number;
  addons: OrderItemAddon[];
}

export interface OrderStatusHistory {
  id: string;
  status: OrderStatus;
  note?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  orderType: OrderType;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: number; // in paise
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  couponCode?: string;
  specialInstructions?: string;
  deliveryAddressSnapshot?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  statusHistory: OrderStatusHistory[];
}

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  expiresAt?: string;
  usageLimit?: number;
  timesUsed: number;
  isActive: boolean;
}

export interface PublicRestaurantSettings {
  restaurant_name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  operating_hours: string;
  tax_rate_percent: number;
  delivery_fee_paise: number;
  free_delivery_threshold_paise: number;
  delivery_enabled: boolean;
  takeaway_enabled: boolean;
  cod_enabled: boolean;
  razorpay_enabled: boolean;
  currency_symbol: string;
}
