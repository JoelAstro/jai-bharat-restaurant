import React, { useState, useEffect } from 'react';
import { Star, MessageSquareQuote } from 'lucide-react';

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

/**
 * DEVELOPMENT REVIEW DATA PLACEHOLDERS
 * Per project requirements: If genuine customer reviews have not yet been connected to the DB/API,
 * we use clearly identifiable placeholder data in development rather than inventing fake reviews.
 * These placeholders can easily be replaced by live database entries or Google reviews.
 */
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
    <div className="w-[300px] sm:w-[360px] md:w-[380px] shrink-0 bg-white rounded-2xl p-6 border border-stone-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Card Header: Avatar, Name & Stars */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 text-[#991b1b] font-bold text-sm flex items-center justify-center shrink-0 border border-red-200">
              {review.avatarInitials}
            </div>
            <div>
              <h4 className="font-serif font-bold text-stone-900 text-sm leading-tight">
                {review.customerName}
              </h4>
              <span className="text-[11px] text-stone-500 font-medium block">
                {review.diningType}
              </span>
            </div>
          </div>

          {/* 5-Star Rating */}
          <div className="flex items-center gap-0.5 shrink-0" aria-label={`${review.rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < review.rating
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-stone-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Review Quote Text */}
        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-4">
          “{review.reviewText}”
        </p>
      </div>

      {/* Card Footer: Development Placeholder Notice & Quote Icon */}
      <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
        <span className="italic">
          {review.isDevelopmentPlaceholder ? 'Sample Review Placeholder' : review.date}
        </span>
        <MessageSquareQuote className="w-4 h-4 text-stone-300" />
      </div>
    </div>
  );
};

export const CustomerReviewsSection: React.FC = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-[#faf7f0] border-b border-[#e2d8c6] overflow-hidden relative">
      {/* Background Subtle Texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, #991b1b 1.5px, transparent 1.5px)`,
          backgroundSize: '28px 28px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-14 text-center relative z-10">
        {/* Section Heading */}
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#991b1b] bg-red-100/70 border border-red-200/80 px-3.5 py-1.5 rounded-full mb-3">
          <span>✦</span>
          <span>Guest Testimonials</span>
          <span>✦</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight mb-3">
          What Our Customers Are Saying
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          Honest feedback from the families and diners who make Jai Bharat Family Restaurant their home for great food in Nandigama.
        </p>
      </div>

      {/* Continuously Moving Review Cards Row */}
      <div className="w-full overflow-hidden select-none relative z-10">
        {/* Subtle Fade Gradients on edges for smooth visual entrance and exit matching cream bg */}
        <div className="absolute left-0 inset-y-0 w-12 sm:w-24 bg-gradient-to-r from-[#faf7f0] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-12 sm:w-24 bg-gradient-to-l from-[#faf7f0] to-transparent z-10 pointer-events-none" />

        <div className="overflow-hidden w-full flex items-center">
          <div
            className={`animate-reviews-marquee flex items-center gap-6 py-2 ${
              prefersReducedMotion ? 'overflow-x-auto justify-center' : ''
            }`}
          >
            {/* Sequence 1 */}
            <div className="flex items-center gap-6 shrink-0">
              {PLACEHOLDER_REVIEWS.map((review) => (
                <ReviewCard key={`s1-${review.id}`} review={review} />
              ))}
            </div>

            {/* Sequence 2 (Seamless Infinite Loop Clone) */}
            <div className="flex items-center gap-6 shrink-0" aria-hidden="true">
              {PLACEHOLDER_REVIEWS.map((review) => (
                <ReviewCard key={`s2-${review.id}`} review={review} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Accessible hint and development note */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 text-center">
        <p className="text-[11px] text-stone-400">
          Hover over cards to pause • Smooth automatic scrolling • Verified diner reviews can be configured in admin
        </p>
      </div>
    </section>
  );
};
