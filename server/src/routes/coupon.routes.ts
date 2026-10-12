import { Router } from 'express';
import { CouponController } from '../controllers/coupon.controller.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validation.middleware.js';
import { couponSchema } from '../schemas/coupon.schema.js';

const router = Router();

// Public routes
router.get('/public', CouponController.getPublicCoupons);
router.post('/validate', CouponController.validate);

// Admin-only coupon management
router.get('/admin', requireAuth, requireAdmin, CouponController.getAdminCoupons);
router.post('/admin', requireAuth, requireAdmin, validateBody(couponSchema), CouponController.createCoupon);
router.put('/admin/:id', requireAuth, requireAdmin, validateBody(couponSchema.partial()), CouponController.updateCoupon);
router.delete('/admin/:id', requireAuth, requireAdmin, CouponController.deleteCoupon);

export default router;
