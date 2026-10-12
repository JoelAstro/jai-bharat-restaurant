import { Router } from 'express';
import { FavoriteController } from '../controllers/favorite.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', requireAuth, FavoriteController.getFavorites);
router.post('/toggle', requireAuth, FavoriteController.toggleFavorite);

export default router;
