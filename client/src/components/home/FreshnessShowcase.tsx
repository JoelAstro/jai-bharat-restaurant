import React from 'react';
import { Link } from 'react-router-dom';
import { Timer, Layers, Flame, Hand, Sparkles, ChefHat } from 'lucide-react';

interface RitualStep {
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  highlight: string;
}

const steps: RitualStep[] = [
  {
    number: '01',
    icon: Timer,
    title: 'Marinate overnight',
    description: 'Fresh farm-tender cuts rest in cultured curd, Kashmiri chilies, crushed saffron, and 16 stone-ground spices.',
    highlight: 'Overnight Infusion',
  },
  {
    number: '02',
    icon: Layers,
    title: 'Layer aged basmati',
    description: 'Extra-long grain aged basmati rice is parboiled with whole cardamom and layered with golden caramelized onions and garden mint.',
    highlight: 'Aged Basmati Rice',
  },
  {
    number: '03',
    icon: Flame,
    title: 'Purdah dough seal',
    description: 'The heavy handi pot is tightly sealed under a fresh whole-wheat dough barrier — locking in every wisp of aroma and natural juice.',
    highlight: 'Aroma Locked In',
  },
  {
    number: '04',
    icon: Hand,
    title: 'Slow dum on embers',
    description: 'Gentle low-heat charcoal embers slow-cook the pot to tender perfection. The aromatic seal is cracked open only when you order.',
    highlight: 'Cracked Fresh To Order',
  },
];

export const FreshnessShowcase: React.FC = () => {
  return (
    <section className="py-12 sm:py-20 lg:py-24 bg-gradient-to-b from-[#f7f0e4] via-[#f5ede1] to-[#f3e8d8] border-b border-[#dfd4c0] relative overflow-hidden">
      {/* Background Subtle Traditional Texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, #991b1b 1.5px, transparent 1.5px)`,
          backgroundSize: '28px 28px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <div className="flex items-center justify-center gap-3 mb-2.5">
            <div className="h-[1px] w-10 sm:w-20 bg-gradient-to-r from-transparent to-[#c99a4c]" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-[#c99a4c]/40 text-[#991b1b]">
              <ChefHat className="w-3.5 h-3.5 text-[#c99a4c]" />
              <span className="text-[10px] sm:text-xs font-serif font-bold uppercase tracking-[0.25em]">
                THE ROYAL DUM RITUAL
              </span>
            </div>
            <div className="h-[1px] w-10 sm:w-20 bg-gradient-to-l from-transparent to-[#c99a4c]" />
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black text-stone-900 tracking-tight mb-2 sm:mb-3">
            Sealed. Steamed. Served.
          </h2>

          <p className="text-stone-700 text-xs sm:text-base leading-relaxed max-w-xl mx-auto font-normal">
            Every signature biryani follows an authentic 4-step slow-cooking ritual passed down through royal Mughal and Andhra kitchen traditions.
          </p>
        </div>

        {/* 4 Connected Stepper Cards with Dashed Line */}
        <div className="relative">
          {/* Dashed Connector Line behind circles on Desktop */}
          <div
            className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-[1px] border-t-2 border-dashed border-[#c99a4c]/50 pointer-events-none z-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 relative z-10">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="group bg-white/95 backdrop-blur-xs rounded-2xl p-6 border border-[#e2d6c1] shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center relative"
                >
                  {/* Step Number Medallion */}
                  <div className="relative inline-flex flex-col items-center mb-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-amber-50 to-white border-2 border-[#c99a4c] shadow-md flex items-center justify-center group-hover:scale-105 group-hover:border-[#991b1b] transition-all">
                      <span className="font-serif font-black text-xl sm:text-2xl text-[#991b1b] tracking-tight">
                        {step.number}
                      </span>
                    </div>

                    {/* Diamond Accent below Circle */}
                    <div className="mt-1.5 text-[#c99a4c] text-[10px] select-none" aria-hidden="true">
                      ◆
                    </div>
                  </div>

                  {/* Icon & Badge */}
                  <div className="mb-3 flex items-center justify-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-red-50 text-[#991b1b] group-hover:bg-[#991b1b] group-hover:text-amber-200 transition-colors flex items-center justify-center border border-red-200/60 shadow-2xs">
                      <Icon className="w-5 h-5 stroke-[1.75]" />
                    </div>
                  </div>

                  {/* Highlight Micro-Pill */}
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-500/10 px-2.5 py-0.5 rounded-full mb-2">
                    {step.highlight}
                  </span>

                  {/* Step Title */}
                  <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg mb-2 tracking-tight group-hover:text-[#991b1b] transition-colors">
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-10 sm:mt-16 text-center">
          <Link
            to="/menu?category=biryani-rice"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#991b1b] hover:bg-[#881337] text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-lg shadow-red-950/20 hover:shadow-xl transition-all border border-red-400/30 active:scale-95 group"
          >
            <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>Taste The Dum Biryani Ritual</span>
            <span className="text-amber-300">→</span>
          </Link>
        </div>

      </div>
    </section>
  );
};
