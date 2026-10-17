import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../../services/api.js';

interface CategoryCard {
  title: string;
  categorySlug: string;
  imageUrl: string;
  badge?: string;
}

const defaultCategories: CategoryCard[] = [
  {
    title: 'Appetizers & Starters',
    categorySlug: 'starters',
    imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=80',
    badge: 'Tandoor Specials',
  },
  {
    title: 'Indo-Chinese Sizzlers',
    categorySlug: 'starters',
    imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80',
    badge: 'Wok Sizzled',
  },
  {
    title: 'Signature Dum Biryanis',
    categorySlug: 'biryani-rice',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80',
    badge: 'Royal Handi',
  },
  {
    title: 'Rich Indian Curries',
    categorySlug: 'main-course',
    imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&q=80',
    badge: 'Simmered Gravies',
  },
  {
    title: 'Clay Oven Naans & Breads',
    categorySlug: 'breads',
    imageUrl: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&q=80',
    badge: 'Fresh From Tandoor',
  },
  {
    title: 'Vegetarian Delicacies',
    categorySlug: 'main-course',
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80',
    badge: 'Pure Vegetarian',
  },
  {
    title: 'Tandoori Kebabs & Tikkas',
    categorySlug: 'starters',
    imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&q=80',
    badge: 'Charcoal Grilled',
  },
  {
    title: 'Desserts & Beverages',
    categorySlug: 'desserts-beverages',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80',
    badge: 'Sweet Celebrations',
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
            badge: defaultCategories[idx]?.badge || 'Specialty',
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
    <section className="py-12 sm:py-20 lg:py-24 bg-[#fcfaf5] border-b border-[#e7decb] relative overflow-hidden">
      {/* Background Subtle Traditional Motif Texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, #991b1b 1.5px, transparent 1.5px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Editorial Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#881337] text-[10px] sm:text-xs font-serif font-bold uppercase tracking-[0.22em] mb-2 sm:mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Culinary Specialties</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black text-stone-900 tracking-tight mb-2 sm:mb-3">
            Flavors You Can't Resist!
          </h2>
          
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#c99a4c]/60" />
            <span className="text-[#c99a4c] text-xs">✦</span>
            <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#c99a4c]/60" />
          </div>

          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
            From smoky clay tandoor starters and slow-simmered handi curries to fragrant dum biryanis, explore authentic dishes prepared with passion and genuine Indian spices.
          </p>
        </div>

        {/* 4x2 Category Card Grid with Layered Vignette and Golden Accents */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => handleCardClick(cat.categorySlug)}
              className="group cursor-pointer rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 bg-white border border-[#e2d8c3] flex flex-col justify-between transform hover:-translate-y-1.5 active:scale-98 relative"
            >
              {/* Dish Photo Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900 shrink-0">
                <img
                  src={cat.imageUrl}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Subtle Multi-Stop Vignette Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent group-hover:opacity-90 transition-opacity" />

                {/* Category Micro-Badge */}
                {cat.badge && (
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[9px] sm:text-[10px] font-bold text-amber-300 uppercase tracking-wider border border-white/15">
                      {cat.badge}
                    </span>
                  </div>
                )}

                {/* Bottom Overlay Info inside the Image Area for Rich Visual Integration */}
                <div className="absolute bottom-2.5 left-3 right-3 sm:bottom-3 sm:left-4 sm:right-4 z-10 flex items-end justify-between">
                  <div className="min-w-0 pr-1">
                    <span className="text-[9px] sm:text-[10px] text-amber-400 font-serif uppercase tracking-widest block drop-shadow-sm">
                      Specialty
                    </span>
                    <h3 className="font-serif font-bold text-xs sm:text-base text-white tracking-wide truncate drop-shadow-md">
                      {cat.title}
                    </h3>
                  </div>

                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 backdrop-blur-md group-hover:bg-[#991b1b] border border-white/30 group-hover:border-amber-400 flex items-center justify-center shrink-0 transition-all text-white">
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Iconic Bawarchi Red Action Bar */}
              <div className="bg-[#991b1b] group-hover:bg-[#881337] transition-colors py-2 px-3 text-center border-t border-red-700/50 flex items-center justify-center gap-1.5 mt-auto">
                <span className="text-[10px] sm:text-xs font-bold text-amber-200 uppercase tracking-wider">
                  View Full Selection
                </span>
                <span className="text-amber-300 text-xs group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>

        {/* View All Menu CTA */}
        <div className="mt-8 sm:mt-12 text-center">
          <button
            onClick={() => navigate('/menu')}
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider px-7 py-3 rounded-xl border border-amber-500/30 hover:border-amber-400 shadow-md transition-all active:scale-95"
          >
            <span>Browse Complete Restaurant Menu</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>

      </div>
    </section>
  );
};
