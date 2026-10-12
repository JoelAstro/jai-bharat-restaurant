import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext.js';

export const Footer: React.FC = () => {
  const { settings } = useRestaurant();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-amber-100 font-serif font-bold text-lg border border-amber-500/30">
                JB
              </div>
              <span className="font-serif font-bold text-xl text-white">
                {settings.restaurant_name}
              </span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed">
              Experience the richness of authentic Indian culinary heritage, prepared with slow-cooked gravies, fragrant spices, and warm hospitality.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 bg-amber-950/60 border border-amber-800/60 px-3 py-1 rounded-full">
                <span>✦</span> Freshly Prepared Everyday
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold text-white text-base mb-4 tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link to="/menu" className="hover:text-amber-400 transition-colors">
                  Full Restaurant Menu
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition-colors">
                  Our Culinary Heritage (About Us)
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition-colors">
                  Find Us & Direct Inquiries
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-amber-400 transition-colors">
                  Offers & Special Deals
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-amber-400 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-amber-500/80 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Staff & Owner Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Restaurant Information */}
          <div>
            <h4 className="font-serif font-semibold text-white text-base mb-4 tracking-wide">
              Location & Hours
            </h4>
            <div className="space-y-3 text-sm text-stone-400">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-stone-300 block">Operating Hours:</strong>
                  {settings.operating_hours}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-stone-300 block">Address:</strong>
                  {settings.address ? (
                    `${settings.address}, ${settings.city} ${settings.pincode}`
                  ) : (
                    <span className="italic text-stone-500">
                      [Address awaiting restaurant owner confirmation in Settings]
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Contact & Safe Payment */}
          <div>
            <h4 className="font-serif font-semibold text-white text-base mb-4 tracking-wide">
              Customer Support
            </h4>
            <div className="space-y-3 text-sm text-stone-400 mb-6">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                {settings.phone ? (
                  <a href={`tel:${settings.phone}`} className="hover:text-amber-400 text-stone-300 font-medium">
                    {settings.phone}
                  </a>
                ) : (
                  <span className="italic text-stone-500">[Phone pending owner setup]</span>
                )}
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                {settings.email ? (
                  <a href={`mailto:${settings.email}`} className="hover:text-amber-400">
                    {settings.email}
                  </a>
                ) : (
                  <span className="italic text-stone-500">[Email pending owner setup]</span>
                )}
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block mb-2">
                Accepted Payment Methods
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-stone-800 text-stone-300 px-2.5 py-1 rounded border border-stone-700">
                  UPI & GPay
                </span>
                <span className="bg-stone-800 text-stone-300 px-2.5 py-1 rounded border border-stone-700">
                  Credit/Debit Cards
                </span>
                <span className="bg-stone-800 text-stone-300 px-2.5 py-1 rounded border border-stone-700">
                  Cash on Delivery
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} {settings.restaurant_name}. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Prepared with pride for Indian food lovers</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
