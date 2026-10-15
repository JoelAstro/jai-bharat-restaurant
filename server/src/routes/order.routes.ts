import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { requireAuth, requireAdmin, optionalAuth } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validation.middleware.js';
import {
  calculateCartSchema,
  createOrderSchema,
  updateOrderStatusSchema,
} from '../schemas/order.schema.js';

const router = Router();

// Public cart calculations (backend-verified pricing)
router.post('/calculate', validateBody(calculateCartSchema), OrderController.calculateCart);

// Customer order operations (guest checkout supported without sign-in/registration)
router.post('/', optionalAuth, validateBody(createOrderSchema), OrderController.createOrder);
router.get('/customer', optionalAuth, OrderController.getCustomerOrders);
router.get('/:id', optionalAuth, OrderController.getOrderById);

// Admin order operations
router.get('/admin/list', requireAuth, requireAdmin, OrderController.getAdminOrders);
router.patch('/admin/:id/status', requireAuth, requireAdmin, validateBody(updateOrderStatusSchema), OrderController.updateOrderStatus);
router.patch('/admin/:id/payment-status', requireAuth, requireAdmin, OrderController.updatePaymentStatus);

export default router;
