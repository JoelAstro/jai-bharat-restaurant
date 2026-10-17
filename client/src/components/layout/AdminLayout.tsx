import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Users,
  Tag,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  Menu as MenuIcon,
  X,
  ShieldCheck,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useRestaurant } from '../../context/RestaurantContext.js';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, logout, isLoading } = useAuth();
  const { settings } = useRestaurant();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    navigate('/admin/login');
    return null;
  }

  const navItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Live Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Content Manager', path: '/admin/manager', icon: Sparkles },
    { name: 'Menu & Dishes', path: '/admin/menu', icon: UtensilsCrossed },
    { name: 'Website Images', path: '/admin/images', icon: ImageIcon },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Coupons & Offers', path: '/admin/coupons', icon: Tag },
    { name: 'Sales Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Restaurant Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-stone-900 text-white px-4 py-3 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center font-serif font-bold text-sm">
            JB
          </div>
          <span className="font-serif font-bold text-sm tracking-wide">
            Admin Management
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-stone-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-stone-900 text-stone-300 flex flex-col justify-between z-50 md:z-30 transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Top Branding */}
          <div className="p-6 border-b border-stone-800">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-amber-100 font-serif font-bold text-lg shadow-md border border-amber-500/30">
                JB
              </div>
              <div>
                <h2 className="font-serif font-bold text-base text-white leading-tight">
                  {settings.restaurant_name}
                </h2>
                <span className="text-[11px] text-amber-400 font-semibold tracking-wider uppercase">
                  Management Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                    active
                      ? 'bg-amber-600 text-white font-semibold shadow-xs'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile / Quick Links */}
        <div className="p-4 border-t border-stone-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
              <span>View Customer Site</span>
            </div>
          </Link>

          <div className="px-3.5 py-2 flex items-center justify-between text-xs text-stone-400">
            <div className="truncate mr-2">
              <p className="font-semibold text-stone-200 truncate">{user?.name}</p>
              <p className="text-[10px] text-amber-500">Administrator</p>
            </div>
            <button
              onClick={logout}
              className="text-stone-400 hover:text-rose-400 p-1"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
