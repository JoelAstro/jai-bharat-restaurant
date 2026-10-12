import React from 'react';
import { MapPin, Phone, Clock, Info, ShieldAlert } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext.js';

export const OwnerInfoNotice: React.FC = () => {
  const { settings } = useRestaurant();

  const isConfigured =
    settings.phone &&
    settings.address &&
    !settings.phone.includes('[') &&
    !settings.address.includes('[');

  return (
    <section className="py-12 bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-50 rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Hours */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 text-[#991b1b] rounded-2xl shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-stone-900 text-base mb-1">
                  Operating Hours
                </h4>
                <p className="text-stone-600 text-xs sm:text-sm">
                  {settings.operating_hours}
                </p>
                <span className="text-[11px] text-emerald-700 font-medium inline-block mt-1">
                  ● Kitchen Open for Takeaway & Delivery
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 text-[#991b1b] rounded-2xl shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-stone-900 text-base mb-1">
                  Restaurant Location
                </h4>
                {settings.address ? (
                  <p className="text-stone-600 text-xs sm:text-sm">
                    {settings.address}, {settings.city} {settings.pincode}
                  </p>
                ) : (
                  <p className="text-stone-400 text-xs italic">
                    Location details awaiting owner entry in Admin Settings.
                  </p>
                )}
              </div>
            </div>

            {/* Direct Orders */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 text-[#991b1b] rounded-2xl shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-stone-900 text-base mb-1">
                  Direct Inquiries
                </h4>
                {settings.phone ? (
                  <p className="text-stone-900 font-bold text-sm">
                    <a href={`tel:${settings.phone}`} className="hover:text-[#991b1b]">
                      {settings.phone}
                    </a>
                  </p>
                ) : (
                  <p className="text-stone-400 text-xs italic">
                    Direct phone awaiting owner setup in Admin Settings.
                  </p>
                )}
                <span className="text-[11px] text-stone-500 block mt-1">
                  Online order placement available 24/7 on website
                </span>
              </div>
            </div>
          </div>

          {!isConfigured && (
            <div className="mt-8 pt-6 border-t border-stone-200 flex items-center gap-3 text-xs text-stone-500">
              <Info className="w-4 h-4 text-[#991b1b] shrink-0" />
              <span>
                <strong>Owner Notice:</strong> To update official restaurant phone number, physical address, and custom logo, log in to the <a href="/admin" className="text-[#991b1b] underline font-semibold">Admin Settings Panel</a>.
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
