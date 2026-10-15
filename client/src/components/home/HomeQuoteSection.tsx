import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';
import { api } from '../../services/api.js';

export const HomeQuoteSection: React.FC = () => {
  const [ownerSrc, setOwnerSrc] = useState<string>('/images/owner.jpg');

  useEffect(() => {
    let isMounted = true;
    api
      .getPublicImages('owner')
      .then((data) => {
        if (isMounted && data && data.length > 0 && data[0].imageUrl) {
          setOwnerSrc(data[0].imageUrl);
        }
      })
      .catch((err) => {
        console.warn('Using default owner image path:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-18 sm:py-24 lg:py-28 bg-[#1c130d] text-white border-y border-[#3a2517] relative overflow-hidden">
      {/* Subtle warm gold starburst texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, #c99a4c 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Warm subtle amber ambient glow in the background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-gradient-to-b from-[#991b1b]/10 via-transparent to-amber-950/20 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Decorative Top Accent: Gold lines and ornamental badge */}
        <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
          <div className="h-[1px] w-12 sm:w-24 bg-[#c99a4c]/60" />
          <div className="w-9 h-9 rounded-full bg-[#2a1a11] border border-[#c99a4c]/50 text-[#c99a4c] flex items-center justify-center shadow-md">
            <Quote className="w-4 h-4 fill-[#c99a4c]/30 text-[#c99a4c]" />
          </div>
          <div className="h-[1px] w-12 sm:w-24 bg-[#c99a4c]/60" />
        </div>

        {/* Existing Brand Inspirational Quote */}
        <blockquote className="space-y-6 sm:space-y-8">
          <p className="font-serif italic font-medium text-amber-50 text-xl sm:text-2xl md:text-3xl lg:text-[2.15rem] leading-relaxed tracking-tight max-w-3xl mx-auto">
            “Every meal is an opportunity to share delicious flavors, welcome people with care, and bring families and friends together.”
          </p>

          <footer className="pt-2 sm:pt-4">
            <div className="inline-flex flex-col items-center">
              <div className="relative mb-3.5">
                <img
                  src={ownerSrc}
                  alt="Owner and Founder of Jai Bharat Family Restaurant"
                  onError={() => setOwnerSrc('/images/owner-placeholder.svg')}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover object-top border-2 border-[#c99a4c] shadow-lg ring-4 ring-[#c99a4c]/20"
                />
              </div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-[#c99a4c]">
                Jai Bharat Family Restaurant
              </span>
              <span className="text-xs text-stone-300 font-medium tracking-wider mt-1.5">
                Owner &amp; Founder • Nandigama, Andhra Pradesh
              </span>
            </div>
          </footer>
        </blockquote>
      </div>
    </section>
  );
};
