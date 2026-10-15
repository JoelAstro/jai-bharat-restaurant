import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Clock, ArrowRight, RotateCw, AlertTriangle, Search, CheckCircle2 } from 'lucide-react';
import { Order, OrderItem, OrderItemAddon } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useCart } from '../../context/CartContext.js';
import { useRestaurant } from '../../context/RestaurantContext.js';
import { useAuth } from '../../context/AuthContext.js';

export const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [reorderNotice, setReorderNotice] = useState<string | null>(null);
  const [searchOrderNumber, setSearchOrderNumber] = useState('');

  const { addItem, setIsCartOpen } = useCart();
  const { formatPrice } = useRestaurant();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      const ordersMap = new Map<string, Order>();

      // 1. Load orders from server if authenticated
      if (user) {
        try {
          const userOrders = await api.getCustomerOrders();
          userOrders.forEach((o) => ordersMap.set(o.id, o));
        } catch (err) {
          console.error('Failed to load user orders:', err);
        }
      }

      // 2. Load recent guest orders saved in browser local storage
      try {
        const storedOrderIds: string[] = JSON.parse(
          localStorage.getItem('jb_recent_orders') || '[]'
        );

        const guestPromises = storedOrderIds.map((id) =>
          api.getOrderById(id).catch(() => null)
        );

        const results = await Promise.all(guestPromises);
        results.forEach((res) => {
          if (res && res.id) {
            ordersMap.set(res.id, res);
          }
        });
      } catch (err) {
        console.error('Failed to read recent orders from storage:', err);
      }

      // Sort by creation date descending
      const sorted = Array.from(ordersMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setOrders(sorted);
      setIsLoading(false);
    };

    loadOrders();
  }, [user]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchOrderNumber.trim();
    if (query) {
      navigate(`/orders/${query}`);
    }
  };

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
        const matchedAddons =
          liveItem.addons?.filter((addon: any) =>
            orderItem.addons?.some((a: OrderItemAddon) => a.addonName === addon.name)
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
      alert('Could not re-order: ' + (err.message || 'Error'));
    } finally {
      setReorderingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">Placed</span>;
      case 'CONFIRMED':
        return <span className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-xs font-bold">Accepted</span>;
      case 'PREPARING':
        return <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-bold">Cooking</span>;
      case 'READY':
        return <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-xs font-bold">Out for Delivery</span>;
      case 'COMPLETED':
        return <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">Delivered</span>;
      case 'CANCELLED':
        return <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-xs font-bold">Cancelled</span>;
      default:
        return <span className="bg-stone-100 text-stone-800 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900">
              Track & View Orders
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              Check live order progress or quickly re-order your favorite dishes.
            </p>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold bg-[#991b1b] hover:bg-[#7f1d1d] text-white px-5 py-2.5 rounded-full shadow-xs self-start sm:self-auto"
          >
            <span>Explore Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Quick Order Search / Tracker Form */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200/80 shadow-xs mb-8">
          <h2 className="text-sm font-bold text-stone-900 mb-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-amber-600" />
            <span>Have an Order Number?</span>
          </h2>
          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter Order ID or Number (e.g. JB-20261015-1234)"
              value={searchOrderNumber}
              onChange={(e) => setSearchOrderNumber(e.target.value)}
              className="flex-1 text-xs sm:text-sm px-4 py-3 rounded-xl border border-stone-300 focus:outline-hidden focus:border-[#991b1b] bg-stone-50"
            />
            <button
              type="submit"
              disabled={!searchOrderNumber.trim()}
              className="bg-[#991b1b] hover:bg-[#7f1d1d] disabled:opacity-50 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-colors"
            >
              Track Live Order
            </button>
          </form>
        </div>

        {reorderNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-stone-900 text-xs sm:text-sm flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#991b1b] shrink-0" />
            <span>{reorderNotice}</span>
          </div>
        )}

        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 border-4 border-[#991b1b] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-stone-500 text-sm">Retrieving your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-14 border border-stone-200/80 text-center max-w-lg mx-auto shadow-xs">
            <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto mb-4 stroke-1" />
            <h3 className="font-serif font-bold text-xl text-stone-900 mb-2">
              No recent orders found
            </h3>
            <p className="text-stone-500 text-sm mb-6">
              When you place an order, your live tracking and receipts will appear here automatically.
            </p>
            <Link
              to="/menu"
              className="bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-full inline-block shadow-sm"
            >
              Order Something Delicious
            </Link>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-serif font-bold text-base sm:text-lg text-stone-900">
                        #{order.orderNumber}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(order.createdAt).toLocaleString()}</span>
                      <span>•</span>
                      <span className="uppercase font-semibold tracking-wider text-stone-500">
                        {order.orderType}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="font-bold text-lg text-stone-900">
                      {formatPrice(order.total)}
                    </span>
                    <Link
                      to={`/orders/${order.id}`}
                      className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-1"
                    >
                      <span>Track</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="py-4 space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs sm:text-sm">
                      <div className="text-stone-700">
                        <span className="font-semibold text-stone-900">{item.quantity}x</span>{' '}
                        <span>{item.itemName}</span>
                        {item.variationName && (
                          <span className="text-stone-400 text-xs ml-1.5">
                            ({item.variationName})
                          </span>
                        )}
                      </div>
                      <span className="text-stone-500 font-medium">
                        {formatPrice(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <span className="text-stone-500">
                    Payment:{' '}
                    <strong className="text-stone-700 uppercase">
                      {order.paymentMethod} ({order.paymentStatus})
                    </strong>
                  </span>

                  <button
                    onClick={() => handleReorder(order)}
                    disabled={reorderingId === order.id}
                    className="inline-flex items-center gap-1.5 font-bold text-[#991b1b] hover:text-[#7f1d1d] py-1 transition-colors self-start sm:self-auto"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${reorderingId === order.id ? 'animate-spin' : ''}`} />
                    <span>Re-order Meals</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
