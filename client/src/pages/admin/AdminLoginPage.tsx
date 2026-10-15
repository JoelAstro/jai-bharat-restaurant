import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useRestaurant } from '../../context/RestaurantContext.js';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login, logout } = useAuth();
  const { settings } = useRestaurant();
  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const user = await login(email.trim(), password);
      if (user.role !== 'ADMIN') {
        logout();
        throw new Error('Access denied. Administrator privileges required.');
      }
      navigate('/admin');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid administrator credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-stone-950 rounded-3xl p-8 sm:p-10 border border-stone-800 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-amber-100 font-serif font-bold text-xl mx-auto mb-4 border border-amber-500/30">
            <ShieldCheck className="w-6 h-6 text-amber-200" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-tight">
            Administrator Portal
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm mt-1">
            {settings.restaurant_name} Management Console
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-2xl flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@jaibharatrestaurant.com"
                className="w-full text-xs sm:text-sm pl-10 pr-3 py-3 rounded-xl border border-stone-800 bg-stone-900 text-white placeholder-stone-500 focus:outline-hidden focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs sm:text-sm pl-10 pr-10 py-3 rounded-xl border border-stone-800 bg-stone-900 text-white placeholder-stone-500 focus:outline-hidden focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 transition-colors focus:outline-hidden"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all text-sm mt-3"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-stone-800 text-center">
          <Link to="/" className="text-xs text-stone-400 hover:text-amber-400 transition-colors">
            ← Return to Customer Website
          </Link>
        </div>
      </div>
    </div>
  );
};
