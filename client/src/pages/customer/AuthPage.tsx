import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, User, Phone, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useRestaurant } from '../../context/RestaurantContext.js';

export const AuthPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login, register } = useAuth();
  const { settings } = useRestaurant();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/menu';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) throw new Error('Please enter your full name.');
        if (password.length < 6) throw new Error('Password must be at least 6 characters.');
        if (phone && !/^[0-9]{10}$/.test(phone.trim())) {
          throw new Error('Phone number must be a 10-digit mobile number.');
        }

        await register(name.trim(), email.trim(), password, phone.trim());
      } else {
        await login(email.trim(), password);
      }
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-xl">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#991b1b] flex items-center justify-center text-red-100 font-serif font-bold text-lg shadow-sm">
              JB
            </div>
            <span className="font-serif font-bold text-xl text-stone-900">
              {settings.restaurant_name}
            </span>
          </Link>
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            {isRegister ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            {isRegister
              ? 'Join to save delivery addresses and track food orders.'
              : 'Sign in to access your previous orders and saved favourites.'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-stone-100 p-1 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              !isRegister
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              isRegister
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Register
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rohan Sharma"
                  className="w-full text-xs sm:text-sm pl-10 pr-3 py-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#991b1b]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs sm:text-sm pl-10 pr-3 py-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#991b1b]"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Mobile Number (10 digits)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  pattern="[0-9]{10}"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full text-xs sm:text-sm pl-10 pr-3 py-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#991b1b]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs sm:text-sm pl-10 pr-3 py-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#991b1b]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-[#991b1b] hover:bg-[#7f1d1d] disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all text-sm mt-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isRegister ? 'Register Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-stone-100 text-center">
          <p className="text-xs text-stone-500">
            Are you a restaurant staff or administrator?{' '}
            <Link to="/admin" className="text-[#991b1b] font-semibold hover:underline">
              Admin Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
