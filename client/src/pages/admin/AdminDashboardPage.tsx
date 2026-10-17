import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  UtensilsCrossed,
  Tag,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { api } from '../../services/api.js';
import { useRestaurant } from '../../context/RestaurantContext.js';

export const AdminDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [settingsStatus, setSettingsStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { formatPrice } = useRestaurant();

  useEffect(() => {
    Promise.all([
      api.getOverviewMetrics(),
      api.getAdminSettings(),
    ])
      .then(([metricsData, settingsData]) => {
        setMetrics(metricsData);
        setSettingsStatus(settingsData);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-serif font-bold text-stone-900">
            Restaurant Dashboard
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Real-time orders, verified revenue, and kitchen status.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white px-3.5 sm:px-4 py-2.5 rounded-xl shadow-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Manage Orders</span>
          </Link>
          <Link
            to="/admin/menu"
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white px-3.5 sm:px-4 py-2.5 rounded-xl shadow-xs"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Update Menu</span>
          </Link>
        </div>
      </div>

      {/* Owner Setup Checklist Warning (if missing official details) */}
      {settingsStatus && settingsStatus.missingDetails && settingsStatus.missingDetails.length > 0 && (
        <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-amber-900">
                Action Required: Owner Configuration Incomplete
              </h4>
              <p className="text-xs text-amber-800/90 mt-0.5">
                The following restaurant details must be supplied: {settingsStatus.missingDetails.join(', ')}.
              </p>
            </div>
          </div>
          <Link
            to="/admin/settings"
            className="shrink-0 text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 px-4 py-2 rounded-xl transition-colors"
          >
            Update Settings Now →
          </Link>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Orders */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
            <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-stone-900">
            {metrics?.totalOrders || 0}
          </p>
          <span className="text-xs text-stone-400 mt-1 block">Lifetime customer orders</span>
        </div>

        {/* Orders Today */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Orders Today</span>
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-stone-900">
            {metrics?.ordersToday || 0}
          </p>
          <span className="text-xs text-stone-400 mt-1 block">Since 12:00 AM today</span>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Kitchen</span>
            <div className="p-2.5 bg-orange-50 text-orange-700 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-orange-600">
            {metrics?.pendingOrders || 0}
          </p>
          <span className="text-xs text-stone-400 mt-1 block">Awaiting prep or dispatch</span>
        </div>

        {/* Total Collected Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Collected Revenue</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-serif font-bold text-emerald-700">
            {formatPrice(metrics?.totalRevenuePaise || 0)}
          </p>
          <span className="text-xs text-stone-400 mt-1 block">From completed & paid orders</span>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-xs p-4 sm:p-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg">
            Recent Incoming Orders
          </h3>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {metrics?.recentOrders && metrics.recentOrders.length > 0 ? (
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full text-left text-xs min-w-[520px]">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 uppercase font-semibold">
                  <th className="pb-3">Order #</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {metrics.recentOrders.map((o: any) => (
                  <tr key={o.id} className="hover:bg-stone-50/60">
                    <td className="py-3 font-mono font-bold text-stone-800">
                      <Link to={`/admin/orders`} className="hover:text-amber-700">
                        #{o.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 font-medium text-stone-800">{o.customerName}</td>
                    <td className="py-3 text-stone-500">
                      {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3">
                      <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase">
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 text-stone-600">
                      {o.paymentMethod} ({o.paymentStatus})
                    </td>
                    <td className="py-3 text-right font-bold text-stone-900">
                      {formatPrice(o.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-stone-400 py-6 text-center">No orders recorded yet.</p>
        )}
      </div>
    </div>
  );
};
