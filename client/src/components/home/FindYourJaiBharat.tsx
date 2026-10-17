import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, Navigation, ArrowRight, UploadCloud, Users, Sparkles } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext.js';
import { api } from '../../services/api.js';

export const FindYourJaiBharat: React.FC = () => {
  const { settings } = useRestaurant();
  const [buildingSrc, setBuildingSrc] = useState<string>('/images/jai-bharat-building.jpg');
  const [photoError, setPhotoError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    api
      .getPublicImages('building')
      .then((data) => {
        if (isMounted && data && data.length > 0 && data[0].imageUrl) {
          setBuildingSrc(data[0].imageUrl);
        }
      })
      .catch((err) => {
        console.warn('Using default building image path:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const buildingPhotoSrc = photoError ? '/images/building-placeholder.svg' : buildingSrc;

  const mapQuery = encodeURIComponent(
    settings.address
      ? `${settings.restaurant_name}, ${settings.address}, ${settings.city}`
      : 'Jai Bharat Family Restaurant, Nandigama, Andhra Pradesh'
  );
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-gradient-to-b from-[#f8f3ea] to-[#f4eee3] border-b border-[#dfd4c0] relative overflow-hidden">
      {/* Background Subtle Traditional Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, #991b1b 1.5px, transparent 1.5px)`,
          backgroundSize: '28px 28px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-linear-to-r from-red-100/90 via-amber-100/90 to-red-100/90 border border-amber-500/40 text-[#991b1b] text-[10px] sm:text-xs font-serif font-bold uppercase tracking-[0.22em] shadow-xs mb-2 sm:mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Visit Nandigama's Landmark</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black text-stone-900 tracking-tight mb-2 sm:mb-3">
            Find Your Jai Bharat
          </h2>

          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#c99a4c]" />
            <span className="text-[#c99a4c] text-xs">✦</span>
            <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#c99a4c]" />
          </div>

          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
            Experience wholesome family dining in Nandigama, pick up steaming hot handi biryanis, or order authentic flavours directly to your home.
          </p>
        </div>

        {/* 2-Column Discovery Grid: Building Photo Card + Restaurant Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Dedicated Restaurant Building Exterior Photo Card */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-amber-300/40 p-1 sm:p-1.5 bg-gradient-to-b from-amber-100/60 to-white group">
              <div className="relative w-full h-full rounded-[1.3rem] sm:rounded-[2rem] overflow-hidden bg-stone-900">
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
                  <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 bg-stone-900/90 text-white backdrop-blur-md px-3 py-2 rounded-xl border border-stone-700 shadow-lg flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <UploadCloud className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="truncate">Upload to: <code className="break-all font-mono text-[10px] text-amber-300">public/images/jai-bharat-building.jpg</code></span>
                    </div>
                  </div>
                )}

                {/* Lower Overlay Badge */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 sm:p-6 pt-10 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block mb-1">
                    OUR RESTAURANT FACILITY
                  </span>
                  <p className="font-serif font-black text-lg sm:text-xl drop-shadow-md">
                    Jai Bharat Family Restaurant
                  </p>
                  <p className="text-stone-300 text-xs sm:text-sm">
                    Nandigama, Andhra Pradesh, India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Restaurant Location, Hours & Fast Navigation */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              
              {/* Address Card */}
              <div className="bg-white/95 backdrop-blur-xs p-5 rounded-2xl border border-[#e2d8c3] shadow-xs hover:shadow-md transition-shadow flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#991b1b] flex items-center justify-center shrink-0 border border-red-200/60">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif font-bold text-stone-900 text-sm mb-1">
                    Restaurant Address
                  </h4>
                  {settings.address ? (
                    <p className="text-stone-600 text-xs leading-relaxed">
                      {settings.address}, {settings.city} {settings.pincode}
                    </p>
                  ) : (
                    <p className="text-stone-600 text-xs leading-relaxed">
                      Main Road, Nandigama, Krishna District, Andhra Pradesh
                    </p>
                  )}
                  <span className="text-[10px] text-amber-700 font-semibold block mt-1">
                    Central Nandigama
                  </span>
                </div>
              </div>

              {/* Operating Hours Card */}
              <div className="bg-white/95 backdrop-blur-xs p-5 rounded-2xl border border-[#e2d8c3] shadow-xs hover:shadow-md transition-shadow flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#991b1b] flex items-center justify-center shrink-0 border border-red-200/60">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif font-bold text-stone-900 text-sm mb-1">
                    Operating Hours
                  </h4>
                  <p className="text-stone-600 text-xs leading-relaxed">
                    11:00 AM – 11:00 PM
                  </p>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                    ● Open 7 Days A Week
                  </span>
                </div>
              </div>

              {/* Phone Inquiries Card */}
              <div className="bg-white/95 backdrop-blur-xs p-5 rounded-2xl border border-[#e2d8c3] shadow-xs hover:shadow-md transition-shadow flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#991b1b] flex items-center justify-center shrink-0 border border-red-200/60">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif font-bold text-stone-900 text-sm mb-1">
                    Phone Orders
                  </h4>
                  {settings.phone ? (
                    <a
                      href={`tel:${settings.phone}`}
                      className="text-stone-800 hover:text-[#991b1b] font-bold text-xs transition-colors"
                    >
                      {settings.phone}
                    </a>
                  ) : (
                    <p className="text-stone-600 text-xs">
                      Available during operating hours
                    </p>
                  )}
                  <span className="text-[10px] text-stone-400 block mt-1">
                    Call for takeaway or party packs
                  </span>
                </div>
              </div>

              {/* Family Dining Feature Card */}
              <div className="bg-white/95 backdrop-blur-xs p-5 rounded-2xl border border-[#e2d8c3] shadow-xs hover:shadow-md transition-shadow flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#991b1b] flex items-center justify-center shrink-0 border border-red-200/60">
                  <Users className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif font-bold text-stone-900 text-sm mb-1">
                    Family Seating
                  </h4>
                  <p className="text-stone-600 text-xs leading-relaxed">
                    Air-conditioned dining hall
                  </p>
                  <span className="text-[10px] text-amber-700 font-semibold block mt-1">
                    Spacious &amp; child-friendly
                  </span>
                </div>
              </div>

            </div>

            {/* Directions Action Button */}
            <div className="pt-2">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#991b1b] to-[#7f1d1d] hover:from-[#881337] hover:to-[#6b0f0f] text-white font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-xl shadow-lg shadow-red-950/20 hover:shadow-xl transition-all border border-red-400/30 active:scale-95 group"
              >
                <Navigation className="w-4 h-4 text-amber-300 group-hover:rotate-45 transition-transform" />
                <span>Get Directions On Google Maps</span>
                <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
