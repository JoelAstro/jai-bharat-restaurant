import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Clock, ArrowRight, RotateCw, AlertTriangle } from 'lucide-react';
import { Order } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useCart } from '../../context/CartContext.js';
import { useRestaurant } from '../../context/RestaurantContext.js';
import { useAuth } from '../../context/AuthContext.js';

export const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [reorderNotice, setReorderNotice] = useState<string | null>(null);

  const { addItem, setIsCartOpen } = useCart();
  const { formatPrice } = useRestaurant();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    api
      .getCustomerOrders()
      .then((data) => setOrders(data))
      .catch((err) => console.error('Failed to load customer orders:', err))
      .finally(() => setIsLoading(false));
  }, [user]);

  /**
   * Re-order: fetch current live menu data, verify item availability and fresh prices
   */
  const handleReorder = async (order: Order) => {
    setReorderingId(order.id);
    setReorderNotice(null);

    try {
      // Fetch fresh menu items from database
      const liveMenuItems = await api.getMenuItems();
      let addedCount = 0;
      let unavailableDishes: string[] = [];

      for (const orderItem of order.items) {
        if (!orderItem.menuItemId) continue;
        const liveItem = liveMenuItems.find((m: any) => m.id === orderItem.menuItemId);

        if (!liveItem || !liveItem.isAvailable) {
          unavailableDishes.push(orderItem.itemName);
          continue;
        }

        // Match variation if applicable
        const variation = liveItem.variations?.find(
          (v: any) => v.name === orderItem.variationName
        );

        // Match add-ons if applicable
        const matchedAddons = liveItem.addons?.filter((addon: any) =>
          orderItem.addons?.some((a: any) => a.addonName === addon.name)
        ) || [];

        addItem(liveItem, orderItem.quantity, variation, matchedAddons);
        addedCount++;
      }

      if (unavailableDishes.length > 0) {
        setReorderNotice(
          `Added ${addedCount} items. Note: ${unavailableDishes.join(', ')} is currently unavailable and was omitted.`
        );
      } else {
        setIsCartOpen(true);
      }
    } catch (err: any) {
      alert('Could not re-order: ' + err.message);
    } finally {
      setReorderingId(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <ShoppingBag className="w-16 h-16 text-stone-300 mb-4" />
        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">
          Please log in to view your orders
        </h2>
        <p className="text-stone-500 text-sm mb-6">
          Access your order history, receipts, and 1-click re-ordering.
        </p>
        <Link
          to="/auth"
          className="bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-semibold text-sm px-6 py-3 rounded-full"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#991b1b] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-stone-500 text-sm">Loading your order history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900">
              Your Orders
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              Track live food deliveries or easily re-order your favourite meals.
            </p>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold bg-[#991b1b] hover:bg-[#7f1d1d] text-white px-5 py-2.5 rounded-full shadow-xs"
          >
            <span>Explore Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {reorderNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-stone-900 text-xs sm:text-sm flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#991b1b] shrink-0" />
            <span>{reorderNotice}</span>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-md mx-auto">
            <Clock className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="font-serif font-bold text-lg text-stone-800 mb-1">
              No orders placed yet
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              When you order dishes, you can track them here in real-time.
            </p>
            <Link
              to="/menu"
              className="bg-[#991b1b] hover:bg-[#7f1d1d] text-white text-xs font-semibold px-6 py-2.5 rounded-full"
            >
              Order Now
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusColors: Record<string, string> = {
                PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
                CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
                PREPARING: 'bg-indigo-100 text-indigo-800 border-indigo-200',
                READY: 'bg-purple-100 text-purple-800 border-purple-200',
                COMPLETED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                CANCELLED: 'bg-rose-100 text-rose-800 border-rose-200',
              };

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-stone-100 gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-base text-stone-900">
                          #{order.orderNumber}
                        </span>
                        <span className="text-stone-300">•</span>
                        <span className="text-xs text-stone-500">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
                        {order.orderType} • Payment: {order.paymentMethod} ({order.paymentStatus})
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${
                          statusColors[order.status] || 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="font-serif font-bold text-lg text-stone-900">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Items list preview */}
                  <div className="py-4 space-y-1.5 text-xs text-stone-600">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>
                          <strong className="text-stone-800">{item.quantity}x</strong> {item.itemName}{' '}
                          {item.variationName && `(${item.variationName})`}
                        </span>
                        <span className="font-medium text-stone-800">
                          {formatPrice(item.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-xs font-bold text-[#991b1b] hover:text-[#7f1d1d] inline-flex items-center gap-1"
                    >
                      <span>Track / View Receipt</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => handleReorder(order)}
                      disabled={reorderingId === order.id}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white px-4 py-2 rounded-xl transition-all shadow-xs"
                    >
                      <RotateCw
                        className={`w-3.5 h-3.5 ${reorderingId === order.id ? 'animate-spin' : ''}`}
                      />
                      <span>Re-Order Dishes</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
