import { z } from 'zod';

export const cartItemSchema = z.object({
  productId: z.string().optional(),
  name: z.string().min(1).max(200),
  price: z.number().int().nonnegative().max(1000000),
  quantity: z.number().int().positive().max(100),
});

export const orderSchema = z.object({
  items: z.array(cartItemSchema).min(1).max(50),
  total: z.number().int().nonnegative().max(10000000),
  customerName: z.string().max(100).optional(),
  customerPhone: z.string().regex(/^[0-9+ ]{8,20}$/).optional(),
  cashRegisterId: z.string().max(50).optional(),
});

export const closeDaySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const loginSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(6).max(200),
});

export const statusUpdateSchema = z.object({
  status: z.enum(['pending', 'preparing', 'ready', 'completed']),
});

export type CartItemInput = z.infer<typeof cartItemSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type CloseDayInput = z.infer<typeof closeDaySchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type StatusUpdateInput = z.infer<typeof statusUpdateSchema>;
