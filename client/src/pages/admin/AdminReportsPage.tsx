import React, { useState, useEffect } from 'react';
import { Download, BarChart3, TrendingUp, IndianRupee, CreditCard, Banknote } from 'lucide-react';
import { api } from '../../services/api.js';
import { useRestaurant } from '../../context/RestaurantContext.js';

export const AdminReportsPage: React.FC = () => {
  const [periodDays, setPeriodDays] = useState(30);
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const { formatPrice } = useRestaurant();

  const loadReport = async () => {
    setIsLoading(true);
    try {
      const data = await api.getSalesReport(periodDays);
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [periodDays]);

  const handleDownloadCSV = async () => {
    setIsExporting(true);
    try {
      const csvText = await api.exportOrdersCSV(periodDays);
      const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `jai-bharat-sales-report-${periodDays}days-${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      alert(err.message || 'Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-serif font-bold text-stone-900">
            Sales & Order Analytics
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Verified restaurant revenue, payment method breakdowns, and top-selling dishes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Period Selector */}
          <div className="flex bg-stone-200/80 p-1 rounded-2xl text-xs font-semibold">
            {[7, 30, 90].map((days) => (
              <button
                key={days}
                onClick={() => setPeriodDays(days)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  periodDays === days
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Last {days} Days
              </button>
            ))}
          </div>

          {/* Export CSV CTA */}
          <button
            onClick={handleDownloadCSV}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white px-4 py-2.5 rounded-2xl shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-20 text-center">
          <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-stone-400">Compiling report data...</p>
        </div>
      ) : (
        <>
          {/* Revenue & Payment Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Period Orders */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 block mb-2">
                Orders in Period ({periodDays} Days)
              </span>
              <p className="text-3xl font-serif font-bold text-stone-900">
                {report?.totalOrdersInPeriod || 0}
              </p>
              <span className="text-xs text-stone-400 mt-1 block">Valid non-cancelled orders</span>
            </div>

            {/* Online Razorpay Payments */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Online (Razorpay / UPI)
                </span>
                <CreditCard className="w-4 h-4 text-indigo-600" />
              </div>
              <p className="text-2xl font-serif font-bold text-indigo-700">
                {formatPrice(report?.paymentMethodBreakdown?.razorpay?.revenuePaise || 0)}
              </p>
              <span className="text-xs text-stone-400 mt-1 block">
                {report?.paymentMethodBreakdown?.razorpay?.count || 0} orders paid online
              </span>
            </div>

            {/* Cash on Delivery */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Cash on Delivery (COD)
                </span>
                <Banknote className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-serif font-bold text-emerald-700">
                {formatPrice(report?.paymentMethodBreakdown?.cod?.revenuePaise || 0)}
              </p>
              <span className="text-xs text-stone-400 mt-1 block">
                {report?.paymentMethodBreakdown?.cod?.count || 0} orders collected
              </span>
            </div>
          </div>

          {/* Top-Selling Dishes Ranking */}
          <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 sm:p-8">
            <h3 className="font-serif font-bold text-stone-900 text-lg mb-6">
              Top 10 Selling Dishes (Ranked by Quantity)
            </h3>

            {report?.topSellingItems && report.topSellingItems.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-400 uppercase font-semibold">
                      <th className="pb-3">Rank</th>
                      <th className="pb-3">Dish Name</th>
                      <th className="pb-3 text-center">Portions Ordered</th>
                      <th className="pb-3 text-right">Revenue Generated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {report.topSellingItems.map((item: any, idx: number) => (
                      <tr key={item.name} className="hover:bg-stone-50/60">
                        <td className="py-3 font-bold text-stone-400 text-sm">#{idx + 1}</td>
                        <td className="py-3 font-bold text-stone-900 text-sm">{item.name}</td>
                        <td className="py-3 text-center font-bold text-amber-700">
                          {item.quantity} portions
                        </td>
                        <td className="py-3 text-right font-bold text-stone-900 text-sm">
                          {formatPrice(item.revenuePaise)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-stone-400 py-6 text-center">
                Insufficient order data in the selected period.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};
