import React, { useState } from 'react';
import { Hero } from '../../components/home/Hero.js';
import { BawarchiCategoryGrid } from '../../components/home/BawarchiCategoryGrid.js';
import { FreshnessShowcase } from '../../components/home/FreshnessShowcase.js';
import { HomeQuoteSection } from '../../components/home/HomeQuoteSection.js';
import { CustomerReviewsSection } from '../../components/home/CustomerReviewsSection.js';
import { FindYourJaiBharat } from '../../components/home/FindYourJaiBharat.js';
import { ItemCustomizerModal } from '../../components/menu/ItemCustomizerModal.js';
import { MenuItem } from '../../types/index.js';

export const HomePage: React.FC = () => {
  const [selectedItemForCustomization, setSelectedItemForCustomization] =
    useState<MenuItem | null>(null);

  return (
    <div>
      {/* 1 & 2. Bawarchi-Style Split Editorial Hero & Continuously Moving Announcement Bar */}
      <Hero />

      {/* 3. "Flavors You Can't Resist!" 8-Category Visual Grid */}
      <BawarchiCategoryGrid />

      {/* 4. "Sealed. Steamed. Served." Food Preparation & Freshness Showcase */}
      <FreshnessShowcase />

      {/* 5. Inspirational Quote Section */}
      <HomeQuoteSection />

      {/* 6. "What Our Customers Are Saying" Animated Customer Review Cards */}
      <CustomerReviewsSection />

      {/* 7. "Find Your Jai Bharat" Dedicated Building Photo Card & Nandigama Discovery */}
      <FindYourJaiBharat />

      {/* Food Customization Modal */}
      <ItemCustomizerModal
        item={selectedItemForCustomization}
        onClose={() => setSelectedItemForCustomization(null)}
      />
    </div>
  );
};
