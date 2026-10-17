import React, { useState, useEffect } from 'react';
import { Quote, Sparkles } from 'lucide-react';
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
    <section className="py-14 sm:py-24 lg:py-28 bg-gradient-to-b from-[#190d07] via-[#130703] to-[#190d07] text-white border-y-2 border-[#3d2314] relative overflow-hidden">
      {/* Background Subtle Warm Gold Texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, #c99a4c 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Atmospheric Amber & Crimson Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-72 bg-gradient-to-r from-red-900/15 via-amber-600/15 to-red-900/15 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Decorative Top Accent: Gold lines and ornate badge */}
        <div className="flex items-center justify-center gap-3 mb-6 sm:mb-10">
          <div className="h-[1px] w-10 sm:w-28 bg-gradient-to-r from-transparent to-[#c99a4c]/80" />
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#24130b] border-2 border-[#c99a4c] text-[#c99a4c] flex items-center justify-center shadow-lg shadow-black/40">
            <Quote className="w-4 h-4 sm:w-5 sm:h-5 fill-[#c99a4c]/30 text-[#c99a4c]" />
          </div>
          <div className="h-[1px] w-10 sm:w-28 bg-gradient-to-l from-transparent to-[#c99a4c]/80" />
        </div>

        {/* Brand Inspirational Quote */}
        <blockquote className="space-y-6 sm:space-y-10">
          <p className="font-serif italic font-medium text-amber-50 text-lg sm:text-2xl md:text-3xl lg:text-[2.25rem] leading-relaxed sm:leading-[1.4] tracking-tight max-w-3xl mx-auto drop-shadow-md">
            “Every meal is an opportunity to share delicious flavors, welcome people with genuine care, and bring families together around authentic food.”
          </p>

          <footer className="pt-2 sm:pt-4">
            <div className="inline-flex flex-col items-center">
              {/* Founder Photograph with Gilded Dual Ring */}
              <div className="relative mb-3.5">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-[#c99a4c] via-amber-300 to-[#c99a4c] opacity-40 blur-xs" />
                <img
                  src={ownerSrc}
                  alt="Founder of Jai Bharat Family Restaurant"
                  onError={() => setOwnerSrc('/images/owner-placeholder.svg')}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover object-top border-3 border-[#c99a4c] shadow-2xl ring-4 ring-black/50"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#c99a4c] text-stone-950 flex items-center justify-center shadow-md">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </div>

              <span className="text-xs sm:text-sm font-serif font-bold uppercase tracking-[0.22em] text-[#c99a4c] block">
                Jai Bharat Family Restaurant
              </span>
              <span className="text-[11px] sm:text-xs text-stone-300 font-medium tracking-wider mt-1 block">
                Founder &amp; Restaurateur • Nandigama, Andhra Pradesh
              </span>
            </div>
          </footer>
        </blockquote>

      </div>
    </section>
  );
};
