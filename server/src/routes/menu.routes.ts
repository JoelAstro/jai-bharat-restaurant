import { Router } from 'express';
import { MenuController } from '../controllers/menu.controller.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validation.middleware.js';
import { categorySchema, menuItemSchema } from '../schemas/menu.schema.js';

import { getMenu } from '../controllers/content.controller.js';

const router = Router();

// Public menu browsing routes
router.get('/', getMenu);
router.get('/categories', MenuController.getCategories);
router.get('/items', MenuController.getMenuItems);
router.get('/items/:id', MenuController.getMenuItemById);

// Admin-protected menu management
router.post('/categories', requireAuth, requireAdmin, validateBody(categorySchema), MenuController.createCategory);
router.put('/categories/:id', requireAuth, requireAdmin, validateBody(categorySchema.partial()), MenuController.updateCategory);
router.delete('/categories/:id', requireAuth, requireAdmin, MenuController.deleteCategory);

router.post('/items', requireAuth, requireAdmin, validateBody(menuItemSchema), MenuController.createMenuItem);
router.put('/items/:id', requireAuth, requireAdmin, validateBody(menuItemSchema.partial()), MenuController.updateMenuItem);
router.patch('/items/:id/availability', requireAuth, requireAdmin, MenuController.toggleAvailability);
router.delete('/items/:id', requireAuth, requireAdmin, MenuController.deleteMenuItem);

export default router;
