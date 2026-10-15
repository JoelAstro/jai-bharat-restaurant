import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';
import { uploadSingleImage } from '../middlewares/upload.middleware.js';
import {
  createHomeBanner,
  getHomeBanners,
  updateHomeBanner,
  deleteHomeBanner,
  getHomeFeatures,
  createHomeFeature,
  updateHomeFeature,
  deleteHomeFeature,
  createMenuCategory,
  updateMenuCategory,
  deleteMenuCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getAbout,
  updateAboutSection,
  deleteAboutSection,
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
} from '../controllers/content.controller.js';
import { MenuController } from '../controllers/menu.controller.js';

const router = Router();

// Protect all admin routes with JWT authentication & Admin role check
router.use(requireAuth, requireAdmin);

// ============================================================================
// 1. HOME BANNERS & FEATURES ADMIN CRUD
// ============================================================================
router.get('/home/banners', getHomeBanners);
router.post('/home/banner', uploadSingleImage, createHomeBanner);
router.put('/home/banner/:id', uploadSingleImage, updateHomeBanner);
router.delete('/home/banner/:id', deleteHomeBanner);

router.get('/home/features', getHomeFeatures);
router.post('/home/feature', uploadSingleImage, createHomeFeature);
router.put('/home/feature/:id', uploadSingleImage, updateHomeFeature);
router.delete('/home/feature/:id', deleteHomeFeature);

// ============================================================================
// 2. MENU CATEGORIES & ITEMS ADMIN CRUD
// ============================================================================
router.get('/menu/categories', MenuController.getCategories);
router.post('/menu/category', uploadSingleImage, createMenuCategory);
router.put('/menu/category/:id', uploadSingleImage, updateMenuCategory);
router.delete('/menu/category/:id', deleteMenuCategory);

router.get('/menu/items', MenuController.getMenuItems);
router.post('/menu/item', uploadSingleImage, createMenuItem);
router.put('/menu/item/:id', uploadSingleImage, updateMenuItem);
router.delete('/menu/item/:id', deleteMenuItem);

// ============================================================================
// 3. ABOUT US SECTIONS ADMIN CRUD
// ============================================================================
router.get('/about', getAbout);
router.put('/about/:section_key', uploadSingleImage, updateAboutSection);
router.delete('/about/:section_key', deleteAboutSection);

// ============================================================================
// 4. OFFERS & PROMOTIONS ADMIN CRUD
// ============================================================================
router.get('/offers', getOffers);
router.post('/offers', uploadSingleImage, createOffer);
router.put('/offers/:id', uploadSingleImage, updateOffer);
router.delete('/offers/:id', deleteOffer);

export default router;
