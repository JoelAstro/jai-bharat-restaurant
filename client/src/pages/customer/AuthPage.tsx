import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext.js';

export const AuthPage: React.FC = () => {
  const { settings } = useRestaurant();

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-xl text-center">
        {/* Header Branding */}
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#991b1b] flex items-center justify-center text-red-100 font-serif font-bold text-xl shadow-md">
            JB
          </div>
          <span className="font-serif font-bold text-2xl text-stone-900">
            {settings.restaurant_name}
          </span>
        </Link>

        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-serif font-bold text-stone-900 mb-2">
          No Sign-in Required!
        </h1>

        <p className="text-stone-600 text-sm leading-relaxed mb-6">
          Enjoy direct guest ordering with zero registration. Simply pick your dishes, add your delivery address or select takeaway, and order right away!
        </p>

        <div className="space-y-3">
          <Link
            to="/menu"
            className="w-full flex items-center justify-center gap-2 bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-bold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all text-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order Now</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

          <Link
            to="/orders"
            className="w-full flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold py-3 px-6 rounded-2xl transition-all text-xs"
          >
            <span>Track Existing Order</span>
          </Link>
        </div>

        {/* Restaurant Staff Login Link */}
        <div className="mt-8 pt-6 border-t border-stone-100 text-center">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-[#991b1b] transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Restaurant Management Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
