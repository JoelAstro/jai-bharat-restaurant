import React, { useState, useEffect } from 'react';
import { Search, Users, Phone, Mail, ShoppingBag, IndianRupee } from 'lucide-react';
import { api } from '../../services/api.js';

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await api.getCustomers(searchQuery);
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadCustomers();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-3xl font-serif font-bold text-stone-900">
          Customer Directory
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm mt-1">
          Registered customer accounts, contact numbers, order frequency, and lifetime spend.
        </p>
      </div>

      {/* Search Header */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-xs flex justify-between items-center">
        <form onSubmit={handleSearch} className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, or email..."
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-600"
          />
        </form>
        <span className="text-xs text-stone-500 font-semibold hidden sm:inline ml-3">
          {customers.length} Customers Registered
        </span>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center">
            <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-stone-400">Loading customers...</p>
          </div>
        ) : customers.length === 0 ? (
          <p className="p-12 text-center text-stone-400 text-sm">No customers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[580px]">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold">
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Mobile Phone</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Registered Date</th>
                  <th className="p-4 text-center">Orders Placed</th>
                  <th className="p-4 text-right">Lifetime Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/60">
                    <td className="p-4 font-bold text-stone-900 text-sm flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{c.name}</span>
                    </td>
                    <td className="p-4 font-mono text-stone-700">
                      {c.phone ? (
                        <a href={`tel:${c.phone}`} className="hover:text-amber-700">
                          {c.phone}
                        </a>
                      ) : (
                        <span className="text-stone-300">—</span>
                      )}
                    </td>
                    <td className="p-4 text-stone-600">{c.email}</td>
                    <td className="p-4 text-stone-500">
                      {new Date(c.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-4 text-center font-bold text-stone-800">
                      {c.ordersCount}
                    </td>
                    <td className="p-4 text-right font-bold text-stone-900 text-sm">
                      ₹{c.totalSpendRupees}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
