import React, { useState } from 'react';
import { Plus, Heart, SlidersHorizontal } from 'lucide-react';
import { MenuItem } from '../../types/index.js';
import { VegBadge } from './VegBadge.js';
import { useRestaurant } from '../../context/RestaurantContext.js';
import { useCart } from '../../context/CartContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { api } from '../../services/api.js';

interface FoodCardProps {
  item: MenuItem;
  onCustomize: (item: MenuItem) => void;
  isFavorited?: boolean;
  onToggleFavorite?: (itemId: string) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  item,
  onCustomize,
  isFavorited = false,
  onToggleFavorite,
}) => {
  const { formatPrice } = useRestaurant();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [favoriteActive, setFavoriteActive] = useState(isFavorited);

  const hasOptions =
    (item.variations && item.variations.length > 0) ||
    (item.addons && item.addons.length > 0);

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.isAvailable) return;
    if (hasOptions) {
      onCustomize(item);
    } else {
      addItem(item, 1);
    }
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      alert('Please log in to save dishes to your favorites.');
      return;
    }
    try {
      setFavoriteActive(!favoriteActive);
      const res = await api.toggleFavorite(item.id);
      setFavoriteActive(res.isFavorite);
      if (onToggleFavorite) onToggleFavorite(item.id);
    } catch {
      setFavoriteActive(favoriteActive);
    }
  };

  return (
    <div
      onClick={() => onCustomize(item)}
      className={`group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer ${
        !item.isAvailable ? 'opacity-70 grayscale-30' : ''
      }`}
    >
      <div>
        {/* Dish Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
          <img
            src={
              item.imageUrl ||
              'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80'
            }
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Badges on Image */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <VegBadge isVeg={item.isVeg} />
            {item.isFeatured && (
              <span className="bg-amber-600/90 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                Popular
              </span>
            )}
          </div>

          {/* Favorite Toggle Button */}
          <button
            onClick={handleFavoriteClick}
            aria-label="Save to favorites"
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-xs text-stone-700 hover:text-rose-600 shadow-sm transition-colors"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                favoriteActive ? 'fill-rose-500 text-rose-500' : ''
              }`}
            />
          </button>

          {/* Unavailable Ribbon */}
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center">
              <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg group-hover:text-amber-700 transition-colors line-clamp-1">
              {item.name}
            </h3>
          </div>

          <p className="text-stone-500 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4">
            {item.description}
          </p>
        </div>
      </div>

      {/* Bottom Pricing & Action Bar */}
      <div className="p-4 sm:p-5 pt-0 flex items-center justify-between border-t border-stone-100 mt-auto">
        <div>
          <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider block">
            Price
          </span>
          <span className="font-bold text-base sm:text-lg text-stone-900">
            {formatPrice(item.price)}
          </span>
        </div>

        <div>
          {item.isAvailable ? (
            <button
              onClick={handleAddClick}
              className={`flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl transition-all shadow-xs ${
                hasOptions
                  ? 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              {hasOptions ? (
                <>
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Customize</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </>
              )}
            </button>
          ) : (
            <span className="text-xs text-stone-400 font-medium px-2 py-1">
              Unavailable
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
