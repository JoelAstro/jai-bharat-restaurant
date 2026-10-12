import React, { useState, useEffect } from 'react';
import { Tag, Check, Copy } from 'lucide-react';
import { Coupon } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useRestaurant } from '../../context/RestaurantContext.js';

export const OffersBanner: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { formatPrice } = useRestaurant();

  useEffect(() => {
    api
      .getPublicCoupons()
      .then((data) => setCoupons(data))
      .catch(() => {});
  }, []);

  if (coupons.length === 0) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section className="py-12 bg-white border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold text-[#991b1b] bg-red-100/80 px-3 py-1 rounded-full mb-2">
            <Tag className="w-3.5 h-3.5 text-[#991b1b]" />
            <span>Exclusive Savings</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Current Offers & Promo Deals
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Apply these coupon codes at checkout to enjoy special discounts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {coupons.map((coupon) => (
            <div
              key={coupon.code}
              className="bg-[#fdfbf7] rounded-2xl p-5 border border-dashed border-red-300 shadow-xs flex items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-base text-[#991b1b] bg-red-100/80 px-2.5 py-0.5 rounded-md tracking-wider">
                    {coupon.code}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700">
                    {coupon.discountType === 'PERCENTAGE'
                      ? `${coupon.discountValue}% OFF`
                      : `Flat ${formatPrice(coupon.discountValue)} OFF`}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-snug">
                  {coupon.description || `Min order: ${formatPrice(coupon.minOrderAmount)}`}
                </p>
              </div>

              <button
                onClick={() => handleCopy(coupon.code)}
                className="shrink-0 flex items-center gap-1.5 text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white px-3.5 py-2 rounded-xl transition-all shadow-xs"
              >
                {copiedCode === coupon.code ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
