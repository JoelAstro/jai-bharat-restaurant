import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ArrowRight, Tag, ShoppingBag, Truck, Store } from 'lucide-react';
import { useCart } from '../../context/CartContext.js';
import { useRestaurant } from '../../context/RestaurantContext.js';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    orderType,
    setOrderType,
    updateQuantity,
    removeItem,
    clearCart,
    appliedCoupon,
    discountPaise,
    couponError,
    applyCoupon,
    removeCoupon,
    subtotalPaise,
    deliveryFeePaise,
    taxPaise,
    totalPaise,
  } = useCart();

  const { formatPrice, settings } = useRestaurant();
  const navigate = useNavigate();
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setIsApplyingCoupon(true);
    await applyCoupon(couponCodeInput.trim().toUpperCase());
    setIsApplyingCoupon(false);
    setCouponCodeInput('');
  };

  const freeDeliveryProgress = Math.min(
    100,
    Math.round((subtotalPaise / settings.free_delivery_threshold_paise) * 100)
  );

  const amountNeededForFreeDelivery = Math.max(
    0,
    settings.free_delivery_threshold_paise - subtotalPaise
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/60 backdrop-blur-xs flex justify-end">
      {/* Background backdrop click handler */}
      <div
        className="fixed inset-0 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full sm:max-w-md bg-[#fdfbf7] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#991b1b]" />
            <h2 className="font-serif font-bold text-base sm:text-lg text-stone-900">Your Order</h2>
            <span className="text-xs bg-red-100 text-[#991b1b] font-bold px-2 py-0.5 rounded-full">
              {items.length} items
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Type Selector (Delivery vs Takeaway) */}
        <div className="p-3 bg-stone-100 border-b border-stone-200 flex gap-2">
          <button
            onClick={() => setOrderType('DELIVERY')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              orderType === 'DELIVERY'
                ? 'bg-white text-[#991b1b] shadow-xs border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Truck className="w-4 h-4 text-[#991b1b]" />
            <span>Home Delivery</span>
          </button>
          <button
            onClick={() => setOrderType('TAKEAWAY')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              orderType === 'TAKEAWAY'
                ? 'bg-white text-[#991b1b] shadow-xs border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Store className="w-4 h-4 text-[#991b1b]" />
            <span>Takeaway Pickup</span>
          </button>
        </div>

        {/* Free Delivery Banner (Delivery mode only) */}
        {orderType === 'DELIVERY' && items.length > 0 && (
          <div className="px-5 py-3 bg-red-50 border-b border-red-200/60 text-xs">
            {amountNeededForFreeDelivery > 0 ? (
              <div>
                <p className="text-stone-900 font-medium mb-1.5">
                  Add <strong className="font-bold">{formatPrice(amountNeededForFreeDelivery)}</strong> more to get <span className="text-emerald-700 font-bold">FREE Delivery</span>!
                </p>
                <div className="w-full bg-red-200/80 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#991b1b] h-full rounded-full transition-all duration-300"
                    style={{ width: `${freeDeliveryProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-emerald-700 font-bold flex items-center gap-1.5">
                <span>🎉</span> You have unlocked FREE Delivery!
              </p>
            )}
          </div>
        )}

        {/* Items List (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3 sm:space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
              <ShoppingBag className="w-16 h-16 stroke-1 text-stone-300 mb-4" />
              <h3 className="font-serif font-bold text-lg text-stone-700 mb-1">Your cart is empty</h3>
              <p className="text-xs text-stone-500 mb-6 max-w-xs">
                Explore delicious curries, biryanis, and tandoori starters from our menu.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/menu');
                }}
                className="bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-medium text-xs px-5 py-2.5 rounded-full shadow-sm"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col gap-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-serif font-bold text-stone-900 text-sm">
                      {item.menuItem.name}
                    </h4>
                    {item.selectedVariation && (
                      <span className="text-xs text-stone-500 block">
                        Size: {item.selectedVariation.name}
                      </span>
                    )}
                    {item.selectedAddons.length > 0 && (
                      <span className="text-xs text-[#991b1b] block">
                        + {item.selectedAddons.map((a) => a.name).join(', ')}
                      </span>
                    )}
                    {item.specialInstructions && (
                      <span className="text-[11px] text-stone-400 italic block">
                        Note: "{item.specialInstructions}"
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-sm text-stone-900">
                    {formatPrice(item.totalPricePaise)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Quantity adjustment */}
                  <div className="flex items-center bg-stone-100 rounded-full px-2 py-0.5 border border-stone-200">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 text-stone-600 hover:text-stone-900"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-stone-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 text-stone-600 hover:text-stone-900"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Area: Coupons, Bill Breakdown, Checkout */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-white space-y-3 sm:space-y-4">
            {/* Promo Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                    <Tag className="w-4 h-4" />
                    <span>Coupon "{appliedCoupon.code}" applied! (-{formatPrice(discountPaise)})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-rose-600 hover:text-rose-700 font-bold text-xs"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    placeholder="Enter Coupon Code (e.g. WELCOME50)"
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-stone-300 focus:outline-hidden focus:border-[#991b1b] font-mono uppercase"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingCoupon || !couponCodeInput.trim()}
                    className="bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-medium text-xs px-4 py-2 rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{couponError}</p>
              )}
            </div>

            {/* Bill Summary */}
            <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-100 pt-3">
              <div className="flex justify-between">
                <span>Item Subtotal</span>
                <span>{formatPrice(subtotalPaise)}</span>
              </div>
              {discountPaise > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(discountPaise)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST Taxes ({settings.tax_rate_percent}%)</span>
                <span>{formatPrice(taxPaise)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span>
                  {deliveryFeePaise === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase text-[11px]">FREE</span>
                  ) : (
                    formatPrice(deliveryFeePaise)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-stone-900 font-bold text-sm pt-2 border-t border-stone-200">
                <span>To Pay</span>
                <span>{formatPrice(totalPaise)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                navigate('/checkout');
              }}
              className="w-full flex items-center justify-between bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-bold py-3.5 px-5 rounded-2xl shadow-md hover:shadow-lg transition-all"
            >
              <span>Proceed to Checkout</span>
              <div className="flex items-center gap-1.5">
                <span>{formatPrice(totalPaise)}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
