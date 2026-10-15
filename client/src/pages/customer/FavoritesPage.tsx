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

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      if (user) {
        const records = await api.getFavorites();
        setFavoriteItems(records.map((r) => r.menuItem));
      } else {
        // Load favorites from local storage
        const storedFavIds: string[] = JSON.parse(
          localStorage.getItem('jb_favorites') || '[]'
        );

        if (storedFavIds.length === 0) {
          setFavoriteItems([]);
        } else {
          const allMenuItems = await api.getMenuItems();
          const filtered = allMenuItems.filter((item: MenuItem) =>
            storedFavIds.includes(item.id)
          );
          setFavoriteItems(filtered);
        }
      }
    } catch (err) {
      console.error('Failed to load favorites:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [user]);

  const handleFavoriteToggle = (_itemId: string) => {
    loadFavorites();
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#991b1b] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-stone-500 text-sm">Loading your favorites...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900">
              Your Favorite Dishes
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              Your hand-picked selection of dishes ready for quick ordering.
            </p>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold bg-[#991b1b] hover:bg-[#7f1d1d] text-white px-5 py-2.5 rounded-full shadow-xs self-start sm:self-auto"
          >
            <span>Explore Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {favoriteItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-14 border border-stone-200/80 text-center max-w-lg mx-auto shadow-xs">
            <Heart className="w-16 h-16 text-stone-300 mx-auto mb-4 stroke-1" />
            <h3 className="font-serif font-bold text-xl text-stone-900 mb-2">
              No favorites saved yet
            </h3>
            <p className="text-stone-500 text-sm mb-6">
              Tap the heart icon on any dish while exploring our menu to save it here for instant access.
            </p>
            <Link
              to="/menu"
              className="bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-full inline-block shadow-sm"
            >
              Browse Restaurant Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteItems.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                isFavorited={true}
                onCustomize={(i) => setSelectedItemForCustomization(i)}
                onToggleFavorite={handleFavoriteToggle}
              />
            ))}
          </div>
        )}

        {selectedItemForCustomization && (
          <ItemCustomizerModal
            item={selectedItemForCustomization}
            onClose={() => setSelectedItemForCustomization(null)}
          />
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
