import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRestaurant } from '../../context/RestaurantContext.js';
import { useCart } from '../../context/CartContext.js';

const heroImages = [
  { src: '/images/hero/hero-1.jpg', alt: 'Delicious Chicken Dum Biryani in Clay Handi' },
  { src: '/images/hero/hero-2.jpg', alt: 'Crispy Spicy Chicken 65 with Fresh Garnish' },
  { src: '/images/hero/hero-3.jpg', alt: 'Royal Dum Biryani in Copper Handi with Egg & Lemon' },
  { src: '/images/hero/hero-4.jpg', alt: 'Aromatic Steaming Chicken Biryani Handi' },
];

const TickerPhrase: React.FC = () => (
  <span className="inline-flex items-center whitespace-nowrap text-white font-serif uppercase tracking-[0.2em] text-base sm:text-lg lg:text-xl font-bold px-4">
    <span>DELICIOUS FOOD IN</span>
    <span className="font-serif font-black text-white text-[1.18em] tracking-[0.22em] mx-2 underline decoration-white/40 underline-offset-4">
      NANDIGAMA
    </span>
    <span className="text-white/90 mx-5 text-sm sm:text-base select-none">✦</span>
    <span>AUTHENTIC FLAVORS</span>
    <span className="text-white/90 mx-5 text-sm sm:text-base select-none">✦</span>
    <span>FRESHLY PREPARED, SERVED WITH LOVE</span>
    <span className="text-white/90 mx-5 text-sm sm:text-base select-none">✦</span>
    <span>JAI BHARAT FAMILY RESTAURANT</span>
    <span className="text-white/90 mx-5 text-sm sm:text-base select-none">✦</span>
  </span>
);

export const Hero: React.FC = () => {
  const { settings } = useRestaurant();
  const { setOrderType } = useCart();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // 1. Accessibility listener for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // 2. 6-second auto-rotation across the 4 user-provided hero images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  // 3. Scroll listener: hide full-width announcement bar at very top, reveal on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

          {/* Right Column: 4-Image Slideshow (No overlay card, changes every 6s with fade) */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-square sm:aspect-4/3 lg:aspect-square w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100">
              {heroImages.map((image, idx) => (
                <img
                  key={image.src}
                  src={image.src}
                  alt={image.alt}
                  className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
                    idx === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Full-Width Continuous Moving Red Bar (Below entire hero section, straight edges, hidden at top, reveals on scroll) */}
      <div
        className={`w-full bg-[#991b1b] overflow-hidden select-none transition-all duration-700 ease-in-out h-14 sm:h-16 flex items-center ${
          isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'
        }`}
        aria-hidden={!isScrolled}
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

