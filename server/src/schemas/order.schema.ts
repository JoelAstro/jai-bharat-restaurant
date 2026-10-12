import { z } from 'zod';

export const cartItemInputSchema = z.object({
  menuItemId: z.string().min(1, 'Item ID is required'),
  variationId: z.string().optional(),
  addonIds: z.array(z.string()).optional(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const calculateCartSchema = z.object({
  items: z.array(cartItemInputSchema).min(1, 'At least one item is required in cart'),
  couponCode: z.string().optional(),
  orderType: z.enum(['DELIVERY', 'TAKEAWAY']).default('DELIVERY'),
});

export const createOrderSchema = z.object({
  items: z.array(cartItemInputSchema).min(1, 'At least one item is required'),
  orderType: z.enum(['DELIVERY', 'TAKEAWAY']),
  paymentMethod: z.enum(['RAZORPAY', 'COD']),
  couponCode: z.string().optional(),
  specialInstructions: z.string().max(250).optional(),
  addressId: z.string().optional(),
  guestAddress: z
    .object({
      street: z.string().min(3),
      area: z.string().optional(),
      city: z.string().min(2),
      pincode: z.string().regex(/^[0-9]{6}$/),
      landmark: z.string().optional(),
    })
    .optional(),
  customerName: z.string().min(2, 'Customer name is required'),
  customerPhone: z.string().regex(/^[0-9]{10}$/, '10-digit mobile number is required'),
  customerEmail: z.string().email('Valid email is required'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED']),
  note: z.string().optional(),
});
