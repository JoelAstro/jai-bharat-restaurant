import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validation.middleware.js';
import { registerSchema, loginSchema, addressSchema } from '../schemas/auth.schema.js';

const router = Router();

// Public auth routes
router.post('/register', validateBody(registerSchema), AuthController.register);
router.post('/login', validateBody(loginSchema), AuthController.login);

// Customer protected profile & addresses
router.get('/profile', requireAuth, AuthController.getProfile);
router.put('/profile', requireAuth, AuthController.updateProfile);

router.get('/addresses', requireAuth, AuthController.getAddresses);
router.post('/addresses', requireAuth, validateBody(addressSchema), AuthController.addAddress);
router.put('/addresses/:id', requireAuth, validateBody(addressSchema.partial()), AuthController.updateAddress);
router.delete('/addresses/:id', requireAuth, AuthController.deleteAddress);

export default router;
