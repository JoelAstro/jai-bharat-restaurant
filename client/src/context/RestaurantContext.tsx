import React, { createContext, useContext, useState, useEffect } from 'react';
import { PublicRestaurantSettings } from '../types/index.js';
import { api } from '../services/api.js';

interface RestaurantContextType {
  settings: PublicRestaurantSettings;
  isLoading: boolean;
  formatPrice: (paise: number) => string;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: PublicRestaurantSettings = {
  restaurant_name: 'Jai Bharat Family Restaurant',
  tagline: 'Great Food. Beautiful Moments.',
  phone: '',
  email: '',
  address: '',
  city: '',
  pincode: '',
  operating_hours: '11:00 AM - 11:00 PM',
  tax_rate_percent: 5,
  delivery_fee_paise: 4000,
  free_delivery_threshold_paise: 50000,
  delivery_enabled: true,
  takeaway_enabled: true,
  cod_enabled: true,
  razorpay_enabled: true,
  currency_symbol: '₹',
};

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<PublicRestaurantSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchSettings = async () => {
    try {
      const data = await api.getPublicSettings();
      setSettings(data);
    } catch (err) {
      console.warn('Could not load restaurant settings, using defaults');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const formatPrice = (paise: number) => {
    const rupees = (paise / 100).toFixed(0);
    return `${settings.currency_symbol}${rupees}`;
  };

  return (
    <RestaurantContext.Provider
      value={{
        settings,
        isLoading,
        formatPrice,
        refreshSettings: fetchSettings,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
