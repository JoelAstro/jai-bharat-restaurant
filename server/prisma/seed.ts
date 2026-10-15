import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding Jai Bharat Family Restaurant Database ---');

  // 1. Initial Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'joelramieddy@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'JaiBharatAdmin2026!';
  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'ADMIN',
      passwordHash: adminPasswordHash,
    },
    create: {
      email: adminEmail,
      passwordHash: adminPasswordHash,
      name: process.env.ADMIN_NAME || 'Jai Bharat Administrator',
      phone: process.env.ADMIN_PHONE || '9876543210',
      role: 'ADMIN',
    },
  });
  console.log(`✓ Admin user configured: ${admin.email}`);

  // 2. Demo Customer User (for development and automated testing)
  const customerEmail = 'customer@example.com';
  const customerPassword = 'Customer123!';
  const customerPasswordHash = await bcrypt.hash(customerPassword, 10);

  const customer = await prisma.user.upsert({
    where: { email: customerEmail },
    update: {
      passwordHash: customerPasswordHash,
    },
    create: {
      email: customerEmail,
      passwordHash: customerPasswordHash,
      name: 'Rohan Sharma',
      phone: '9811223344',
      role: 'CUSTOMER',
      addresses: {
        create: [
          {
            label: 'Home',
            street: 'Flat 402, Sunshine Residency',
            area: 'MG Road Sector 4',
            city: 'Bengaluru',
            pincode: '560001',
            landmark: 'Near Central Mall',
            isDefault: true,
          },
        ],
      },
    },
  });
  console.log(`✓ Demo customer user configured: ${customer.email}`);

  // 3. Restaurant Settings (Configurable Store Profile)
  // Per non-negotiable rules: owner-supplied data is marked as pending configuration
  const defaultSettings: Record<string, string> = {
    restaurant_name: 'Jai Bharat Family Restaurant',
    tagline: 'Great Food. Beautiful Moments.',
    phone: '', // Owner must configure in Admin Settings
    email: '', // Owner must configure in Admin Settings
    address: '', // Owner must configure in Admin Settings
    city: '',
    pincode: '',
    operating_hours: '11:00 AM - 11:00 PM (Everyday)',
    tax_rate_percent: '5', // Standard 5% GST on dining / takeaway in India
    delivery_fee_paise: '4000', // ₹40.00
    free_delivery_threshold_paise: '50000', // ₹500.00
    delivery_enabled: 'true',
    takeaway_enabled: 'true',
    cod_enabled: 'true',
    razorpay_enabled: 'true',
    currency_symbol: '₹',
  };

  for (const [key, value] of Object.entries(defaultSettings)) {
    await prisma.restaurantSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  console.log('✓ Restaurant configuration settings seeded');

  // 4. Sample Categories (Clearly marked as sample data pending owner's real menu)
  const categoriesData = [
    {
      name: 'Starters & Appetizers (Sample)',
      slug: 'starters',
      description: 'Crispy, smoky, and flavour-packed tandoori and tawa starters',
      displayOrder: 1,
      imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&q=80',
    },
    {
      name: 'Main Course (Sample)',
      slug: 'main-course',
      description: 'Rich, slow-simmered gravies and authentic homestyle curries',
      displayOrder: 2,
      imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&q=80',
    },
    {
      name: 'Biryani & Rice (Sample)',
      slug: 'biryani-rice',
      description: 'Fragrant basmati rice layered with aromatics and sealed in handi',
      displayOrder: 3,
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80',
    },
    {
      name: 'Tandoori Breads (Sample)',
      slug: 'breads',
      description: 'Fresh clay-oven baked naans, rotis, and stuffed parathas',
      displayOrder: 4,
      imageUrl: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&q=80',
    },
    {
      name: 'Desserts & Beverages (Sample)',
      slug: 'desserts-beverages',
      description: 'Sweet indulgences and refreshing Indian beverages',
      displayOrder: 5,
      imageUrl: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=600&q=80',
    },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap.set(cat.slug, record.id);
  }
  console.log(`✓ ${categoriesData.length} Sample categories seeded`);

  // 5. Sample Menu Items with Variations & Addons
  // (Notice each item explicitly includes [Sample] or realistic placeholder note)
  const menuItemsData = [
    {
      categoryId: categoryMap.get('starters')!,
      name: 'Paneer Tikka (Sample Item)',
      description: 'Char-grilled cottage cheese cubes marinated in spiced hung curd, bell peppers, and carom seeds.',
      price: 24000, // ₹240
      isVeg: true,
      isAvailable: true,
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=80',
      variations: [
        { name: 'Standard (6 pcs)', price: 24000 },
        { name: 'Large Platter (10 pcs)', price: 38000 },
      ],
      addons: [
        { name: 'Extra Mint Chutney & Salad', price: 3000 },
        { name: 'Cheese Dip', price: 4000 },
      ],
    },
    {
      categoryId: categoryMap.get('starters')!,
      name: 'Murgh Malai Tikka (Sample Item)',
      description: 'Melt-in-mouth chicken chunks steeped in fresh cream, cardamom, mild cheese, and white pepper.',
      price: 32000, // ₹320
      isVeg: false,
      isAvailable: true,
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&q=80',
      variations: [
        { name: 'Regular Portion', price: 32000 },
        { name: 'Double Portion', price: 58000 },
      ],
      addons: [
        { name: 'Extra Butter Glaze', price: 2500 },
        { name: 'Mint Chutney Bowl', price: 2000 },
      ],
    },
    {
      categoryId: categoryMap.get('main-course')!,
      name: 'Butter Chicken Masala (Sample Item)',
      description: 'Tandoor-roasted chicken simmered in a silky, rich makhani gravy flavoured with dried fenugreek leaves and butter.',
      price: 36000, // ₹360
      isVeg: false,
      isAvailable: true,
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&q=80',
      variations: [
        { name: 'Half Handi', price: 24000 },
        { name: 'Full Handi', price: 36000 },
      ],
      addons: [
        { name: 'Extra Makhani Gravy', price: 6000 },
        { name: 'Extra Butter Swirl', price: 3000 },
      ],
    },
    {
      categoryId: categoryMap.get('main-course')!,
      name: 'Dal Makhani (Sample Item)',
      description: 'Slow-simmered whole black lentils cooked overnight with tomatoes, butter, and cream on gentle charcoal heat.',
      price: 26000, // ₹260
      isVeg: true,
      isAvailable: true,
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80',
      variations: [
        { name: 'Regular Handi', price: 26000 },
        { name: 'Large Handi', price: 39000 },
      ],
      addons: [
        { name: 'Extra Cream Topping', price: 3000 },
      ],
    },
    {
      categoryId: categoryMap.get('main-course')!,
      name: 'Paneer Butter Masala (Sample Item)',
      description: 'Fresh malai paneer simmered in an aromatic tomato cashew nut gravy with Indian whole spices.',
      price: 29000, // ₹290
      isVeg: true,
      isAvailable: true,
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80',
      variations: [
        { name: 'Half Bowl', price: 18000 },
        { name: 'Full Bowl', price: 29000 },
      ],
      addons: [
        { name: 'Extra Paneer Cubes (4 pcs)', price: 6000 },
      ],
    },
    {
      categoryId: categoryMap.get('biryani-rice')!,
      name: 'Hyderabadi Dum Biryani (Sample Item)',
      description: 'Long grain aged basmati rice layered with succulent marinated chicken, saffron strands, and fried onions, cooked in dum handi.',
      price: 34000, // ₹340
      isVeg: false,
      isAvailable: true,
      isFeatured: true,
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80',
      variations: [
        { name: 'Regular (Serves 1-2)', price: 34000 },
        { name: 'Jumbo Pack (Serves 3-4)', price: 65000 },
      ],
      addons: [
        { name: 'Boiled Egg (2 pcs)', price: 3000 },
        { name: 'Extra Salan & Raita', price: 4000 },
      ],
    },
    {
      categoryId: categoryMap.get('biryani-rice')!,
      name: 'Subz Dum Biryani (Sample Item)',
      description: 'Garden fresh vegetables, fried cashews, and aromatic spices layered with fragrant saffron basmati rice.',
      price: 26000, // ₹260
      isVeg: true,
      isAvailable: true,
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1642821373181-696a54913e9a?w=600&q=80',
      variations: [
        { name: 'Regular Portion', price: 26000 },
      ],
      addons: [
        { name: 'Boondi Raita', price: 3500 },
      ],
    },
    {
      categoryId: categoryMap.get('breads')!,
      name: 'Butter Garlic Naan (Sample Item)',
      description: 'Traditional tandoor-baked leavened flatbread brushed with garlic butter and fresh cilantro.',
      price: 6500, // ₹65
      isVeg: true,
      isAvailable: true,
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&q=80',
      variations: [],
      addons: [],
    },
    {
      categoryId: categoryMap.get('desserts-beverages')!,
      name: 'Shahi Gulab Jamun (2 pcs) (Sample Item)',
      description: 'Warm golden milk dumplings soaked in cardamom and saffron-infused rose sugar syrup.',
      price: 9000, // ₹90
      isVeg: true,
      isAvailable: true,
      isFeatured: false,
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80',
      variations: [],
      addons: [
        { name: 'Vanilla Ice Cream Scoop', price: 4000 },
      ],
    },
  ];

  for (const item of menuItemsData) {
    const existing = await prisma.menuItem.findFirst({
      where: { name: item.name },
    });

    if (!existing) {
      await prisma.menuItem.create({
        data: {
          categoryId: item.categoryId,
          name: item.name,
          description: item.description,
          price: item.price,
          isVeg: item.isVeg,
          isAvailable: item.isAvailable,
          isFeatured: item.isFeatured,
          imageUrl: item.imageUrl,
          variations: {
            create: item.variations,
          },
          addons: {
            create: item.addons,
          },
        },
      });
    }
  }
  console.log(`✓ ${menuItemsData.length} Sample menu items configured`);

  // 6. Sample Promotional Coupons
  const couponsData = [
    {
      code: 'WELCOME50',
      description: 'Flat ₹50 OFF on your first family order above ₹299',
      discountType: 'FIXED',
      discountValue: 5000, // ₹50.00
      minOrderAmount: 29900, // ₹299.00
      maxDiscount: 5000,
      usageLimit: 500,
      isActive: true,
    },
    {
      code: 'JAI10',
      description: '10% OFF up to ₹100 on orders above ₹400',
      discountType: 'PERCENTAGE',
      discountValue: 10, // 10%
      minOrderAmount: 40000, // ₹400.00
      maxDiscount: 10000, // ₹100.00
      usageLimit: 1000,
      isActive: true,
    },
  ];

  for (const coupon of couponsData) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: coupon,
      create: coupon,
    });
  }
  console.log(`✓ ${couponsData.length} Promotional coupons seeded`);

  console.log('--- Database Seeding Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
