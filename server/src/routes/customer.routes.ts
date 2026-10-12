import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Admin-only customer directory
router.get('/', requireAuth, requireAdmin, CustomerController.getCustomers);
router.get('/:id', requireAuth, requireAdmin, CustomerController.getCustomerById);

export default router;
