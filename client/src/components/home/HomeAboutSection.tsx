import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Utensils, Heart, Clock, MapPin, Sparkles } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext.js';

export const HomeAboutSection: React.FC = () => {
  const { settings } = useRestaurant();

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Authentic Photography & Ambience */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-[#faf7f0] bg-stone-100 aspect-4/3 sm:aspect-16/10 lg:aspect-4/3">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
                alt="Jai Bharat Family Restaurant Dining Space"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent pointer-events-none" />
              
              {/* Nandigama Town Badge Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-stone-200 shadow-md flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#991b1b] block">
                    Proudly Serving
                  </span>
                  <p className="font-serif font-bold text-stone-900 text-sm sm:text-base">
                    Nandigama & Surrounding Areas
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Dine-in • Takeaway • Doorstep Delivery
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#991b1b] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Decorative Heritage Accent Tag */}
            <div className="absolute -top-4 -left-4 hidden sm:flex items-center gap-2 bg-[#991b1b] text-white px-4 py-2 rounded-xl shadow-lg text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Nandigama's Choice</span>
            </div>
          </div>

          {/* Right Column: Restaurant Story & Hospitality */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#991b1b] bg-red-50 px-3.5 py-1.5 rounded-full">
              <span>✦</span>
              <span>About Jai Bharat Family Restaurant</span>
              <span>✦</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 leading-tight">
              Delicious Food in <span className="text-[#991b1b]">Nandigama</span>, Prepared Fresh Every Day
            </h2>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Welcome to <strong>{settings.restaurant_name}</strong>. Serving the vibrant community of Nandigama, our restaurant brings families, friends, and food lovers together over genuine Indian recipes cooked with passion and care.
            </p>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              From fragrant handi biryanis and clay-tandoor flatbreads to savoury starters and rich regional curries, each dish on our menu is prepared fresh to order. Whether you are dining with family or ordering your evening meal online, we are committed to delivering great taste and warm hospitality to every table.
            </p>

            {/* Confirmed Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-[#faf7f0] p-4 rounded-2xl border border-stone-200/80 text-left">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-[#991b1b] flex items-center justify-center mb-2.5">
                  <Utensils className="w-4 h-4" />
                </div>
                <h4 className="font-serif font-bold text-stone-900 text-sm mb-1">
                  Cooked to Order
                </h4>
                <p className="text-stone-500 text-xs leading-snug">
                  Fresh Indian curries, aromatic biryanis, and tandoori favourites.
                </p>
              </div>

              <div className="bg-[#faf7f0] p-4 rounded-2xl border border-stone-200/80 text-left">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-[#991b1b] flex items-center justify-center mb-2.5">
                  <Heart className="w-4 h-4" />
                </div>
                <h4 className="font-serif font-bold text-stone-900 text-sm mb-1">
                  Family Hospitality
                </h4>
                <p className="text-stone-500 text-xs leading-snug">
                  A warm, welcoming atmosphere where every guest feels at home.
                </p>
              </div>

              <div className="bg-[#faf7f0] p-4 rounded-2xl border border-stone-200/80 text-left">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-[#991b1b] flex items-center justify-center mb-2.5">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="font-serif font-bold text-stone-900 text-sm mb-1">
                  Daily Service
                </h4>
                <p className="text-stone-500 text-xs leading-snug">
                  Open {settings.operating_hours || '11:00 AM - 11:00 PM'} for takeaway and online delivery.
                </p>
              </div>
            </div>

            {/* Action Links */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
              <Link
                to="/menu"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-xl shadow-md transition-all active:scale-95"
              >
                <span>View Full Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-xl transition-all border border-stone-300 active:scale-95"
              >
                <span>Learn More About Us</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
