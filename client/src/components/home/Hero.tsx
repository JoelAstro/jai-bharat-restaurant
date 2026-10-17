import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Bike, Star, Sparkles, Flame, CheckCircle2 } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext.js';
import { useCart } from '../../context/CartContext.js';
import { api } from '../../services/api.js';

const defaultHeroImages = [
  { src: '/images/hero/hero-1.jpg', alt: 'Delicious Chicken Dum Biryani in Clay Handi', title: 'Royal Dum Biryani' },
  { src: '/images/hero/hero-2.jpg', alt: 'Crispy Spicy Chicken 65 with Fresh Garnish', title: 'Crispy Chicken 65' },
  { src: '/images/hero/hero-3.jpg', alt: 'Royal Dum Biryani in Copper Handi with Egg & Lemon', title: 'Copper Handi Feast' },
  { src: '/images/hero/hero-4.jpg', alt: 'Aromatic Steaming Chicken Biryani Handi', title: 'Clay Pot Sizzler' },
];

const TickerPhrase: React.FC = () => (
  <span className="inline-flex items-center whitespace-nowrap text-white font-serif uppercase tracking-[0.2em] text-xs sm:text-sm lg:text-base font-bold px-4">
    <span>DELICIOUS FOOD IN</span>
    <span className="font-serif font-black text-amber-300 text-[1.18em] tracking-[0.22em] mx-2 underline decoration-amber-400/50 underline-offset-4">
      NANDIGAMA
    </span>
    <span className="text-amber-400 mx-4 sm:mx-6 text-xs sm:text-sm select-none">✦</span>
    <span>AUTHENTIC FLAVORS</span>
    <span className="text-amber-400 mx-4 sm:mx-6 text-xs sm:text-sm select-none">✦</span>
    <span>FRESHLY PREPARED, SERVED WITH LOVE</span>
    <span className="text-amber-400 mx-4 sm:mx-6 text-xs sm:text-sm select-none">✦</span>
    <span>JAI BHARAT FAMILY RESTAURANT</span>
    <span className="text-amber-400 mx-4 sm:mx-6 text-xs sm:text-sm select-none">✦</span>
  </span>
);

export const Hero: React.FC = () => {
  const { settings } = useRestaurant();
  const { setOrderType } = useCart();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [sliderImages, setSliderImages] = useState(defaultHeroImages);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 1. Accessibility listener for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // 2. Fetch dynamic hero images from database
  useEffect(() => {
    let isMounted = true;
    api
      .getPublicImages('hero')
      .then((data) => {
        if (!isMounted || !data || data.length === 0) return;
        const sorted = [...data].sort((a, b) => {
          if (a.isDefault) return -1;
          if (b.isDefault) return 1;
          return a.displayOrder - b.displayOrder;
        });
        setSliderImages(
          sorted.map((item, idx) => ({
            src: item.imageUrl,
            alt: item.altText || item.title,
            title: item.title || defaultHeroImages[idx]?.title || 'Signature Dish',
          }))
        );
        setCurrentImageIndex(0);
      })
      .catch((err) => {
        console.warn('Using default hero images:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 3. 5.5-second auto-rotation across hero dishes
  useEffect(() => {
    if (sliderImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % sliderImages.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [sliderImages.length]);

  return (
    <div className="relative bg-gradient-to-b from-[#fbf8f3] via-[#f7f2e8] to-[#f4ede1] border-b border-[#e5dcce] overflow-hidden">
      {/* Ambient Lighting & Traditional Glow */}
      <div className="absolute top-10 right-0 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-amber-400/20 via-red-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -left-20 bottom-10 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-red-800/15 via-amber-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Subtle Warm Traditional Pattern Texture */}
      <div
        className="absolute inset-0 opacity-[0.032] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, #991b1b 1.5px, transparent 1.5px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* 1. Main Luxury Editorial Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 sm:pt-16 sm:pb-16 md:pt-20 md:pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Brand Story, Editorial Typography & Tactile CTAs */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-center lg:text-left">
            
            {/* Heritage Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-linear-to-r from-red-100/80 via-amber-100/90 to-red-100/80 border border-amber-500/40 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#991b1b]" />
              <span className="text-[10px] sm:text-xs font-serif font-bold uppercase tracking-[0.22em] text-[#991b1b]">
                Authentic Taste • Nandigama's Pride
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#991b1b]" />
            </div>

            {/* High-Impact Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black text-stone-900 tracking-tight leading-[1.12]">
              Jai Bharat. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#991b1b] via-[#b91c1c] to-amber-700 italic font-normal block sm:inline">
                Where Indian Heritage
              </span>{' '}
              <span className="block text-stone-900 font-serif">Meets Family Warmth.</span>
            </h1>

            {/* Appetizing Subtitle */}
            <p className="text-stone-700 text-xs sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
              From slow-steamed clay handi Dum Biryanis to sizzling tandoor kebabs and hand-ground spice curries — {settings.restaurant_name} invites you to experience genuine Indian recipes prepared fresh daily with whole spices and pure love.
            </p>

            {/* Dual Tactile Bawarchi-Style CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <Link
                to="/menu"
                onClick={() => setOrderType('TAKEAWAY')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#991b1b] to-[#7f1d1d] hover:from-[#881337] hover:to-[#6b0f0f] text-white font-bold text-xs uppercase tracking-wider px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl shadow-lg shadow-red-950/20 hover:shadow-xl hover:shadow-red-950/30 transition-all border border-red-500/30 active:scale-95 group"
              >
                <ShoppingBag className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                <span>Order Pickup</span>
                <span className="hidden sm:inline-block text-[10px] py-0.5 px-1.5 rounded-md bg-black/25 text-amber-200 uppercase font-semibold">
                  20 Min
                </span>
              </Link>

              <Link
                to="/menu"
                onClick={() => setOrderType('DELIVERY')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-stone-950 hover:bg-stone-900 text-white font-bold text-xs uppercase tracking-wider px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl shadow-lg shadow-stone-950/20 hover:shadow-xl transition-all border border-amber-500/40 hover:border-amber-400 active:scale-95 group"
              >
                <Bike className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Order Delivery</span>
                <span className="hidden sm:inline-block text-[10px] py-0.5 px-1.5 rounded-md bg-white/10 text-stone-300 uppercase font-semibold">
                  Doorstep
                </span>
              </Link>
            </div>

            {/* Quality Badges Row */}
            <div className="pt-4 sm:pt-6 border-t border-[#e2d6c3] flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 text-xs">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 border border-stone-200/90 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold text-stone-800 text-[11px] sm:text-xs">Fresh Daily Prep</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 border border-stone-200/90 shadow-2xs">
                <Flame className="w-3.5 h-3.5 text-[#991b1b]" />
                <span className="font-semibold text-stone-800 text-[11px] sm:text-xs">Clay Pot Tandoor</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 border border-stone-200/90 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-semibold text-stone-800 text-[11px] sm:text-xs">Royal Handi Dum</span>
              </div>
            </div>
          </div>

          {/* Right Column: Layered Food Showcase with Floating Culinary Badges */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full max-w-md mx-auto lg:max-w-none">
              
              {/* Outer Decorative Warm Ring & Soft Glow */}
              <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-tr from-amber-500/20 via-red-600/15 to-amber-300/25 rounded-[2.5rem] blur-xl -z-10" />

              {/* Main Image Frame */}
              <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl border-2 sm:border-4 border-amber-300/40 p-1 sm:p-1.5 bg-gradient-to-b from-amber-100/60 via-white to-amber-50">
                <div className="relative w-full h-full rounded-[1.7rem] sm:rounded-[2.2rem] overflow-hidden bg-stone-900">
                  {sliderImages.map((image, idx) => (
                    <img
                      key={`${image.src}-${idx}`}
                      src={image.src}
                      alt={image.alt}
                      className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-out ${
                        idx === currentImageIndex
                          ? 'opacity-100 scale-100 z-10'
                          : 'opacity-0 scale-105 z-0 pointer-events-none'
                      }`}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                    />
                  ))}

                  {/* Subtle Inner Dark Gradient Vignette for Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-10 pointer-events-none" />

                  {/* Active Dish Name Overlay */}
                  <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-5 sm:right-5 z-20 flex items-center justify-between text-white">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 block">
                        SIGNATURE CREATION
                      </span>
                      <p className="font-serif font-bold text-sm sm:text-lg drop-shadow-md">
                        {sliderImages[currentImageIndex]?.title || 'Authentic Specialty'}
                      </p>
                    </div>

                    {/* Interactive Slide Indicator Dots */}
                    <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/20">
                      {sliderImages.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          onClick={() => setCurrentImageIndex(dotIdx)}
                          className={`transition-all rounded-full ${
                            dotIdx === currentImageIndex
                              ? 'w-5 h-2 bg-amber-400'
                              : 'w-2 h-2 bg-white/60 hover:bg-white'
                          }`}
                          aria-label={`Show slide ${dotIdx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Culinary Seal 1: Top Right */}
              <div className="absolute -top-3 -right-2 sm:-top-5 sm:-right-4 z-20 bg-white/95 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-amber-300/80 shadow-xl flex items-center gap-2.5 animate-in fade-in">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs sm:text-sm font-black text-stone-900 leading-none">4.9 ★</span>
                    <span className="text-[10px] text-stone-500 font-medium">Guest Rating</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#991b1b] uppercase tracking-wider block mt-0.5">
                    Authentic Dum Ritual
                  </span>
                </div>
              </div>

              {/* Floating Culinary Seal 2: Bottom Left */}
              <div className="absolute -bottom-3 -left-2 sm:-bottom-5 sm:-left-4 z-20 bg-stone-950/90 text-white backdrop-blur-md px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-amber-400/40 shadow-xl flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-red-950/80 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <Flame className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <span className="text-[11px] sm:text-xs font-bold text-amber-300 block leading-tight">
                    Pure Ghee &amp; Whole Spices
                  </span>
                  <span className="text-[9.5px] sm:text-[10px] text-stone-300 tracking-wider uppercase font-semibold">
                    100% Traditional Handi
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* 2. Full-Width Gilded Continuous Moving Announcement Bar (Connecting Hero to Menu) */}
      <div
        className="w-full bg-[#881337] border-y-2 border-amber-400/60 overflow-hidden select-none h-13 sm:h-15 flex items-center shadow-md relative z-20"
        aria-label="Restaurant highlights ticker"
      >
        <div className="overflow-hidden w-full flex items-center">
          <div
            className={`animate-ticker-marquee flex items-center select-none ${
              prefersReducedMotion ? 'overflow-x-auto justify-center' : ''
            }`}
          >
            {/* Sequence 1 */}
            <div className="flex items-center shrink-0">
              <TickerPhrase />
              <TickerPhrase />
            </div>

            {/* Sequence 2 (Seamless Infinite Loop Clone) */}
            <div className="flex items-center shrink-0" aria-hidden="true">
              <TickerPhrase />
              <TickerPhrase />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
