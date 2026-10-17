import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  ChefHat,
  Bike,
  PackageCheck,
  XCircle,
  Phone,
  MapPin,
  RefreshCw,
  AlertCircle,
  IndianRupee,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useRestaurant } from '../../context/RestaurantContext.js';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { formatPrice } = useRestaurant();

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAdminOrders({
        status: statusFilter,
        search: searchQuery,
      });
      setOrders(res.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 10000); // 10s auto-refresh
    return () => clearInterval(interval);
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadOrders();
  };

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: OrderStatus,
    note?: string
  ) => {
    setUpdatingId(orderId);
    try {
      await api.updateOrderStatus(orderId, newStatus, note);
      await loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        const updated = await api.getOrderById(orderId);
        setSelectedOrder(updated);
      }
    } catch (err: any) {
      alert(err.message || 'Status update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleTogglePayment = async (orderId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'PAID' ? 'PENDING' : 'PAID';
    try {
      await api.updatePaymentStatus(orderId, nextStatus);
      await loadOrders();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filterTabs = [
    'ALL',
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'READY',
    'COMPLETED',
    'CANCELLED',
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-serif font-bold text-stone-900">
            Order Management
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Accept, prepare, and advance real customer food orders through kitchen stages.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 px-3.5 py-2 rounded-xl shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-xs space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar touch-pan-x w-full sm:w-auto -mx-1 px-1">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`text-xs font-bold px-3 sm:px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                  statusFilter === tab
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order # or Name..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-600"
            />
          </form>
        </div>
      </div>

      {/* Orders List Grid */}
      {isLoading ? (
        <div className="p-16 text-center">
          <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-stone-400">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-stone-200 text-stone-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-stone-300" />
          <p className="text-sm font-semibold text-stone-700">No orders match this filter</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            let parsedAddr: any = null;
            if (order.deliveryAddressSnapshot) {
              try {
                parsedAddr = JSON.parse(order.deliveryAddressSnapshot);
              } catch {}
            }

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 hover:shadow-md transition-shadow"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-base text-stone-900">
                        #{order.orderNumber}
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="text-xs text-stone-500">
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className="text-xs bg-stone-100 text-stone-700 font-bold px-2 py-0.5 rounded-md">
                        {order.orderType}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-stone-600 mt-1">
                      <span className="font-semibold text-stone-800">{order.customerName}</span>
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="text-amber-700 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{order.customerPhone}</span>
                      </a>
                    </div>
                  </div>

                  {/* Status & Amount */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleTogglePayment(order.id, order.paymentStatus)}
                      title="Click to toggle collected status"
                      className={`text-xs font-bold px-3 py-1 rounded-full border cursor-pointer ${
                        order.paymentStatus === 'PAID'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      {order.paymentMethod}: {order.paymentStatus}
                    </button>

                    <span className="font-serif font-bold text-lg text-stone-900">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                {/* Items & Address details */}
                <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Items list */}
                  <div className="space-y-1.5">
                    <span className="font-bold text-stone-400 uppercase tracking-wider text-[10px] block">
                      Kitchen Items ({order.items.length})
                    </span>
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-stone-700">
                        <span>
                          <strong className="text-stone-900">{item.quantity}x</strong> {item.itemName}{' '}
                          {item.variationName && <span className="text-stone-500">({item.variationName})</span>}
                          {item.addons?.length > 0 && (
                            <span className="text-amber-700">
                              {' '}[+{item.addons.map((a) => a.addonName).join(', ')}]
                            </span>
                          )}
                        </span>
                        <span className="font-medium text-stone-900">
                          {formatPrice(item.subtotal)}
                        </span>
                      </div>
                    ))}
                    {order.specialInstructions && (
                      <p className="p-2 bg-amber-50 text-amber-900 rounded-xl mt-2 italic text-[11px]">
                        <strong>Kitchen Note:</strong> {order.specialInstructions}
                      </p>
                    )}
                  </div>

                  {/* Delivery address */}
                  <div>
                    <span className="font-bold text-stone-400 uppercase tracking-wider text-[10px] block">
                      Delivery Destination
                    </span>
                    {parsedAddr ? (
                      <p className="text-stone-700 mt-1 leading-relaxed">
                        {parsedAddr.street}, {parsedAddr.area ? `${parsedAddr.area}, ` : ''}{parsedAddr.city} — {parsedAddr.pincode}
                        {parsedAddr.landmark && ` (Landmark: ${parsedAddr.landmark})`}
                      </p>
                    ) : (
                      <p className="text-stone-500 italic mt-1">Direct Takeaway Pickup</p>
                    )}
                  </div>
                </div>

                {/* Actions row: Stage Progression Buttons */}
                <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500">Current Status:</span>
                    <span className="font-bold text-xs bg-stone-100 px-2.5 py-1 rounded-md text-stone-800">
                      {order.status}
                    </span>
                  </div>

                  {/* Action transitions */}
                  <div className="flex flex-wrap items-center gap-2">
                    {order.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'CONFIRMED', 'Kitchen confirmed the order')}
                          disabled={updatingId === order.id}
                          className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl shadow-xs"
                        >
                          Confirm Order
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'CANCELLED', 'Order rejected by restaurant')}
                          disabled={updatingId === order.id}
                          className="text-xs font-semibold bg-stone-100 hover:bg-rose-100 text-rose-700 px-3.5 py-2 rounded-xl transition-colors"
                        >
                          Reject / Cancel
                        </button>
                      </>
                    )}

                    {order.status === 'CONFIRMED' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'PREPARING', 'Food is cooking in the kitchen')}
                          disabled={updatingId === order.id}
                          className="text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded-xl shadow-xs"
                        >
                          Start Preparing
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'CANCELLED', 'Cancelled')}
                          disabled={updatingId === order.id}
                          className="text-xs text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {order.status === 'PREPARING' && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(
                            order.id,
                            'READY',
                            order.orderType === 'DELIVERY'
                              ? 'Out for delivery to customer address'
                              : 'Ready for parcel collection'
                          )
                        }
                        disabled={updatingId === order.id}
                        className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl shadow-xs"
                      >
                        {order.orderType === 'DELIVERY' ? 'Dispatch / Out for Delivery' : 'Mark Ready for Pickup'}
                      </button>
                    )}

                    {order.status === 'READY' && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(order.id, 'COMPLETED', 'Order successfully delivered to customer')
                        }
                        disabled={updatingId === order.id}
                        className="text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl shadow-xs"
                      >
                        Mark Completed / Delivered
                      </button>
                    )}

                    {(order.status === 'COMPLETED' || order.status === 'CANCELLED') && (
                      <span className="text-xs text-stone-400 italic">Terminal Status</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
