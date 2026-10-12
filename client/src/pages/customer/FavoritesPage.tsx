import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { FoodCard } from '../../components/menu/FoodCard.js';
import { ItemCustomizerModal } from '../../components/menu/ItemCustomizerModal.js';
import { MenuItem } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.js';

export const FavoritesPage: React.FC = () => {
  const [favoriteItems, setFavoriteItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItemForCustomization, setSelectedItemForCustomization] =
    useState<MenuItem | null>(null);

  const { user } = useAuth();

  const loadFavorites = () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    api
      .getFavorites()
      .then((records) => {
        const items = records.map((r) => r.menuItem);
        setFavoriteItems(items);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadFavorites();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <Heart className="w-16 h-16 text-stone-300 mb-4" />
        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">
          Log in to view your favorite dishes
        </h2>
        <p className="text-stone-500 text-sm mb-6">
          Save your favourite biryanis, starters, and gravies for instant ordering.
        </p>
        <Link
          to="/auth"
          className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm px-6 py-3 rounded-full"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-stone-500 text-sm">Loading your favourites...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900">
              Your Favourite Dishes
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              Quickly re-order the dishes you love most.
            </p>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-full shadow-xs"
          >
            <span>Explore Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {favoriteItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-md mx-auto">
            <Heart className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="font-serif font-bold text-lg text-stone-800 mb-1">
              No favourites saved yet
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Click the heart icon on any menu item to add it to your favourites.
            </p>
            <Link
              to="/menu"
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-6 py-2.5 rounded-full"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteItems.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                isFavorited={true}
                onToggleFavorite={loadFavorites}
                onCustomize={(i) => setSelectedItemForCustomization(i)}
              />
            ))}
          </div>
        )}
      </div>

      <ItemCustomizerModal
        item={selectedItemForCustomization}
        onClose={() => setSelectedItemForCustomization(null)}
      />
    </div>
  );
};
