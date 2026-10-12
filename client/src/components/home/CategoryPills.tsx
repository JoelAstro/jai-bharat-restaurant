import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Category } from '../../types/index.js';
import { Flame } from 'lucide-react';

interface CategoryPillsProps {
  categories: Category[];
  selectedSlug?: string;
  onSelectCategory?: (slug: string) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedSlug,
  onSelectCategory,
}) => {
  const navigate = useNavigate();

  const handleCategoryClick = (slug: string) => {
    if (onSelectCategory) {
      onSelectCategory(slug);
    } else {
      navigate(`/menu?category=${slug}`);
    }
  };

  return (
    <div className="py-6 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-3 min-w-max px-2">
        <button
          onClick={() => handleCategoryClick('all')}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all border ${
            !selectedSlug || selectedSlug === 'all'
              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
              : 'bg-white text-stone-700 border-stone-200 hover:border-amber-400'
          }`}
        >
          All Dishes
        </button>

        {categories.map((cat) => {
          const isSelected = selectedSlug === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all border ${
                isSelected
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-amber-400'
              }`}
            >
              <span>{cat.name.replace(' (Sample)', '')}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
