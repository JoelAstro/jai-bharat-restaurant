import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  User,
  Heart,
  Menu as MenuIcon,
  X,
  Clock,
  ShieldCheck,
  LogOut,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import { useCart } from '../../context/CartContext.js';
import { useAuth } from '../../context/AuthContext.js';
import { useRestaurant } from '../../context/RestaurantContext.js';

export const Navbar: React.FC = () => {
  const { itemCount, setIsCartOpen } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const { settings } = useRestaurant();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top Operating Notice Bar (Subtle Gold / Black Accent) */}
      <div className="bg-[#121214] text-stone-300 text-xs py-1 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[11px] sm:text-xs">
              Daily Kitchen Hours: <strong className="text-white font-medium">{settings.operating_hours}</strong>
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] sm:text-xs text-stone-400">
            {settings.phone ? (
              <span className="hidden sm:inline">
                Call: <a href={`tel:${settings.phone}`} className="text-amber-400 font-semibold hover:underline">{settings.phone}</a>
              </span>
            ) : null}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Bawarchi-Inspired Red Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#991b1b] shadow-md border-b-2 border-[#7f1d1d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-20">
            {/* Left Links (Desktop) */}
            <nav className="hidden md:flex items-center gap-7">
              <Link
                to="/"
                className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                  isActive('/')
                    ? 'text-amber-300'
                    : 'text-white/95 hover:text-amber-300'
                }`}
              >
                Home
              </Link>
              <Link
                to="/menu"
                className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                  isActive('/menu')
                    ? 'text-amber-300'
                    : 'text-white/95 hover:text-amber-300'
                }`}
              >
                Menu
              </Link>
              <Link
                to="/about"
                className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                  isActive('/about')
                    ? 'text-amber-300'
                    : 'text-white/95 hover:text-amber-300'
                }`}
              >
                About Us
              </Link>
              <Link
                to="/offers"
                className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                  isActive('/offers')
                    ? 'text-amber-300'
                    : 'text-white/95 hover:text-amber-300'
                }`}
              >
                Offers
              </Link>
            </nav>

            {/* Centered Circular Crest / Brand Emblem */}
            <div className="absolute left-1/2 -translate-x-1/2 top-1.5 z-50">
              <Link
                to="/"
                className="group flex flex-col items-center"
                title={settings.restaurant_name}
              >
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-white p-1 shadow-xl border-3 border-amber-400 group-hover:scale-105 transition-transform flex items-center justify-center">
                  <div className="w-full h-full rounded-full border-2 border-dashed border-[#991b1b] flex flex-col items-center justify-center bg-radial from-amber-50 to-white text-center p-1">
                    <span className="font-serif font-black text-lg sm:text-xl text-[#991b1b] tracking-tighter leading-none">
                      JB
                    </span>
                    <span className="text-[7px] sm:text-[8px] font-bold uppercase tracking-widest text-stone-900 mt-0.5 leading-tight">
                      Jai Bharat
                    </span>
                    <span className="text-[5.5px] font-semibold uppercase tracking-wider text-amber-700 leading-none">
                      Restaurant
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Right Links & Action Buttons (Desktop) */}
            <div className="flex items-center gap-3 sm:gap-5 ml-auto md:ml-0">
              <Link
                to="/contact"
                className={`hidden lg:inline-block text-xs font-bold uppercase tracking-widest transition-colors ${
                  isActive('/contact')
                    ? 'text-amber-300'
                    : 'text-white/95 hover:text-amber-300'
                }`}
              >
                Find Us
              </Link>

              {/* Favorites Heart */}
              <Link
                to="/favorites"
                className="p-2 text-white/90 hover:text-amber-300 transition-colors"
                title="Favorites"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* Shopping Bag / Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-white/90 hover:text-amber-300 transition-colors"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-400 text-stone-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Customer Account / Sign In */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-black/20 hover:bg-black/30 px-3 py-2 rounded-xl transition-colors border border-white/20"
                  >
                    <span>{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                  </button>

                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 text-stone-800 text-xs animate-in fade-in zoom-in-95"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-stone-100">
                        <p className="font-bold text-stone-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-stone-400 truncate">{user.email}</p>
                      </div>
                      <Link to="/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-stone-50">
                        <User className="w-4 h-4 text-stone-500" /> Profile & Addresses
                      </Link>
                      <Link to="/orders" className="flex items-center gap-2 px-4 py-2 hover:bg-stone-50">
                        <ShoppingBag className="w-4 h-4 text-stone-500" /> Order History
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-[#991b1b] font-bold hover:bg-red-50">
                          <ShieldCheck className="w-4 h-4" /> Admin Portal
                        </Link>
                      )}
                      <div className="border-t border-stone-100 my-1" />
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 text-left font-semibold"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : null}

              {/* Bawarchi-Style Solid Black "Order" / "Order Online" Button */}
              <Link
                to="/menu"
                className="bg-black hover:bg-stone-900 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl border border-stone-800 hover:border-amber-400 transition-all shadow-md active:scale-95"
              >
                Order Online
              </Link>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-white hover:text-amber-300 transition-colors"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#7f1d1d] border-t border-red-800 px-4 pt-4 pb-6 space-y-3 animate-in slide-in-from-top-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-white font-semibold text-sm hover:bg-red-800"
            >
              Home
            </Link>
            <Link
              to="/menu"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-white font-semibold text-sm hover:bg-red-800"
            >
              Full Menu
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-white font-semibold text-sm hover:bg-red-800"
            >
              About Us
            </Link>
            <Link
              to="/offers"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-white font-semibold text-sm hover:bg-red-800"
            >
              Offers & Coupons
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-white font-semibold text-sm hover:bg-red-800"
            >
              Contact & Location
            </Link>
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-white font-semibold text-sm hover:bg-red-800"
            >
              Track Order / History
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-amber-300 font-bold text-sm bg-black/40"
              >
                Admin Management Portal
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
};
