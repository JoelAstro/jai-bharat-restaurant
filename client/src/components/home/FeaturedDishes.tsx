import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { MenuItem } from '../../types/index.js';
import { FoodCard } from '../menu/FoodCard.js';

interface FeaturedDishesProps {
  items: MenuItem[];
  onCustomize: (item: MenuItem) => void;
}

export const FeaturedDishes: React.FC<FeaturedDishesProps> = ({
  items,
  onCustomize,
}) => {
  return (
    <section className="py-16 bg-[#fdfbf7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Chef's Recommendations</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              Featured Specialities
            </h2>
            <p className="text-stone-500 text-sm mt-1">
              Top requested curries, aromatic biryanis, and tandoori favourites.
            </p>
          </div>

          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800 transition-colors"
          >
            <span>View Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid of Food Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.slice(0, 8).map((item) => (
            <FoodCard key={item.id} item={item} onCustomize={onCustomize} />
          ))}
        </div>
      </div>
    </section>
  );
};
