import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Sparkles, Utensils, Play, Pause } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext.js';
import { useCart } from '../../context/CartContext.js';

export const Hero: React.FC = () => {
  const { settings } = useRestaurant();
  const { setOrderType } = useCart();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return (
    <div className="relative bg-[#faf7f0] border-b border-stone-200 overflow-hidden">
      {/* Background Subtle Sunburst / Mandala Watermark Texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, #991b1b 1.5px, transparent 1.5px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* 1. Main Bawarchi-Style Split Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Editorial Typography & Dual Order Buttons */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#991b1b]">
              <span>✦</span>
              <span>Crafted With Tradition</span>
              <span>✦</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 tracking-tight leading-[1.1]">
              Jai Bharat. <br />
              <span className="text-stone-900">
                Where Indian Cuisine Meets Tradition
              </span>
            </h1>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
              Embark on a flavourful journey through the rich heritage of Indian cuisine. From timeless recipes to the finest whole spices, {settings.restaurant_name} offers an authentic dining experience that celebrates tradition with every dish.
            </p>

            {/* Dual Bawarchi-Style CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/menu"
                onClick={() => setOrderType('TAKEAWAY')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <span>Order Pickup</span>
              </Link>

              <Link
                to="/menu"
                onClick={() => setOrderType('DELIVERY')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-all border border-stone-800 active:scale-95"
              >
                <span>Order Delivery</span>
              </Link>
            </div>

            {/* Quality Badges */}
            <div className="pt-6 border-t border-stone-200/80 flex items-center justify-center lg:justify-start gap-8 text-xs text-stone-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="font-medium text-stone-700">Fresh Daily Prep</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#991b1b]" />
                <span className="font-medium text-stone-700">Authentic Clay Tandoor</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                <span className="font-medium text-stone-700">Royal Handi Biryani</span>
              </div>
            </div>
          </div>

          {/* Right Column: Signature Dish Photography with Steam & Copper Handi */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-square sm:aspect-4/3 lg:aspect-square w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=900&q=85"
                alt="Signature Handi Biryani Jai Bharat"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />

              {/* Gradient Overlay for Mood & Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Signature Dish Badge */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-stone-100">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#991b1b] block">
                    House Speciality
                  </span>
                  <h4 className="font-serif font-bold text-stone-900 text-sm sm:text-base">
                    Hyderabadi Dum Biryani
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Aged basmati rice, royal aromatics, sealed handi
                  </p>
                </div>
                <Link
                  to="/menu"
                  className="bg-[#991b1b] hover:bg-[#7f1d1d] text-white p-2.5 rounded-xl shadow-xs transition-colors shrink-0"
                  title="Order now"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Full-Width Sizzling Cooking Video Showcase Section */}
      <div className="relative bg-stone-950 text-white overflow-hidden py-14 sm:py-20 border-t border-stone-800">
        {/* Background Poster (Instant Fallback) */}
        <img
          src="/images/restaurant-hero-poster.webp"
          alt="Jai Bharat Cooking Ambience"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
            videoLoaded && !videoFailed && isPlaying ? 'opacity-30' : 'opacity-60'
          }`}
          loading="eager"
        />

        {/* Video Element */}
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
              console.info('Hero video asset not available. Displaying high-res cooking poster.');
              setVideoFailed(true);
            }}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
              videoLoaded && isPlaying ? 'opacity-40' : 'opacity-0'
            }`}
          >
            <source src="/videos/restaurant-hero.mp4" type="video/mp4" />
          </video>
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/70 to-stone-950/90 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
              Live From Our Kitchen
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Sizzling Tawa, Aromatic Spices, Pure Passion.
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Watch our chefs prepare authentic Indian curries, tandoor flatbreads, and sizzling kebabs made to order.
            </p>
            <div className="pt-2">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full transition-all shadow-md"
              >
                <span>Browse Full Menu</span>
                <ArrowRight className="w-4 h-4 text-stone-950" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
