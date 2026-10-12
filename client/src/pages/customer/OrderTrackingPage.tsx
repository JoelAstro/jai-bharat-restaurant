import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  ChefHat,
  PackageCheck,
  Bike,
  XCircle,
  RefreshCw,
  Phone,
  MapPin,
  ArrowLeft,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useRestaurant } from '../../context/RestaurantContext.js';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { formatPrice, settings } = useRestaurant();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (showRefresh = false) => {
    if (!id) return;
    if (showRefresh) setIsRefreshing(true);
    try {
      const data = await api.getOrderById(id);
      setOrder(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Could not load order details.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Auto-poll order updates every 8 seconds until completed or cancelled
    const interval = setInterval(() => {
      if (order && (order.status === 'COMPLETED' || order.status === 'CANCELLED')) {
        return;
      }
      fetchOrder(false);
    }, 8000);

    return () => clearInterval(interval);
  }, [id, order?.status]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#991b1b] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-stone-500 text-sm">Retrieving order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <XCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">Order Not Found</h2>
        <p className="text-stone-500 text-sm mb-6 max-w-md">{error}</p>
        <Link
          to="/menu"
          className="bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-semibold text-sm px-6 py-3 rounded-full"
        >
          Return to Menu
        </Link>
      </div>
    );
  }

  // Lifecycle steps definition
  const steps: { status: OrderStatus; label: string; icon: any }[] = [
    { status: 'PENDING', label: 'Order Received', icon: Clock },
    { status: 'CONFIRMED', label: 'Order Confirmed', icon: CheckCircle2 },
    { status: 'PREPARING', label: 'Kitchen Preparing', icon: ChefHat },
    {
      status: 'READY',
      label: order.orderType === 'DELIVERY' ? 'Out for Delivery' : 'Ready for Pickup',
      icon: order.orderType === 'DELIVERY' ? Bike : PackageCheck,
    },
    { status: 'COMPLETED', label: 'Order Delivered', icon: CheckCircle2 },
  ];

  const statusOrder = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED'];
  const currentIndex = statusOrder.indexOf(order.status);
  const isCancelled = order.status === 'CANCELLED';

  let parsedAddress: any = null;
  if (order.deliveryAddressSnapshot) {
    try {
      parsedAddress = JSON.parse(order.deliveryAddressSnapshot);
    } catch {}
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-600 hover:text-[#991b1b] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Orders</span>
          </Link>

          <button
            onClick={() => fetchOrder(true)}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 px-3.5 py-1.5 rounded-full shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Status</span>
          </button>
        </div>

        {/* Tracking Card */}
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden mb-8">
          {/* Header Banner */}
          <div className="bg-stone-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
                  Order Details
                </span>
                <span className="text-stone-500">•</span>
                <span className="text-xs text-stone-400">
                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                #{order.orderNumber}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  order.paymentStatus === 'PAID'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                Payment: {order.paymentStatus} ({order.paymentMethod})
              </span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="p-6 sm:p-10 border-b border-stone-100">
            {isCancelled ? (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
                <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                <div>
                  <h4 className="font-bold">Order Cancelled</h4>
                  <p className="text-xs text-rose-700 mt-0.5">
                    This order was cancelled. If you have questions, please reach out to the restaurant.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-5 relative">
                  {/* Connecting Progress Line */}
                  <div className="absolute top-5 left-0 right-0 h-1 bg-stone-200 z-0">
                    <div
                      className="bg-[#991b1b] h-full transition-all duration-500"
                      style={{
                        width: `${(Math.max(0, currentIndex) / (steps.length - 1)) * 100}%`,
                      }}
                    />
                  </div>

                  {steps.map((step, idx) => {
                    const isDone = currentIndex >= idx;
                    const isCurrent = currentIndex === idx;
                    const Icon = step.icon;

                    return (
                      <div key={step.status} className="flex flex-col items-center text-center relative z-10">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-xs ${
                            isDone
                              ? 'bg-[#991b1b] text-white ring-4 ring-red-100'
                              : 'bg-white border-2 border-stone-300 text-stone-400'
                          } ${isCurrent ? 'scale-110 ring-red-200' : ''}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span
                          className={`text-[10px] sm:text-xs mt-2 font-semibold ${
                            isDone ? 'text-stone-900' : 'text-stone-400'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Status Updates Log */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="p-6 sm:p-8 bg-stone-50 border-b border-stone-100">
              <h3 className="font-serif font-bold text-stone-900 text-base mb-3">
                Status Updates Timeline
              </h3>
              <div className="space-y-3">
                {order.statusHistory.map((hist) => (
                  <div key={hist.id} className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#991b1b] mt-1.5 shrink-0" />
                    <div>
                      <span className="font-bold text-stone-800 uppercase tracking-wider text-[11px]">
                        {hist.status}
                      </span>
                      <span className="text-stone-400 text-[10px] ml-2">
                        {new Date(hist.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {hist.note && <p className="text-stone-600 mt-0.5">{hist.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Details & Items Breakdown */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Ordered Items */}
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-base mb-3">
                Items Ordered
              </h3>
              <div className="divide-y divide-stone-100">
                {order.items.map((item) => (
                  <div key={item.id} className="py-2.5 flex justify-between gap-3 text-xs">
                    <div>
                      <p className="font-bold text-stone-800">
                        {item.quantity}x {item.itemName}
                      </p>
                      {item.variationName && (
                        <p className="text-stone-500 text-[11px]">{item.variationName}</p>
                      )}
                      {item.addons && item.addons.length > 0 && (
                        <p className="text-[#991b1b] text-[11px]">
                          +{item.addons.map((a) => a.addonName).join(', ')}
                        </p>
                      )}
                    </div>
                    <span className="font-semibold text-stone-900">
                      {formatPrice(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price summary */}
              <div className="border-t border-stone-200 mt-4 pt-3 space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span>{order.deliveryFee === 0 ? 'FREE' : formatPrice(order.deliveryFee)}</span>
                </div>
                <div className="flex justify-between font-serif font-bold text-stone-900 text-sm pt-2 border-t border-stone-100">
                  <span>Grand Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Right: Delivery & Customer Info */}
            <div className="space-y-6 text-xs text-stone-600">
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-base mb-3">
                  Customer & Delivery Information
                </h3>
                <p className="font-semibold text-stone-800 text-sm">{order.customerName}</p>
                <p className="text-stone-600">{order.customerPhone}</p>
                <p className="text-stone-500">{order.customerEmail}</p>

                {order.orderType === 'DELIVERY' && parsedAddress && (
                  <div className="mt-4 p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#991b1b] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-800 block">Delivery Address:</strong>
                      <span>
                        {parsedAddress.street}, {parsedAddress.area ? `${parsedAddress.area}, ` : ''}{parsedAddress.city} — {parsedAddress.pincode}
                      </span>
                    </div>
                  </div>
                )}

                {order.specialInstructions && (
                  <div className="mt-3 p-3 bg-red-50 rounded-xl text-stone-900 text-[11px]">
                    <strong>Special Instructions:</strong> {order.specialInstructions}
                  </div>
                )}
              </div>

              {/* Direct Restaurant Contact */}
              <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200/80">
                <h4 className="font-bold text-stone-900 text-xs mb-1">
                  Need assistance with this order?
                </h4>
                <p className="text-[11px] text-stone-500 mb-2">
                  Contact {settings.restaurant_name} directly with order #{order.orderNumber}.
                </p>
                {settings.phone ? (
                  <a
                    href={`tel:${settings.phone}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#991b1b] hover:text-[#7f1d1d]"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Restaurant: {settings.phone}</span>
                  </a>
                ) : (
                  <span className="text-[11px] text-stone-400 italic">
                    [Restaurant phone pending owner setup in Settings]
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
