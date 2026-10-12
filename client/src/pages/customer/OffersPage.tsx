import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Check, Copy, ArrowRight, Sparkles } from 'lucide-react';
import { Coupon } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useRestaurant } from '../../context/RestaurantContext.js';

export const OffersPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { formatPrice } = useRestaurant();

  useEffect(() => {
    api
      .getPublicCoupons()
      .then((data) => setCoupons(data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Special Customer Privileges</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 mb-3">
            Restaurant Offers & Coupons
          </h1>
          <p className="text-stone-600 text-sm sm:text-base">
            Enjoy hand-picked discounts on genuine homestyle Indian recipes, biryanis, and family meal combos.
          </p>
        </div>

        {isLoading ? (
          <div className="p-16 text-center">
            <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-stone-400">Loading valid offers...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-stone-200 max-w-md mx-auto">
            <Tag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-lg text-stone-800 mb-1">
              No active offers at this moment
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Check back soon for festive specials and celebration discounts.
            </p>
            <Link
              to="/menu"
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-6 py-2.5 rounded-full"
            >
              Explore Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coupons.map((coupon) => (
              <div
                key={coupon.code}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-100 to-transparent rounded-bl-full pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="font-mono font-bold text-lg text-amber-900 bg-amber-50 border border-amber-300 px-3.5 py-1 rounded-xl">
                      {coupon.code}
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase">
                      {coupon.discountType === 'PERCENTAGE'
                        ? `${coupon.discountValue}% OFF`
                        : `Flat ${formatPrice(coupon.discountValue)} OFF`}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-stone-900 text-base mb-2">
                    {coupon.description || `Save with ${coupon.code}`}
                  </h3>

                  <ul className="text-xs text-stone-500 space-y-1 mb-6">
                    <li>• Minimum cart value: {formatPrice(coupon.minOrderAmount)}</li>
                    {coupon.maxDiscount && (
                      <li>• Maximum discount cap: {formatPrice(coupon.maxDiscount)}</li>
                    )}
                    <li>• Valid for both Home Delivery and Takeaway pickup</li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white px-4 py-2.5 rounded-xl transition-all shadow-xs"
                  >
                    {copiedCode === coupon.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Code Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>

                  <Link
                    to="/menu"
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                  >
                    <span>Order Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
