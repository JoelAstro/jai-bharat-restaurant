import React, { useState, useEffect } from 'react';
import { Hero } from '../../components/home/Hero.js';
import { CategoryPills } from '../../components/home/CategoryPills.js';
import { FeaturedDishes } from '../../components/home/FeaturedDishes.js';
import { OffersBanner } from '../../components/home/OffersBanner.js';
import { OwnerInfoNotice } from '../../components/home/OwnerInfoNotice.js';
import { ItemCustomizerModal } from '../../components/menu/ItemCustomizerModal.js';
import { Category, MenuItem } from '../../types/index.js';
import { api } from '../../services/api.js';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [selectedItemForCustomization, setSelectedItemForCustomization] =
    useState<MenuItem | null>(null);

  useEffect(() => {
    // Load categories & featured dishes
    Promise.all([
      api.getCategories(),
      api.getMenuItems({ isFeatured: true }),
    ])
      .then(([cats, items]) => {
        setCategories(cats);
        setFeaturedItems(items);
      })
      .catch((err) => {
        console.error('Error fetching homepage data:', err);
      });
  }, []);

  return (
    <div>
      {/* 1. Cinematic Video Hero */}
      <Hero />

      {/* 2. Category Quick Navigation Bar */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryPills categories={categories} />
        </div>
      </div>

      {/* 3. Promotional Offers Banner */}
      <OffersBanner />

      {/* 4. Featured Menu Items */}
      <FeaturedDishes
        items={featuredItems}
        onCustomize={(item) => setSelectedItemForCustomization(item)}
      />

      {/* 5. Configurable Restaurant Details & Notice */}
      <OwnerInfoNotice />

      {/* Item Customizer Modal */}
      <ItemCustomizerModal
        item={selectedItemForCustomization}
        onClose={() => setSelectedItemForCustomization(null)}
      />
    </div>
  );
};
