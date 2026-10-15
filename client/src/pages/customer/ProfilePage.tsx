import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Plus, Trash2, Check, AlertCircle, Save } from 'lucide-react';
import { Address } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.js';

export const ProfilePage: React.FC = () => {
  const { user, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  // Address fields
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    street: '',
    area: '',
    city: 'Bengaluru',
    pincode: '',
    landmark: '',
    isDefault: false,
  });
  const [addressError, setAddressError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setName(user.name);
    setPhone(user.phone || '');
    loadAddresses();
  }, [user]);

  const loadAddresses = async () => {
    try {
      const data = await api.getAddresses();
      setAddresses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileSuccessMsg(null);
    try {
      await api.updateProfile({ name, phone });
      await refreshProfile();
      setProfileSuccessMsg('Profile details updated successfully!');
      setTimeout(() => setProfileSuccessMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressError(null);
    if (!newAddress.street.trim() || !newAddress.pincode.trim()) {
      setAddressError('Street address and PIN code are required.');
      return;
    }

    try {
      await api.addAddress(newAddress);
      setShowAddAddressModal(false);
      setNewAddress({
        label: 'Home',
        street: '',
        area: '',
        city: 'Bengaluru',
        pincode: '',
        landmark: '',
        isDefault: false,
      });
      loadAddresses();
    } catch (err: any) {
      setAddressError(err.message || 'Failed to save address');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to remove this delivery address?')) return;
    try {
      await api.deleteAddress(id);
      loadAddresses();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 mb-8">
          Account Settings
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Profile Edit Form */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs h-fit space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
              <div className="w-12 h-12 rounded-full bg-red-100 text-[#991b1b] font-bold text-lg flex items-center justify-center">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-serif font-bold text-stone-900 text-base">{user.name}</h3>
                <span className="text-xs text-stone-400">{user.email}</span>
              </div>
            </div>

            {profileSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#991b1b]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  pattern="[0-9]{10}"
                  value={phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                  placeholder="10 digit mobile"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#991b1b]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address (Read-only)
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-400 cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-semibold text-xs py-3 rounded-xl transition-colors shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>{isUpdatingProfile ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </form>

            <div className="pt-4 border-t border-stone-100">
              <button
                onClick={logout}
                className="w-full text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 py-2.5 rounded-xl transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Right: Saved Addresses List */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-serif font-bold text-stone-900 text-lg">
                    Saved Delivery Addresses
                  </h3>
                  <p className="text-xs text-stone-500">
                    Quickly select your address during checkout
                  </p>
                </div>
                <button
                  onClick={() => setShowAddAddressModal(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#991b1b] hover:bg-[#7f1d1d] text-white px-3.5 py-2 rounded-xl shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Address</span>
                </button>
              </div>

              {isLoadingAddresses ? (
                <p className="text-xs text-stone-400 py-6 text-center">Loading addresses...</p>
              ) : addresses.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-stone-200 rounded-2xl">
                  <MapPin className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                  <p className="text-xs text-stone-500">No saved addresses yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr: Address) => (
                    <div
                      key={addr.id}
                      className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#991b1b] bg-red-100 px-2 py-0.5 rounded-md">
                            {addr.label}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-800 font-medium">
                          {addr.street}
                        </p>
                        {addr.area && <p className="text-xs text-stone-500">{addr.area}</p>}
                        <p className="text-xs text-stone-500">
                          {addr.city} — {addr.pincode}
                        </p>
                        {addr.landmark && (
                          <p className="text-[11px] text-stone-400 italic mt-1">
                            Landmark: {addr.landmark}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 mt-3 border-t border-stone-200/60 flex justify-end">
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-xs text-stone-400 hover:text-rose-600 transition-colors p-1"
                          title="Delete address"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Address Modal */}
        {showAddAddressModal && (
          <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
              <h3 className="font-serif font-bold text-stone-900 text-lg mb-4">
                Add New Delivery Address
              </h3>

              {addressError && (
                <div className="mb-4 p-3 bg-rose-50 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{addressError}</span>
                </div>
              )}

              <form onSubmit={handleCreateAddress} className="space-y-3">
                <div className="flex gap-2 mb-2">
                  {['Home', 'Work', 'Other'].map((label) => (
                    <button
                      type="button"
                      key={label}
                      onClick={() => setNewAddress({ ...newAddress, label })}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-xl border ${
                        newAddress.label === label
                          ? 'border-[#991b1b] bg-red-50 text-[#991b1b]'
                          : 'border-stone-200 text-stone-600'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Street Address / Flat / Building *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    placeholder="e.g. 402 Sunshine Apts"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#991b1b]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Area / Locality
                    </label>
                    <input
                      type="text"
                      value={newAddress.area}
                      onChange={(e) => setNewAddress({ ...newAddress, area: e.target.value })}
                      placeholder="e.g. MG Road"
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#991b1b]"
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
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#991b1b]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      pattern="[0-9]{6}"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      placeholder="560001"
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#991b1b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Landmark
                    </label>
                    <input
                      type="text"
                      value={newAddress.landmark}
                      onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                      placeholder="Near City Park"
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#991b1b]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
                    <input
                      type="checkbox"
                      checked={newAddress.isDefault}
                      onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                      className="rounded-sm text-[#991b1b] focus:ring-red-500"
                    />
                    <span>Set as primary default address</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddAddressModal(false)}
                    className="flex-1 text-xs font-semibold py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 text-xs font-semibold py-2.5 rounded-xl bg-[#991b1b] hover:bg-[#7f1d1d] text-white shadow-xs"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
