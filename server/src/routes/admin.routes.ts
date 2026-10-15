import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';
import { uploadSingleImage } from '../middlewares/upload.middleware.js';
import {
  createHomeBanner,
  getHomeBanners,
  deleteHomeBanner,
  createMenuCategory,
  createMenuItem,
  deleteMenuItem,
  updateAboutSection,
  getAbout,
  createOffer,
  getOffers,
  deleteOffer,
} from '../controllers/content.controller.js';
import { MenuController } from '../controllers/menu.controller.js';

const router = Router();

// Protect all admin routes with JWT authentication & Admin role check
router.use(requireAuth, requireAdmin);

// ============================================================================
// 1. HOME BANNERS ADMIN CRUD
// ============================================================================
router.get('/home/banners', getHomeBanners);
router.post('/home/banner', uploadSingleImage, createHomeBanner);
router.delete('/home/banner/:id', deleteHomeBanner);

// ============================================================================
// 2. MENU & CATEGORIES ADMIN CRUD
// ============================================================================
router.get('/menu/categories', MenuController.getCategories);
router.post('/menu/category', uploadSingleImage, createMenuCategory);
router.get('/menu/items', MenuController.getMenuItems);
router.post('/menu/item', uploadSingleImage, createMenuItem);
router.delete('/menu/item/:id', deleteMenuItem);

// ============================================================================
// 3. ABOUT US ADMIN CRUD
// ============================================================================
router.get('/about', getAbout);
router.put('/about/:section_key', uploadSingleImage, updateAboutSection);

// ============================================================================
// 4. OFFERS & PROMOTIONS ADMIN CRUD
// ============================================================================
router.get('/offers', getOffers);
router.post('/offers', uploadSingleImage, createOffer);
router.delete('/offers/:id', deleteOffer);

export default router;
