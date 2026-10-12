import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Heart, Menu as MenuIcon, X, Clock, ShieldCheck, LogOut } from 'lucide-react';
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

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Offers', path: '/offers' },
    { name: 'My Orders', path: '/orders' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-stone-900 text-stone-300 text-xs py-1.5 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Open Today: {settings.operating_hours}</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-stone-400">
            {settings.phone ? (
              <span>Call: <a href={`tel:${settings.phone}`} className="text-amber-400 font-medium">{settings.phone}</a></span>
            ) : (
              <span className="text-amber-400/80 italic text-[11px]">Direct Table / Parcel Orders</span>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Portal
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-[#fdfbf7]/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo / Branding */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-stone-900 flex items-center justify-center text-amber-100 font-serif font-bold text-xl shadow-md border border-amber-500/30 group-hover:scale-105 transition-transform">
                JB
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl sm:text-2xl text-stone-900 tracking-tight leading-tight group-hover:text-amber-700 transition-colors">
                  {settings.restaurant_name}
                </span>
                <span className="text-[11px] tracking-widest uppercase text-amber-700 font-semibold">
                  Authentic Taste & Quality
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors relative py-1 ${
                    isActive(link.path)
                      ? 'text-amber-700 font-semibold'
                      : 'text-stone-700 hover:text-amber-600'
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Action Buttons: Favorites, Cart, Account */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Favorites Icon */}
              <Link
                to="/favorites"
                className="p-2.5 rounded-full text-stone-600 hover:text-amber-600 hover:bg-stone-100 transition-colors"
                title="Saved Favorites"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-4 py-2.5 rounded-full font-medium text-sm shadow-sm hover:shadow transition-all"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {itemCount > 0 && (
                  <span className="ml-0.5 bg-stone-900 text-amber-300 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* User Account Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-2 rounded-full hover:bg-stone-100 text-stone-700 transition-colors border border-stone-200"
                    title="Account Menu"
                  >
                    <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-semibold text-xs flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </button>

                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-stone-200 py-2 z-50 text-stone-700 text-sm animate-in fade-in slide-in-from-top-2"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-stone-100">
                        <p className="font-semibold text-stone-900 truncate">{user.name}</p>
                        <p className="text-xs text-stone-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-amber-50 hover:text-amber-700"
                      >
                        <User className="w-4 h-4" /> My Profile & Addresses
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-amber-50 hover:text-amber-700"
                      >
                        <ShoppingBag className="w-4 h-4" /> Order History
                      </Link>
                      <Link
                        to="/favorites"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-amber-50 hover:text-amber-700"
                      >
                        <Heart className="w-4 h-4" /> Favorites
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-amber-700 font-medium hover:bg-amber-50"
                        >
                          <ShieldCheck className="w-4 h-4" /> Admin Dashboard
                        </Link>
                      )}
                      <div className="border-t border-stone-100 my-1" />
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 text-left"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate('/auth')}
                  className="flex items-center gap-1.5 text-stone-700 hover:text-amber-700 font-medium text-sm px-3 py-2 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-stone-700 hover:text-amber-700 rounded-lg"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#fdfbf7] border-b border-stone-200 px-4 pt-2 pb-6 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-amber-100 text-amber-900 font-semibold'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/favorites"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-stone-700 hover:bg-stone-100"
            >
              Saved Favorites
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-amber-800 bg-amber-50"
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
