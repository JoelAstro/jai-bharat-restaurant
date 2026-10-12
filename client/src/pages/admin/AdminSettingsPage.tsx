import React, { useState, useEffect } from 'react';
import { Settings, Save, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { api } from '../../services/api.js';
import { useRestaurant } from '../../context/RestaurantContext.js';

export const AdminSettingsPage: React.FC = () => {
  const [settingsMap, setSettingsMap] = useState<Record<string, string>>({});
  const [missingDetails, setMissingDetails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { refreshSettings } = useRestaurant();

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAdminSettings();
      setSettingsMap(res.settings);
      setMissingDetails(res.missingDetails);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettingsMap((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await api.updateSettings(settingsMap);
      await refreshSettings();
      await loadSettings();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-20 text-center">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-stone-400">Loading restaurant settings...</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
          Restaurant Business Settings
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm mt-1">
          Configure verified contact info, operating hours, delivery fees, and payment channels.
        </p>
      </div>

      {/* Owner Setup Checklist Card */}
      {missingDetails.length > 0 ? (
        <div className="p-6 rounded-3xl bg-amber-50 border border-amber-300 text-amber-950 space-y-3">
          <div className="flex items-center gap-2.5 font-bold text-sm text-amber-900">
            <ShieldAlert className="w-5 h-5 text-amber-700" />
            <span>Pending Owner Information Checklist</span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            Per restaurant operational guidelines, the following owner-supplied details are required before final production launch:
          </p>
          <ul className="list-disc list-inside text-xs font-semibold text-amber-900 space-y-1">
            {missingDetails.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">
            All primary restaurant business details are configured!
          </span>
        </div>
      )}

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="font-bold">Settings saved successfully and synced globally!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Official Business Identity */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-stone-900 text-lg border-b border-stone-100 pb-3">
            1. Official Restaurant Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Restaurant Legal / Brand Name *
              </label>
              <input
                type="text"
                required
                value={settingsMap.restaurant_name || ''}
                onChange={(e) => handleChange('restaurant_name', e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Marketing Tagline
              </label>
              <input
                type="text"
                value={settingsMap.tagline || ''}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="Great Food. Beautiful Moments."
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Official Contact Phone Number *
              </label>
              <input
                type="text"
                value={settingsMap.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="e.g. +91 9876543210"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Official Business Email *
              </label>
              <input
                type="email"
                value={settingsMap.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="contact@jaibharatrestaurant.com"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Physical Street Address *
              </label>
              <input
                type="text"
                value={settingsMap.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="e.g. Shop 12, Ground Floor, Main Road..."
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Operating City
              </label>
              <input
                type="text"
                value={settingsMap.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Bengaluru"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Operating Hours
              </label>
              <input
                type="text"
                value={settingsMap.operating_hours || ''}
                onChange={(e) => handleChange('operating_hours', e.target.value)}
                placeholder="11:00 AM - 11:00 PM (Everyday)"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-600"
              />
            </div>
          </div>
        </div>

        {/* 2. Operational Rules & Taxes */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-stone-900 text-lg border-b border-stone-100 pb-3">
            2. Taxes & Delivery Pricing Rules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                GST / Tax Percentage (%)
              </label>
              <input
                type="number"
                min={0}
                max={28}
                value={settingsMap.tax_rate_percent || '5'}
                onChange={(e) => handleChange('tax_rate_percent', e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-600"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">5% standard for restaurant dining/takeaway</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Standard Delivery Fee (Paise)
              </label>
              <input
                type="number"
                min={0}
                value={settingsMap.delivery_fee_paise || '4000'}
                onChange={(e) => handleChange('delivery_fee_paise', e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-600"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">4000 paise = ₹40.00</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Free Delivery Threshold (Paise)
              </label>
              <input
                type="number"
                min={0}
                value={settingsMap.free_delivery_threshold_paise || '50000'}
                onChange={(e) => handleChange('free_delivery_threshold_paise', e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-600"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">50000 paise = ₹500.00</span>
            </div>
          </div>
        </div>

        {/* 3. Ordering & Payment Channels Toggles */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-stone-900 text-lg border-b border-stone-100 pb-3">
            3. Ordering Channels & Payment Methods
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-stone-200 cursor-pointer">
              <span className="text-xs font-bold text-stone-800">Home Delivery Service</span>
              <input
                type="checkbox"
                checked={settingsMap.delivery_enabled !== 'false'}
                onChange={(e) => handleChange('delivery_enabled', String(e.target.checked))}
                className="rounded-sm text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-stone-200 cursor-pointer">
              <span className="text-xs font-bold text-stone-800">Takeaway Pickup Service</span>
              <input
                type="checkbox"
                checked={settingsMap.takeaway_enabled !== 'false'}
                onChange={(e) => handleChange('takeaway_enabled', String(e.target.checked))}
                className="rounded-sm text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-stone-200 cursor-pointer">
              <span className="text-xs font-bold text-stone-800">Cash on Delivery (COD)</span>
              <input
                type="checkbox"
                checked={settingsMap.cod_enabled !== 'false'}
                onChange={(e) => handleChange('cod_enabled', String(e.target.checked))}
                className="rounded-sm text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl border border-stone-200 cursor-pointer">
              <span className="text-xs font-bold text-stone-800">Online Payments (Razorpay)</span>
              <input
                type="checkbox"
                checked={settingsMap.razorpay_enabled !== 'false'}
                onChange={(e) => handleChange('razorpay_enabled', String(e.target.checked))}
                className="rounded-sm text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
            </label>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 text-white font-bold px-8 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all text-sm"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Settings...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
