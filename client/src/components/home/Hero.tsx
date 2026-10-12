import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Utensils, Sparkles } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext.js';

export const Hero: React.FC = () => {
  const { settings } = useRestaurant();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check user's OS preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return (
    <div className="relative min-h-[85vh] sm:min-h-[88vh] flex items-center justify-center overflow-hidden bg-stone-950">
      {/* Background Layer: Poster Image (always rendered as base / instant fallback) */}
      <img
        src="/images/restaurant-hero-poster.webp"
        alt="Jai Bharat Cooking Ambience"
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
          videoLoaded && !videoFailed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        loading="eager"
      />

      {/* Cinematic Video Layer (loaded only if reduced motion is disabled) */}
      {!prefersReducedMotion && !videoFailed && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/restaurant-hero-poster.webp"
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => {
            console.info('Local hero video not detected or failed to load. Gracefully displaying cinematic poster fallback.');
            setVideoFailed(true);
          }}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-80' : 'opacity-0'
          }`}
        >
          <source src="/videos/restaurant-hero.mp4" type="video/mp4" />
        </video>
      )}

      {/* Multi-layered Cinematic Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/65 to-black/75 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-stone-950/40 to-stone-950/80 pointer-events-none" />

      {/* Hero Foreground Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        {/* Subtle Brand Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-medium tracking-wide mb-6 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Authentic Indian Family Dining & Fast Delivery</span>
        </div>

        {/* Restaurant Name */}
        <p className="text-amber-500 font-serif tracking-widest uppercase text-sm sm:text-base font-semibold mb-3">
          {settings.restaurant_name}
        </p>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-md">
          Great Food. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
            Beautiful Moments.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="max-w-2xl mx-auto text-base sm:text-xl text-stone-300 font-light leading-relaxed mb-10 drop-shadow-xs">
          Discover your favourites and order with ease. From sizzling starters and fragrant biryanis to rich homestyle gravies prepared fresh on order.
        </p>

        {/* Working Calls to Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link
            to="/menu"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-stone-950 font-bold px-8 py-4 rounded-full text-base shadow-lg shadow-amber-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>Order Now</span>
            <ArrowRight className="w-5 h-5 text-stone-950" />
          </Link>

          <Link
            to="/menu"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-900/80 hover:bg-stone-800 text-white font-medium px-8 py-4 rounded-full text-base border border-stone-700/80 backdrop-blur-md hover:border-amber-500/50 transition-all"
          >
            <Utensils className="w-4 h-4 text-amber-400" />
            <span>Explore Menu</span>
          </Link>
        </div>

        {/* Quick Highlights Strip */}
        <div className="mt-14 pt-8 border-t border-stone-800/80 max-w-3xl mx-auto grid grid-cols-3 gap-4 text-stone-400 text-xs sm:text-sm">
          <div>
            <span className="block text-amber-400 font-bold text-base sm:text-lg">Fresh</span>
            <span>Made to Order</span>
          </div>
          <div>
            <span className="block text-amber-400 font-bold text-base sm:text-lg">Fast</span>
            <span>Hot & Safe Delivery</span>
          </div>
          <div>
            <span className="block text-amber-400 font-bold text-base sm:text-lg">Pure</span>
            <span>Vegetarian & Non-Veg</span>
          </div>
        </div>
      </div>
    </div>
  );
};
