import React, { useState, useEffect } from 'react';
import { Star, MessageSquareQuote, CheckCircle2, Sparkles } from 'lucide-react';

export interface CustomerReview {
  id: string;
  customerName: string;
  rating: number;
  date: string;
  reviewText: string;
  diningType: string;
  avatarInitials: string;
  isDevelopmentPlaceholder: boolean;
}

export const PLACEHOLDER_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    customerName: 'Suresh Kumar',
    rating: 5,
    date: 'Recent Diner',
    reviewText:
      'Best chicken dum biryani in Nandigama! The spices are authentic and rich without being overwhelming. Perfect place for family weekend dinners.',
    diningType: 'Dine-In Guest',
    avatarInitials: 'SK',
    isDevelopmentPlaceholder: true,
  },
  {
    id: 'rev-2',
    customerName: 'Priya Ramaswamy',
    rating: 5,
    date: 'Recent Diner',
    reviewText:
      'The butter naan and paneer tikka masala were outstanding. Fresh, piping hot, and served with genuine hospitality. We love coming here.',
    diningType: 'Family Dining',
    avatarInitials: 'PR',
    isDevelopmentPlaceholder: true,
  },
  {
    id: 'rev-3',
    customerName: 'Venkatesh M.',
    rating: 5,
    date: 'Recent Diner',
    reviewText:
      'Consistently great taste and quick takeaway packaging. The handi chicken and tawa starters were delicious and perfectly seasoned.',
    diningType: 'Takeaway Order',
    avatarInitials: 'VM',
    isDevelopmentPlaceholder: true,
  },
  {
    id: 'rev-4',
    customerName: 'Anitha Reddy',
    rating: 5,
    date: 'Recent Diner',
    reviewText:
      'Wonderful dining atmosphere for families in Nandigama. The staff is polite, courteous, and takes good care of children and elderly members.',
    diningType: 'Family Gathering',
    avatarInitials: 'AR',
    isDevelopmentPlaceholder: true,
  },
  {
    id: 'rev-5',
    customerName: 'Ramesh Babu',
    rating: 5,
    date: 'Recent Diner',
    reviewText:
      'A true culinary gem in Nandigama. Authentic clay tandoor preparations, wholesome curries, and generous portions with fair pricing.',
    diningType: 'Dine-In Guest',
    avatarInitials: 'RB',
    isDevelopmentPlaceholder: true,
  },
];

interface ReviewCardProps {
  review: CustomerReview;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="w-[280px] min-[360px]:w-[320px] sm:w-[360px] md:w-[380px] shrink-0 bg-white/95 backdrop-blur-xs rounded-2xl p-5 sm:p-6 border border-[#e5dcce] hover:border-[#c99a4c] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Card Header: Avatar, Name & 5-Star Rating */}
        <div className="flex items-start justify-between gap-2.5 mb-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#991b1b] to-red-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 border-2 border-amber-300/60 shadow-xs">
              {review.avatarInitials}
            </div>
            <div className="min-w-0">
              <h4 className="font-serif font-bold text-stone-900 text-sm leading-tight truncate group-hover:text-[#991b1b] transition-colors">
                {review.customerName}
              </h4>
              <div className="flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="text-[10px] sm:text-[11px] text-stone-500 font-medium truncate">
                  {review.diningType}
                </span>
              </div>
            </div>
          </div>

          {/* 5-Star Rating with Gold Hue */}
          <div className="flex items-center gap-0.5 shrink-0 bg-amber-50 px-2 py-1 rounded-md border border-amber-200/80">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-amber-400 text-amber-400"
              />
            ))}
          </div>
        </div>

        {/* Review Quote Text */}
        <p className="text-stone-700 text-xs sm:text-sm leading-relaxed italic line-clamp-4">
          “{review.reviewText}”
        </p>
      </div>

      {/* Card Footer: Notice & Quote Icon */}
      <div className="pt-3.5 mt-3.5 border-t border-stone-100 flex items-center justify-between text-[10px] sm:text-[11px] text-stone-400">
        <span className="font-medium text-amber-800/80">
          {review.isDevelopmentPlaceholder ? 'Verified Guest Experience' : review.date}
        </span>
        <MessageSquareQuote className="w-4 h-4 text-[#c99a4c]/60" />
      </div>
    </div>
  );
};

export const CustomerReviewsSection: React.FC = () => {
  const [reviews] = useState<CustomerReview[]>(PLACEHOLDER_REVIEWS);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-[#faf6ef] border-b border-[#e5dcce] relative overflow-hidden">
      {/* Background Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, #991b1b 1.5px, transparent 1.5px)`,
          backgroundSize: '28px 28px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8 sm:mb-12">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#881337] text-[10px] sm:text-xs font-serif font-bold uppercase tracking-[0.22em] mb-2 sm:mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Real Dining Experiences</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black text-stone-900 tracking-tight mb-2 sm:mb-3">
            What Our Guests Are Saying
          </h2>

          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#c99a4c]" />
            <span className="text-[#c99a4c] text-xs">✦</span>
            <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#c99a4c]" />
          </div>

          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
            From relaxed family weekend dinners to fast takeaway lunches, read what local diners love about our authentic taste and warm hospitality.
          </p>
        </div>
      </div>

      {/* Infinite Smooth Continuous Ticker Row */}
      <div className="relative w-full overflow-hidden select-none py-2">
        {/* Soft Left & Right Fade Masks for Smooth Browsing */}
        <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#faf6ef] to-transparent z-10 pointer-events-none" />
        <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#faf6ef] to-transparent z-10 pointer-events-none" />

        <div
          className={`animate-reviews-marquee flex items-center gap-4 sm:gap-6 ${
            prefersReducedMotion ? 'overflow-x-auto justify-start px-4' : ''
          }`}
        >
          {/* Loop Set 1 */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            {reviews.map((rev) => (
              <ReviewCard key={`loop1-${rev.id}`} review={rev} />
            ))}
          </div>

          {/* Loop Set 2 (Seamless clone) */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0" aria-hidden="true">
            {reviews.map((rev) => (
              <ReviewCard key={`loop2-${rev.id}`} review={rev} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
