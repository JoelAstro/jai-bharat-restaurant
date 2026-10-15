import { Router } from 'express';
import {
  getHomeBanners,
  getMenu,
  getAbout,
  getOffers,
} from '../controllers/content.controller.js';

const router = Router();

// Public REST API Endpoints
router.get('/home/banners', getHomeBanners);
router.get('/menu', getMenu);
router.get('/about', getAbout);
router.get('/offers', getOffers);

export default router;
