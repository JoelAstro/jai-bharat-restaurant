import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Truck,
  Store,
  CreditCard,
  Banknote,
  MapPin,
  Plus,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '../../context/CartContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { useRestaurant } from '../../context/RestaurantContext.js';
import { Address } from '../../types/index.js';
import { api } from '../../services/api.js';

export const CheckoutPage: React.FC = () => {
  const {
    items,
    orderType,
    setOrderType,
    appliedCoupon,
    discountPaise,
    subtotalPaise,
    deliveryFeePaise,
    taxPaise,
    totalPaise,
    clearCart,
  } = useCart();

  const { user } = useAuth();
  const { formatPrice, settings } = useRestaurant();
  const navigate = useNavigate();

  // Contact State
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Delivery Address State
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    street: '',
    area: '',
    city: settings.city || 'Bengaluru',
    pincode: '',
    landmark: '',
  });

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'COD'>('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerPhone && user.phone) setCustomerPhone(user.phone);
      if (!customerEmail) setCustomerEmail(user.email);

      api.getAddresses().then((addrs) => {
        setSavedAddresses(addrs);
        const defaultAddr = addrs.find((a) => a.isDefault) || addrs[0];
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
        else setIsAddingNewAddress(true);
      }).catch(() => {});
    } else {
      setIsAddingNewAddress(true);
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <ShoppingBag className="w-16 h-16 text-stone-300 mb-4" />
        <h2 className="text-2xl font-serif font-bold text-stone-800 mb-2">
          Your cart is currently empty
        </h2>
        <p className="text-stone-500 text-sm mb-6">
          Add some delicious dishes to proceed with your order.
        </p>
        <Link
          to="/menu"
          className="bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-semibold text-sm px-6 py-3 rounded-full"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!customerPhone.trim() || !/^[0-9]{10}$/.test(customerPhone.trim())) {
      setErrorMessage('Please provide a valid 10-digit mobile number.');
      return;
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (orderType === 'DELIVERY') {
      if (!selectedAddressId && (!newAddress.street.trim() || !newAddress.pincode.trim())) {
        setErrorMessage('Please provide a complete delivery street and PIN code.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // 1. Prepare items payload for backend calculation & validation
      const itemsPayload = items.map((i) => ({
        menuItemId: i.menuItem.id,
        variationId: i.selectedVariation?.id,
        addonIds: i.selectedAddons.map((a) => a.id),
        quantity: i.quantity,
      }));

      // 2. Prepare order payload
      const orderPayload: any = {
        items: itemsPayload,
        orderType,
        paymentMethod,
        couponCode: appliedCoupon?.code,
        specialInstructions,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
      };

      if (orderType === 'DELIVERY') {
        if (selectedAddressId) {
          orderPayload.addressId = selectedAddressId;
        } else {
          orderPayload.guestAddress = newAddress;
        }
      }

      // 3. Create order on backend
      const createdOrder = await api.createOrder(orderPayload);

      // 4. If Online Payment selected, handle gateway / dev simulation
      if (paymentMethod === 'RAZORPAY') {
        const paymentOrder = await api.createPaymentOrder(createdOrder.id);

        if (paymentOrder.isSimulated) {
          // Development test simulation
          const mockPaymentId = `pay_mock_${Date.now()}`;
          await api.verifyPayment({
            orderId: createdOrder.id,
            razorpayOrderId: paymentOrder.razorpayOrderId,
            razorpayPaymentId: mockPaymentId,
            razorpaySignature: 'simulated_valid_signature',
          });
        } else {
          // Live Razorpay popup (if razorpay window script loaded)
          // For now, redirect to tracking where customer can view payment status
        }
      }

      try {
        const recentOrders = JSON.parse(localStorage.getItem('jb_recent_orders') || '[]');
        if (!recentOrders.includes(createdOrder.id)) {
          recentOrders.unshift(createdOrder.id);
          localStorage.setItem('jb_recent_orders', JSON.stringify(recentOrders.slice(0, 15)));
        }
      } catch {}

      clearCart();
      navigate(`/orders/${createdOrder.id}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order. Please check inputs.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 mb-8">
          Complete Your Order
        </h1>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Left Column: Form Details (8 Cols) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            {/* 1. Order Type Selection */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-xs">
              <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg mb-3 sm:mb-4">
                1. Order Preference
              </h3>
              <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => setOrderType('DELIVERY')}
                  className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all ${
                    orderType === 'DELIVERY'
                      ? 'border-[#991b1b] bg-red-50/50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <Truck className="w-5 h-5 text-[#991b1b] mb-2" />
                  <span className="font-bold text-sm block text-stone-900">Home Delivery</span>
                  <span className="text-xs text-stone-500">Delivered hot to your door</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('TAKEAWAY')}
                  className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all ${
                    orderType === 'TAKEAWAY'
                      ? 'border-[#991b1b] bg-red-50/50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <Store className="w-5 h-5 text-[#991b1b] mb-2" />
                  <span className="font-bold text-sm block text-stone-900">Takeaway Pickup</span>
                  <span className="text-xs text-stone-500">Collect directly from restaurant</span>
                </button>
              </div>
            </div>

            {/* 2. Customer Contact Information */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-xs">
              <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg mb-3 sm:mb-4">
                2. Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Rohan Sharma"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#991b1b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Mobile Number (10 digits) *
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#991b1b]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address (for order receipts) *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="rohan@example.com"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#991b1b]"
                  />
                </div>
              </div>
            </div>

            {/* 3. Delivery Address (Delivery only) */}
            {orderType === 'DELIVERY' && (
              <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg">
                    3. Delivery Destination
                  </h3>
                  {savedAddresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
                      className="text-xs text-[#991b1b] font-semibold hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAddingNewAddress ? 'Use Saved Address' : 'Add New Address'}</span>
                    </button>
                  )}
                </div>

                {!isAddingNewAddress && savedAddresses.length > 0 ? (
                  <div className="space-y-3">
                    {savedAddresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          selectedAddressId === addr.id
                            ? 'border-[#991b1b] bg-red-50/40 text-stone-900'
                            : 'border-stone-200 hover:border-stone-300 text-stone-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-1 text-[#991b1b] focus:ring-red-500"
                        />
                        <div className="flex-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#991b1b] bg-red-100 px-2 py-0.5 rounded-md">
                            {addr.label}
                          </span>
                          <p className="text-xs sm:text-sm text-stone-800 mt-1">
                            {addr.street}, {addr.area ? `${addr.area}, ` : ''}{addr.city} — {addr.pincode}
                          </p>
                          {addr.landmark && (
                            <p className="text-[11px] text-stone-500 italic mt-0.5">
                              Landmark: {addr.landmark}
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Street Address / Flat / Building *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        placeholder="e.g. Flat 302, Green Valley Apartments"
                        className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#991b1b]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Locality / Area
                        </label>
                        <input
                          type="text"
                          value={newAddress.area}
                          onChange={(e) => setNewAddress({ ...newAddress, area: e.target.value })}
                          placeholder="e.g. Indiranagar Sector 2"
                          className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#991b1b]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          placeholder="Bengaluru"
                          className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#991b1b]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          PIN Code (6 digits) *
                        </label>
                        <input
                          type="text"
                          required
                          pattern="[0-9]{6}"
                          value={newAddress.pincode}
                          onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                          placeholder="560038"
                          className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#991b1b]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Nearby Landmark
                        </label>
                        <input
                          type="text"
                          value={newAddress.landmark}
                          onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                          placeholder="Near Metro Station"
                          className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#991b1b]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. Payment Method */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-xs">
              <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg mb-3 sm:mb-4">
                4. Payment Method
              </h3>
              <div className="space-y-3">
                <label
                  onClick={() => setPaymentMethod('COD')}
                  className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-[#991b1b] bg-red-50/40 text-stone-900'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Banknote className="w-5 h-5 text-[#991b1b]" />
                    <div>
                      <span className="text-sm font-bold block">Cash on Delivery (COD)</span>
                      <span className="text-xs text-stone-500">
                        Pay with cash or UPI QR scan upon food arrival
                      </span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="text-[#991b1b] focus:ring-red-500"
                  />
                </label>

                <label
                  onClick={() => setPaymentMethod('RAZORPAY')}
                  className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'RAZORPAY'
                      ? 'border-[#991b1b] bg-red-50/40 text-stone-900'
                      : 'border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-[#991b1b]" />
                    <div>
                      <span className="text-sm font-bold block">Online Payment (Razorpay)</span>
                      <span className="text-xs text-stone-500">
                        UPI, Google Pay, PhonePe, Cards, NetBanking
                      </span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'RAZORPAY'}
                    onChange={() => setPaymentMethod('RAZORPAY')}
                    className="text-[#991b1b] focus:ring-red-500"
                  />
                </label>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-xs">
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                Order Delivery Notes or Requests (Optional)
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Ring the bell twice, keep it less spicy..."
                rows={2}
                maxLength={200}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#991b1b] resize-none"
              />
            </div>
          </div>

          {/* Right Column: Order Summary (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-xs space-y-4 sm:space-y-6">
              <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg border-b border-stone-100 pb-3">
                Order Summary ({items.length} items)
              </h3>

              {/* Items List */}
              <div className="max-h-64 overflow-y-auto divide-y divide-stone-100 pr-1 space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 flex justify-between gap-3 text-xs">
                    <div>
                      <p className="font-bold text-stone-800">
                        {item.quantity}x {item.menuItem.name}
                      </p>
                      {item.selectedVariation && (
                        <p className="text-stone-500 text-[11px]">{item.selectedVariation.name}</p>
                      )}
                      {item.selectedAddons.length > 0 && (
                        <p className="text-[#991b1b] text-[11px]">
                          +{item.selectedAddons.map((a) => a.name).join(', ')}
                        </p>
                      )}
                    </div>
                    <span className="font-semibold text-stone-900 shrink-0">
                      {formatPrice(item.totalPricePaise)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotalPaise)}</span>
                </div>
                {discountPaise > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-{formatPrice(discountPaise)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST ({settings.tax_rate_percent}%)</span>
                  <span>{formatPrice(taxPaise)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>
                    {deliveryFeePaise === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase text-[11px]">FREE</span>
                    ) : (
                      formatPrice(deliveryFeePaise)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-stone-900 pt-3 border-t border-stone-200">
                  <span>Total Amount</span>
                  <span>{formatPrice(totalPaise)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#991b1b] hover:bg-[#7f1d1d] disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-md hover:shadow-lg transition-all"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Placing Your Order...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Place Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Safe & Contactless Ordering Guarantee</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
