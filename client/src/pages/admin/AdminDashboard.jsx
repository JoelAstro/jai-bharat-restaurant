import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  UtensilsCrossed,
  Sliders,
  Tag,
  Plus,
  Trash2,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { api } from '../../services/api.js';
import { VegBadge } from '../../components/menu/VegBadge.js';
import { useRestaurant } from '../../context/RestaurantContext.js';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const { formatPrice } = useRestaurant();

  // Data states
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [aboutSections, setAboutSections] = useState([]);
  const [offers, setOffers] = useState([]);

  // Modal display states
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);

  // File and preview states
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  // Forms
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    buttonText: 'Order Now',
    buttonLink: '/menu',
    displayOrder: 0,
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    displayOrder: 0,
  });

  const [itemForm, setItemForm] = useState({
    categoryId: '',
    name: '',
    description: '',
    priceRupees: 250,
    isVeg: true,
    isAvailable: true,
    isFeatured: false,
  });

  const [aboutForm, setAboutForm] = useState({
    sectionKey: 'heritage',
    title: '',
    subtitle: '',
    content: '',
  });

  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    minOrderAmountRupees: 299,
    maxDiscountRupees: 100,
  });

  const showToast = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const resetFileUpload = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [bannersRes, catsRes, itemsRes, aboutRes, offersRes] = await Promise.all([
        api.getAdminHomeBanners().catch(() => api.getPublicHomeBanners()),
        api.getCategories(true),
        api.getMenuItems({ isAdmin: true }),
        api.getAdminAbout().catch(() => api.getPublicAbout()),
        api.getAdminOffers().catch(() => api.getPublicOffers()),
      ]);

      setBanners(bannersRes || []);
      setCategories(catsRes || []);
      setMenuItems(itemsRes || []);
      setAboutSections(aboutRes || []);
      setOffers(offersRes || []);

      if (catsRes?.length && !itemForm.categoryId) {
        setItemForm((prev) => ({ ...prev, categoryId: catsRes[0].id }));
      }
    } catch (err) {
      showToast('error', err.message || 'Failed to load content.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // --- 1. Home Banner Handlers ---
  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast('error', 'Please choose an image file for the banner.');
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('title', bannerForm.title);
      formData.append('subtitle', bannerForm.subtitle);
      formData.append('buttonText', bannerForm.buttonText);
      formData.append('buttonLink', bannerForm.buttonLink);
      formData.append('displayOrder', String(bannerForm.displayOrder));

      await api.createAdminHomeBanner(formData);
      showToast('success', 'Home banner uploaded and added successfully!');
      setShowBannerModal(false);
      resetFileUpload();
      setBannerForm({ title: '', subtitle: '', buttonText: 'Order Now', buttonLink: '/menu', displayOrder: 0 });
      loadAllData();
    } catch (err) {
      showToast('error', err.message || 'Error creating banner.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!confirm('Delete banner? Associated Cloudinary image will be removed.')) return;
    try {
      await api.deleteAdminHomeBanner(id);
      showToast('success', 'Banner deleted successfully.');
      loadAllData();
    } catch (err) {
      showToast('error', err.message || 'Error deleting banner.');
    }
  };

  // --- 2. Menu Category & Item Handlers ---
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (selectedFile) formData.append('image', selectedFile);
      formData.append('name', categoryForm.name);
      formData.append('description', categoryForm.description);
      formData.append('displayOrder', String(categoryForm.displayOrder));

      await api.createAdminCategory(formData);
      showToast('success', 'Category created!');
      setShowCategoryModal(false);
      resetFileUpload();
      setCategoryForm({ name: '', description: '', displayOrder: 0 });
      loadAllData();
    } catch (err) {
      showToast('error', err.message || 'Error creating category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (selectedFile) formData.append('image', selectedFile);
      formData.append('categoryId', itemForm.categoryId);
      formData.append('name', itemForm.name);
      formData.append('description', itemForm.description);
      formData.append('price', String(itemForm.priceRupees * 100)); // paise
      formData.append('isVeg', String(itemForm.isVeg));
      formData.append('isAvailable', String(itemForm.isAvailable));
      formData.append('isFeatured', String(itemForm.isFeatured));

      await api.createAdminMenuItem(formData);
      showToast('success', 'Menu dish uploaded to Cloudinary & saved to Neon!');
      setShowItemModal(false);
      resetFileUpload();
      setItemForm({
        categoryId: categories[0]?.id || '',
        name: '',
        description: '',
        priceRupees: 250,
        isVeg: true,
        isAvailable: true,
        isFeatured: false,
      });
      loadAllData();
    } catch (err) {
      showToast('error', err.message || 'Error creating menu item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (id, name) => {
    if (!confirm(`Delete "${name}"? Cloudinary image will be permanently removed.`)) return;
    try {
      await api.deleteAdminMenuItem(id);
      showToast('success', `"${name}" and Cloudinary image deleted.`);
      loadAllData();
    } catch (err) {
      showToast('error', err.message || 'Error deleting dish.');
    }
  };

  const handleToggleItemStock = async (item) => {
    try {
      await api.toggleMenuItemAvailability(item.id);
      showToast('success', `"${item.name}" stock updated.`);
      loadAllData();
    } catch (err) {
      showToast('error', err.message || 'Error updating stock.');
    }
  };

  // --- 3. About Us Handlers ---
  const openAboutEdit = (sec) => {
    setAboutForm({
      sectionKey: sec.sectionKey || 'heritage',
      title: sec.title || '',
      subtitle: sec.subtitle || '',
      content: sec.content || '',
    });
    setPreviewUrl(sec.imageUrl || '');
    setSelectedFile(null);
    setShowAboutModal(true);
  };

  const handleAboutSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (selectedFile) formData.append('image', selectedFile);
      formData.append('title', aboutForm.title);
      formData.append('subtitle', aboutForm.subtitle);
      formData.append('content', aboutForm.content);

      await api.updateAdminAboutSection(aboutForm.sectionKey, formData);
      showToast('success', `About section "${aboutForm.sectionKey}" updated!`);
      setShowAboutModal(false);
      resetFileUpload();
      loadAllData();
    } catch (err) {
      showToast('error', err.message || 'Error updating section.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 4. Offers Handlers ---
  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (selectedFile) formData.append('image', selectedFile);
      formData.append('title', offerForm.title);
      formData.append('description', offerForm.description);
      formData.append('code', offerForm.code);
      formData.append('discountType', offerForm.discountType);
      formData.append('discountValue', String(offerForm.discountValue));
      formData.append('minOrderAmount', String(offerForm.minOrderAmountRupees * 100));
      if (offerForm.maxDiscountRupees) {
        formData.append('maxDiscount', String(offerForm.maxDiscountRupees * 100));
      }

      await api.createAdminOffer(formData);
      showToast('success', 'Promotion created successfully!');
      setShowOfferModal(false);
      resetFileUpload();
      setOfferForm({
        title: '',
        description: '',
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        minOrderAmountRupees: 299,
        maxDiscountRupees: 100,
      });
      loadAllData();
    } catch (err) {
      showToast('error', err.message || 'Error creating offer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOffer = async (id, code) => {
    if (!confirm(`Delete offer "${code}"?`)) return;
    try {
      await api.deleteAdminOffer(id);
      showToast('success', `Offer "${code}" removed.`);
      loadAllData();
    } catch (err) {
      showToast('error', err.message || 'Error deleting offer.');
    }
  };

  const tabs = [
    { key: 'home', label: 'Home Banners', icon: Sparkles },
    { key: 'menu', label: 'Menu & Categories', icon: UtensilsCrossed },
    { key: 'about', label: 'About Us Sections', icon: Sliders },
    { key: 'offers', label: 'Offers & Coupons', icon: Tag },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Admin Dynamic Content Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Full editing rights over customer-facing sections with automated Cloudinary streaming and Neon storage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllData}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-600' : ''}`} />
            <span>Refresh</span>
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>Customer Site</span>
          </a>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 shadow-xs ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isSelected = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
        <div>
          <h2 className="text-sm sm:text-base font-serif font-bold text-stone-900 capitalize">
            {activeTab.replace('_', ' ')} Management
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Create, replace images, and configure display parameters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'home' && (
            <button
              onClick={() => {
                resetFileUpload();
                setShowBannerModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Banner</span>
            </button>
          )}

          {activeTab === 'menu' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  resetFileUpload();
                  setShowCategoryModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-stone-300 text-stone-700 hover:bg-stone-50"
              >
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>New Category</span>
              </button>
              <button
                onClick={() => {
                  resetFileUpload();
                  setShowItemModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Dish</span>
              </button>
            </div>
          )}

          {activeTab === 'offers' && (
            <button
              onClick={() => {
                resetFileUpload();
                setShowOfferModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon Offer</span>
            </button>
          )}
        </div>
      </div>

      {/* --- TAB 1: HOME BANNERS --- */}
      {activeTab === 'home' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {banners.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-stone-200">
              <p className="text-sm font-semibold text-stone-700">No home banners found.</p>
              <p className="text-xs text-stone-400 mt-1">Upload a hero banner to get started.</p>
            </div>
          ) : (
            banners.map((banner) => (
              <div
                key={banner.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-16/9 bg-stone-100 overflow-hidden">
                  <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2.5 right-2.5 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Order #{banner.displayOrder}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-serif font-bold text-stone-900 text-sm">{banner.title}</h3>
                    {banner.subtitle && (
                      <p className="text-xs text-stone-500 mt-1 line-clamp-2">{banner.subtitle}</p>
                    )}
                    <span className="inline-block mt-2 font-semibold text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200">
                      Button: {banner.buttonText || 'Order Now'} ({banner.buttonLink || '/menu'})
                    </span>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                    <button
                      onClick={() => handleDeleteBanner(banner.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* --- TAB 2: MENU & CATEGORIES --- */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Categories ({categories.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 text-stone-800 text-xs font-semibold border border-stone-200"
                >
                  {c.imageUrl && <img src={c.imageUrl} alt="" className="w-4 h-4 rounded-full object-cover" />}
                  <span>{c.name.replace(' (Sample)', '')}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold">
                    <th className="p-3.5">Dish</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {menuItems.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/60">
                      <td className="p-3.5 flex items-center gap-3">
                        <img
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=120'}
                          alt=""
                          className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <VegBadge isVeg={item.isVeg} />
                            <span className="font-bold text-stone-900">{item.name}</span>
                          </div>
                          <p className="text-stone-400 text-[11px] line-clamp-1 max-w-xs">{item.description}</p>
                        </div>
                      </td>
                      <td className="p-3.5 text-stone-600 font-medium">
                        {item.category?.name?.replace(' (Sample)', '') || 'Main'}
                      </td>
                      <td className="p-3.5 font-bold text-stone-900">
                        {formatPrice(item.price)}
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => handleToggleItemStock(item)}
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            item.isAvailable
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                              : 'bg-rose-50 text-rose-800 border border-rose-300'
                          }`}
                        >
                          {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeleteItem(item.id, item.name)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: ABOUT US --- */}
      {activeTab === 'about' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {aboutSections.map((sec, idx) => (
            <div
              key={sec.id || idx}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                  <img
                    src={sec.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800'}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-stone-900/80 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    Key: {sec.sectionKey || 'heritage'}
                  </div>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-stone-900 text-base">{sec.title}</h3>
                  {sec.subtitle && <p className="text-xs font-semibold text-amber-700 mt-0.5">{sec.subtitle}</p>}
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">{sec.content}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end">
                <button
                  onClick={() => openAboutEdit(sec)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                >
                  Edit Section
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- TAB 4: OFFERS & COUPONS --- */}
      {activeTab === 'offers' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {offers.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-stone-200">
              <p className="text-sm font-semibold text-stone-700">No active promotional offers.</p>
              <p className="text-xs text-stone-400 mt-1">Launch a discount voucher code.</p>
            </div>
          ) : (
            offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {offer.imageUrl && (
                    <div className="aspect-16/9 rounded-xl overflow-hidden bg-stone-100">
                      <img src={offer.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm bg-amber-100 text-amber-900 px-3 py-1 rounded-lg border border-amber-300">
                      {offer.code}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">
                      {offer.discountType === 'FIXED'
                        ? `₹${offer.discountValue / 100} OFF`
                        : `${offer.discountValue}% OFF`}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-stone-900 text-sm">{offer.title}</h4>
                    <p className="text-xs text-stone-500 mt-1">{offer.description}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between">
                  <span className="text-[10px] text-stone-400">
                    Min Order: ₹{Math.round((offer.minOrderAmount || 0) / 100)}
                  </span>
                  <button
                    onClick={() => handleDeleteOffer(offer.id, offer.code)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* --- MODAL 1: ADD BANNER --- */}
      {showBannerModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif font-bold text-stone-900 text-lg">Add Home Banner</h3>
              <button onClick={() => setShowBannerModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBannerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Banner Image *</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-2xl p-4 text-center cursor-pointer bg-stone-50/50 flex flex-col items-center justify-center"
                >
                  {previewUrl ? (
                    <div className="w-full aspect-16/9 rounded-xl overflow-hidden">
                      <img src={previewUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-stone-400 mb-1" />
                      <p className="text-xs font-semibold text-stone-700">Select Banner File</p>
                      <p className="text-[10px] text-stone-400">Auto stream to Cloudinary f_auto, q_auto</p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  placeholder="e.g. Royal Wood-Fired Dum Biryani"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  placeholder="e.g. Slow cooked generational recipe since 1998"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={bannerForm.buttonText}
                    onChange={(e) => setBannerForm({ ...bannerForm, buttonText: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={bannerForm.displayOrder}
                    onChange={(e) => setBannerForm({ ...bannerForm, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowBannerModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Uploading to Cloudinary...' : 'Save Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: ADD CATEGORY --- */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif font-bold text-stone-900 text-lg">New Category</h3>
              <button onClick={() => setShowCategoryModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Category Image (Optional)</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 rounded-2xl p-3 text-center cursor-pointer bg-stone-50"
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="" className="h-20 mx-auto rounded-lg object-cover" />
                  ) : (
                    <span className="text-xs text-stone-500">Choose icon/photo</span>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Starters & Kebabs"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Description</label>
                <input
                  type="text"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: ADD DISH --- */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif font-bold text-stone-900 text-lg">Add Dish</h3>
              <button onClick={() => setShowItemModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleItemSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Dish Photo *</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-2xl p-4 text-center cursor-pointer bg-stone-50"
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="" className="h-28 mx-auto rounded-xl object-cover" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-stone-400 mx-auto mb-1" />
                      <p className="text-xs font-semibold text-stone-700">Upload Dish Image</p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Dish Name *</label>
                  <input
                    type="text"
                    required
                    value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                    placeholder="e.g. Mutton Ghee Roast"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Category *</label>
                  <select
                    value={itemForm.categoryId}
                    onChange={(e) => setItemForm({ ...itemForm, categoryId: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name.replace(' (Sample)', '')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  placeholder="Ingredients and culinary presentation..."
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={itemForm.priceRupees}
                    onChange={(e) => setItemForm({ ...itemForm, priceRupees: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Dietary Classification</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setItemForm({ ...itemForm, isVeg: true })}
                      className={`flex-1 py-2 text-xs font-semibold rounded-xl border ${
                        itemForm.isVeg
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-stone-200 text-stone-600'
                      }`}
                    >
                      Veg
                    </button>
                    <button
                      type="button"
                      onClick={() => setItemForm({ ...itemForm, isVeg: false })}
                      className={`flex-1 py-2 text-xs font-semibold rounded-xl border ${
                        !itemForm.isVeg
                          ? 'border-rose-600 bg-rose-50 text-rose-800'
                          : 'border-stone-200 text-stone-600'
                      }`}
                    >
                      Non-Veg
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
                  <input
                    type="checkbox"
                    checked={itemForm.isAvailable}
                    onChange={(e) => setItemForm({ ...itemForm, isAvailable: e.target.checked })}
                    className="rounded-sm text-amber-600"
                  />
                  <span>Mark In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
                  <input
                    type="checkbox"
                    checked={itemForm.isFeatured}
                    onChange={(e) => setItemForm({ ...itemForm, isFeatured: e.target.checked })}
                    className="rounded-sm text-amber-600"
                  />
                  <span>Featured Dish</span>
                </label>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 4: EDIT ABOUT SECTION --- */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif font-bold text-stone-900 text-lg">
                Edit Section: {aboutForm.sectionKey}
              </h3>
              <button onClick={() => setShowAboutModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAboutSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Replace Image</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 rounded-2xl p-3 text-center cursor-pointer bg-stone-50"
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="" className="h-28 mx-auto rounded-xl object-cover" />
                  ) : (
                    <span className="text-xs text-stone-500">Choose replacement photo</span>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  value={aboutForm.title}
                  onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={aboutForm.subtitle}
                  onChange={(e) => setAboutForm({ ...aboutForm, subtitle: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Content Body *</label>
                <textarea
                  required
                  rows={4}
                  value={aboutForm.content}
                  onChange={(e) => setAboutForm({ ...aboutForm, content: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAboutModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Update Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 5: CREATE OFFER --- */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif font-bold text-stone-900 text-lg">Create Coupon Offer</h3>
              <button onClick={() => setShowOfferModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOfferSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Offer Banner Image (Optional)</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 rounded-2xl p-3 text-center cursor-pointer bg-stone-50"
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="" className="h-24 mx-auto rounded-xl object-cover" />
                  ) : (
                    <span className="text-xs text-stone-500">Choose promotional graphic</span>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    value={offerForm.code}
                    onChange={(e) => setOfferForm({ ...offerForm, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. FEAST50"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Discount Type</label>
                  <select
                    value={offerForm.discountType}
                    onChange={(e) => setOfferForm({ ...offerForm, discountType: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Flat Amount (₹)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Offer Title *</label>
                <input
                  type="text"
                  required
                  value={offerForm.title}
                  onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                  placeholder="e.g. 20% Off Weekend Family Feast"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {offerForm.discountType === 'PERCENTAGE' ? 'Discount (%)' : 'Discount (₹)'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={offerForm.discountValue}
                    onChange={(e) => setOfferForm({ ...offerForm, discountValue: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    value={offerForm.minOrderAmountRupees}
                    onChange={(e) => setOfferForm({ ...offerForm, minOrderAmountRupees: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Max Discount (₹)</label>
                  <input
                    type="number"
                    value={offerForm.maxDiscountRupees}
                    onChange={(e) => setOfferForm({ ...offerForm, maxDiscountRupees: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
