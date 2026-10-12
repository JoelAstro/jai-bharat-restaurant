import { z } from 'zod';

export const couponSchema = z.object({
  code: z
    .string()
    .min(3, 'Coupon code must be at least 3 characters')
    .regex(/^[A-Z0-9_-]+$/i, 'Coupon code can only contain letters, numbers, and dashes'),
  description: z.string().optional(),
  discountType: z.enum(['PERCENTAGE', 'FIXED']),
  discountValue: z.number().int().positive('Discount value must be greater than 0'),
  minOrderAmount: z.number().int().nonnegative('Minimum order amount must be non-negative').optional(),
  maxDiscount: z.number().int().positive().optional(),
  expiresAt: z.string().datetime().optional().nullable(),
  usageLimit: z.number().int().positive().optional().nullable(),
  isActive: z.boolean().optional(),
});
