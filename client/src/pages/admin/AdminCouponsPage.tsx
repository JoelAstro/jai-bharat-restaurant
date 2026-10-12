import React, { useState, useEffect } from 'react';
import { Plus, Tag, Trash2, X, AlertCircle } from 'lucide-react';
import { Coupon } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useRestaurant } from '../../context/RestaurantContext.js';

export const AdminCouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    code: '',
    description: '',
    discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    discountValue: 20,
    minOrderAmountRupees: 299,
    maxDiscountRupees: 100,
    usageLimit: 500,
    isActive: true,
  });

  const { formatPrice } = useRestaurant();

  const loadCoupons = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAdminCoupons();
      setCoupons(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      await api.updateCoupon(coupon.id, { isActive: !coupon.isActive });
      loadCoupons();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteCoupon = async (id: string, code: string) => {
    if (!confirm(`Delete promotional coupon "${code}"?`)) return;
    try {
      await api.deleteCoupon(id);
      loadCoupons();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        code: form.code.trim().toUpperCase(),
        description: form.description.trim() || undefined,
        discountType: form.discountType,
        discountValue:
          form.discountType === 'FIXED'
            ? form.discountValue * 100 // into paise
            : form.discountValue, // percentage
        minOrderAmount: form.minOrderAmountRupees * 100,
        maxDiscount: form.maxDiscountRupees ? form.maxDiscountRupees * 100 : undefined,
        usageLimit: form.usageLimit ? form.usageLimit : null,
        isActive: form.isActive,
      };

      await api.createCoupon(payload);
      setShowModal(false);
      setForm({
        code: '',
        description: '',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        minOrderAmountRupees: 299,
        maxDiscountRupees: 100,
        usageLimit: 500,
        isActive: true,
      });
      loadCoupons();
    } catch (err: any) {
      alert(err.message || 'Failed to create coupon');
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Coupons & Offers
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Create promotional discount vouchers, set minimum order rules, and track redemption limits.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center">
            <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-stone-400">Loading coupons...</p>
          </div>
        ) : coupons.length === 0 ? (
          <p className="p-12 text-center text-stone-400 text-sm">No coupons created yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold">
                  <th className="p-4">Coupon Code</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Min Order Value</th>
                  <th className="p-4">Max Cap</th>
                  <th className="p-4 text-center">Times Used</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-stone-50/60">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-amber-600" />
                        <span className="font-mono font-bold text-sm text-stone-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          {coupon.code}
                        </span>
                      </div>
                      {coupon.description && (
                        <p className="text-stone-400 text-[11px] mt-0.5">{coupon.description}</p>
                      )}
                    </td>

                    <td className="p-4 font-bold text-emerald-700 text-sm">
                      {coupon.discountType === 'PERCENTAGE'
                        ? `${coupon.discountValue}% OFF`
                        : `Flat ${formatPrice(coupon.discountValue)} OFF`}
                    </td>

                    <td className="p-4 text-stone-700 font-medium">
                      {formatPrice(coupon.minOrderAmount)}
                    </td>

                    <td className="p-4 text-stone-700">
                      {coupon.maxDiscount ? formatPrice(coupon.maxDiscount) : 'No Cap'}
                    </td>

                    <td className="p-4 text-center font-bold text-stone-800">
                      {coupon.timesUsed} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : ''}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(coupon)}
                        className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                          coupon.isActive
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-stone-100 text-stone-600 border-stone-300'
                        }`}
                      >
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif font-bold text-stone-900 text-xl">Create Coupon Code</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Coupon Code (uppercase, alphanumeric) *
                </label>
                <input
                  type="text"
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. FESTIVE20"
                  className="w-full text-xs font-mono uppercase p-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Offer Description / Note
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. 20% OFF on family dinner orders"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={form.discountType}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        discountType: e.target.value as 'PERCENTAGE' | 'FIXED',
                      })
                    }
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-600 bg-white"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.discountValue}
                    onChange={(e) =>
                      setForm({ ...form, discountValue: parseInt(e.target.value) || 0 })
                    }
                    placeholder={form.discountType === 'PERCENTAGE' ? 'e.g. 20 for 20%' : 'e.g. 50 for ₹50'}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Min Order Value (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.minOrderAmountRupees}
                    onChange={(e) =>
                      setForm({ ...form, minOrderAmountRupees: parseInt(e.target.value) || 0 })
                    }
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.maxDiscountRupees}
                    onChange={(e) =>
                      setForm({ ...form, maxDiscountRupees: parseInt(e.target.value) || 0 })
                    }
                    placeholder="e.g. 100"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 text-xs font-semibold py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 text-xs font-semibold py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                >
                  Create Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
