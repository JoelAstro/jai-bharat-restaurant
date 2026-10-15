import React from 'react';
import { Quote } from 'lucide-react';

export const HomeQuoteSection: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 bg-[#faf7f0] border-b border-stone-200 relative overflow-hidden">
      {/* Subtle Indian-inspired background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, #991b1b 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Decorative Top Accent */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-[1px] w-12 sm:w-20 bg-[#c99a4c]/60" />
          <div className="w-8 h-8 rounded-full bg-red-100/80 text-[#991b1b] flex items-center justify-center shadow-xs">
            <Quote className="w-4 h-4 fill-[#991b1b]/20" />
          </div>
          <div className="h-[1px] w-12 sm:w-20 bg-[#c99a4c]/60" />
        </div>

        {/* Existing Brand Inspirational Quote */}
        <blockquote className="space-y-4">
          <p className="font-serif italic font-medium text-stone-900 text-xl sm:text-2xl md:text-3xl lg:text-[2rem] leading-snug sm:leading-relaxed tracking-tight">
            “Every meal is an opportunity to share delicious flavors, welcome people with care, and bring families and friends together.”
          </p>

          <footer className="pt-4 sm:pt-6">
            <div className="inline-flex flex-col items-center">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#991b1b]">
                Jai Bharat Family Restaurant
              </span>
              <span className="text-xs text-stone-500 font-medium tracking-wider mt-1">
                Nandigama, Andhra Pradesh
              </span>
            </div>
          </footer>
        </blockquote>
      </div>
    </section>
  );
};
