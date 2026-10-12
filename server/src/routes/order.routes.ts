import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validation.middleware.js';
import {
  calculateCartSchema,
  createOrderSchema,
  updateOrderStatusSchema,
} from '../schemas/order.schema.js';

const router = Router();

// Public cart calculations (backend-verified pricing)
router.post('/calculate', validateBody(calculateCartSchema), OrderController.calculateCart);

// Customer order operations
router.post('/', requireAuth, validateBody(createOrderSchema), OrderController.createOrder);
router.get('/customer', requireAuth, OrderController.getCustomerOrders);
router.get('/:id', requireAuth, OrderController.getOrderById);

// Admin order operations
router.get('/admin/list', requireAuth, requireAdmin, OrderController.getAdminOrders);
router.patch('/admin/:id/status', requireAuth, requireAdmin, validateBody(updateOrderStatusSchema), OrderController.updateOrderStatus);
router.patch('/admin/:id/payment-status', requireAuth, requireAdmin, OrderController.updatePaymentStatus);

export default router;
