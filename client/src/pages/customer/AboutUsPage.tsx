import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Utensils,
  Heart,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  Phone,
  Sparkles,
  Flame,
  CheckCircle2,
  Quote,
  Award,
  Users,
  Compass,
  Soup,
  Coffee,
} from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext.js';

export const AboutUsPage: React.FC = () => {
  const { settings } = useRestaurant();
  const [ownerImgSrc, setOwnerImgSrc] = useState<string>('/images/owner.jpg');

  const tickerPhrase = (
    <div className="flex items-center shrink-0">
      <span className="font-bold tracking-[0.2em] uppercase text-xs sm:text-sm text-white px-4">
        TASTE OF TRADITION
      </span>
      <span className="text-amber-300 text-xs sm:text-sm px-2">✦</span>
      <span className="font-bold tracking-[0.2em] uppercase text-xs sm:text-sm text-white px-4">
        DELICIOUS FOOD IN NANDIGAMA
      </span>
      <span className="text-amber-300 text-xs sm:text-sm px-2">✦</span>
      <span className="font-bold tracking-[0.2em] uppercase text-xs sm:text-sm text-white px-4">
        HOSPITALITY WITH HEART
      </span>
      <span className="text-amber-300 text-xs sm:text-sm px-2">✦</span>
      <span className="font-bold tracking-[0.2em] uppercase text-xs sm:text-sm text-white px-4">
        A PLACE FOR EVERY GATHERING
      </span>
      <span className="text-amber-300 text-xs sm:text-sm px-2">✦</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#faf7f0] text-stone-900">
      {/* ========================================================================= */}
      {/* SECTION 1: MAIN ABOUT US HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-stone-200">
        {/* Subtle patterned background texture */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at center, #991b1b 1.5px, transparent 1.5px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Editorial Storytelling */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Location Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100/80 border border-red-200 text-[#991b1b] text-xs font-bold uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>PROUDLY SERVING NANDIGAMA, ANDHRA PRADESH</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 tracking-tight leading-[1.15]">
                The Jai Bharat Story. <br />
                <span className="text-[#991b1b]">Tradition in Every Bite, Warmth in Every Welcome.</span>
              </h1>

              {/* Tagline */}
              <p className="text-lg sm:text-xl font-serif text-amber-900/90 italic font-medium">
                Where authentic regional flavors and heartfelt Indian hospitality bring families together.
              </p>

              {/* Verified Nandigama Intro Paragraph */}
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Welcome to <strong>{settings.restaurant_name}</strong>. Nestled in the heart of Nandigama, Andhra Pradesh, our kitchen was built on a simple, timeless promise: to prepare honest, delicious Indian food that honours our heritage. From royal handi biryanis layered with fragrant spices to sizzling tandoori starters and comforting curries, every meal is prepared with sincere care, hygiene, and the authentic spirit of home.
              </p>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/menu"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  <span>Explore Our Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs uppercase tracking-wider px-7 py-4 rounded-xl shadow-sm hover:shadow transition-all border border-stone-300 active:scale-95"
                >
                  <span>Visit Our Restaurant</span>
                </Link>
              </div>

              {/* Trust Pillars Bar */}
              <div className="pt-6 border-t border-stone-200/90 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span className="font-semibold text-stone-800">Fresh Daily Prep</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#991b1b]" />
                  <span className="font-semibold text-stone-800">Authentic Dum & Tandoor</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                  <span className="font-semibold text-stone-800">Family-Friendly Ambiance</span>
                </div>
              </div>
            </div>

            {/* Right Column: High Quality Real Food Photograph (No Overlay Cards) */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-4/3 sm:aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100 group">
                <img
                  src="/images/hero/hero-3.jpg"
                  alt="Royal Dum Biryani in Copper Handi at Jai Bharat Family Restaurant"
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: MOVING RESTAURANT VALUES BAR */}
      {/* ========================================================================= */}
      <section
        className="w-full bg-[#991b1b] overflow-hidden select-none py-3.5 sm:py-4 border-y border-[#7f1d1d] shadow-sm"
        aria-label="Restaurant Values ticker"
      >
        <div className="overflow-hidden w-full flex items-center">
          <div className="animate-ticker-marquee flex items-center select-none">
            {/* Sequence 1 */}
            <div className="flex items-center shrink-0">
              {tickerPhrase}
              {tickerPhrase}
            </div>
            {/* Sequence 2 (Seamless Infinite Loop Clone) */}
            <div className="flex items-center shrink-0" aria-hidden="true">
              {tickerPhrase}
              {tickerPhrase}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: WHAT MAKES JAI BHARAT SPECIAL */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#991b1b] bg-red-50 border border-red-100 px-3.5 py-1.5 rounded-full inline-block">
              OUR DISTINCTION
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900">
              What Makes Jai Bharat Special
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Four fundamental pillars that define every dish we cook and every smile we share with the families of Nandigama.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1 */}
            <div className="bg-[#faf7f0] rounded-3xl p-8 border border-stone-200 hover:border-red-300 transition-all duration-300 hover:shadow-lg flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-red-100 text-[#991b1b] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Flame className="w-7 h-7" />
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-xl">
                  Flavor Worth Enjoying
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Rich, authentic recipes passed down through culinary heritage. Hand-pounded whole spices, slow-cooked gravies, and perfectly marinated cuts that make every bite an experience.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-stone-200/80 text-xs font-bold text-[#991b1b] uppercase tracking-wider flex items-center gap-1.5">
                <span>✦ Authentic Spices</span>
              </div>
            </div>

            {/* Column 2 */}
            <div className="bg-[#faf7f0] rounded-3xl p-8 border border-stone-200 hover:border-amber-300 transition-all duration-300 hover:shadow-lg flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart className="w-7 h-7" />
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-xl">
                  Hospitality from the Heart
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Every guest is welcomed as family. Whether you are dining in our spacious hall or ordering delivery for a family feast at home, we serve with warmth, care, and prompt attention.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-stone-200/80 text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <span>✦ Welcoming Smiles</span>
              </div>
            </div>

            {/* Column 3 */}
            <div className="bg-[#faf7f0] rounded-3xl p-8 border border-stone-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-xl">
                  Quality in Every Meal
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Carefully selected fresh ingredients, daily butcher cuts, pure cooking oils, and pristine kitchen hygiene. We cook food that we are proud to serve our own families.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-stone-200/80 text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <span>✦ Daily Freshness</span>
              </div>
            </div>

            {/* Column 4 */}
            <div className="bg-[#faf7f0] rounded-3xl p-8 border border-stone-200 hover:border-red-300 transition-all duration-300 hover:shadow-lg flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-red-100 text-[#991b1b] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin className="w-7 h-7" />
                </div>
                <h3 className="font-serif font-bold text-stone-900 text-xl">
                  Proudly Local
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Deeply rooted in Nandigama, Andhra Pradesh. We are honoured to be the favorite gathering destination for local residents, visiting relatives, and travelers alike.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-stone-200/80 text-xs font-bold text-[#991b1b] uppercase tracking-wider flex items-center gap-1.5">
                <span>✦ Nandigama Pride</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: OUR APPROACH TO FOOD AND HOSPITALITY */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-[#faf7f0] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Real Food Photography (Crispy Chicken 65 / Starters) */}
            <div className="lg:col-span-5 relative order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100 group aspect-4/3 sm:aspect-square">
                <img
                  src="/images/hero/hero-2.jpg"
                  alt="Crispy Starters and Fresh Indian Delicacies at Jai Bharat Family Restaurant"
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 hidden sm:flex items-center gap-2 bg-[#991b1b] text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Cooked Fresh on Order</span>
              </div>
            </div>

            {/* Right Column: Editorial Philosophy & Bullet Points */}
            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2 text-center lg:text-left">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#991b1b] bg-red-100/70 border border-red-200/80 px-3.5 py-1.5 rounded-full inline-block">
                OUR CULINARY PHILOSOPHY
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 leading-tight">
                Crafting Meals That Bring People Closer
              </h2>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                At Jai Bharat Family Restaurant, cooking is never rushed. We believe that memorable flavors come from patience, seasoned craftsmanship, and genuine respect for culinary traditions. Our kitchen comes alive every morning by roasting whole spices, hand-grinding aromatics, and gently simmering our curries so that each flavor develops naturally.
              </p>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                From slow-dum biryanis cooked in tightly sealed pots to capture every aromatic note, to sizzling tandoor flatbreads, we balance rich Indian spices with wholesome comfort. We craft dishes that appeal across generations—so children, parents, and grandparents all leave our dining tables completely delighted.
              </p>

              {/* 3 Key Approach Statements */}
              <div className="space-y-3.5 pt-2 text-left">
                <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      Authentic Dum & Tandoor Preparations
                    </h4>
                    <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
                      Slow-cooked dum biryanis and authentic curries made fresh daily on order without artificial colors or shortcuts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      Locally Sourced Farm Produce & Premium Spices
                    </h4>
                    <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
                      Every ingredient is inspected daily for peak freshness, tenderness, and rich natural aroma.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      A Warm, Welcoming Family Environment
                    </h4>
                    <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
                      Thoughtfully maintained air-conditioned dining, hygienic kitchen protocols, and attentive hospitality where everyone feels at home.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: OUR OWNER AND THE PERSON BEHIND JAI BHARAT */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-stone-950 text-white relative overflow-hidden border-b border-stone-800">
        {/* Warm Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#991b1b]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Owner Portrait Card with Graceful Fallback */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-stone-800 bg-stone-900 aspect-3/4 max-w-md mx-auto group">
                <img
                  src={ownerImgSrc}
                  alt="Owner and Founder of Jai Bharat Family Restaurant"
                  onError={() => {
                    // Fall back cleanly to the dedicated vector placeholder
                    if (ownerImgSrc !== '/images/owner-placeholder.svg') {
                      setOwnerImgSrc('/images/owner-placeholder.svg');
                    }
                  }}
                  className="w-full h-full object-cover object-center transform group-hover:scale-102 transition-transform duration-700"
                />

                {/* Subtle Owner Tag Overlay */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent p-6 pt-12">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block mb-1">
                    LEADERSHIP & CULINARY DEDICATION
                  </span>
                  <p className="font-serif font-bold text-white text-xl sm:text-2xl">
                    Owner & Founder
                  </p>
                  <p className="text-stone-400 text-xs sm:text-sm">
                    {settings.restaurant_name}, Nandigama
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Owner Story, Pull Quote & 4 Effort Points */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-800/90 border border-stone-700 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>THE PERSON BEHIND JAI BHARAT</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
                Driven by Passion, <br className="hidden sm:inline" />
                <span className="text-amber-400">Built on Trust and Integrity.</span>
              </h2>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                Behind every flavorful recipe and smooth dining experience at <strong>{settings.restaurant_name}</strong> is a deep personal commitment to hospitality and the community of Nandigama. Guided by a lifelong appreciation for authentic Indian cooking, the restaurant was founded to provide families with a welcoming place where quality is never compromised.
              </p>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                From handpicking spices every morning to actively supervising the kitchen and greeting guests at the door, our owner’s hands-on leadership ensures that every dish leaving the kitchen represents the pride of our family.
              </p>

              {/* Prominent Pull Quote */}
              <div className="bg-stone-900/90 border-l-4 border-amber-400 p-6 rounded-r-2xl text-left shadow-lg space-y-3">
                <Quote className="w-8 h-8 text-amber-400/50" />
                <p className="font-serif italic text-base sm:text-lg text-stone-100 leading-relaxed">
                  “Our goal is simple: serve our customers with care, welcome them with warmth, and give them a reason to visit us again.”
                </p>
                <div className="pt-2 border-t border-stone-800">
                  <p className="font-bold text-amber-400 text-xs uppercase tracking-wider">
                    — Owner &amp; Founder
                  </p>
                  <p className="text-stone-400 text-xs">
                    Jai Bharat Family Restaurant, Nandigama
                  </p>
                </div>
              </div>

              {/* 4 Effort Badges */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-left">
                <div className="bg-stone-900 border border-stone-800 p-3.5 rounded-xl flex items-center gap-3">
                  <Award className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="text-xs font-semibold text-stone-200">
                    Hands-on Kitchen Oversight
                  </span>
                </div>
                <div className="bg-stone-900 border border-stone-800 p-3.5 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-xs font-semibold text-stone-200">
                    Daily Quality Verification
                  </span>
                </div>
                <div className="bg-stone-900 border border-stone-800 p-3.5 rounded-xl flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
                  <span className="text-xs font-semibold text-stone-200">
                    Uncompromising Hygiene
                  </span>
                </div>
                <div className="bg-stone-900 border border-stone-800 p-3.5 rounded-xl flex items-center gap-3">
                  <Heart className="w-5 h-5 text-[#ef4444] shrink-0" />
                  <span className="text-xs font-semibold text-stone-200">
                    Customer-First Hospitality
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: OUR VALUES (WHAT WE STAND FOR) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#991b1b] bg-red-50 border border-red-100 px-3.5 py-1.5 rounded-full inline-block">
              WHAT WE STAND FOR
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900">
              Our Core Guiding Values
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Six foundational commitments that guide every decision in our kitchen, dining hall, and community interactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-[#faf7f0] rounded-3xl p-8 border border-stone-200/90 hover:border-red-300 transition-all duration-300 hover:shadow-md space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#991b1b] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-lg">
                Taste and Tradition
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Staying true to time-honoured Indian recipes, slow-cooking techniques, and aromatic spice formulations without taking shortcuts.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-[#faf7f0] rounded-3xl p-8 border border-stone-200/90 hover:border-amber-300 transition-all duration-300 hover:shadow-md space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-lg">
                Customer First
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Listening attentively to our diners and placing customer satisfaction and happiness at the very core of our daily operations.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-[#faf7f0] rounded-3xl p-8 border border-stone-200/90 hover:border-emerald-300 transition-all duration-300 hover:shadow-md space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-lg">
                Quality and Care
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Selecting fresh vegetables, tender poultry, pure dairy, and whole spices every morning. Clean food you can always trust.
              </p>
            </div>

            {/* Value 4 */}
            <div className="bg-[#faf7f0] rounded-3xl p-8 border border-stone-200/90 hover:border-red-300 transition-all duration-300 hover:shadow-md space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#991b1b] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-lg">
                Honest Hospitality
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Welcoming every guest with sincere warmth, transparent menu pricing, generous portion sizes, and attentive Indian hospitality.
              </p>
            </div>

            {/* Value 5 */}
            <div className="bg-[#faf7f0] rounded-3xl p-8 border border-stone-200/90 hover:border-amber-300 transition-all duration-300 hover:shadow-md space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-lg">
                Family and Togetherness
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Maintaining a spacious, respectful, and family-friendly dining environment where all age groups can comfortably celebrate moments.
              </p>
            </div>

            {/* Value 6 */}
            <div className="bg-[#faf7f0] rounded-3xl p-8 border border-stone-200/90 hover:border-emerald-300 transition-all duration-300 hover:shadow-md space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-lg">
                Community Connection
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Proud to be a cherished culinary home for Nandigama. We support local produce suppliers and actively invest in our neighborhood.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: A TASTE OF THE MENU */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-[#faf7f0] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#991b1b] bg-red-100/70 border border-red-200/80 px-3.5 py-1.5 rounded-full inline-block">
              A TASTE OF OUR KITCHEN
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900">
              Signature Highlights from Our Menu
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Explore the beloved categories that make Jai Bharat Family Restaurant a favorite dining choice in Nandigama.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Category 1: Dum Biryanis */}
            <div className="bg-white rounded-3xl p-7 border border-stone-200 shadow-sm hover:shadow-md transition-all space-y-4 group">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#991b1b] flex items-center justify-center">
                  <Flame className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-red-100 text-[#991b1b] px-3 py-1 rounded-full">
                  Signature Specialty
                </span>
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-xl group-hover:text-[#991b1b] transition-colors">
                Royal Dum Biryanis
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Slow-cooked chicken and mutton handi biryanis with aromatic long-grain basmati rice, pure desi ghee, and our authentic secret spice pot.
              </p>
            </div>

            {/* Category 2: Tandoori & Starters */}
            <div className="bg-white rounded-3xl p-7 border border-stone-200 shadow-sm hover:shadow-md transition-all space-y-4 group">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
                  <Utensils className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                  Clay Oven & Sizzling
                </span>
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-xl group-hover:text-amber-800 transition-colors">
                Tandoori &amp; Starters
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Crispy chicken 65, char-grilled chicken tikka, and spiced paneer skewers marinated in creamy yogurt and roasted aromatic masalas.
              </p>
            </div>

            {/* Category 3: Rich Curries */}
            <div className="bg-white rounded-3xl p-7 border border-stone-200 shadow-sm hover:shadow-md transition-all space-y-4 group">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <Soup className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full">
                  Slow Simmered
                </span>
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-xl group-hover:text-emerald-800 transition-colors">
                Rich Indian Curries
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Velvety butter gravies, traditional regional curries, rich korma preparations, and comforting homestyle dal cooked to perfection.
              </p>
            </div>

            {/* Category 4: Indo-Chinese */}
            <div className="bg-white rounded-3xl p-7 border border-stone-200 shadow-sm hover:shadow-md transition-all space-y-4 group">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#991b1b] flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-red-100 text-[#991b1b] px-3 py-1 rounded-full">
                  Wok Tossed
                </span>
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-xl group-hover:text-[#991b1b] transition-colors">
                Indo-Chinese Delights
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                High-heat wok noodles, aromatic fried rice, and savoury Manchurian appetizers packed with vibrant sauces and crunchy garden vegetables.
              </p>
            </div>

            {/* Category 5: Fresh Breads & Rice */}
            <div className="bg-white rounded-3xl p-7 border border-stone-200 shadow-sm hover:shadow-md transition-all space-y-4 group sm:col-span-2 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
                  <Coffee className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                  Fresh from Clay Oven
                </span>
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-xl group-hover:text-amber-800 transition-colors">
                Fresh Breads &amp; Fragrant Rice
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Piping hot butter naans, tandoori rotis, fragrant jeera rice, and comforting curd rice to complete your authentic Indian meal.
              </p>
            </div>
          </div>

          {/* Central Button */}
          <div className="text-center pt-10">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <span>View Full Menu &amp; Order Online</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8: OUR PLACE IN NANDIGAMA */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Story */}
            <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#991b1b] bg-red-50 border border-red-100 px-3.5 py-1.5 rounded-full inline-block">
                OUR NANDIGAMA HOME
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 leading-tight">
                A Welcoming Gathering Place in the Heart of Town
              </h2>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Located centrally in Nandigama, Andhra Pradesh, <strong>{settings.restaurant_name}</strong> was created to give our town an inviting culinary destination. Whether you are catching up over a weekday lunch with coworkers, treating your family to a relaxed Sunday biryani feast, or picking up parcel orders on your way home, our doors are always open for you.
              </p>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                We also deliver directly to your doorstep across Nandigama with swift handling, ensuring your curries and biryanis arrive piping hot, fragrant, and carefully packaged.
              </p>

              <div className="pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded-xl transition-all shadow-sm"
                >
                  <span>Directions &amp; Contact Info</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Quick Info Grid */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Card 1: Address */}
              <div className="bg-[#faf7f0] rounded-2xl p-6 border border-stone-200/90 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-[#991b1b] flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-stone-900 text-base">
                  Prime Location
                </h4>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  {settings.address
                    ? `${settings.address}, ${settings.city || 'Nandigama'}`
                    : 'Main Road, Nandigama, Andhra Pradesh 521185'}
                </p>
                <span className="text-[11px] font-semibold text-[#991b1b] block">
                  Easy parking &amp; central access
                </span>
              </div>

              {/* Card 2: Operating Hours */}
              <div className="bg-[#faf7f0] rounded-2xl p-6 border border-stone-200/90 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-stone-900 text-base">
                  Operating Hours
                </h4>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  {settings.operating_hours || '11:00 AM – 11:00 PM'}
                </p>
                <span className="text-[11px] font-semibold text-amber-800 block">
                  Open daily for lunch &amp; dinner
                </span>
              </div>

              {/* Card 3: Dining Choices */}
              <div className="bg-[#faf7f0] rounded-2xl p-6 border border-stone-200/90 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-stone-900 text-base">
                  Flexible Services
                </h4>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  Dine-in AC Dining Hall • Quick Parcel Counter • Doorstep Online Delivery.
                </p>
                <span className="text-[11px] font-semibold text-emerald-800 block">
                  Fast takeaway packaging
                </span>
              </div>

              {/* Card 4: Phone & Reservations */}
              <div className="bg-[#faf7f0] rounded-2xl p-6 border border-stone-200/90 space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-stone-900 text-base">
                  Direct Inquiries
                </h4>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  {settings.phone ? settings.phone : '+91 98765 43210'}
                </p>
                <span className="text-[11px] font-semibold text-blue-800 block">
                  Party orders &amp; reservations
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 9: WARM CLOSING MESSAGE */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 bg-[#faf7f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-[#991b1b] via-[#881313] to-[#5a0d0d] text-white rounded-3xl p-8 sm:p-14 lg:p-16 shadow-2xl overflow-hidden border border-red-900/60">
            {/* Subtle decorative ring overlay */}
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-amber-400/10 pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
              <span className="text-xs uppercase font-bold tracking-[0.25em] text-amber-300 bg-white/10 px-4 py-1.5 rounded-full inline-block backdrop-blur-sm">
                A WARM INVITATION TO YOU
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight">
                Your Table Is Waiting at Jai Bharat
              </h2>

              <p className="text-stone-200 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                Whether you're stopping by for a hearty afternoon meal, gathering the family for a celebratory weekend dinner, or ordering delivery to enjoy at home, our kitchen is ready to serve you with warm hearts and memorable flavors.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  to="/menu"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-100 text-[#991b1b] font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-lg transition-all active:scale-95"
                >
                  <span>Explore Our Menu &amp; Order</span>
                  <ArrowRight className="w-4 h-4 text-[#991b1b]" />
                </Link>

                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border border-white/40 hover:border-white transition-all active:scale-95"
                >
                  <span>Contact &amp; Directions</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
