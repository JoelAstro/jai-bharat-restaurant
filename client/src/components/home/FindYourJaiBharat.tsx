import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, Navigation, ArrowRight, UploadCloud } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext.js';

export const FindYourJaiBharat: React.FC = () => {
  const { settings } = useRestaurant();
  const [photoError, setPhotoError] = useState(false);

  // Fallback to building placeholder SVG if the actual photograph is not yet uploaded
  const buildingPhotoSrc = photoError
    ? '/images/building-placeholder.svg'
    : '/images/jai-bharat-building.jpg';

  const mapQuery = encodeURIComponent(
    settings.address
      ? `${settings.restaurant_name}, ${settings.address}, ${settings.city}`
      : 'Jai Bharat Family Restaurant, Nandigama, Andhra Pradesh'
  );
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <section className="py-16 sm:py-24 bg-[#faf7f0] border-b border-stone-200 relative overflow-hidden">
      {/* Background Texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, #991b1b 1.5px, transparent 1.5px)`,
          backgroundSize: '28px 28px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#991b1b] bg-red-100/70 border border-red-200/80 px-3.5 py-1.5 rounded-full mb-3">
            <span>✦</span>
            <span>Visit Nandigama's Favourite</span>
            <span>✦</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight mb-3">
            Find Your Jai Bharat
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            Come dine with family, pick up a freshly packed meal, or order your favourite dishes right to your doorstep in Nandigama.
          </p>
        </div>

        {/* 2-Column Discovery Grid: Building Photo Card + Restaurant Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Dedicated Restaurant Building Exterior Photo Card */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white group">
              <img
                src={buildingPhotoSrc}
                alt="Jai Bharat Family Restaurant Building Exterior - Nandigama"
                onError={() => setPhotoError(true)}
                className={`w-full h-full object-cover object-center transition-transform duration-700 ${
                  photoError ? 'object-contain p-2 bg-[#faf7f0]' : 'group-hover:scale-105'
                }`}
                loading="lazy"
              />

              {/* Status Badge for Development / Missing Upload */}
              {photoError && (
                <div className="absolute top-4 left-4 right-4 bg-stone-900/90 text-white backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-stone-700 shadow-lg flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Upload photo to: <code>public/images/jai-bharat-building.jpg</code></span>
                  </div>
                </div>
              )}

              {/* Lower Overlay Badge */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 pt-10 text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block mb-1">
                  OUR RESTAURANT FACILITY
                </span>
                <p className="font-serif font-bold text-base sm:text-lg">
                  Jai Bharat Family Restaurant
                </p>
                <p className="text-stone-300 text-xs">
                  Nandigama, Andhra Pradesh, India
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Restaurant Location, Hours & Fast Navigation */}
          <div className="lg:col-span-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Address Card */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#991b1b] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-stone-900 text-sm mb-1">
                    Restaurant Address
                  </h4>
                  {settings.address ? (
                    <p className="text-stone-600 text-xs leading-relaxed">
                      {settings.address}, {settings.city} {settings.pincode}
                    </p>
                  ) : (
                    <p className="text-stone-600 text-xs leading-relaxed">
                      Nandigama, Andhra Pradesh
                    </p>
                  )}
                  <span className="text-[10px] text-stone-400 block mt-1">
                    Central Nandigama Location
                  </span>
                </div>
              </div>

              {/* Operating Hours Card */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#991b1b] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-stone-900 text-sm mb-1">
                    Service Hours
                  </h4>
                  <p className="text-stone-700 font-semibold text-xs leading-relaxed">
                    {settings.operating_hours || '11:00 AM - 11:00 PM'}
                  </p>
                  <span className="text-[10px] text-emerald-700 font-medium block mt-1">
                    ● Daily Dine-In & Delivery
                  </span>
                </div>
              </div>

              {/* Phone Inquiries Card */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs flex items-start gap-4 sm:col-span-2">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#991b1b] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-serif font-bold text-stone-900 text-sm mb-1">
                    Table Reservations & Direct Orders
                  </h4>
                  {settings.phone ? (
                    <p className="text-stone-900 font-bold text-sm">
                      <a href={`tel:${settings.phone}`} className="hover:text-[#991b1b] transition-colors">
                        {settings.phone}
                      </a>
                    </p>
                  ) : (
                    <p className="text-stone-600 text-xs leading-relaxed">
                      Online orders and reservations available directly on this website.
                    </p>
                  )}
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    Family banquet and party orders accepted
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-xl shadow-md transition-all active:scale-95"
              >
                <Navigation className="w-4 h-4 text-white" />
                <span>Get Directions (Maps)</span>
              </a>

              <Link
                to="/menu"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-xl transition-all border border-stone-800 active:scale-95"
              >
                <span>Explore Full Menu</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
