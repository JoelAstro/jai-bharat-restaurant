import React, { useState, useEffect } from 'react';
import { Hero } from '../../components/home/Hero.js';
import { HomeAboutSection } from '../../components/home/HomeAboutSection.js';
import { BawarchiCategoryGrid } from '../../components/home/BawarchiCategoryGrid.js';
import { FreshnessShowcase } from '../../components/home/FreshnessShowcase.js';
import { FeaturedDishes } from '../../components/home/FeaturedDishes.js';
import { OffersBanner } from '../../components/home/OffersBanner.js';
import { OwnerInfoNotice } from '../../components/home/OwnerInfoNotice.js';
import { ItemCustomizerModal } from '../../components/menu/ItemCustomizerModal.js';
import { MenuItem } from '../../types/index.js';
import { api } from '../../services/api.js';

export const HomePage: React.FC = () => {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [selectedItemForCustomization, setSelectedItemForCustomization] =
    useState<MenuItem | null>(null);

  useEffect(() => {
    api
      .getMenuItems({ isFeatured: true })
      .then((items) => setFeaturedItems(items))
      .catch((err) => console.error('Error fetching featured items:', err));
  }, []);

  return (
    <div>
      {/* 1. Bawarchi-Style Split Editorial Hero with Nandigama Announcement Ticker & Video Banner */}
      <Hero />

      {/* 2. About Jai Bharat Family Restaurant in Nandigama */}
      <HomeAboutSection />

      {/* 3. "Flavors You Can't Resist!" 8-Category Visual Grid with Solid Red Banners */}
      <BawarchiCategoryGrid />

      {/* 3. "Freshness. Hospitality" Kitchen Gallery Carousel */}
      <FreshnessShowcase />

      {/* 4. Featured Specialities from Real Database Menu */}
      <FeaturedDishes
        items={featuredItems}
        onCustomize={(item) => setSelectedItemForCustomization(item)}
      />

      {/* 5. Special Promotional Offers & Coupons */}
      <OffersBanner />

      {/* 6. Location, Hours, & Hospitality Notice */}
      <OwnerInfoNotice />

      {/* Food Customization Modal */}
      <ItemCustomizerModal
        item={selectedItemForCustomization}
        onClose={() => setSelectedItemForCustomization(null)}
      />
    </div>
  );
};
