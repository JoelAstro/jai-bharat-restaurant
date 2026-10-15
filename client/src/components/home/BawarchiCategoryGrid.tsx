import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api.js';

interface CategoryCard {
  title: string;
  categorySlug: string;
  imageUrl: string;
}

const defaultCategories: CategoryCard[] = [
  {
    title: 'Appetizers',
    categorySlug: 'starters',
    imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=80',
  },
  {
    title: 'Indo-Chinese',
    categorySlug: 'starters',
    imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80',
  },
  {
    title: 'Signature Biryanis',
    categorySlug: 'biryani-rice',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80',
  },
  {
    title: 'Entrees & Curries',
    categorySlug: 'main-course',
    imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&q=80',
  },
  {
    title: 'Fresh Tandoori Breads',
    categorySlug: 'breads',
    imageUrl: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&q=80',
  },
  {
    title: 'Vegetarian Delicacies',
    categorySlug: 'main-course',
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80',
  },
  {
    title: 'Tandoori & Kebab Specials',
    categorySlug: 'starters',
    imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&q=80',
  },
  {
    title: 'Desserts & Beverages',
    categorySlug: 'desserts-beverages',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80',
  },
];

export const BawarchiCategoryGrid: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryCard[]>(defaultCategories);

  useEffect(() => {
    let isMounted = true;
    api
      .getPublicImages('categories')
      .then((data) => {
        if (!isMounted || !data || data.length === 0) return;
        const mapped = data.map((item, idx) => {
          let categorySlug = defaultCategories[idx]?.categorySlug || 'menu';
          try {
            if (item.metadata) {
              const meta = JSON.parse(item.metadata);
              if (meta.categorySlug) categorySlug = meta.categorySlug;
            }
          } catch {
            // Keep default
          }
          return {
            title: item.title,
            imageUrl: item.imageUrl,
            categorySlug,
          };
        });
        setCategories(mapped);
      })
      .catch((err) => {
        console.warn('Using default category cards:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCardClick = (slug: string) => {
    navigate(`/menu?category=${slug}`);
  };

  return (
    <section className="py-16 sm:py-24 bg-[#faf7f0] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight mb-3">
            Flavors You Can't Resist!
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            From flavorful appetizers to authentic biryanis, these dishes embody the rich traditions of India and make every meal unforgettable.
          </p>
        </div>

        {/* 4x2 Category Card Grid with Iconic Red Bottom Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => handleCardClick(cat.categorySlug)}
              className="group cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white border border-stone-200/80 flex flex-col transform hover:-translate-y-1"
            >
              {/* Dish Photo */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                <img
                  src={cat.imageUrl}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>

              {/* Iconic Bawarchi-Style Solid Red Label Banner */}
              <div className="bg-[#991b1b] group-hover:bg-[#7f1d1d] transition-colors py-3 px-4 text-center">
                <span className="font-serif font-bold text-sm text-white tracking-wide block">
                  {cat.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
