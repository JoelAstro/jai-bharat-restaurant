import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  slug: z.string().optional(),
  description: z.string().optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

export const menuItemSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  name: z.string().min(2, 'Item name is required'),
  description: z.string().min(5, 'Description is required'),
  price: z.number().int().positive('Price must be greater than 0'),
  isVeg: z.boolean(),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  variations: z
    .array(
      z.object({
        name: z.string().min(1, 'Variation name is required'),
        price: z.number().int().positive('Variation price must be positive'),
      })
    )
    .optional(),
  addons: z
    .array(
      z.object({
        name: z.string().min(1, 'Add-on name is required'),
        price: z.number().int().positive('Add-on price must be positive'),
      })
    )
    .optional(),
});
