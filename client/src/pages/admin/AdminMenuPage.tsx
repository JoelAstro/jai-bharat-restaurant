import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  AlertCircle,
  Search,
  SlidersHorizontal,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { Category, MenuItem } from '../../types/index.js';
import { api } from '../../services/api.js';
import { VegBadge } from '../../components/menu/VegBadge.js';
import { useRestaurant } from '../../context/RestaurantContext.js';

export const AdminMenuPage: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal State for Dish
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemForm, setItemForm] = useState({
    name: '',
    categoryId: '',
    description: '',
    priceRupees: 200,
    isVeg: true,
    isAvailable: true,
    isFeatured: false,
    imageUrl: '',
    variations: [] as { name: string; priceRupees: number }[],
    addons: [] as { name: string; priceRupees: number }[],
  });

  const { formatPrice } = useRestaurant();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [cats, menuItems] = await Promise.all([
        api.getCategories(true),
        api.getMenuItems({ isAdmin: true }),
      ]);
      setCategories(cats);
      setItems(menuItems);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setItemForm({
      name: '',
      categoryId: categories[0]?.id || '',
      description: '',
      priceRupees: 200,
      isVeg: true,
      isAvailable: true,
      isFeatured: false,
      imageUrl: '',
      variations: [],
      addons: [],
    });
    setShowItemModal(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      categoryId: item.categoryId,
      description: item.description,
      priceRupees: Math.round(item.price / 100),
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      isFeatured: item.isFeatured,
      imageUrl: item.imageUrl || '',
      variations:
        item.variations?.map((v) => ({
          name: v.name,
          priceRupees: Math.round(v.price / 100),
        })) || [],
      addons:
        item.addons?.map((a) => ({
          name: a.name,
          priceRupees: Math.round(a.price / 100),
        })) || [],
    });
    setShowItemModal(true);
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      await api.toggleMenuItemAvailability(item.id);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    try {
      await api.deleteMenuItem(id);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        name: itemForm.name.trim(),
        categoryId: itemForm.categoryId,
        description: itemForm.description.trim(),
        price: itemForm.priceRupees * 100, // into paise
        isVeg: itemForm.isVeg,
        isAvailable: itemForm.isAvailable,
        isFeatured: itemForm.isFeatured,
        imageUrl: itemForm.imageUrl.trim() || undefined,
        variations: itemForm.variations.map((v) => ({
          name: v.name.trim(),
          price: v.priceRupees * 100,
        })),
        addons: itemForm.addons.map((a) => ({
          name: a.name.trim(),
          price: a.priceRupees * 100,
        })),
      };

      if (editingItem) {
        await api.updateMenuItem(editingItem.id, payload);
      } else {
        await api.createMenuItem(payload);
      }

      setShowItemModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save menu item');
    }
  };

  const addVariationRow = () => {
    setItemForm({
      ...itemForm,
      variations: [...itemForm.variations, { name: '', priceRupees: itemForm.priceRupees }],
    });
  };

  const removeVariationRow = (idx: number) => {
    setItemForm({
      ...itemForm,
      variations: itemForm.variations.filter((_, i) => i !== idx),
    });
  };

  const addAddonRow = () => {
    setItemForm({
      ...itemForm,
      addons: [...itemForm.addons, { name: '', priceRupees: 30 }],
    });
  };

  const removeAddonRow = (idx: number) => {
    setItemForm({
      ...itemForm,
      addons: itemForm.addons.filter((_, i) => i !== idx),
    });
  };

  const filteredItems = items.filter((item) => {
    if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-serif font-bold text-stone-900">
            Menu & Dishes
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Add new dishes, manage sizes, edit prices, or mark dishes out of stock.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar touch-pan-x w-full sm:w-auto -mx-1 px-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-amber-600 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            All Categories ({items.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === c.id
                  ? 'bg-amber-600 text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {c.name.replace(' (Sample)', '')}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish name..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-600"
          />
        </div>
      </div>

      {/* Dishes Table */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[640px]">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold">
                <th className="p-4">Dish</th>
                <th className="p-4">Category</th>
                <th className="p-4">Base Price</th>
                <th className="p-4">Availability</th>
                <th className="p-4">Popular</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/60">
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=120'}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <VegBadge isVeg={item.isVeg} />
                        <span className="font-bold text-stone-900 text-sm">{item.name}</span>
                      </div>
                      <p className="text-stone-400 text-[11px] line-clamp-1 max-w-xs mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </td>

                  <td className="p-4 font-medium text-stone-600">
                    {item.category?.name?.replace(' (Sample)', '')}
                  </td>

                  <td className="p-4 font-bold text-stone-900 text-sm">
                    {formatPrice(item.price)}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                        item.isAvailable
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-50 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </td>

                  <td className="p-4">
                    {item.isFeatured ? (
                      <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full text-[10px]">
                        ★ Featured
                      </span>
                    ) : (
                      <span className="text-stone-400 text-[11px]">—</span>
                    )}
                  </td>

                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-amber-700 hover:bg-stone-100"
                      title="Edit dish"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id, item.name)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete dish"
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

      {/* Create / Edit Dish Modal */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="font-serif font-bold text-stone-900 text-lg sm:text-xl">
                {editingItem ? 'Edit Dish' : 'Add New Menu Dish'}
              </h3>
              <button
                onClick={() => setShowItemModal(false)}
                className="p-2 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Dish Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                    placeholder="e.g. Paneer Lababdar"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Menu Category *
                  </label>
                  <select
                    required
                    value={itemForm.categoryId}
                    onChange={(e) => setItemForm({ ...itemForm, categoryId: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-600 bg-white"
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
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  placeholder="Ingredients, preparation style, and flavour profile..."
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-600 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Base Price (INR ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={itemForm.priceRupees}
                    onChange={(e) => setItemForm({ ...itemForm, priceRupees: parseInt(e.target.value) || 0 })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Dietary Classification *
                  </label>
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

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Featured Dish
                  </label>
                  <label className="flex items-center gap-2 pt-2 cursor-pointer text-xs text-stone-700">
                    <input
                      type="checkbox"
                      checked={itemForm.isFeatured}
                      onChange={(e) => setItemForm({ ...itemForm, isFeatured: e.target.checked })}
                      className="rounded-sm text-amber-600 focus:ring-amber-500"
                    />
                    <span>Highlight on Home</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Food Image URL (Unsplash or direct asset)
                </label>
                <input
                  type="url"
                  value={itemForm.imageUrl}
                  onChange={(e) => setItemForm({ ...itemForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-600"
                />
              </div>

              {/* Variations Builder */}
              <div className="border-t border-stone-100 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-stone-900 uppercase">
                    Portion Sizes / Variations
                  </h4>
                  <button
                    type="button"
                    onClick={addVariationRow}
                    className="text-xs text-amber-700 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Size
                  </button>
                </div>
                {itemForm.variations.map((v, i) => (
                  <div key={i} className="flex gap-2 items-center mb-2">
                    <input
                      type="text"
                      placeholder="e.g. Full Handi or Large"
                      value={v.name}
                      onChange={(e) => {
                        const copy = [...itemForm.variations];
                        copy[i].name = e.target.value;
                        setItemForm({ ...itemForm, variations: copy });
                      }}
                      className="flex-1 text-xs p-2 rounded-xl border border-stone-200"
                    />
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-stone-400">₹</span>
                      <input
                        type="number"
                        placeholder="Price"
                        value={v.priceRupees}
                        onChange={(e) => {
                          const copy = [...itemForm.variations];
                          copy[i].priceRupees = parseInt(e.target.value) || 0;
                          setItemForm({ ...itemForm, variations: copy });
                        }}
                        className="w-24 text-xs p-2 rounded-xl border border-stone-200"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariationRow(i)}
                      className="p-1.5 text-stone-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add-ons Builder */}
              <div className="border-t border-stone-100 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-stone-900 uppercase">
                    Custom Add-ons (e.g. Extra Gravy, Raita)
                  </h4>
                  <button
                    type="button"
                    onClick={addAddonRow}
                    className="text-xs text-amber-700 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Add-on
                  </button>
                </div>
                {itemForm.addons.map((a, i) => (
                  <div key={i} className="flex gap-2 items-center mb-2">
                    <input
                      type="text"
                      placeholder="e.g. Extra Gravy Bowl"
                      value={a.name}
                      onChange={(e) => {
                        const copy = [...itemForm.addons];
                        copy[i].name = e.target.value;
                        setItemForm({ ...itemForm, addons: copy });
                      }}
                      className="flex-1 text-xs p-2 rounded-xl border border-stone-200"
                    />
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-stone-400">₹</span>
                      <input
                        type="number"
                        placeholder="Price"
                        value={a.priceRupees}
                        onChange={(e) => {
                          const copy = [...itemForm.addons];
                          copy[i].priceRupees = parseInt(e.target.value) || 0;
                          setItemForm({ ...itemForm, addons: copy });
                        }}
                        className="w-24 text-xs p-2 rounded-xl border border-stone-200"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAddonRow(i)}
                      className="p-1.5 text-stone-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="flex-1 text-xs font-semibold py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 text-xs font-semibold py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
