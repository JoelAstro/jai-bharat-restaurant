import fs from 'fs';
import path from 'path';
import prisma from '../config/prisma.js';

export interface CreateImageDTO {
  section: string;
  title: string;
  imageUrl: string;
  altText?: string;
  displayOrder?: number;
  isDefault?: boolean;
  isEnabled?: boolean;
  metadata?: string;
}

export interface UpdateImageDTO {
  title?: string;
  imageUrl?: string;
  altText?: string;
  displayOrder?: number;
  isDefault?: boolean;
  isEnabled?: boolean;
  metadata?: string;
}

export class ImageService {
  /**
   * Seed default images into WebsiteImage table if table or section is empty
   */
  static async seedDefaultsIfEmpty(): Promise<void> {
    try {
      const count = await prisma.websiteImage.count();
      if (count > 0) return;

      const defaults = [
        // Hero Images (4 rotating, hero-1 default)
        {
          section: 'hero',
          title: 'Delicious Chicken Dum Biryani in Clay Handi',
          imageUrl: '/images/hero/hero-1.jpg',
          altText: 'Delicious Chicken Dum Biryani in Clay Handi',
          displayOrder: 0,
          isDefault: true,
          isEnabled: true,
        },
        {
          section: 'hero',
          title: 'Crispy Spicy Chicken 65 with Fresh Garnish',
          imageUrl: '/images/hero/hero-2.jpg',
          altText: 'Crispy Spicy Chicken 65 with Fresh Garnish',
          displayOrder: 1,
          isDefault: false,
          isEnabled: true,
        },
        {
          section: 'hero',
          title: 'Royal Dum Biryani in Copper Handi with Egg & Lemon',
          imageUrl: '/images/hero/hero-3.jpg',
          altText: 'Royal Dum Biryani in Copper Handi with Egg & Lemon',
          displayOrder: 2,
          isDefault: false,
          isEnabled: true,
        },
        {
          section: 'hero',
          title: 'Aromatic Steaming Chicken Biryani Handi',
          imageUrl: '/images/hero/hero-4.jpg',
          altText: 'Aromatic Steaming Chicken Biryani Handi',
          displayOrder: 3,
          isDefault: false,
          isEnabled: true,
        },

        // Building / Exterior Photo
        {
          section: 'building',
          title: 'Jai Bharat Restaurant Building Exterior',
          imageUrl: '/images/jai-bharat-building.jpg',
          altText: 'Jai Bharat Family Restaurant Building Exterior - Nandigama',
          displayOrder: 0,
          isDefault: true,
          isEnabled: true,
        },

        // Owner Portrait
        {
          section: 'owner',
          title: 'Owner and Founder',
          imageUrl: '/images/owner.jpg',
          altText: 'Owner & Founder of Jai Bharat Family Restaurant',
          displayOrder: 0,
          isDefault: true,
          isEnabled: true,
        },

        // Category Cards (8 cards)
        {
          section: 'categories',
          title: 'Appetizers',
          imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=80',
          altText: 'Appetizers',
          displayOrder: 0,
          isDefault: false,
          isEnabled: true,
          metadata: JSON.stringify({ categorySlug: 'starters' }),
        },
        {
          section: 'categories',
          title: 'Indo-Chinese',
          imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80',
          altText: 'Indo-Chinese',
          displayOrder: 1,
          isDefault: false,
          isEnabled: true,
          metadata: JSON.stringify({ categorySlug: 'starters' }),
        },
        {
          section: 'categories',
          title: 'Signature Biryanis',
          imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80',
          altText: 'Signature Biryanis',
          displayOrder: 2,
          isDefault: false,
          isEnabled: true,
          metadata: JSON.stringify({ categorySlug: 'biryani-rice' }),
        },
        {
          section: 'categories',
          title: 'Entrees & Curries',
          imageUrl: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&q=80',
          altText: 'Entrees & Curries',
          displayOrder: 3,
          isDefault: false,
          isEnabled: true,
          metadata: JSON.stringify({ categorySlug: 'main-course' }),
        },
        {
          section: 'categories',
          title: 'Fresh Tandoori Breads',
          imageUrl: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&q=80',
          altText: 'Fresh Tandoori Breads',
          displayOrder: 4,
          isDefault: false,
          isEnabled: true,
          metadata: JSON.stringify({ categorySlug: 'breads' }),
        },
        {
          section: 'categories',
          title: 'Vegetarian Delicacies',
          imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80',
          altText: 'Vegetarian Delicacies',
          displayOrder: 5,
          isDefault: false,
          isEnabled: true,
          metadata: JSON.stringify({ categorySlug: 'main-course' }),
        },
        {
          section: 'categories',
          title: 'Tandoori & Kebab Specials',
          imageUrl: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&q=80',
          altText: 'Tandoori & Kebab Specials',
          displayOrder: 6,
          isDefault: false,
          isEnabled: true,
          metadata: JSON.stringify({ categorySlug: 'starters' }),
        },
        {
          section: 'categories',
          title: 'Desserts & Beverages',
          imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80',
          altText: 'Desserts & Beverages',
          displayOrder: 7,
          isDefault: false,
          isEnabled: true,
          metadata: JSON.stringify({ categorySlug: 'desserts-beverages' }),
        },

        // About Us Philosophy
        {
          section: 'about',
          title: 'Our Culinary Philosophy',
          imageUrl: '/images/hero/hero-2.jpg',
          altText: 'Crispy Starters and Fresh Indian Delicacies at Jai Bharat',
          displayOrder: 0,
          isDefault: true,
          isEnabled: true,
        },
      ];

      for (const item of defaults) {
        await prisma.websiteImage.create({ data: item });
      }
    } catch (error) {
      console.error('Error seeding default website images:', error);
    }
  }

  /**
   * Public list: returns enabled images for a given section or all sections.
   * If hero section, ensures the default image is first.
   */
  static async getPublicImages(section?: string) {
    const where: any = { isEnabled: true };
    if (section) {
      where.section = section;
    }

    const images = await prisma.websiteImage.findMany({
      where,
      orderBy: [
        { isDefault: 'desc' },
        { displayOrder: 'asc' },
        { createdAt: 'asc' },
      ],
    });

    return images;
  }

  /**
   * Admin list: returns all images (enabled & disabled) for a given section or all sections.
   */
  static async getAllImages(section?: string) {
    const where: any = {};
    if (section) {
      where.section = section;
    }

    return prisma.websiteImage.findMany({
      where,
      orderBy: [
        { section: 'asc' },
        { displayOrder: 'asc' },
        { createdAt: 'asc' },
      ],
    });
  }

  /**
   * Create a new website image record.
   */
  static async createImage(data: CreateImageDTO) {
    // If setting as default, clear other default in this section
    if (data.isDefault) {
      await prisma.websiteImage.updateMany({
        where: { section: data.section, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Determine default order if not provided
    if (data.displayOrder === undefined) {
      const maxOrder = await prisma.websiteImage.aggregate({
        where: { section: data.section },
        _max: { displayOrder: true },
      });
      data.displayOrder = (maxOrder._max.displayOrder ?? -1) + 1;
    }

    return prisma.websiteImage.create({
      data: {
        section: data.section,
        title: data.title,
        imageUrl: data.imageUrl,
        altText: data.altText || data.title,
        displayOrder: data.displayOrder,
        isDefault: data.isDefault ?? false,
        isEnabled: data.isEnabled ?? true,
        metadata: data.metadata,
      },
    });
  }

  /**
   * Update an image record.
   */
  static async updateImage(id: string, data: UpdateImageDTO) {
    const existing = await prisma.websiteImage.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new Error('Image record not found');
    }

    // If making default, unset other defaults in the same section
    if (data.isDefault) {
      await prisma.websiteImage.updateMany({
        where: { section: existing.section, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    return prisma.websiteImage.update({
      where: { id },
      data,
    });
  }

  /**
   * Set a specific image as the default/first image for its section.
   */
  static async setDefaultImage(id: string) {
    const target = await prisma.websiteImage.findUnique({ where: { id } });
    if (!target) {
      throw new Error('Image record not found');
    }

    // Unset current default in this section
    await prisma.websiteImage.updateMany({
      where: { section: target.section, isDefault: true },
      data: { isDefault: false },
    });

    // Set new default
    return prisma.websiteImage.update({
      where: { id },
      data: { isDefault: true },
    });
  }

  /**
   * Batch reorder images in a section.
   */
  static async reorderImages(items: { id: string; displayOrder: number; isDefault?: boolean }[]) {
    return prisma.$transaction(
      items.map((item) =>
        prisma.websiteImage.update({
          where: { id: item.id },
          data: {
            displayOrder: item.displayOrder,
            ...(item.isDefault !== undefined ? { isDefault: item.isDefault } : {}),
          },
        })
      )
    );
  }

  /**
   * Delete an image record and remove the uploaded file from disk if it was stored locally.
   */
  static async deleteImage(id: string) {
    const image = await prisma.websiteImage.findUnique({ where: { id } });
    if (!image) {
      throw new Error('Image record not found');
    }

    // Delete local file if it's in /uploads/
    if (image.imageUrl.startsWith('/uploads/')) {
      try {
        const filePath = path.resolve(process.cwd(), '.' + image.imageUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error('Failed to delete file from disk:', err);
      }
    }

    return prisma.websiteImage.delete({ where: { id } });
  }
}
