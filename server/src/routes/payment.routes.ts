import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// Customer payment endpoints
router.post('/create-order', requireAuth, PaymentController.createPaymentOrder);
router.post('/verify', requireAuth, PaymentController.verifyPayment);

// Webhook endpoint (raw payload processed for signature verification)
router.post('/webhook', PaymentController.handleWebhook);

export default router;
