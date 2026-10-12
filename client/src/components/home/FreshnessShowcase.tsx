import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ReelCard {
  title: string;
  description: string;
  imageUrl: string;
}

export const FreshnessShowcase: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const reelItems: ReelCard[] = [
    {
      title: 'Sizzling Tawa',
      description: 'Char-grilled on cast iron tawa',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
    },
    {
      title: 'Tandoori Roast',
      description: 'Marinated in yogurt & whole spices',
      imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&q=80',
    },
    {
      title: 'Chef Wok Fire',
      description: 'High heat wok tossed preparations',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
    },
    {
      title: 'Dum Handi Biryani',
      description: 'Sealed with dough & slow cooked',
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80',
    },
    {
      title: 'Spiced Tawa Fry',
      description: 'Crispy carom seeds and fresh curry leaves',
      imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&q=80',
    },
    {
      title: 'Simmering Makhani',
      description: 'Slow simmered with butter and fenugreek',
      imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&q=80',
    },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-[#faf7f0] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight mb-3">
            Freshness. Hospitality
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            Authentic Indian cuisine made fresh daily, using quality ingredients and traditional recipes for bold, unforgettable flavors.
          </p>
        </div>

        {/* Gallery Carousel Container */}
        <div className="relative">
          {/* Scroll Controls */}
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-stone-200 items-center justify-center text-stone-700 hover:text-[#991b1b] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg border border-stone-200 items-center justify-center text-stone-700 hover:text-[#991b1b] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Cards Reel */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-4 pt-2 px-1 snap-x snap-mandatory"
          >
            {reelItems.map((item, idx) => (
              <div
                key={idx}
                className="snap-start shrink-0 w-48 sm:w-56 md:w-60 aspect-[9/16] rounded-2xl overflow-hidden shadow-md relative group border border-stone-200"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="font-serif font-bold text-sm sm:text-base leading-tight mb-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-stone-300 leading-tight">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
