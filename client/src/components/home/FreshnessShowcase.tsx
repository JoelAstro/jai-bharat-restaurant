import React from 'react';
import { Link } from 'react-router-dom';
import { Timer, Layers, Flame, Hand } from 'lucide-react';

interface RitualStep {
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const steps: RitualStep[] = [
  {
    number: '01',
    icon: Timer,
    title: 'Marinate overnight',
    description: 'Meat rests in yogurt, saffron and whole spices until the flavors settle deep.',
  },
  {
    number: '02',
    icon: Layers,
    title: 'Layer the basmati',
    description: 'Half-cooked rice is layered over the marinade with fried onions and mint.',
  },
  {
    number: '03',
    icon: Flame,
    title: 'Seal with dough',
    description: 'The pot is closed under a purdah of dough — no steam escapes, no flavor either.',
  },
  {
    number: '04',
    icon: Hand,
    title: 'Slow-steam on dum',
    description: "Low coals finish the pot. It's opened only at your table's order.",
  },
];

export const FreshnessShowcase: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#faf7f0] border-b border-[#e2d8c6] relative overflow-hidden">
      {/* Background Subtle Watermark Texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, #991b1b 1.5px, transparent 1.5px)`,
          backgroundSize: '28px 28px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Header: Line Swirl + Tag */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-[1px] w-12 sm:w-20 bg-[#c99a4c]/50" />
            <svg
              className="w-4 h-4 text-[#c99a4c]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                d="M12 4a8 8 0 1 0 8 8 6 6 0 1 0-6-6 4 4 0 1 0 4 4"
                strokeLinecap="round"
              />
            </svg>
            <div className="h-[1px] w-12 sm:w-20 bg-[#c99a4c]/50" />
          </div>

          <span className="text-[11px] sm:text-xs font-serif font-bold uppercase tracking-[0.25em] text-[#991b1b] block mb-3">
            THE DUM RITUAL
          </span>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 tracking-tight mb-3">
            Sealed. Steamed. Served.
          </h2>

          <p className="text-stone-600 text-xs sm:text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Every biryani follows the same four-step ritual it has for generations.
          </p>
        </div>

        {/* 4 Connected Stepper Cards with Dashed Line */}
        <div className="relative">
          {/* Dashed Connector Line behind circles on Desktop */}
          <div
            className="hidden lg:block absolute top-7 left-[12%] right-[12%] h-[1px] border-t border-dashed border-stone-300/90 pointer-events-none"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8 lg:gap-6 relative z-10">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="text-center flex flex-col items-center">
                  {/* Step Number Circle */}
                  <div className="relative inline-flex flex-col items-center mb-5">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border border-stone-200 shadow-sm flex items-center justify-center">
                      <span className="font-serif font-bold text-xl sm:text-2xl text-stone-900 tracking-tight">
                        {step.number}
                      </span>
                    </div>

                    {/* Diamond Accent below Circle */}
                    <div className="mt-2 text-[#c99a4c] text-[10px] select-none" aria-hidden="true">
                      ◆
                    </div>
                  </div>

                  {/* Red/Crimson Outline Icon */}
                  <div className="mb-3.5 text-[#991b1b] flex items-center justify-center">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
                  </div>

                  {/* Step Title */}
                  <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg lg:text-xl mb-2 tracking-tight">
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-[260px] mx-auto">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-12 sm:mt-16 text-center">
          <Link
            to="/menu?category=biryani-rice"
            className="inline-flex items-center justify-center bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-md shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            Taste the ritual
          </Link>
        </div>
      </div>
    </section>
  );
};
