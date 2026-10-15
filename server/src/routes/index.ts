import { Router } from 'express';
import authRoutes from './auth.routes.js';
import menuRoutes from './menu.routes.js';
import orderRoutes from './order.routes.js';
import couponRoutes from './coupon.routes.js';
import paymentRoutes from './payment.routes.js';
import settingRoutes from './setting.routes.js';
import reportRoutes from './report.routes.js';
import customerRoutes from './customer.routes.js';
import favoriteRoutes from './favorite.routes.js';
import uploadRoutes from './upload.routes.js';
import imageRoutes from './image.routes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/menu', menuRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/coupons', couponRoutes);
apiRouter.use('/payments', paymentRoutes);
apiRouter.use('/settings', settingRoutes);
apiRouter.use('/reports', reportRoutes);
apiRouter.use('/customers', customerRoutes);
apiRouter.use('/favorites', favoriteRoutes);
apiRouter.use('/upload', uploadRoutes);
apiRouter.use('/images', imageRoutes);

export default apiRouter;
