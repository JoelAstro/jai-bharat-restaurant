import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Utensils, ShieldCheck, Clock, MapPin, ArrowRight } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext.js';

export const AboutUsPage: React.FC = () => {
  const { settings } = useRestaurant();

  return (
    <div className="min-h-screen bg-[#faf7f0] py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#991b1b] bg-red-100/70 px-3.5 py-1 rounded-full mb-3 inline-block">
            Our Culinary Heritage
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 mt-2 mb-4 leading-tight">
            Crafted With Tradition. <br />
            <span className="text-[#991b1b]">Served With Heart.</span>
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Welcome to {settings.restaurant_name}. Our kitchen is founded on an enduring passion for authentic Indian cuisine, where time-honoured culinary techniques meet the finest whole spices and fresh daily ingredients.
          </p>
        </div>

        {/* Feature Split Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm">
          <div className="space-y-5">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              The Art of Slow-Cooked Flavors
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              Every dish prepared in our kitchen honors the depth of regional Indian culinary traditions. From fragrant handi biryanis sealed with aromatic herbs to velvety makhani gravies simmered over gentle heat, our recipes are designed to evoke comfort and celebration.
            </p>
            <p className="text-stone-600 text-sm leading-relaxed">
              We believe great dining is born from uncompromised freshness. Our marinades, tandoori preparations, and curries are made fresh every single day—free from shortcuts or artificial enhancements.
            </p>
            <div className="pt-2">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full transition-all shadow-sm"
              >
                <span>Explore Our Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-md border border-stone-200">
            <img
              src="https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80"
              alt="Traditional Indian Cooking & Spices"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Three Pillars of Jai Bharat */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center space-y-3">
            <div className="w-12 h-12 bg-red-50 text-[#991b1b] rounded-2xl flex items-center justify-center mx-auto">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-stone-900 text-lg">Authentic Recipes</h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              Timeless homestyle preparations and aromatic royal dum recipes passed down through generations.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center space-y-3">
            <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-stone-900 text-lg">Fresh Ingredients</h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              Whole roasted spices ground in-house, farm-fresh vegetables, and premium dairy and poultry.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-stone-900 text-lg">Family Hospitality</h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              Warm Indian hospitality where every guest and online delivery customer is treated like family.
            </p>
          </div>
        </div>

        {/* Location & Hospitality Card */}
        <div className="bg-[#121214] text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-amber-400 text-xs uppercase font-bold tracking-widest">
              Visit Or Order Online
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold">
              Join Us For An Authentic Meal
            </h2>
            <p className="text-stone-400 text-sm max-w-lg leading-relaxed">
              Kitchen open daily: <strong className="text-stone-200">{settings.operating_hours}</strong>. Fresh food prepared on order for takeaway and home delivery.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link
              to="/menu"
              className="bg-[#991b1b] hover:bg-[#b91c1c] text-white font-bold text-sm px-8 py-3.5 rounded-full transition-all text-center shadow-md"
            >
              Order Online
            </Link>
            <Link
              to="/contact"
              className="bg-stone-800 hover:bg-stone-700 text-white font-semibold text-sm px-6 py-3.5 rounded-full transition-all text-center border border-stone-700"
            >
              Contact & Location
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
