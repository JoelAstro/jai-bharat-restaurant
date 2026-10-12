import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be a valid 10-digit mobile number').optional().or(z.literal('')),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const addressSchema = z.object({
  label: z.string().min(1, 'Label is required (e.g., Home, Work)'),
  street: z.string().min(3, 'Street address is required'),
  area: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  pincode: z.string().regex(/^[0-9]{6}$/, 'PIN code must be exactly 6 digits'),
  landmark: z.string().optional(),
  isDefault: z.boolean().optional(),
});
