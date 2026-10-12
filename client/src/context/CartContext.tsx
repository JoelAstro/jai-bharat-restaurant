import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem, ItemVariation, ItemAddon, Coupon } from '../types/index.js';
import { useRestaurant } from './RestaurantContext.js';
import { api } from '../services/api.js';

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  orderType: 'DELIVERY' | 'TAKEAWAY';
  setOrderType: (type: 'DELIVERY' | 'TAKEAWAY') => void;
  appliedCoupon: Coupon | null;
  discountPaise: number;
  couponError: string | null;
  addItem: (
    menuItem: MenuItem,
    quantity?: number,
    variation?: ItemVariation,
    addons?: ItemAddon[],
    specialInstructions?: string
  ) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  subtotalPaise: number;
  deliveryFeePaise: number;
  taxPaise: number;
  totalPaise: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useRestaurant();
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('jb_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [orderType, setOrderType] = useState<'DELIVERY' | 'TAKEAWAY'>('DELIVERY');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discountPaise, setDiscountPaise] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('jb_cart', JSON.stringify(items));
  }, [items]);

  // Subtotal calculation
  const subtotalPaise = items.reduce((sum, item) => sum + item.totalPricePaise, 0);

  // Delivery fee calculation
  const deliveryFeePaise =
    orderType === 'DELIVERY'
      ? subtotalPaise >= settings.free_delivery_threshold_paise
        ? 0
        : settings.delivery_fee_paise
      : 0;

  // Re-verify coupon whenever subtotal changes
  useEffect(() => {
    if (appliedCoupon && subtotalPaise > 0) {
      api
        .validateCoupon(appliedCoupon.code, subtotalPaise)
        .then((res) => {
          setDiscountPaise(res.discountPaise);
          setCouponError(null);
        })
        .catch((err) => {
          setCouponError(err.message);
          setAppliedCoupon(null);
          setDiscountPaise(0);
        });
    } else if (subtotalPaise === 0) {
      setAppliedCoupon(null);
      setDiscountPaise(0);
      setCouponError(null);
    }
  }, [subtotalPaise]);

  // Tax calculation
  const taxableAmountPaise = Math.max(0, subtotalPaise - discountPaise);
  const taxPaise = Math.round((taxableAmountPaise * settings.tax_rate_percent) / 100);

  // Final Total
  const totalPaise = taxableAmountPaise + taxPaise + deliveryFeePaise;

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = (
    menuItem: MenuItem,
    quantity = 1,
    variation?: ItemVariation,
    addons: ItemAddon[] = [],
    specialInstructions?: string
  ) => {
    const unitPrice = variation ? variation.price : menuItem.price;
    const addonsTotal = addons.reduce((sum, a) => sum + a.price, 0);
    const itemUnitPrice = unitPrice + addonsTotal;

    // Generate deterministic cart entry key based on variations and add-ons
    const addonIdsKey = addons.map((a) => a.id).sort().join('_');
    const cartItemId = `${menuItem.id}_${variation?.id || 'none'}_${addonIdsKey}`;

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPricePaise: itemUnitPrice * newQty,
        };
        return updated;
      }

      return [
        ...prev,
        {
          id: cartItemId,
          menuItem,
          selectedVariation: variation,
          selectedAddons: addons,
          specialInstructions,
          quantity,
          unitPricePaise: itemUnitPrice,
          totalPricePaise: itemUnitPrice * quantity,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPricePaise: item.unitPricePaise * newQty,
            };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setDiscountPaise(0);
    setCouponError(null);
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    try {
      setCouponError(null);
      const res = await api.validateCoupon(code, subtotalPaise);
      setAppliedCoupon(res.coupon);
      setDiscountPaise(res.discountPaise);
      return true;
    } catch (err: any) {
      setCouponError(err.message || 'Invalid coupon');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountPaise(0);
    setCouponError(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        setIsCartOpen,
        orderType,
        setOrderType,
        appliedCoupon,
        discountPaise,
        couponError,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
        subtotalPaise,
        deliveryFeePaise,
        taxPaise,
        totalPaise,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
