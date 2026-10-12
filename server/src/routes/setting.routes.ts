import { Router } from 'express';
import { SettingController } from '../controllers/setting.controller.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Public settings (restaurant name, phone, hours, delivery charges, etc.)
router.get('/public', SettingController.getPublicSettings);

// Admin settings and missing details checklist
router.get('/admin', requireAuth, requireAdmin, SettingController.getAdminSettings);
router.put('/admin', requireAuth, requireAdmin, SettingController.updateSettings);

export default router;
