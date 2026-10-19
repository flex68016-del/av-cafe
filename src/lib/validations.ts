import { z } from 'zod';

export const cartItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number().int().nonnegative(),
  quantity: z.number().int().positive(),
});

export const orderSchema = z.object({
  items: z.array(cartItemSchema),
  total: z.number().int().nonnegative(),
});

export type CartItemInput = z.infer<typeof cartItemSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
