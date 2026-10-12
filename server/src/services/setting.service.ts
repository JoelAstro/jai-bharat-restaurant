import prisma from '../config/prisma.js';

export class SettingService {
  static async getAllSettingsMap(): Promise<Record<string, string>> {
    const records = await prisma.restaurantSetting.findMany();
    const map: Record<string, string> = {};
    for (const record of records) {
      map[record.key] = record.value;
    }
    return map;
  }

  static async getPublicSettings() {
    const settings = await this.getAllSettingsMap();
    return {
      restaurant_name: settings.restaurant_name || 'Jai Bharat Family Restaurant',
      tagline: settings.tagline || 'Great Food. Beautiful Moments.',
      phone: settings.phone || '',
      email: settings.email || '',
      address: settings.address || '',
      city: settings.city || '',
      pincode: settings.pincode || '',
      operating_hours: settings.operating_hours || '11:00 AM - 11:00 PM',
      tax_rate_percent: parseInt(settings.tax_rate_percent || '5', 10),
      delivery_fee_paise: parseInt(settings.delivery_fee_paise || '4000', 10),
      free_delivery_threshold_paise: parseInt(settings.free_delivery_threshold_paise || '50000', 10),
      delivery_enabled: settings.delivery_enabled !== 'false',
      takeaway_enabled: settings.takeaway_enabled !== 'false',
      cod_enabled: settings.cod_enabled !== 'false',
      razorpay_enabled: settings.razorpay_enabled !== 'false',
      currency_symbol: settings.currency_symbol || '₹',
    };
  }

  static async getAdminSettings() {
    const settings = await this.getAllSettingsMap();
    
    // Check which owner details are missing
    const missingDetails: string[] = [];
    if (!settings.phone || settings.phone.trim() === '') {
      missingDetails.push('Official Restaurant Phone Number');
    }
    if (!settings.email || settings.email.trim() === '') {
      missingDetails.push('Official Restaurant Email');
    }
    if (!settings.address || settings.address.trim() === '') {
      missingDetails.push('Official Physical Restaurant Address');
    }
    if (!settings.city || settings.city.trim() === '') {
      missingDetails.push('Operating City / Delivery Zone');
    }
    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes('your_') || process.env.RAZORPAY_KEY_ID.includes('mock_')) {
      missingDetails.push('Production Razorpay API Credentials (Key ID & Secret)');
    }

    return {
      settings,
      missingDetails,
      isConfigured: missingDetails.length === 0,
    };
  }

  static async updateSettings(updates: Record<string, string>) {
    const results = [];
    for (const [key, value] of Object.entries(updates)) {
      const record = await prisma.restaurantSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
      results.push(record);
    }
    return results;
  }
}
