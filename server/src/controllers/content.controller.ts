import { Request, Response } from 'express';
import prisma from '../config/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { uploadBufferToCloudinary, deleteCloudinaryImage } from './upload.controller.js';
import { isCloudinaryConfigured } from '../config/cloudinary.js';

// ============================================================================
// PUBLIC REST API ENDPOINTS
// ============================================================================

/**
 * GET /api/home/banners
 * Returns active home banners ordered by display order
 */
export async function getHomeBanners(_req: Request, res: Response): Promise<any> {
  try {
    const banners = await prisma.homeBanner.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    // Seamless fallback to websiteImage hero images if home_banners is empty
    if (banners.length === 0) {
      const heroImages = await prisma.websiteImage.findMany({
        where: { section: 'hero', isEnabled: true },
        orderBy: { displayOrder: 'asc' },
      });

      const fallbackBanners = heroImages.map((img) => ({
        id: img.id,
        title: img.title,
        subtitle: img.altText || 'Authentic Royal Flavors',
        imageUrl: img.imageUrl,
        cloudinaryPublicId: img.cloudinaryPublicId,
        buttonText: 'Order Now',
        buttonLink: '/menu',
        displayOrder: img.displayOrder,
        isActive: img.isEnabled,
        createdAt: img.createdAt,
        updatedAt: img.updatedAt,
      }));

      return sendSuccess(res, fallbackBanners, 'Home banners retrieved');
    }

    return sendSuccess(res, banners, 'Home banners retrieved');
  } catch (error: any) {
    console.error('[Content] getHomeBanners error:', error);
    return sendError(res, error.message || 'Failed to fetch home banners', 500);
  }
}

/**
 * GET /api/menu
 * Returns active menu categories populated with their active menu items
 */
export async function getMenu(req: Request, res: Response): Promise<any> {
  try {
    const search = req.query.search as string | undefined;
    const isVegQuery = req.query.isVeg as string | undefined;

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        items: {
          where: {
            isAvailable: true,
            ...(search
              ? {
                  OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                  ],
                }
              : {}),
            ...(isVegQuery !== undefined ? { isVeg: isVegQuery === 'true' } : {}),
          },
          include: {
            variations: true,
            addons: true,
          },
          orderBy: { price: 'asc' },
        },
      },
    });

    return sendSuccess(res, categories, 'Menu catalog retrieved');
  } catch (error: any) {
    console.error('[Content] getMenu error:', error);
    return sendError(res, error.message || 'Failed to fetch menu', 500);
  }
}

/**
 * GET /api/about
 * Returns about sections with culinary philosophy, history, and founder details
 */
export async function getAbout(_req: Request, res: Response): Promise<any> {
  try {
    const sections = await prisma.aboutSection.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    if (sections.length === 0) {
      // Fallback defaults if no dedicated about sections created yet
      const aboutImages = await prisma.websiteImage.findMany({
        where: { section: { in: ['about', 'owner', 'building'] }, isEnabled: true },
      });

      const fallback = [
        {
          sectionKey: 'heritage',
          title: 'A Royal Heritage of Flavors',
          subtitle: 'Tradition Since 1998',
          content:
            'Jai Bharat Family Restaurant is built on generational recipes, slow-cooked wood-fired dum biryanis, and culinary craftsmanship honed across decades.',
          imageUrl:
            aboutImages.find((img) => img.section === 'about')?.imageUrl ||
            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
        },
        {
          sectionKey: 'founder',
          title: 'Founder & Culinary Vision',
          subtitle: 'A Legacy of Excellence',
          content:
            'Every spice blend is roasted in-house. We source pure cold-pressed oils, aged basmati grains, and daily fresh cuts to guarantee authenticity in every bite.',
          imageUrl:
            aboutImages.find((img) => img.section === 'owner')?.imageUrl ||
            'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800',
        },
      ];

      return sendSuccess(res, fallback, 'About Us content retrieved');
    }

    return sendSuccess(res, sections, 'About Us content retrieved');
  } catch (error: any) {
    console.error('[Content] getAbout error:', error);
    return sendError(res, error.message || 'Failed to fetch about content', 500);
  }
}

/**
 * GET /api/offers
 * Returns active offers and promotional coupon codes
 */
export async function getOffers(_req: Request, res: Response): Promise<any> {
  try {
    const offers = await prisma.offer.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    if (offers.length === 0) {
      // Fallback to coupons if offers table is currently empty
      const coupons = await prisma.coupon.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      });

      const fallbackOffers = coupons.map((c) => ({
        id: c.id,
        title: c.description || `Special Promotion ${c.code}`,
        description: c.description || 'Limited time dining discount.',
        code: c.code,
        discountType: c.discountType,
        discountValue: c.discountValue,
        minOrderAmount: c.minOrderAmount,
        maxDiscount: c.maxDiscount,
        imageUrl: c.imageUrl,
        cloudinaryPublicId: c.cloudinaryPublicId,
        expiresAt: c.expiresAt,
        isActive: c.isActive,
      }));

      return sendSuccess(res, fallbackOffers, 'Active offers retrieved');
    }

    return sendSuccess(res, offers, 'Active offers retrieved');
  } catch (error: any) {
    console.error('[Content] getOffers error:', error);
    return sendError(res, error.message || 'Failed to fetch offers', 500);
  }
}

// ============================================================================
// PROTECTED ADMIN CRUD ENDPOINTS (WITH CLOUDINARY + NEON POSTGRESQL)
// ============================================================================

/**
 * POST /api/admin/home/banner
 * Creates a new home banner with image upload to Cloudinary
 */
export async function createHomeBanner(req: Request, res: Response): Promise<any> {
  let uploadedPublicId: string | null = null;

  try {
    const { title, subtitle, buttonText, buttonLink, displayOrder, isActive, imageUrl: directUrl } = req.body;

    if (!title) {
      return sendError(res, 'Banner title is required.', 400);
    }

    let finalImageUrl = directUrl;

    // Handle multipart buffer upload to Cloudinary
    if (req.file) {
      if (!isCloudinaryConfigured()) {
        return sendError(res, 'Cloudinary is not configured. Please supply credentials in .env', 503);
      }
      const uploadRes = await uploadBufferToCloudinary(req.file.buffer, 'jai_bharat/home_banners');
      finalImageUrl = uploadRes.secure_url;
      uploadedPublicId = uploadRes.public_id;
    }

    if (!finalImageUrl) {
      return sendError(res, 'Banner image is required (upload file or specify imageUrl).', 400);
    }

    const banner = await prisma.homeBanner.create({
      data: {
        title: title.trim(),
        subtitle: subtitle ? subtitle.trim() : null,
        imageUrl: finalImageUrl,
        cloudinaryPublicId: uploadedPublicId,
        buttonText: buttonText ? buttonText.trim() : 'Order Now',
        buttonLink: buttonLink ? buttonLink.trim() : '/menu',
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder, 10) : 0,
        isActive: isActive !== undefined ? String(isActive) === 'true' || isActive === true : true,
      },
    });

    return sendSuccess(res, banner, 'Home banner created successfully', 201);
  } catch (error: any) {
    // Compensation rollback: delete Cloudinary asset if DB insertion failed
    if (uploadedPublicId) {
      await deleteCloudinaryImage(uploadedPublicId);
    }
    console.error('[Admin] createHomeBanner error:', error);
    return sendError(res, error.message || 'Failed to create home banner', 500);
  }
}

/**
 * POST /api/admin/menu/category
 * Creates a menu category with image upload to Cloudinary
 */
export async function createMenuCategory(req: Request, res: Response): Promise<any> {
  let uploadedPublicId: string | null = null;

  try {
    const { name, slug, description, displayOrder, isActive, imageUrl: directUrl } = req.body;

    if (!name) {
      return sendError(res, 'Category name is required.', 400);
    }

    const generatedSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    let finalImageUrl = directUrl;

    if (req.file) {
      if (!isCloudinaryConfigured()) {
        return sendError(res, 'Cloudinary credentials required.', 503);
      }
      const uploadRes = await uploadBufferToCloudinary(req.file.buffer, 'jai_bharat/menu_categories');
      finalImageUrl = uploadRes.secure_url;
      uploadedPublicId = uploadRes.public_id;
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: generatedSlug,
        description: description ? description.trim() : null,
        imageUrl: finalImageUrl,
        cloudinaryPublicId: uploadedPublicId,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder, 10) : 0,
        isActive: isActive !== undefined ? String(isActive) === 'true' || isActive === true : true,
      },
    });

    return sendSuccess(res, category, 'Menu category created successfully', 201);
  } catch (error: any) {
    if (uploadedPublicId) {
      await deleteCloudinaryImage(uploadedPublicId);
    }
    console.error('[Admin] createMenuCategory error:', error);
    return sendError(res, error.message || 'Failed to create category', 500);
  }
}

/**
 * POST /api/admin/menu/item
 * Creates a menu item with image upload to Cloudinary
 */
export async function createMenuItem(req: Request, res: Response): Promise<any> {
  let uploadedPublicId: string | null = null;

  try {
    const {
      categoryId,
      name,
      description,
      price,
      isVeg,
      isAvailable,
      isFeatured,
      imageUrl: directUrl,
    } = req.body;

    if (!name || !categoryId || price === undefined) {
      return sendError(res, 'Missing required fields: categoryId, name, price.', 400);
    }

    // Verify category exists
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      return sendError(res, 'Category not found.', 404);
    }

    // Convert rupee inputs to integer paise if raw rupee number provided
    let rawPrice = parseFloat(price);
    let finalPricePaise = rawPrice > 1000 ? Math.round(rawPrice) : Math.round(rawPrice * 100);

    let finalImageUrl = directUrl;

    if (req.file) {
      if (!isCloudinaryConfigured()) {
        return sendError(res, 'Cloudinary credentials required.', 503);
      }
      const uploadRes = await uploadBufferToCloudinary(req.file.buffer, 'jai_bharat/menu_items');
      finalImageUrl = uploadRes.secure_url;
      uploadedPublicId = uploadRes.public_id;
    }

    const item = await prisma.menuItem.create({
      data: {
        categoryId,
        name: name.trim(),
        description: (description || '').trim(),
        price: finalPricePaise,
        isVeg: isVeg !== undefined ? String(isVeg) === 'true' || isVeg === true : true,
        isAvailable: isAvailable !== undefined ? String(isAvailable) === 'true' || isAvailable === true : true,
        isFeatured: isFeatured !== undefined ? String(isFeatured) === 'true' || isFeatured === true : false,
        imageUrl: finalImageUrl,
        cloudinaryPublicId: uploadedPublicId,
      },
      include: {
        category: true,
      },
    });

    return sendSuccess(res, item, 'Menu item created successfully', 201);
  } catch (error: any) {
    if (uploadedPublicId) {
      await deleteCloudinaryImage(uploadedPublicId);
    }
    console.error('[Admin] createMenuItem error:', error);
    return sendError(res, error.message || 'Failed to create menu item', 500);
  }
}

/**
 * PUT /api/admin/about/:section_key
 * Updates or creates an about section with image upload to Cloudinary
 */
export async function updateAboutSection(req: Request, res: Response): Promise<any> {
  let uploadedPublicId: string | null = null;

  try {
    const { section_key } = req.params;
    const { title, subtitle, content, displayOrder, isActive, imageUrl: directUrl } = req.body;

    if (!section_key) {
      return sendError(res, 'Section key parameter is required.', 400);
    }

    const existingSection = await prisma.aboutSection.findUnique({
      where: { sectionKey: section_key },
    });

    let finalImageUrl = directUrl || existingSection?.imageUrl;

    if (req.file) {
      if (!isCloudinaryConfigured()) {
        return sendError(res, 'Cloudinary credentials required.', 503);
      }
      const uploadRes = await uploadBufferToCloudinary(req.file.buffer, 'jai_bharat/about');
      finalImageUrl = uploadRes.secure_url;
      uploadedPublicId = uploadRes.public_id;

      // If replacing an existing Cloudinary asset, clean up old image
      if (existingSection?.cloudinaryPublicId) {
        await deleteCloudinaryImage(existingSection.cloudinaryPublicId);
      }
    }

    const section = await prisma.aboutSection.upsert({
      where: { sectionKey: section_key },
      create: {
        sectionKey: section_key,
        title: title || 'About Jai Bharat',
        subtitle: subtitle || null,
        content: content || 'About section content.',
        imageUrl: finalImageUrl,
        cloudinaryPublicId: uploadedPublicId,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder, 10) : 0,
        isActive: isActive !== undefined ? String(isActive) === 'true' || isActive === true : true,
      },
      update: {
        ...(title && { title: title.trim() }),
        ...(subtitle !== undefined && { subtitle: subtitle ? subtitle.trim() : null }),
        ...(content && { content: content.trim() }),
        ...(finalImageUrl && { imageUrl: finalImageUrl }),
        ...(uploadedPublicId && { cloudinaryPublicId: uploadedPublicId }),
        ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder, 10) }),
        ...(isActive !== undefined && { isActive: String(isActive) === 'true' || isActive === true }),
      },
    });

    return sendSuccess(res, section, `About section "${section_key}" updated successfully`);
  } catch (error: any) {
    if (uploadedPublicId) {
      await deleteCloudinaryImage(uploadedPublicId);
    }
    console.error('[Admin] updateAboutSection error:', error);
    return sendError(res, error.message || 'Failed to update about section', 500);
  }
}

/**
 * POST /api/admin/offers
 * Creates an offer/coupon with promotional image upload
 */
export async function createOffer(req: Request, res: Response): Promise<any> {
  let uploadedPublicId: string | null = null;

  try {
    const {
      title,
      description,
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      expiresAt,
      isActive,
      imageUrl: directUrl,
    } = req.body;

    if (!code || discountValue === undefined) {
      return sendError(res, 'Coupon code and discountValue are required.', 400);
    }

    let finalImageUrl = directUrl;

    if (req.file) {
      if (!isCloudinaryConfigured()) {
        return sendError(res, 'Cloudinary credentials required.', 503);
      }
      const uploadRes = await uploadBufferToCloudinary(req.file.buffer, 'jai_bharat/offers');
      finalImageUrl = uploadRes.secure_url;
      uploadedPublicId = uploadRes.public_id;
    }

    const cleanCode = code.trim().toUpperCase();

    // Create in offers table
    const offer = await prisma.offer.create({
      data: {
        title: title ? title.trim() : `Offer ${cleanCode}`,
        description: description ? description.trim() : null,
        code: cleanCode,
        discountType: discountType === 'FIXED' ? 'FIXED' : 'PERCENTAGE',
        discountValue: parseInt(discountValue, 10),
        minOrderAmount: minOrderAmount !== undefined ? parseInt(minOrderAmount, 10) : 0,
        maxDiscount: maxDiscount !== undefined ? parseInt(maxDiscount, 10) : null,
        imageUrl: finalImageUrl,
        cloudinaryPublicId: uploadedPublicId,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: isActive !== undefined ? String(isActive) === 'true' || isActive === true : true,
      },
    });

    // Also mirror to Coupon table for checkout validation compatibility
    try {
      await prisma.coupon.upsert({
        where: { code: cleanCode },
        create: {
          code: cleanCode,
          description: title || description || `Offer ${cleanCode}`,
          discountType: discountType === 'FIXED' ? 'FIXED' : 'PERCENTAGE',
          discountValue: parseInt(discountValue, 10),
          minOrderAmount: minOrderAmount !== undefined ? parseInt(minOrderAmount, 10) : 0,
          maxDiscount: maxDiscount !== undefined ? parseInt(maxDiscount, 10) : null,
          imageUrl: finalImageUrl,
          cloudinaryPublicId: uploadedPublicId,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
          isActive: isActive !== undefined ? String(isActive) === 'true' || isActive === true : true,
        },
        update: {
          description: title || description || `Offer ${cleanCode}`,
          discountType: discountType === 'FIXED' ? 'FIXED' : 'PERCENTAGE',
          discountValue: parseInt(discountValue, 10),
          minOrderAmount: minOrderAmount !== undefined ? parseInt(minOrderAmount, 10) : 0,
          maxDiscount: maxDiscount !== undefined ? parseInt(maxDiscount, 10) : null,
          imageUrl: finalImageUrl,
          cloudinaryPublicId: uploadedPublicId,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
          isActive: isActive !== undefined ? String(isActive) === 'true' || isActive === true : true,
        },
      });
    } catch (couponErr) {
      console.warn('[Admin] Note: coupon mirror warning:', couponErr);
    }

    return sendSuccess(res, offer, 'Offer created successfully', 201);
  } catch (error: any) {
    if (uploadedPublicId) {
      await deleteCloudinaryImage(uploadedPublicId);
    }
    console.error('[Admin] createOffer error:', error);
    return sendError(res, error.message || 'Failed to create offer', 500);
  }
}

/**
 * DELETE /api/admin/menu/item/:id
 * Deletes a menu item and destroys its orphaned Cloudinary image
 */
export async function deleteMenuItem(req: Request, res: Response): Promise<any> {
  try {
    const { id } = req.params;

    const item = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!item) {
      return sendError(res, 'Menu item not found', 404);
    }

    // CRITICAL: Call Cloudinary destroy to remove orphaned images
    if (item.cloudinaryPublicId) {
      console.log(`[Cloudinary Cleanup] Destroying orphaned asset: ${item.cloudinaryPublicId}`);
      await deleteCloudinaryImage(item.cloudinaryPublicId);
    }

    // Delete associated relations if any, then delete item
    await prisma.itemVariation.deleteMany({ where: { menuItemId: id } });
    await prisma.itemAddon.deleteMany({ where: { menuItemId: id } });
    await prisma.favorite.deleteMany({ where: { menuItemId: id } });

    await prisma.menuItem.delete({
      where: { id },
    });

    return sendSuccess(res, { id, name: item.name }, 'Menu item and Cloudinary image deleted successfully');
  } catch (error: any) {
    console.error('[Admin] deleteMenuItem error:', error);
    return sendError(res, error.message || 'Failed to delete menu item', 500);
  }
}

/**
 * DELETE /api/admin/home/banner/:id
 * Deletes a home banner with Cloudinary image cleanup
 */
export async function deleteHomeBanner(req: Request, res: Response): Promise<any> {
  try {
    const { id } = req.params;
    const banner = await prisma.homeBanner.findUnique({ where: { id } });

    if (!banner) {
      return sendError(res, 'Banner not found', 404);
    }

    if (banner.cloudinaryPublicId) {
      await deleteCloudinaryImage(banner.cloudinaryPublicId);
    }

    await prisma.homeBanner.delete({ where: { id } });
    return sendSuccess(res, { id }, 'Home banner deleted successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete banner', 500);
  }
}

/**
 * DELETE /api/admin/offers/:id
 * Deletes an offer with Cloudinary image cleanup
 */
export async function deleteOffer(req: Request, res: Response): Promise<any> {
  try {
    const { id } = req.params;
    const offer = await prisma.offer.findUnique({ where: { id } });

    if (!offer) {
      return sendError(res, 'Offer not found', 404);
    }

    if (offer.cloudinaryPublicId) {
      await deleteCloudinaryImage(offer.cloudinaryPublicId);
    }

    await prisma.offer.delete({ where: { id } });
    return sendSuccess(res, { id }, 'Offer deleted successfully');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to delete offer', 500);
  }
}
