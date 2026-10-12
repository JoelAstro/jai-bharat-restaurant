import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, AlertCircle, X } from 'lucide-react';
import { FoodCard } from '../../components/menu/FoodCard.js';
import { ItemCustomizerModal } from '../../components/menu/ItemCustomizerModal.js';
import { CategoryPills } from '../../components/home/CategoryPills.js';
import { Category, MenuItem } from '../../types/index.js';
import { api } from '../../services/api.js';

export const MenuPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'all'
  );
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [selectedItemForCustomization, setSelectedItemForCustomization] =
    useState<MenuItem | null>(null);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      api.getCategories(),
      api.getMenuItems(),
    ])
      .then(([cats, menuItems]) => {
        setCategories(cats);
        setItems(menuItems);
      })
      .catch((err) => console.error('Menu load failed:', err))
      .finally(() => setIsLoading(false));
  }, []);

  // Update URL search params
  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  // Filter items in memory
  const filteredItems = items.filter((item) => {
    // 1. Category filter
    if (selectedCategory !== 'all' && item.category?.slug !== selectedCategory) {
      return false;
    }

    // 2. Veg / Non-veg filter
    if (vegFilter === 'veg' && !item.isVeg) return false;
    if (vegFilter === 'non-veg' && item.isVeg) return false;

    // 3. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-700 bg-amber-100/70 px-3 py-1 rounded-full">
            Our Kitchen Creations
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 mt-3 mb-3">
            Restaurant Menu
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Authentic Indian culinary flavours freshly cooked on order. Select sizes, customize sides, and enjoy fast doorstep delivery.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200/80 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Live Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes (e.g. Biryani, Paneer, Naan)..."
                className="w-full text-xs sm:text-sm pl-10 pr-9 py-2.5 rounded-2xl border border-stone-200 focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Veg / Non-Veg Diet Toggle */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl w-full sm:w-auto">
              <button
                onClick={() => setVegFilter('all')}
                className={`flex-1 sm:flex-initial text-xs font-semibold px-4 py-2 rounded-xl transition-all ${
                  vegFilter === 'all'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setVegFilter('veg')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl transition-all ${
                  vegFilter === 'veg'
                    ? 'bg-white text-emerald-800 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-emerald-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>Pure Veg</span>
              </button>
              <button
                onClick={() => setVegFilter('non-veg')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl transition-all ${
                  vegFilter === 'non-veg'
                    ? 'bg-white text-rose-800 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-rose-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                <span>Non-Veg</span>
              </button>
            </div>
          </div>

          {/* Category Horizontal Pills */}
          <div className="border-t border-stone-100 pt-2">
            <CategoryPills
              categories={categories}
              selectedSlug={selectedCategory}
              onSelectCategory={handleCategoryChange}
            />
          </div>
        </div>

        {/* Dishes Grid */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-stone-500 text-sm">Loading authentic dishes...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-stone-200 p-8 max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-lg text-stone-800 mb-1">
              No matching dishes found
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Try adjusting your search terms or dietary filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setVegFilter('all');
              }}
              className="text-xs font-semibold bg-amber-600 text-white px-5 py-2.5 rounded-full hover:bg-amber-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onCustomize={(i) => setSelectedItemForCustomization(i)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Item Customizer Modal */}
      <ItemCustomizerModal
        item={selectedItemForCustomization}
        onClose={() => setSelectedItemForCustomization(null)}
      />
    </div>
  );
};
